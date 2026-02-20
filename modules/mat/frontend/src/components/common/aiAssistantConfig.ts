/**
 * Embedded AI Assistant — Types and Configuration
 * Platform Standard: LL-031 (Maturion/Platform/AI-Standard)
 * FRS: FR-072 (Embedded AI Assistant)
 * TRS: TR-072
 *
 * Separated from the component file so non-component exports do not trigger
 * the react-refresh/only-export-components lint rule.
 */

/** Selectable AI agent presets exposed to the user */
export interface AIAgentOption {
  id: string;
  label: string;
  taskType: string;
  primaryModel: string;
  description: string;
}

/** A single message in the conversation */
export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

/** Default agent/model options derived from the MAT AI routing table (TR-040) */
export const AI_AGENT_OPTIONS: AIAgentOption[] = [
  {
    id: 'scoring',
    label: 'Scoring Assistant',
    taskType: 'scoring',
    primaryModel: 'gpt-4-turbo',
    description: 'AI-assisted maturity scoring and gap analysis',
  },
  {
    id: 'document_parsing',
    label: 'Document Parser',
    taskType: 'document_parsing',
    primaryModel: 'gpt-4-turbo',
    description: 'Parse and structure criteria documents',
  },
  {
    id: 'routine',
    label: 'General Assistant',
    taskType: 'routine',
    primaryModel: 'gpt-4o-mini',
    description: 'General audit guidance and Q&A',
  },
  {
    id: 'report_generation',
    label: 'Report Writer',
    taskType: 'report_generation',
    primaryModel: 'gpt-4-turbo',
    description: 'Assist with audit report generation',
  },
];
