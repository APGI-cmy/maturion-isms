import { hasModuleEntitlement, type EntitlementState, type IsmsModuleKey } from './entitlements';
import { findPromptSeed, type AskMaturionAudience } from './aiPromptSeeds';

export interface AskMaturionContext {
  isAuthenticated: boolean;
  moduleKey?: IsmsModuleKey;
  entitlement: EntitlementState;
  organisationName?: string | null;
  sector?: string | null;
  primaryGoal?: string | null;
}

export interface AskMaturionRequest {
  question: string;
  context: AskMaturionContext;
}

export interface AskMaturionResponse {
  answer: string;
  audience: AskMaturionAudience;
  allowedPrivateContext: boolean;
  promptSeedTitle: string;
  fallback: boolean;
}

function sanitizeQuestion(question: string): string {
  return question.trim().replace(/\s+/g, ' ').slice(0, 500);
}

function createFilteredContext(context: AskMaturionContext): string {
  const parts = [
    context.organisationName ? `Organisation: ${context.organisationName}` : null,
    context.sector ? `Sector: ${context.sector}` : null,
    context.primaryGoal ? `Primary goal: ${context.primaryGoal}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join('; ') : 'No private operating context supplied.';
}

function createEducationalAnswer(question: string): string {
  return [
    'Educational preview:',
    'ISMS maturity work starts by understanding whether controls are repeatable, evidenced and resilient under pressure. A useful next step is to compare the organisation’s current operating state against the five maturity domains, then choose one or two improvements that would make control performance less dependent on individual effort.',
    `Your question: ${question}`,
    'W5 does not call a live AI provider. This is a deterministic local preview and keeps private operating context behind authentication and entitlement checks.',
  ].join('\n\n');
}

function createFilteredContextAnswer(question: string, context: AskMaturionContext): string {
  return [
    'Filtered-context preview:',
    'Based on the available ISMS context, focus first on the maturity domain that most directly supports the stated operating goal. Convert the goal into evidence-backed minimum performance expectations, identify the next maturity level, and define the controls, owners and review cadence needed to move toward resilience.',
    `Filtered context: ${createFilteredContext(context)}`,
    `Your question: ${question}`,
    'W5 does not call a live AI provider or persist this prompt. Live provider integration, prompt logging, audit and persistence remain future governed work.',
  ].join('\n\n');
}

export function canUsePrivateAskContext(context: AskMaturionContext): boolean {
  if (!context.isAuthenticated || !context.moduleKey) return false;
  return hasModuleEntitlement(context.entitlement, context.moduleKey);
}

export function buildAskMaturionResponse(request: AskMaturionRequest): AskMaturionResponse {
  const question = sanitizeQuestion(request.question);
  const moduleKey = request.context.moduleKey ?? 'general';
  const allowedPrivateContext = canUsePrivateAskContext(request.context);
  const audience: AskMaturionAudience = allowedPrivateContext ? 'authenticated' : 'public';
  const seed = findPromptSeed(moduleKey, audience);

  if (!question) {
    return {
      answer: 'Ask Maturion needs a question before it can prepare a preview. Try asking about maturity, risk, controls, evidence or resilience.',
      audience,
      allowedPrivateContext,
      promptSeedTitle: seed.title,
      fallback: true,
    };
  }

  if (!allowedPrivateContext) {
    return {
      answer: createEducationalAnswer(question),
      audience,
      allowedPrivateContext,
      promptSeedTitle: seed.title,
      fallback: true,
    };
  }

  return {
    answer: createFilteredContextAnswer(question, request.context),
    audience,
    allowedPrivateContext,
    promptSeedTitle: seed.title,
    fallback: true,
  };
}
