module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true, allowExportNames: ['*'] },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    // GRS-001: All AI calls must route through @maturion/ai-centre — direct SDK imports are prohibited.
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['openai', 'openai/*'],
          message: 'Direct OpenAI SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).'
        },
        {
          group: ['@anthropic-ai/*'],
          message: 'Direct Anthropic SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).'
        },
        {
          group: ['@pinecone-database/*'],
          message: 'Direct Pinecone SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).'
        },
        {
          group: ['cohere-ai', 'cohere-ai/*'],
          message: 'Direct Cohere SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).'
        },
        {
          group: ['@google/generative-ai', '@google-cloud/aiplatform'],
          message: 'Direct Google AI SDK imports are prohibited. Route all AI calls through @maturion/ai-centre (GRS-001).'
        }
      ]
    }],
  },
}
