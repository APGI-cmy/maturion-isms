/**
 * ProviderKeyStore — STUB (Wave 2 implementation pending)
 *
 * All methods throw NOT_IMPLEMENTED until Wave 2 implementation is complete.
 * Tests against this stub will FAIL (RED) as required by AAD §9 / Step 6.
 *
 * References: GRS-015 | APS §6.3 | AAD §5.9
 */
import type {
  ProviderKeyStore as IProviderKeyStore,
  ProviderName,
} from '../types/index.js';

export class ProviderKeyStore implements IProviderKeyStore {
  getKey(_provider: ProviderName): string {
    throw new Error('NOT_IMPLEMENTED: ProviderKeyStore.getKey()');
  }
}
