/**
 * AIMCBypassError — Wave 9.4
 *
 * Thrown when a FeedbackPipeline operation is attempted without a valid
 * organisationId, which would constitute an AIMC governance bypass.
 *
 * References:
 *   ARCH_FREEZE-wave9-self-learning-loop-20260226.md §4.2 (API)
 *   Issue #613 — Wave 9.4 authority: CS2 (@APGI-cmy)
 *   GRS-011 | APS §10 | AAD §10.1
 */
export class AIMCBypassError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIMCBypassError';
    // Maintain correct prototype chain for instanceof checks in ES5 targets
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
