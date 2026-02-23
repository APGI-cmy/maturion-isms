/**
 * PersonaLoader — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-010, GRS-028, GRS-029 | APS §8.1 | AAD §5.8
 */
import type { PersonaLoader as IPersonaLoader } from '../types/index.js';

export class PersonaLoader implements IPersonaLoader {
  async load(_agentId: string): Promise<string> {
    throw new Error('NOT_IMPLEMENTED: PersonaLoader.load()');
  }

  async listAvailable(): Promise<string[]> {
    throw new Error('NOT_IMPLEMENTED: PersonaLoader.listAvailable()');
  }
}
