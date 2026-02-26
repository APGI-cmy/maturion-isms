/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL of the server-side AIMC proxy endpoint. Defaults to /api/ai/request if unset. */
  readonly VITE_AI_GATEWAY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
