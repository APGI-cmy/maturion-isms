/**
 * Embedded AI Assistant — Types and Configuration
 * Platform Standard: LL-031 (Maturion/Platform/AI-Standard)
 * FRS: FR-072 (Embedded AI Assistant)
 * TRS: TR-072
 *
 * Separated from the component file so non-component exports do not trigger
 * the react-refresh/only-export-components lint rule.
 *
 * Wave 7 (AIMC Advisory Integration): Removed hardcoded provider model names.
 * Model selection is AIMC's responsibility.
 * Each option now carries an `agentId` (AIMC canonical persona identifier)
 * instead of a `primaryModel` string. AI calls route through AI_GATEWAY_URL.
 */

/** URL of the server-side AIMC proxy endpoint */
export const AI_GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL ?? '/api/ai/request';

/** Selectable AI agent presets exposed to the user */
export interface AIAgentOption {
  id: string;
  label: string;
  /** AIMC canonical agent/persona identifier — replaces the removed primaryModel field */
  agentId: string;
  taskType: string;
  description: string;
}

/** A single message in the conversation */
export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/** Agent options mapped to AIMC canonical persona identifiers (TR-072, ai-architecture.md v2.0.0) */
export const AI_AGENT_OPTIONS: AIAgentOption[] = [
  {
    id: 'scoring',
    label: 'Scoring Assistant',
    agentId: 'maturity-advisor',
    taskType: 'scoring',
    description: 'AI-assisted maturity scoring and gap analysis',
  },
  {
    id: 'document_parsing',
    label: 'Document Parser',
    agentId: 'document-parser',
    taskType: 'document_parsing',
    description: 'Parse and structure criteria documents',
  },
  {
    id: 'routine',
    label: 'General Assistant',
    agentId: 'maturity-advisor',
    taskType: 'routine',
    description: 'General audit guidance and Q&A',
  },
  {
    id: 'report_generation',
    label: 'Report Writer',
    agentId: 'document-parser',
    taskType: 'report_generation',
    description: 'Assist with audit report generation',
  },
];
