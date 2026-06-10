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
      answer: 'Ask Maturion needs a question before it can respond. Try asking about maturity, risk, controls, evidence or resilience.',
      audience,
      allowedPrivateContext,
      promptSeedTitle: seed.title,
      fallback: true,
    };
  }

  if (!allowedPrivateContext) {
    return {
      answer: `Educational response: ${seed.seed}\n\nYour question: ${question}\n\nW5 does not call a live AI provider. It prepares a safe public prompt seed and keeps private context behind authentication and entitlement checks.`,
      audience,
      allowedPrivateContext,
      promptSeedTitle: seed.title,
      fallback: true,
    };
  }

  return {
    answer: `Entitled-context response draft: ${seed.seed}\n\nFiltered context: ${createFilteredContext(request.context)}\n\nYour question: ${question}\n\nW5 keeps this as a non-blocking adapter response. Live AI provider calls, persistence and audit logging remain future governed work.`,
    audience,
    allowedPrivateContext,
    promptSeedTitle: seed.title,
    fallback: true,
  };
}
