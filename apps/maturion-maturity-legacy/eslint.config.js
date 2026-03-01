import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      // GRS-001: All AI calls must route through @maturion/ai-centre — direct SDK imports are prohibited.
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['openai', 'openai/*'],
            message: 'Direct OpenAI SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).',
          },
          {
            group: ['@anthropic-ai/*'],
            message: 'Direct Anthropic SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).',
          },
          {
            group: ['@pinecone-database/*'],
            message: 'Direct Pinecone SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).',
          },
          {
            group: ['cohere-ai', 'cohere-ai/*'],
            message: 'Direct Cohere SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).',
          },
          {
            group: ['@google/generative-ai', '@google-cloud/aiplatform'],
            message: 'Direct Google AI SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).',
          },
        ],
      }],
    },
  },
);
