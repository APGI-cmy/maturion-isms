/**
 * Vite environment type declarations for @maturion/ai-centre
 *
 * Declares module types for Vite-specific import suffixes used in tests.
 * The `?raw` suffix loads file content as a raw string (no processing).
 * This is a Vite feature used in test files for source-inspection assertions.
 *
 * References: https://vitejs.dev/guide/features#importing-asset-as-string
 */

// Raw string import — `import src from './file.ts?raw'` returns the file content as string
declare module '*?raw' {
  const content: string;
  export default content;
}
