/**
 * ParsingInstructionsModal — Wave 17 (T-W17-UI-001)
 *
 * Displayed after document upload, before AI parsing is triggered.
 * Allows user to provide or select parsing instructions for the AI parser.
 */
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ParsingTemplate {
  id: string;
  name: string;
  instructions: string;
  is_default: boolean;
  is_system: boolean;
}

interface SaveAsTemplate {
  name: string;
}

interface ParsingInstructionsModalProps {
  isOpen: boolean;
  /** Called when user confirms parsing — instructions can be empty string (treated as null by caller) */
  onConfirm: (instructions: string, saveAsTemplate?: SaveAsTemplate) => void;
  /** Called when user skips — triggers parsing with null instructions */
  onCancel: () => void;
  /** Filename for auto-detecting LDCS standard template */
  fileName?: string;
}

/** Maximum characters allowed for parsing instructions (mirrors Edge Function limit) */
const MAX_INSTRUCTIONS_LENGTH = 10_000;

export function ParsingInstructionsModal({
  isOpen,
  onConfirm,
  onCancel,
  fileName,
}: ParsingInstructionsModalProps) {
  const [templates, setTemplates] = useState<ParsingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [instructions, setInstructions] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch templates from Supabase
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    supabase
      .from('parsing_instruction_templates')
      .select('id, name, instructions, is_default, is_system')
      .order('is_system', { ascending: false })
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) {
          setTemplates(data);
          // Auto-select: if fileName contains "ldcs" (case-insensitive), select LDCS Standard template
          const isLdcsFile = fileName ? fileName.toLowerCase().includes('ldcs') : false;
          if (isLdcsFile) {
            const ldcsTemplate = data.find((t) => t.name.toLowerCase().includes('ldcs'));
            if (ldcsTemplate) {
              setSelectedTemplateId(ldcsTemplate.id);
              setInstructions(ldcsTemplate.instructions);
            }
          } else {
            // Auto-select default template if any
            const defaultTemplate = data.find((t) => t.is_default);
            if (defaultTemplate) {
              setSelectedTemplateId(defaultTemplate.id);
              setInstructions(defaultTemplate.instructions);
            }
          }
        }
        setLoading(false);
      });
  }, [isOpen, fileName]);

  // When template is selected, populate instructions textarea
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === '') {
      setInstructions('');
      return;
    }
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setInstructions(template.instructions);
    }
  };

  const handleConfirm = () => {
    const saveAs =
      saveAsTemplate && templateName.trim()
        ? { name: templateName.trim() }
        : undefined;
    onConfirm(instructions, saveAs);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Parsing Instructions
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Provide instructions to guide the AI in parsing this document. Select a
          template or write custom instructions.
        </p>

        {/* Template selector */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            disabled={loading}
          >
            <option value="">— No template (write custom instructions) —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.is_system ? ' ★' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions textarea */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value.slice(0, MAX_INSTRUCTIONS_LENGTH))}
            placeholder="Describe how the AI should parse this document..."
            maxLength={MAX_INSTRUCTIONS_LENGTH}
          />
          <p className={`text-xs mt-1 text-right ${instructions.length >= MAX_INSTRUCTIONS_LENGTH ? 'text-red-600' : 'text-gray-400'}`}>
            {instructions.length.toLocaleString()} / {MAX_INSTRUCTIONS_LENGTH.toLocaleString()}
          </p>
        </div>

        {/* Save as template */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={(e) => setSaveAsTemplate(e.target.checked)}
              className="rounded border-gray-300"
            />
            Save these instructions as a template
          </label>
          {saveAsTemplate && (
            <input
              type="text"
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Skip — parse without instructions
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!instructions.trim() || instructions.length > MAX_INSTRUCTIONS_LENGTH}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse Document →
          </button>
        </div>
      </div>
    </div>
  );
}
