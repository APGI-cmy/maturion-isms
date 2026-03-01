/**
 * AI API Route Registry — api/ai/index.ts
 *
 * Centralised export of all AI gateway route handlers.
 * Used by T-W12-API-5 (API wiring coverage) to verify that every
 * referenced route file is present on disk and exports a valid handler.
 *
 * Wave 12: Full Functionality & Build Wiring Verification
 * References: T-W12-API-5 | Wave 12 gap remediation
 */

export {
  default as aiRequestHandler,
  createHandler,
  buildAICentre,
  buildPersonaLoader,
  buildSessionMemory,
  buildPersistentMemory,
  SCORING_CAPABILITY,
  REPORTING_CAPABILITY,
} from './request.js';

export {
  default as aiHealthHandler,
  createHealthHandler,
} from './health.js';

export { default as aiFeedbackHandler } from './feedback.js';
export { default as aiFeedbackApproveHandler } from './feedback/approve.js';
export { default as aiFeedbackPendingHandler } from './feedback/pending.js';

/**
 * Route registry map — maps logical route paths to their source files.
 * Consumed by T-W12-API-5 wiring coverage test.
 */
export const AI_ROUTE_REGISTRY = {
  '/api/ai/request': 'request.ts',
  '/api/ai/health': 'health.ts',
  '/api/ai/feedback': 'feedback.ts',
  '/api/ai/feedback/approve': 'feedback/approve.ts',
  '/api/ai/feedback/pending': 'feedback/pending.ts',
} as const;
