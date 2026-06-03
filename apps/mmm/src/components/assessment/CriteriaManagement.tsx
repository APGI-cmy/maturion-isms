/**
 * CriteriaManagement — current-app adaptation of the legacy
 * apps/maturion-maturity-legacy/src/components/assessment/CriteriaManagement.tsx
 *
 * Renders criteria grouped and scoped to the active domain and MPS data, and
 * provides per-MPS AI criteria generation with accept/reject/save lifecycle.
 * Adapted for the MMM current app without shadcn/lucide or legacy hook dependencies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DomainAuditCriterionRow,
  DomainAuditLevelDescriptorRow,
  DomainAuditMpsRow,
} from '../../hooks/useDomainAuditBuilder';
import { supabase, getEdgeInvokeHeaders } from '../../lib/supabase';
import { AIGeneratedCriteriaCards } from './AIGeneratedCriteriaCards';
import { EnhancedCriteriaGenerator } from './EnhancedCriteriaGenerator';
import { hasTrimmedText, toTrimmedText } from '../../lib/safeText';
import {
  defaultModeSourceContext,
  evaluateModeSourceAvailability,
  isChunkedSourceReadyForExtraction,
  resolveModeSourceContext,
} from '../../lib/modeSourceContext';
import {
  extractVerbatimCriteriaFromKnowledge,
  isSourceFaithfulStatement,
  mergeOverlappingTextChunks,
  normalizeVerbatimLookup,
} from '../../lib/verbatimCriteriaExtraction';

export interface GeneratedCriterionItem {
  code: string;
  statement: string;
  source_origin?: 'uploaded_source' | 'ai_completion' | 'subject_knowledge' | 'user_added' | 'deferred_user';
  deferred_target_mps_id?: string | null;
  created_by_display?: string | null;
}

interface PerMpsCriteriaState {
  isGenerating: boolean;
  generatedCriteria: GeneratedCriterionItem[];
  acceptedCodes: Set<string>;
  refinePrompt: string;
  error: string | null;
}

function parseCriteriaArrayFromReply(reply: string): GeneratedCriterionItem[] {
  try {
    return JSON.parse(reply) as GeneratedCriterionItem[];
  } catch {
    const start = reply.indexOf('[');
    const end = reply.lastIndexOf(']');
    if (start >= 0 && end > start) {
      const slice = reply.slice(start, end + 1);
      return JSON.parse(slice) as GeneratedCriterionItem[];
    }
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

function tokenizeForMatch(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function resolveDeferredTargetMpsId(statement: string, mpsRows: DomainAuditMpsRow[]): string | null {
  const statementTokens = tokenizeForMatch(statement);
  let bestId: string | null = null;
  let bestScore = 0;
  for (const mps of mpsRows) {
    const mpsTokens = tokenizeForMatch(`${mps.code} ${mps.name}`);
    let score = 0;
    mpsTokens.forEach((token) => {
      if (statementTokens.has(token)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestId = mps.id;
    }
  }
  return bestScore > 0 ? bestId : null;
}

function buildFallbackCriteria(mpsCode: string, mpsName: string, domainName: string): GeneratedCriterionItem[] {
  return [
    {
      code: `${mpsCode}-C001`,
      statement: `Document and approve the ${mpsName} control design for ${domainName}.`,
    },
    {
      code: `${mpsCode}-C002`,
      statement: `Define accountable owners, review frequency, and escalation triggers for ${mpsName}.`,
    },
    {
      code: `${mpsCode}-C003`,
      statement: `Maintain auditable evidence proving ${mpsName} execution and effectiveness.`,
    },
  ];
}

function normalizeCriteriaKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

interface CriterionEditDraft {
  code: string;
  name: string;
}

interface LevelDescriptorDraft {
  level: number;
  label: string;
  descriptor_text: string;
}

interface CriterionActionMessage {
  type: 'success' | 'error';
  text: string;
}

interface AiChatUserRequest {
  message: string;
  context: Record<string, unknown>;
}

interface DescriptorMethodologyRow {
  content?: unknown;
  source_document_name?: unknown;
  metadata?: unknown;
}

interface DescriptorControlObject {
  key: string;
  label: string;
  keywords: string[];
  objectPhrase: string;
  minimumEvidence: string;
  basic: string;
  reactive: string;
  compliant: string;
  proactive: string;
  resilient: string;
}

const MATURITY_LEVELS: Array<{ level: number; label: string; guidance: string }> = [
  {
    level: 1,
    label: 'Basic',
    guidance: 'absent, informal, person-dependent, weakly evidenced, and vulnerable to staff turnover or disruption',
  },
  {
    level: 2,
    label: 'Reactive',
    guidance: 'partly in place, but maintained mainly after incidents, audit findings, operational failures, or management pressure',
  },
  {
    level: 3,
    label: 'Compliant',
    guidance: 'approved, implemented, communicated, recorded, and evidenced at the minimum required standard',
  },
  {
    level: 4,
    label: 'Proactive',
    guidance: 'risk-based, owner-led, measured for effectiveness, trend-informed, and improved through cross-functional governance',
  },
  {
    level: 5,
    label: 'Resilient',
    guidance: 'embedded into systems and routines, monitored continuously, escalated by exception, recoverable, and independent of single individuals',
  },
];

const DESCRIPTOR_CONTROL_OBJECTS: DescriptorControlObject[] = [
  {
    key: 'policy',
    label: 'Policy',
    keywords: ['policy', 'policies', 'displayed', 'communicated', 'signed', 'approved'],
    objectPhrase: 'policy ownership, communication, display, and awareness control',
    minimumEvidence: 'approved policy, communication/display evidence, owner, review record, and awareness evidence',
    basic: 'is absent, outdated, inconsistently displayed, or dependent on one person remembering to communicate it; awareness evidence is weak, fragmented, or not repeatable',
    reactive: 'exists in some form, but display, communication, updates, or awareness checks occur mainly after incidents, audits, management pressure, or visible non-conformance',
    compliant: 'is approved by the accountable authority, displayed or made available where required, communicated to affected personnel, and supported by current evidence that the required communication occurred',
    proactive: 'is reviewed using risk, incidents, site/process changes, awareness measures, and stakeholder input; owners can show that communication methods and content are improved before failures recur',
    resilient: 'is embedded into onboarding, access/control routines, leadership cadence, digital channels, monitoring, and exception escalation so ownership and awareness survive staff turnover, disruption, and abnormal operations',
  },
  {
    key: 'procedure',
    label: 'Procedure',
    keywords: ['procedure', 'procedures', 'sop', 'standard operating', 'process', 'work instruction'],
    objectPhrase: 'procedure execution and control workflow',
    minimumEvidence: 'approved procedure, communication/training evidence, current version, execution records, and review evidence',
    basic: 'is informal, obsolete, inaccessible, or known mainly through individual experience; workarounds are common and evidence of consistent use is weak',
    reactive: 'exists but is corrected or refreshed mainly after incidents, stoppages, complaints, audit findings, or operational failure; fixes treat symptoms more than root causes',
    compliant: 'is approved, current, accessible, communicated, and evidenced through records showing that the required work is performed in accordance with it',
    proactive: 'is owned, reviewed, and improved using risk assessments, incidents, deviations, task observations, trend data, and stakeholder feedback to verify control effectiveness',
    resilient: 'is embedded into workflow or technical systems so execution, evidence capture, exception detection, escalation, and closure are automated where practicable and human steps are protected by oversight and dual accountability',
  },
  {
    key: 'register_matrix',
    label: 'Register / Matrix',
    keywords: ['register', 'matrix', 'chain of custody', 'custody', 'raci', 'accountable manager', 'ownership'],
    objectPhrase: 'register, matrix, ownership, and accountability control',
    minimumEvidence: 'current register/matrix, named owners, version control, review evidence, and change-trigger records',
    basic: 'is missing, incomplete, contested, or dependent on informal knowledge; ownership gaps are discovered through blame or confusion rather than controlled review',
    reactive: 'exists but is updated mainly when challenged by personnel changes, incidents, audits, or confusion; accountability and control gaps are found by exception',
    compliant: 'is current, version controlled, assigned to named accountable owners, and reviewed at the required cadence or after material changes',
    proactive: 'is linked to risk assessments, RACI, incident trends, process changes, and stakeholder review so ownership gaps and control weaknesses trigger updates before failure',
    resilient: 'is integrated into workflows, role profiles, access permissions, escalation rules, audit trails, and change events so ownership changes automatically trigger handover and control validation',
  },
  {
    key: 'committee_governance',
    label: 'Committee / Governance',
    keywords: ['committee', 'governance', 'charter', 'meeting', 'minutes', 'leadership', 'heads of department', 'hod', 'accountability'],
    objectPhrase: 'governance forum, decision, action, and accountability control',
    minimumEvidence: 'charter or mandate, meeting cadence, minutes, action owners, escalation route, and closure records',
    basic: 'has no clear forum, mandate, cadence, or accountable owner; decisions depend on personalities and issues are escalated only when they become visible',
    reactive: 'meets or takes action mainly after incidents, audit findings, pressure, or operational failures; action tracking exists but is inconsistent or closure is weak',
    compliant: 'has an approved mandate or charter, defined cadence, documented minutes, assigned actions, accountable owners, and evidence that required governance activities occur',
    proactive: 'uses metrics, root causes, risk trends, weak signals, and cross-functional input to steer decisions, prioritise mitigation, and prevent recurrence',
    resilient: 'is embedded through dashboards, escalation triggers, continuity of decision rights, delegated authority, and closure assurance so governance continues during disruption or personnel change',
  },
  {
    key: 'training_competency',
    label: 'Training / Competency',
    keywords: ['training', 'competency', 'competence', 'induction', 'awareness', 'qualified', 'personnel'],
    objectPhrase: 'training, competency, and awareness control',
    minimumEvidence: 'training matrix, competency records, induction evidence, refresher cadence, and gap closure records',
    basic: 'depends on experienced individuals, informal coaching, or undocumented awareness; competency gaps are unknown and evidence is anecdotal',
    reactive: 'is delivered or corrected mainly after failures, findings, incidents, or new requirements; recurrence prevention and competency validation are weak',
    compliant: 'is defined, delivered, recorded, and refreshed at the required cadence, with evidence that affected personnel completed the required training or induction',
    proactive: 'uses role risk, incidents, observations, competency gaps, and performance data to tailor learning, verify effectiveness, and close capability gaps before failure',
    resilient: 'is system-supported so unqualified deployment is prevented where practicable, refresher triggers and succession coverage are automated, and competence survives turnover or abnormal operations',
  },
  {
    key: 'technical_control',
    label: 'Technical Control',
    keywords: ['technical', 'camera', 'surveillance', 'alarm', 'sensor', 'system', 'electronic', 'barrier', 'tamper', 'access control'],
    objectPhrase: 'technical or physical control design, monitoring, and response mechanism',
    minimumEvidence: 'design records, maintenance/test results, logs, exception reports, and response/closure records',
    basic: 'is absent, bypassed, manually compensated, poorly maintained, or dependent on ad hoc human detection; failures may go unnoticed',
    reactive: 'is repaired after faults, incidents, or audit findings, but failure trends, bypasses, and root causes are not consistently analysed',
    compliant: 'is installed or implemented as required, documented, maintained, tested, and evidenced through records showing the control is operational',
    proactive: 'is monitored for performance and failure trends, prioritised by risk, reviewed after incidents or changes, and improved to reduce residual exposure',
    resilient: 'uses hard barriers or electronic enforcement where practicable, with redundancy, tamper alerts, self-checking, automated response, exception escalation, and tested recovery',
  },
  {
    key: 'incident_rca',
    label: 'Incident / RCA',
    keywords: ['incident', 'root cause', 'rca', 'near miss', 'finding', 'corrective action', 'mro', 'learning'],
    objectPhrase: 'incident, root-cause, corrective-action, and learning process',
    minimumEvidence: 'incident records, classifications, investigations, root causes, action owners, closure evidence, and recurrence checks',
    basic: 'is hidden, blamed, undocumented, or handled informally; lessons are not captured and evidence of closure is weak',
    reactive: 'records significant events and corrective actions, but investigation quality, root-cause control, recurrence prevention, and action closure are inconsistent',
    compliant: 'has a defined procedure, classification logic, investigation records, assigned actions, due dates, and evidence that required actions are tracked to closure',
    proactive: 'uses near misses, trends, weak signals, root causes, and control failures to update risk registers, improve controls, and prevent recurrence',
    resilient: 'is automated or system-supported for reporting, escalation, learning distribution, action closure, effectiveness verification, and continuity during abnormal operations',
  },
  {
    key: 'access_authorisation',
    label: 'Access / Authorisation',
    keywords: ['access', 'authorisation', 'authorization', 'permission', 'entry', 'role-based', 'least privilege', 'segregation'],
    objectPhrase: 'access, authorisation, segregation, and exception control',
    minimumEvidence: 'authorisation records, access logs, role rules, review records, exception handling, and revocation evidence',
    basic: 'is uncontrolled, personally negotiated, manually remembered, or poorly evidenced; inappropriate access may persist unnoticed',
    reactive: 'is cleaned up mainly after breaches, audits, incidents, personnel changes, or visible exceptions; access reviews are inconsistent',
    compliant: 'is role-based, approved, recorded, reviewed at the required cadence, and supported by evidence of grants, changes, and removals',
    proactive: 'is reviewed using risk, patterns, exceptions, segregation conflicts, personnel changes, and incident learning to prevent inappropriate access',
    resilient: 'is system-enforced through least privilege, automatic revocation triggers, anomaly detection, exception escalation, dual accountability, and audit trails',
  },
  {
    key: 'continuity',
    label: 'Continuity / DR',
    keywords: ['continuity', 'disaster', 'recovery', 'backup', 'redundancy', 'failover', 'rto', 'rpo', 'disruption'],
    objectPhrase: 'continuity, recovery, and disruption-survival control',
    minimumEvidence: 'continuity plan, tested recovery results, roles, trigger-action-response rules, and improvement records',
    basic: 'has no credible continuity arrangement, unclear recovery ownership, and weak evidence that the requirement can survive disruption or staff turnover',
    reactive: 'is planned or repaired after outages, incidents, or management pressure; exercises and lessons are inconsistent or not closed',
    compliant: 'has an approved and reviewed continuity arrangement with assigned roles, required records, and evidence that minimum review or test cadence is met',
    proactive: 'is scenario-tested, risk-based, improved from exercises and incidents, and linked to critical risks, dependencies, and response triggers',
    resilient: 'uses automated failover or recovery where practicable, tested RTO/RPO, redundancy, escalation, and recovery evidence showing minimal operational disruption',
  },
  {
    key: 'monitoring_metrics',
    label: 'Monitoring / Metrics',
    keywords: ['monitor', 'monitoring', 'metric', 'measure', 'dashboard', 'kpi', 'performance', 'review', 'assess'],
    objectPhrase: 'monitoring, measurement, and performance-review control',
    minimumEvidence: 'defined measures, reports or dashboards, owners, review cadence, actions, and closure evidence',
    basic: 'has no reliable monitoring, owner review, or repeatable performance evidence; issues are known only when someone notices or complains',
    reactive: 'uses lagging reports or checks mainly after problems, findings, incidents, or management pressure; trends and causes are not reliably acted on',
    compliant: 'completes required checks, reports, reviews, and records at the minimum cadence with evidence that results are reviewed by accountable owners',
    proactive: 'uses leading indicators, trends, thresholds, risk triggers, and stakeholder review to prioritise action and improve control effectiveness',
    resilient: 'uses continuous monitoring, automated exception queues, escalation, closure tracking, and independent assurance so weak signals are acted on before failure',
  },
  {
    key: 'generic_control',
    label: 'Control Requirement',
    keywords: [],
    objectPhrase: 'control requirement, ownership, evidence, and assurance mechanism',
    minimumEvidence: 'defined requirement, accountable owner, implementation evidence, review record, and exception/action closure',
    basic: 'is absent, informal, inconsistently applied, or dependent on individual effort; ownership and repeatable evidence are weak',
    reactive: 'exists in some form, but action and correction occur mainly after incidents, audit findings, management pressure, or visible failure',
    compliant: 'is defined, implemented, assigned to an accountable owner, and evidenced through records showing that the required action has been completed',
    proactive: 'is reviewed using risk, performance information, incidents, stakeholder input, and trend data to improve control effectiveness before failures recur',
    resilient: 'is embedded into routines, systems, monitoring, exception escalation, continuity arrangements, and ownership structures that survive staff turnover or disruption',
  },
];

function dedupeCriteria(criteria: GeneratedCriterionItem[]): GeneratedCriterionItem[] {
  const seen = new Set<string>();
  const next: GeneratedCriterionItem[] = [];
  for (const item of criteria) {
    const key = normalizeCriteriaKey(item.statement);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(item);
  }
  return next;
}

function normalizeDescriptorText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function descriptorTokenOverlap(left: string, right: string): number {
  const leftTokens = new Set(normalizeDescriptorText(left).split(/\s+/).filter((token) => token.length > 4));
  const rightTokens = normalizeDescriptorText(right).split(/\s+/).filter((token) => token.length > 4);
  if (leftTokens.size === 0 || rightTokens.length === 0) return 0;
  const shared = rightTokens.filter((token) => leftTokens.has(token)).length;
  return shared / Math.max(rightTokens.length, 1);
}

function stripCriterionBoilerplate(criterionText: string): string {
  return criterionText
    .replace(/\s+\[uploaded_source\]$/i, '')
    .replace(/\s*\(hybrid source\)\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function identifyControlObject(criterionText: string): DescriptorControlObject {
  const normalized = normalizeDescriptorText(criterionText);
  const generic = DESCRIPTOR_CONTROL_OBJECTS.find((item) => item.key === 'generic_control') ?? DESCRIPTOR_CONTROL_OBJECTS[0];
  let best = generic;
  let bestScore = -1;
  for (const controlObject of DESCRIPTOR_CONTROL_OBJECTS.filter((item) => item.key !== 'generic_control')) {
    const score = controlObject.keywords.reduce(
      (total, keyword) => total + (normalized.includes(normalizeDescriptorText(keyword)) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = controlObject;
    }
  }
  return bestScore > 0 ? best : generic;
}

function summariseRequirement(criterionText: string, controlObject: DescriptorControlObject): string {
  const clean = stripCriterionBoilerplate(criterionText);
  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? clean;
  if (firstSentence.length <= 145) return firstSentence;

  const lower = firstSentence.toLowerCase();
  if (controlObject.key === 'policy' && lower.includes('policy')) {
    return 'the policy must be approved, current, communicated, displayed or made available, and evidenced';
  }
  if (controlObject.key === 'register_matrix' && (lower.includes('matrix') || lower.includes('custody'))) {
    return 'the accountability matrix must name owners, define controls, and remain current through changes';
  }
  if (controlObject.key === 'committee_governance') {
    return 'the governance requirement must assign ownership, make decisions, track actions, and verify closure';
  }
  if (controlObject.key === 'procedure') {
    return 'the procedure must be approved, current, communicated, followed, and evidenced in operation';
  }
  if (controlObject.key === 'technical_control') {
    return 'the technical or physical control must be designed, maintained, monitored, and verified as effective';
  }
  if (controlObject.key === 'access_authorisation') {
    return 'the access requirement must authorise, record, review, and revoke access based on role and risk';
  }
  if (controlObject.key === 'monitoring_metrics') {
    return 'the monitoring requirement must define measures, review performance, and close exceptions';
  }
  return `${controlObject.objectPhrase} required by this criterion`;
}

function buildFallbackMaturityDescriptorDrafts(criterion: DomainAuditCriterionRow): LevelDescriptorDraft[] {
  const criterionText = criterionEditSafeText(criterion);
  const controlObject = identifyControlObject(criterionText);
  const requirement = summariseRequirement(criterionText, controlObject);

  const descriptions: Record<number, string> = {
    1: `${requirement} ${controlObject.basic}. Minimum evidence such as ${controlObject.minimumEvidence} is absent, weak, outdated, or not repeatable.`,
    2: `${requirement} ${controlObject.reactive}. Evidence shows response and correction, but not stable ownership, prevention, or sustained control.`,
    3: `${requirement} ${controlObject.compliant}. The auditor should be able to verify ${controlObject.minimumEvidence} at the required minimum cadence.`,
    4: `${requirement} ${controlObject.proactive}. Evidence must show risk-based review, metrics or trends, owner action, and improvement of control effectiveness.`,
    5: `${requirement} ${controlObject.resilient}. Evidence must show embedded routines, system or hard-barrier support where practicable, exception escalation, continuity, and survival of staff turnover or disruption.`,
  };

  return MATURITY_LEVELS.map(({ level, label }) => ({
    level,
    label,
    descriptor_text: descriptions[level],
  }));
}

function criterionEditSafeText(criterion: DomainAuditCriterionRow): string {
  return stripCriterionBoilerplate(criterion.name);
}

function parseDescriptorArrayFromReply(reply: string): LevelDescriptorDraft[] {
  const parsed = parseCriteriaArrayFromReply(reply) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('AI descriptor response was not a JSON array.');
  }

  return parsed.map((item) => {
    const row = item as { level?: unknown; label?: unknown; descriptor_text?: unknown; descriptor?: unknown };
    const level = Number(row.level);
    const label = typeof row.label === 'string'
      ? row.label
      : MATURITY_LEVELS.find((maturityLevel) => maturityLevel.level === level)?.label ?? `Level ${level}`;
    const descriptorText = typeof row.descriptor_text === 'string'
      ? row.descriptor_text
      : typeof row.descriptor === 'string'
      ? row.descriptor
      : '';
    return {
      level,
      label,
      descriptor_text: descriptorText.trim(),
    };
  });
}

function edgePayloadDetail(payload: Record<string, unknown>, fallback: string): string {
  return String(
    payload.detail ??
      payload.reason ??
      payload.error ??
      payload.message ??
      fallback,
  );
}

async function invokeAiChatUserWithDiagnostics(
  requestBody: AiChatUserRequest,
  headers: Record<string, string>,
): Promise<Record<string, unknown>> {
  const invokeResult = await supabase.functions.invoke('mmm-ai-chat-user', {
    body: requestBody,
    headers,
  });

  if (!invokeResult.error) {
    return ((invokeResult.data as Record<string, unknown> | null) ?? {});
  }

  const genericMessage =
    (invokeResult.error as { message?: string }).message ??
    'AI generation failed.';

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!supabaseUrl) {
      throw new Error(genericMessage);
    }
    const response = await fetch(`${supabaseUrl}/functions/v1/mmm-ai-chat-user`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const raw = await response.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      payload = { message: raw };
    }
    const detail = edgePayloadDetail(payload, genericMessage || `HTTP ${response.status}`);
    throw new Error(detail || `HTTP ${response.status}`);
  } catch (diagnosticError) {
    throw new Error(diagnosticError instanceof Error ? diagnosticError.message : genericMessage);
  }
}

function validateMaturityDescriptorDrafts(
  criterionText: string,
  drafts: LevelDescriptorDraft[],
): LevelDescriptorDraft[] {
  if (drafts.length !== 5) {
    throw new Error('Descriptor generation must return exactly five maturity levels.');
  }

  const byLevel = new Map(drafts.map((draft) => [draft.level, draft]));
  const normalizedCriterion = stripCriterionBoilerplate(criterionText);
  return MATURITY_LEVELS.map(({ level, label }) => {
    const draft = byLevel.get(level);
    if (!draft?.descriptor_text.trim()) {
      throw new Error(`Descriptor generation omitted ${label}.`);
    }
    const text = draft.descriptor_text.trim();
    if (normalizeDescriptorText(text) === normalizeDescriptorText(`${label}: ${normalizedCriterion}`)) {
      throw new Error('Descriptor generation copied the criterion instead of reconstructing maturity states.');
    }
    if (descriptorTokenOverlap(normalizedCriterion, text) > 0.86) {
      throw new Error('Descriptor generation is too similar to the criterion wording.');
    }
    return {
      level,
      label,
      descriptor_text: text,
    };
  });
}

function extractMethodologySnippet(rows: DescriptorMethodologyRow[]): string {
  const chunks = rows
    .filter((row) => {
      const content = String(row.content ?? '');
      const sourceName = String(row.source_document_name ?? '');
      const metadata = JSON.stringify(row.metadata ?? {});
      const haystack = `${sourceName}\n${metadata}\n${content}`.toLowerCase();
      return (
        haystack.includes('descriptor guideline') ||
        haystack.includes('maturity descriptor') ||
        haystack.includes('critical authoring rule') ||
        haystack.includes('basic reactive compliant proactive resilient')
      );
    })
    .map((row) => String(row.content ?? '').trim())
    .filter(Boolean);

  return chunks.join('\n\n').slice(0, 12000);
}

function descriptorCoverage(
  criteriaRows: DomainAuditCriterionRow[],
  levelDescriptorsByCriterion: Record<string, DomainAuditLevelDescriptorRow[]>,
): { completeCriteria: number; totalDescriptors: number } {
  return criteriaRows.reduce(
    (coverage, criterion) => {
      const count = levelDescriptorsByCriterion[criterion.id]?.length ?? 0;
      return {
        completeCriteria: coverage.completeCriteria + (count >= 5 ? 1 : 0),
        totalDescriptors: coverage.totalDescriptors + count,
      };
    },
    { completeCriteria: 0, totalDescriptors: 0 },
  );
}

export interface CriteriaManagementProps {
  /** The domain currently being built. */
  domainId: string;
  /** Human-readable domain label. */
  domainName: string;
  /** Whether the panel is visible. */
  open: boolean;
  /** Loaded MPS rows for the active domain. */
  mpsRows: DomainAuditMpsRow[];
  /** Criteria rows grouped by MPS id. */
  criteriaByMps: Record<string, DomainAuditCriterionRow[]>;
  /** Level descriptors grouped by criterion id. */
  levelDescriptorsByCriterion: Record<string, DomainAuditLevelDescriptorRow[]>;
  /** Whether MPS/criteria rows are still loading. */
  isLoading: boolean;
  /** Visible error state for failed domain workflow reads. */
  errorMessage: string | null;
  /** Callback to close/cancel. */
  onClose: () => void;
  /** Framework context for Verbatim/Hybrid/New source-mode generation. */
  frameworkId?: string | null;
}

/**
 * Current-app adaptation of CriteriaManagement.
 * Provides per-MPS AI criteria generation with accept/reject/save lifecycle.
 */
export function CriteriaManagement({
  domainId,
  domainName,
  open,
  mpsRows,
  criteriaByMps,
  levelDescriptorsByCriterion,
  isLoading,
  errorMessage,
  onClose,
  frameworkId,
}: CriteriaManagementProps) {
  const queryClient = useQueryClient();
  const [mpsCriteriaStates, setMpsCriteriaStates] = useState<Record<string, PerMpsCriteriaState>>({});
  const [addCriteriaDrafts, setAddCriteriaDrafts] = useState<Record<string, string>>({});
  const [criterionEditDrafts, setCriterionEditDrafts] = useState<Record<string, CriterionEditDraft>>({});
  const [descriptorDraftsByCriterion, setDescriptorDraftsByCriterion] = useState<Record<string, LevelDescriptorDraft[]>>({});
  const [criterionActionMessages, setCriterionActionMessages] = useState<Record<string, CriterionActionMessage>>({});
  const [descriptorGeneratingByCriterion, setDescriptorGeneratingByCriterion] = useState<Record<string, boolean>>({});

  const resetAllStates = useCallback(() => {
    setMpsCriteriaStates({});
    setCriterionActionMessages({});
    setDescriptorGeneratingByCriterion({});
  }, []);

  // NBR-003: reset generation state when domainId changes
  useEffect(() => {
    resetAllStates();
  }, [domainId, resetAllStates]);

  // NBR-003: reset generation state when modal closes
  useEffect(() => {
    if (!open) {
      resetAllStates();
    }
  }, [open, resetAllStates]);

  useEffect(() => {
    const nextDrafts: Record<string, CriterionEditDraft> = {};
    Object.values(criteriaByMps).flat().forEach((criterion) => {
      nextDrafts[criterion.id] = {
        code: criterion.code,
        name: criterion.name,
      };
    });
    setCriterionEditDrafts(nextDrafts);
  }, [criteriaByMps]);

  const mpsIds = mpsRows.map((m) => m.id);

  const saveMutation = useMutation({
    mutationFn: async ({
      mpsId,
      accepted,
    }: {
      mpsId: string;
      accepted: GeneratedCriterionItem[];
    }) => {
      const { error } = await supabase.from('mmm_criteria').insert(
        accepted.map((criterion, idx) => ({
          mps_id: criterion.deferred_target_mps_id ?? mpsId,
          name: criterion.statement,
          code: criterion.code,
          sort_order: idx,
        })),
      );
      if (error) throw new Error(error.message);
      return mpsId;
    },
    onSuccess: (mpsId: string) => {
      // NBR-001: invalidate affected queries after save
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setMpsCriteriaStates((prev) => {
        const next = { ...prev };
        delete next[mpsId];
        return next;
      });
    },
    onError: (err: Error, { mpsId }) => {
      // NBR-005: surface save errors to user
      setMpsCriteriaStates((prev) => {
        const current = prev[mpsId] ?? { isGenerating: false, generatedCriteria: [], acceptedCodes: new Set(), refinePrompt: '', error: null };
        return { ...prev, [mpsId]: { ...current, error: err.message } };
      });
    },
  });

  const updateCriterionMutation = useMutation({
    mutationFn: async (criterion: DomainAuditCriterionRow) => {
      const draft = criterionEditDrafts[criterion.id];
      if (!draft?.name.trim() || !draft?.code.trim()) {
        throw new Error('Criterion code and text are required before saving.');
      }
      const { error } = await supabase
        .from('mmm_criteria')
        .update({
          code: draft.code.trim(),
          name: draft.name.trim(),
        })
        .eq('id', criterion.id);
      if (error) throw new Error(error.message);
      return criterion.id;
    },
    onSuccess: (_criterionId, criterion) => {
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'success', text: 'Criterion edit saved.' },
      }));
    },
    onError: (err: Error, criterion) => {
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'error', text: err.message },
      }));
    },
  });

  const saveDescriptorMutation = useMutation({
    mutationFn: async (criterion: DomainAuditCriterionRow) => {
      const drafts = descriptorDraftsByCriterion[criterion.id] ??
        (levelDescriptorsByCriterion[criterion.id] ?? []).map((descriptor) => ({
          level: descriptor.level,
          label: MATURITY_LEVELS.find((item) => item.level === descriptor.level)?.label ?? `Level ${descriptor.level}`,
          descriptor_text: descriptor.descriptor_text,
        }));
      if (drafts.length !== 5 || drafts.some((draft) => !draft.descriptor_text.trim())) {
        throw new Error('All five maturity level descriptors must be completed before saving.');
      }
      const { error } = await supabase.from('mmm_level_descriptors').upsert(
        drafts.map((draft) => ({
          criterion_id: criterion.id,
          level: draft.level,
          descriptor_text: draft.descriptor_text.trim(),
        })),
        { onConflict: 'criterion_id,level' },
      );
      if (error) throw new Error(error.message);
      return criterion.id;
    },
    onSuccess: (_criterionId, criterion) => {
      queryClient.invalidateQueries({ queryKey: ['domain-audit-level-descriptors'] });
      queryClient.invalidateQueries({ queryKey: ['domain-audit-criteria', mpsIds] });
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'success', text: 'Maturity descriptors saved.' },
      }));
    },
    onError: (err: Error, criterion) => {
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: { type: 'error', text: err.message },
      }));
    },
  });

  const handleGenerate = async (mps: DomainAuditMpsRow) => {
    const refinePrompt = mpsCriteriaStates[mps.id]?.refinePrompt?.trim() ?? '';
    setMpsCriteriaStates((prev) => ({
      ...prev,
      [mps.id]: {
        isGenerating: true,
        generatedCriteria: [],
        acceptedCodes: new Set(),
        refinePrompt,
        error: null,
      },
    }));
    try {
      let headers: Record<string, string>;
      try {
        headers = await getEdgeInvokeHeaders();
      } catch {
        throw new Error('Please log in to use AI generation features.');
      }
      const modeContext = frameworkId
        ? await resolveModeSourceContext(frameworkId)
        : defaultModeSourceContext(null);
      const sourceAvailability = evaluateModeSourceAvailability(modeContext);
      if (sourceAvailability.blockingError) {
        throw new Error(sourceAvailability.blockingError);
      }

      if (frameworkId && modeContext.framework_source_type === 'VERBATIM') {
        const primaryVerbatimSourceDoc = modeContext.mode_source_documents.find(
          (doc) =>
            isChunkedSourceReadyForExtraction(doc) &&
            doc.tags.some((tag) => tag === 'source_mode:VERBATIM'),
        );
        const verbatimSourceDocIds = primaryVerbatimSourceDoc ? [primaryVerbatimSourceDoc.id] : [];
        let processedVerbatimText = '';

        if (verbatimSourceDocIds.length > 0) {
          const { data: knowledgeRows } = await supabase
            .from('ai_knowledge')
            .select('content,chunk_index')
            .in('document_id', verbatimSourceDocIds)
            .order('chunk_index', { ascending: true });

          processedVerbatimText = mergeOverlappingTextChunks(
            (knowledgeRows ?? []).map((row) => String((row as { content?: unknown }).content ?? '')),
          );

          const sourceCriteria = extractVerbatimCriteriaFromKnowledge({
            content: processedVerbatimText,
            mpsCode: mps.code,
            mpsName: mps.name,
            domainName,
          }).map((criterion) => ({
            ...criterion,
            source_origin: 'uploaded_source' as const,
          }));

          if (sourceCriteria.length > 0) {
            const verbatimCriteria = dedupeCriteria(sourceCriteria);
            setMpsCriteriaStates((prev) => ({
              ...prev,
              [mps.id]: {
                isGenerating: false,
                generatedCriteria: verbatimCriteria,
                acceptedCodes: new Set(verbatimCriteria.map((c) => c.code)),
                refinePrompt,
                error: null,
              },
            }));
            return;
          }
        }

        const { data: proposedDomains } = await supabase
          .from('mmm_proposed_domains')
          .select('id,name')
          .eq('framework_id', frameworkId);
        const domainLookup = normalizeVerbatimLookup(domainName);
        const proposedDomain = (proposedDomains ?? []).find(
          (row) =>
            normalizeVerbatimLookup(String(row.name ?? '')) === domainLookup,
        );
        if (proposedDomain) {
          const { data: proposedMps } = await supabase
            .from('mmm_proposed_mps')
            .select('id,name,code')
            .eq('proposed_domain_id', proposedDomain.id);
          const mpsNameLookup = normalizeVerbatimLookup(mps.name);
          const linkedMps = (proposedMps ?? []).find(
            (row) =>
              normalizeVerbatimLookup(String(row.name ?? '')) ===
                mpsNameLookup || row.code === mps.code,
          );
          if (linkedMps) {
            const { data: proposedCriteria } = await supabase
              .from('mmm_proposed_criteria')
              .select('code,name,sort_order')
              .eq('proposed_mps_id', linkedMps.id)
              .order('sort_order', { ascending: true });
            const verbatimCriteria = dedupeCriteria(
              (proposedCriteria ?? []).map((row, idx) => ({
                code: row.code || `${mps.code}-C${String(idx + 1).padStart(3, '0')}`,
                statement: row.name,
                source_origin: 'uploaded_source' as const,
              })).filter((criterion) =>
                !processedVerbatimText ||
                isSourceFaithfulStatement(processedVerbatimText, criterion.statement),
              ),
            );
            if (verbatimCriteria.length > 0) {
              setMpsCriteriaStates((prev) => ({
                ...prev,
                [mps.id]: {
                  isGenerating: false,
                  generatedCriteria: verbatimCriteria,
                  acceptedCodes: new Set(verbatimCriteria.map((c) => c.code)),
                  refinePrompt,
                  error: null,
                },
              }));
              return;
            }
          }
        }
        throw new Error(
          `Verbatim mode is active, but no source Required Actions could be extracted for ${mps.code}. Reprocess the organisation source document and verify parsed chunk quality before regenerating criteria.`,
        );
      }

      const prompt =
        `Generate 3-5 audit criteria for Maturity Practice Statement "${mps.code} — ${mps.name}"` +
        ` (intent: "${mps.intent_statement ?? 'not set'}") in the "${domainName}" domain.\n` +
        `Mode-source strategy: ${modeContext.mode_source_strategy}.\n` +
        (sourceAvailability.warnings.length > 0
          ? `Source availability warnings: ${sourceAvailability.warnings.join(' ')}\n`
          : '') +
        `Available organisation/framework source documents: ${modeContext.mode_source_documents.map((doc) => `${doc.title} (${doc.file_name}, ${doc.processing_status}, chunks=${doc.chunk_count})`).join('; ') || 'none'}.\n` +
        `Perform external web research on the organisation profile and peer organisations in the same industry as supporting context only; never override tenant source documents.\n` +
        `${modeContext.source_rules.join('\n')}\n` +
        (refinePrompt ? `Additional refinement context: ${refinePrompt}\n` : '') +
        `Each criterion should be specific, measurable, and auditable.\n` +
        `Return a JSON array: [{"code": "${mps.code}-C001", "statement": "...", "source_origin": "uploaded_source|ai_completion|subject_knowledge"}]\n` +
        `Return only the JSON array.`;
      const { data, error } = await supabase.functions.invoke('mmm-ai-chat-user', {
        body: {
          message: prompt,
          context: {
            workflow_stage: 'criteria_generation',
            domain_name: domainName,
            mps_code: mps.code,
            framework_id: frameworkId ?? null,
            mode_source_strategy: modeContext.mode_source_strategy,
            mode_source_context: modeContext,
            external_research_required: true,
            tenant_isolation_required: true,
          },
        },
        headers,
      });
      if (error) throw new Error((error as { message?: string }).message ?? 'AI generation failed');
      const parsed = parseCriteriaArrayFromReply((data as { reply: string }).reply);
      const deduped = dedupeCriteria(parsed);
      setMpsCriteriaStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedCriteria: deduped,
          acceptedCodes: new Set(deduped.map((c) => c.code)),
          refinePrompt,
          error: null,
        },
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI generation failed.';
      const isSourceGate =
        message.includes('Verbatim mode requires') ||
        message.includes('Hybrid mode requires') ||
        message.includes('Verbatim criteria source is missing') ||
        message.includes('no source Required Actions could be extracted');
      if (isSourceGate) {
        setMpsCriteriaStates((prev) => ({
          ...prev,
          [mps.id]: {
            isGenerating: false,
            generatedCriteria: [],
            acceptedCodes: new Set(),
            refinePrompt,
            error: message,
          },
        }));
        return;
      }
      const fallback = buildFallbackCriteria(mps.code, mps.name, domainName);
      setMpsCriteriaStates((prev) => ({
        ...prev,
        [mps.id]: {
          isGenerating: false,
          generatedCriteria: fallback,
          acceptedCodes: new Set(fallback.map((item) => item.code)),
          refinePrompt,
          error: 'AI service unavailable. Loaded fallback criteria draft.',
        },
      }));
    }
  };

  const handleToggleCriterion = (mpsId: string, code: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId];
      if (!current) return prev;
      const next = new Set(current.acceptedCodes);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return { ...prev, [mpsId]: { ...current, acceptedCodes: next } };
    });
  };

  const handleAcceptAll = (mpsId: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId];
      if (!current) return prev;
      return {
        ...prev,
        [mpsId]: {
          ...current,
          acceptedCodes: new Set(current.generatedCriteria.map((c) => c.code)),
        },
      };
    });
  };

  const handleRefinePromptChange = (mpsId: string, prompt: string) => {
    setMpsCriteriaStates((prev) => {
      const current = prev[mpsId] ?? {
        isGenerating: false,
        generatedCriteria: [],
        acceptedCodes: new Set(),
        refinePrompt: '',
        error: null,
      };
      return {
        ...prev,
        [mpsId]: {
          ...current,
          refinePrompt: prompt,
        },
      };
    });
  };

  const handleSave = (mps: DomainAuditMpsRow) => {
    const state = mpsCriteriaStates[mps.id];
    if (!state) return;
    const accepted = state.generatedCriteria.filter((c) => state.acceptedCodes.has(c.code));
    if (accepted.length === 0) return;
    saveMutation.mutate({ mpsId: mps.id, accepted });
  };

  const handleSaveAllAccepted = () => {
    mpsRows.forEach((mps) => {
      const state = mpsCriteriaStates[mps.id];
      if (!state) return;
      const accepted = state.generatedCriteria.filter((c) => state.acceptedCodes.has(c.code));
      if (accepted.length === 0) return;
      saveMutation.mutate({ mpsId: mps.id, accepted });
    });
    resetAllStates();
    onClose();
  };

  const handleAddCriteria = (mps: DomainAuditMpsRow) => {
    const raw = addCriteriaDrafts[mps.id] ?? '';
    const statement = raw.trim();
    if (!statement) return;
    const targetMpsId = resolveDeferredTargetMpsId(statement, mpsRows);
    const isDeferred = Boolean(targetMpsId && targetMpsId !== mps.id);
    const state = mpsCriteriaStates[mps.id] ?? {
      isGenerating: false,
      generatedCriteria: [],
      acceptedCodes: new Set<string>(),
      refinePrompt: '',
      error: null,
    };
    const nextIndex = state.generatedCriteria.length + 1;
    const code = `${mps.code}-C${String(nextIndex).padStart(3, '0')}`;
    const added: GeneratedCriterionItem = {
      code,
      statement,
      source_origin: isDeferred ? 'deferred_user' : 'user_added',
      deferred_target_mps_id: isDeferred ? targetMpsId : null,
      created_by_display: 'current_user',
    };
    const nextGenerated = dedupeCriteria([...state.generatedCriteria, added]);
    setMpsCriteriaStates((prev) => ({
      ...prev,
      [mps.id]: {
        ...state,
        generatedCriteria: nextGenerated,
        acceptedCodes: new Set([...Array.from(state.acceptedCodes), code]),
        error: isDeferred ? 'Deferred routing detected: this criterion will be inserted under the better-fit MPS on submit.' : null,
      },
    }));
    setAddCriteriaDrafts((prev) => ({ ...prev, [mps.id]: '' }));
  };

  const handleCriterionDraftChange = (
    criterionId: string,
    field: keyof CriterionEditDraft,
    value: string,
  ) => {
    setCriterionEditDrafts((prev) => ({
      ...prev,
      [criterionId]: {
        ...(prev[criterionId] ?? { code: '', name: '' }),
        [field]: value,
      },
    }));
  };

  const getDescriptorDrafts = (criterion: DomainAuditCriterionRow): LevelDescriptorDraft[] => {
    const activeDrafts = descriptorDraftsByCriterion[criterion.id];
    if (activeDrafts) return activeDrafts;
    const storedDescriptors = levelDescriptorsByCriterion[criterion.id] ?? [];
    if (storedDescriptors.length > 0) {
      return MATURITY_LEVELS.map(({ level, label }) => {
        const stored = storedDescriptors.find((descriptor) => descriptor.level === level);
        return {
          level,
          label,
          descriptor_text: stored?.descriptor_text ?? '',
        };
      });
    }
    return [];
  };

  const handleGenerateDescriptors = async (criterion: DomainAuditCriterionRow) => {
    const activeCriterionText = stripCriterionBoilerplate(
      criterionEditDrafts[criterion.id]?.name ?? criterion.name,
    );
    const criterionForFallback = { ...criterion, name: activeCriterionText };
    setDescriptorGeneratingByCriterion((prev) => ({ ...prev, [criterion.id]: true }));
    setCriterionActionMessages((prev) => ({
      ...prev,
      [criterion.id]: {
        type: 'success',
        text: 'Creating maturity descriptors from the approved methodology reference...',
      },
    }));

    try {
      const { data: methodologyRows } = await supabase
        .from('ai_knowledge')
        .select('content,source_document_name,metadata,chunk_index')
        .order('chunk_index', { ascending: true });
      const methodologySnippet = extractMethodologySnippet((methodologyRows ?? []) as DescriptorMethodologyRow[]);
      const methodologyDrafts = validateMaturityDescriptorDrafts(
        activeCriterionText,
        buildFallbackMaturityDescriptorDrafts(criterionForFallback),
      );

      if (methodologySnippet) {
        try {
          const headers = await getEdgeInvokeHeaders();
          const prompt =
            `Create five maturity level descriptors for this LDCS MMM audit criterion.\n\n` +
            `CRITERION:\n${activeCriterionText}\n\n` +
            `APPROVED METHODOLOGY REFERENCE EXCERPT:\n${methodologySnippet}\n\n` +
            `Rules:\n` +
            `- Do not copy the criterion into each level.\n` +
            `- Reconstruct the criterion into observable operating states for Basic, Reactive, Compliant, Proactive, and Resilient.\n` +
            `- Compliant is the neutral baseline where the requirement is approved, implemented, communicated, recorded, and evidenced.\n` +
            `- Proactive must include risk-based review, measurement/trends, ownership, and improvement.\n` +
            `- Resilient must include embeddedness, automation or hard barriers where practicable, exception escalation, continuity, and survival of staff turnover/disruption.\n` +
            `- Each descriptor must be auditable and evidence-oriented.\n\n` +
            `Return only a JSON array with exactly five objects:\n` +
            `[{"level":1,"label":"Basic","descriptor_text":"..."},{"level":2,"label":"Reactive","descriptor_text":"..."},{"level":3,"label":"Compliant","descriptor_text":"..."},{"level":4,"label":"Proactive","descriptor_text":"..."},{"level":5,"label":"Resilient","descriptor_text":"..."}]`;
          const data = await invokeAiChatUserWithDiagnostics(
            {
              message: prompt,
              context: {
                workflow_stage: 'criteria_maturity_descriptor_generation',
                domain_name: domainName,
                criterion_id: criterion.id,
                criterion_code: criterion.code,
                framework_id: frameworkId ?? null,
                methodology_source: 'uploaded_descriptor_guideline',
                tenant_isolation_required: true,
              },
            },
            headers,
          );
          const parsed = parseDescriptorArrayFromReply((data as { reply: string }).reply);
          const validated = validateMaturityDescriptorDrafts(activeCriterionText, parsed);
          setDescriptorDraftsByCriterion((prev) => ({
            ...prev,
            [criterion.id]: validated,
          }));
          setCriterionActionMessages((prev) => ({
            ...prev,
            [criterion.id]: {
              type: 'success',
              text: 'Maturity descriptors created from the uploaded methodology reference.',
            },
          }));
          return;
        } catch (aiError) {
          setDescriptorDraftsByCriterion((prev) => ({
            ...prev,
            [criterion.id]: methodologyDrafts,
          }));
          setCriterionActionMessages((prev) => ({
            ...prev,
            [criterion.id]: {
              type: 'success',
              text:
                'Maturity descriptors created from the approved methodology reference. ' +
                `AI refinement is temporarily unavailable (${aiError instanceof Error ? aiError.message : 'unknown issue'}), so Maturion used the governed methodology generator.`,
            },
          }));
          return;
        }
      }

      setDescriptorDraftsByCriterion((prev) => ({
        ...prev,
        [criterion.id]: methodologyDrafts,
      }));
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: {
          type: 'success',
          text: 'Maturity descriptors created from the built-in approved methodology fallback. No uploaded methodology chunks were found in retrieval.',
        },
      }));
    } catch (err) {
      setCriterionActionMessages((prev) => ({
        ...prev,
        [criterion.id]: {
          type: 'error',
          text: err instanceof Error ? err.message : 'Unable to create maturity descriptors.',
        },
      }));
    } finally {
      setDescriptorGeneratingByCriterion((prev) => ({ ...prev, [criterion.id]: false }));
    }
  };

  const handleDescriptorDraftChange = (
    criterionId: string,
    level: number,
    descriptorText: string,
  ) => {
    setDescriptorDraftsByCriterion((prev) => {
      const existing =
        prev[criterionId] ??
        MATURITY_LEVELS.map(({ level: itemLevel, label }) => ({
          level: itemLevel,
          label,
          descriptor_text: '',
        }));
      return {
        ...prev,
        [criterionId]: existing.map((draft) =>
          draft.level === level ? { ...draft, descriptor_text: descriptorText } : draft,
        ),
      };
    });
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Criteria Management"
      data-testid="criteria-management"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Criteria Management</h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close criteria management"
            onClick={() => { resetAllStates(); onClose(); }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-domain-context">
            Domain: <strong>{domainName}</strong> <span>({domainId})</span>
          </p>
          {isLoading ? (
            <p data-testid="criteria-management-loading">Loading criteria data…</p>
          ) : errorMessage ? (
            <div role="alert" data-testid="criteria-management-error">
              {errorMessage}
            </div>
          ) : mpsRows.length === 0 ? (
            <p data-testid="criteria-management-empty">
              No MPS rows are currently available for criteria grouping.
            </p>
          ) : (
            <div className="criteria-groups" data-testid="criteria-groups">
              {mpsRows.map((mps) => {
                const criteriaRows = criteriaByMps[mps.id] ?? [];
                const state = mpsCriteriaStates[mps.id];
                const coverage = descriptorCoverage(criteriaRows, levelDescriptorsByCriterion);
                const descriptorSummary =
                  criteriaRows.length > 0
                    ? `${coverage.completeCriteria}/${criteriaRows.length} criteria have full level descriptors`
                    : 'No criteria yet';
                return (
                  <section key={mps.id} className="criteria-group" data-testid="criteria-group">
                    <h3>
                      {mps.code} — {mps.name}
                    </h3>
                    <p>
                      Intent:{' '}
                      {hasTrimmedText(mps.intent_statement)
                        ? toTrimmedText(mps.intent_statement)
                        : 'No intent statement stored for this MPS yet.'}
                    </p>
                    <div className="criteria-group__dashboard" data-testid={`criteria-mps-dashboard-${mps.id}`}>
                      <span><strong>{criteriaRows.length}</strong> criteria</span>
                      <span><strong>{coverage.totalDescriptors}</strong> level descriptor statements</span>
                      <span>MPS maturity: <strong>Not rated yet</strong></span>
                      <span>{descriptorSummary}</span>
                    </div>

                    {/* Per-MPS error (NBR-005) */}
                    {state?.error ? (
                      <div
                        role="alert"
                        className="alert alert-error"
                        data-testid={`criteria-generation-error-${mps.id}`}
                      >
                        {state.error}
                      </div>
                    ) : null}

                    {state?.isGenerating ? (
                      <p data-testid={`criteria-generation-loading-${mps.id}`}>
                        Generating criteria for {mps.code}…
                      </p>
                     ) : state?.generatedCriteria && state.generatedCriteria.length > 0 ? (
                       <AIGeneratedCriteriaCards
                         mpsId={mps.id}
                         criteria={state.generatedCriteria}
                         acceptedCodes={state.acceptedCodes}
                         isSaving={saveMutation.isPending}
                         onToggleCriterion={(code) => handleToggleCriterion(mps.id, code)}
                         onAcceptAll={() => handleAcceptAll(mps.id)}
                         onSaveAccepted={() => handleSave(mps)}
                       />
                     ) : (
                       <div>
                         {criteriaRows.length === 0 ? (
                          <p>No criteria rows are currently stored for this MPS.</p>
                        ) : (
                          <div className="criteria-card-list">
                            {criteriaRows.map((criterion) => (
                              <article
                                key={criterion.id}
                                className="criteria-card"
                                data-testid="criteria-row"
                              >
                                <div className="criteria-card__header">
                                  <div>
                                    <label htmlFor={`criteria-code-${criterion.id}`}>Criterion code</label>
                                    <input
                                      id={`criteria-code-${criterion.id}`}
                                      className="form-control"
                                      value={criterionEditDrafts[criterion.id]?.code ?? criterion.code}
                                      onChange={(event) =>
                                        handleCriterionDraftChange(criterion.id, 'code', event.target.value)
                                      }
                                      data-testid={`criteria-code-input-${criterion.id}`}
                                    />
                                  </div>
                                  <div>
                                    <span>Sort order: {criterion.sort_order}</span>
                                    <span>
                                      Descriptor coverage:{' '}
                                      {(levelDescriptorsByCriterion[criterion.id] ?? []).length}/5
                                    </span>
                                  </div>
                                </div>
                                <label htmlFor={`criteria-text-${criterion.id}`}>Criterion statement</label>
                                <textarea
                                  id={`criteria-text-${criterion.id}`}
                                  className="form-control"
                                  rows={3}
                                  value={criterionEditDrafts[criterion.id]?.name ?? criterion.name}
                                  onChange={(event) =>
                                    handleCriterionDraftChange(criterion.id, 'name', event.target.value)
                                  }
                                  data-testid={`criteria-name-input-${criterion.id}`}
                                />
                                <div className="criteria-card__actions">
                                  <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => updateCriterionMutation.mutate(criterion)}
                                    disabled={updateCriterionMutation.isPending}
                                    data-testid={`criteria-save-btn-${criterion.id}`}
                                  >
                                    Save criterion edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => handleGenerateDescriptors(criterion)}
                                    disabled={Boolean(descriptorGeneratingByCriterion[criterion.id])}
                                    data-testid={`generate-descriptors-btn-${criterion.id}`}
                                  >
                                    {descriptorGeneratingByCriterion[criterion.id]
                                      ? 'Creating descriptors...'
                                      : (levelDescriptorsByCriterion[criterion.id] ?? []).length > 0
                                      ? 'Regenerate maturity descriptors'
                                      : 'Create maturity descriptors'}
                                  </button>
                                </div>
                                {criterionActionMessages[criterion.id] ? (
                                  <div
                                    className={`criteria-card__message criteria-card__message--${criterionActionMessages[criterion.id].type}`}
                                    role={criterionActionMessages[criterion.id].type === 'error' ? 'alert' : 'status'}
                                  >
                                    {criterionActionMessages[criterion.id].text}
                                  </div>
                                ) : null}

                                {getDescriptorDrafts(criterion).length > 0 ? (
                                  <div
                                    className="level-descriptor-grid"
                                    data-testid={`level-descriptor-grid-${criterion.id}`}
                                  >
                                    {getDescriptorDrafts(criterion).map((descriptor) => (
                                      <div
                                        key={descriptor.level}
                                        className={`level-descriptor-card level-descriptor-card--${descriptor.level}`}
                                      >
                                        <label htmlFor={`descriptor-${criterion.id}-${descriptor.level}`}>
                                          {descriptor.label}
                                        </label>
                                        <textarea
                                          id={`descriptor-${criterion.id}-${descriptor.level}`}
                                          className="form-control"
                                          rows={4}
                                          value={descriptor.descriptor_text}
                                          onChange={(event) =>
                                            handleDescriptorDraftChange(
                                              criterion.id,
                                              descriptor.level,
                                              event.target.value,
                                            )
                                          }
                                          data-testid={`descriptor-input-${criterion.id}-${descriptor.level}`}
                                        />
                                      </div>
                                    ))}
                                    <div className="criteria-card__actions">
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => saveDescriptorMutation.mutate(criterion)}
                                        disabled={saveDescriptorMutation.isPending}
                                        data-testid={`save-descriptors-btn-${criterion.id}`}
                                      >
                                        Save maturity descriptors
                                      </button>
                                    </div>
                                  </div>
                                ) : null}
                              </article>
                            ))}
                          </div>
                        )}
                         <EnhancedCriteriaGenerator
                           mpsId={mps.id}
                           refinePrompt={state?.refinePrompt ?? ''}
                           isGenerating={Boolean(state?.isGenerating)}
                           onRefinePromptChange={(value) => handleRefinePromptChange(mps.id, value)}
                           onGenerate={() => handleGenerate(mps)}
                         />
                         <div className="enhanced-criteria-generator" style={{ marginTop: '0.75rem' }}>
                           <label htmlFor={`criteria-add-${mps.id}`}>Add more criteria</label>
                           <textarea
                             id={`criteria-add-${mps.id}`}
                             rows={3}
                             placeholder="Add a criterion (Verb + Noun + Context)."
                             value={addCriteriaDrafts[mps.id] ?? ''}
                             onChange={(event) => {
                               setAddCriteriaDrafts((prev) => ({ ...prev, [mps.id]: event.target.value }));
                             }}
                             data-testid={`criteria-add-input-${mps.id}`}
                           />
                           <button
                             type="button"
                             className="btn btn-outline"
                             onClick={() => handleAddCriteria(mps)}
                             data-testid={`criteria-add-btn-${mps.id}`}
                           >
                             Add More Criteria
                           </button>
                         </div>
                       </div>
                     )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAllAccepted}
            disabled={!Object.values(mpsCriteriaStates).some((state) => state.acceptedCodes.size > 0) || saveMutation.isPending}
          >
            Accept / Submit
          </button>
          <button type="button" className="btn btn-outline" onClick={() => { resetAllStates(); onClose(); }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CriteriaManagement;
