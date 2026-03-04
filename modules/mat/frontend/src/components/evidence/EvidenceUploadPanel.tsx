/**
 * Evidence Upload Panel Component
 * FRS: FR-093 (Evidence Interaction Model)
 * TRS: TR-093
 * Wave: 14 — TASK-W14-BB-002
 *
 * Renders six evidence type upload tiles with Remove/Replace controls.
 * Storage path convention: ${organisationId}/${auditId}/criteria/${criterionId}/
 */
import { useState } from 'react';

export interface EvidenceItem {
  id: string;
  type: 'document' | 'image' | 'link' | 'text' | 'video' | 'file' | 'voice';
  name: string;
  storagePath: string;
  deleted: boolean;
}

interface EvidenceUploadPanelProps {
  criterionId: string;
  auditId: string;
  organisationId: string;
  onEvidenceChange?: (items: EvidenceItem[]) => void;
}

const EVIDENCE_TYPES: {
  type: EvidenceItem['type'];
  label: string;
  icon: string;
  accept?: string;
}[] = [
  { type: 'document', label: 'Document', icon: '📄', accept: '.pdf,.doc,.docx' },
  { type: 'image', label: 'Image', icon: '🖼️', accept: 'image/*' },
  { type: 'link', label: 'Link / URL', icon: '🔗' },
  { type: 'text', label: 'Text / Findings', icon: '📝' },
  { type: 'video', label: 'Video', icon: '🎥', accept: 'video/*' },
  { type: 'file', label: 'File (Spreadsheet)', icon: '📊', accept: '.xlsx,.xls,.csv' },
  { type: 'voice', label: 'Voice Note', icon: '🎙️', accept: 'audio/*' },
] as const;

export function EvidenceUploadPanel({
  criterionId,
  auditId,
  organisationId,
  onEvidenceChange,
}: EvidenceUploadPanelProps) {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [textInput, setTextInput] = useState('');

  function buildStoragePath(type: EvidenceItem['type'], fileName: string): string {
    // Storage path: ${organisationId}/${auditId}/criteria/${criterionId}/
    return `${organisationId}/${auditId}/criteria/${criterionId}/${type}-${fileName}`;
  }

  function handleFileUpload(type: EvidenceItem['type'], file: File) {
    const storagePath = buildStoragePath(type, file.name);
    const newItem: EvidenceItem = {
      id: `${type}-${Date.now()}`,
      type,
      name: file.name,
      storagePath,
      deleted: false,
    };
    const updated = [...evidenceItems, newItem];
    setEvidenceItems(updated);
    onEvidenceChange?.(updated);
  }

  function handleLinkAdd() {
    if (!linkInput.trim()) return;
    const newItem: EvidenceItem = {
      id: `link-${Date.now()}`,
      type: 'link',
      name: linkInput.trim(),
      storagePath: linkInput.trim(),
      deleted: false,
    };
    const updated = [...evidenceItems, newItem];
    setEvidenceItems(updated);
    setLinkInput('');
    onEvidenceChange?.(updated);
  }

  function handleTextSave() {
    if (!textInput.trim()) return;
    const storagePath = buildStoragePath('text', `findings-${Date.now()}.txt`);
    const newItem: EvidenceItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: 'Text finding',
      storagePath,
      deleted: false,
    };
    const updated = [...evidenceItems, newItem];
    setEvidenceItems(updated);
    setTextInput('');
    onEvidenceChange?.(updated);
  }

  /** Soft-delete: sets deleted = true on the evidence row */
  function handleRemove(id: string) {
    const updated = evidenceItems.map((item) =>
      item.id === id ? { ...item, deleted: true } : item
    );
    setEvidenceItems(updated);
    onEvidenceChange?.(updated);
  }

  /** Replace: removes the old item and opens a new upload for same type */
  function handleReplace(id: string, type: EvidenceItem['type'], file: File) {
    // Soft-delete old, add new with updated storage_path
    const storagePath = buildStoragePath(type, file.name);
    const updated = evidenceItems.map((item) =>
      item.id === id
        ? { ...item, deleted: true }
        : item
    );
    const newItem: EvidenceItem = {
      id: `${type}-${Date.now()}`,
      type,
      name: file.name,
      storagePath,
      deleted: false,
    };
    const final = [...updated, newItem];
    setEvidenceItems(final);
    onEvidenceChange?.(final);
  }

  const activeItems = evidenceItems.filter((item) => !item.deleted);

  return (
    <div
      className="evidence-upload-panel p-4 bg-white rounded-lg shadow"
      data-testid="evidence-upload-panel"
      aria-label="Evidence Upload Panel"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Evidence</h3>
      <p className="text-sm text-gray-500 mb-4">
        Select an evidence type to upload or record evidence for this criterion.
      </p>

      {/* Evidence type tiles */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6"
        data-testid="evidence-type-tiles"
      >
        {EVIDENCE_TYPES.map(({ type, label, icon, accept }) => {
          if (type === 'link') {
            return (
              <div
                key={type}
                className="evidence-tile flex flex-col items-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer"
                data-testid={`evidence-tile-${type}`}
              >
                <span className="text-2xl mb-1" aria-hidden="true">{icon}</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="mt-2 flex gap-1 w-full">
                  <input
                    type="url"
                    className="flex-1 text-xs border border-gray-300 rounded px-1 py-0.5"
                    placeholder="https://"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    aria-label="Enter link URL"
                    data-testid="evidence-link-input"
                  />
                  <button
                    type="button"
                    className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded"
                    onClick={handleLinkAdd}
                    aria-label="Add link evidence"
                    data-testid="evidence-link-add"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          }

          if (type === 'text') {
            return (
              <div
                key={type}
                className="evidence-tile col-span-2 flex flex-col p-3 border-2 border-dashed border-gray-300 rounded-lg"
                data-testid={`evidence-tile-${type}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <textarea
                  className="text-xs border border-gray-300 rounded p-1 resize-none"
                  rows={2}
                  placeholder="Enter findings text…"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  aria-label="Enter findings text"
                  data-testid="evidence-text-input"
                />
                <button
                  type="button"
                  className="mt-1 self-end text-xs bg-primary-600 text-white px-2 py-0.5 rounded"
                  onClick={handleTextSave}
                  aria-label="Save findings text"
                  data-testid="evidence-text-save"
                >
                  Save
                </button>
              </div>
            );
          }

          return (
            <label
              key={type}
              className="evidence-tile flex flex-col items-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer"
              data-testid={`evidence-tile-${type}`}
              aria-label={`Upload ${label} evidence`}
            >
              <span className="text-2xl mb-1" aria-hidden="true">{icon}</span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(type, file);
                  e.target.value = '';
                }}
                aria-label={`Select ${label} file`}
                data-testid={`evidence-file-input-${type}`}
              />
            </label>
          );
        })}
      </div>

      {/* Uploaded evidence tiles */}
      {activeItems.length > 0 && (
        <div className="uploaded-evidence" data-testid="uploaded-evidence-list">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Uploaded Evidence ({activeItems.length})
          </h4>
          <div className="space-y-2">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded"
                data-testid={`evidence-item-${item.id}`}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-700 truncate block">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                </div>
                <div className="flex gap-2 ml-2">
                  {/* Replace control */}
                  <label
                    className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                    aria-label={`Replace ${item.name}`}
                    data-testid={`evidence-replace-${item.id}`}
                  >
                    Replace
                    {item.type !== 'link' && item.type !== 'text' && (
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplace(item.id, item.type, file);
                          e.target.value = '';
                        }}
                      />
                    )}
                  </label>
                  {/* Remove control — soft-delete */}
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name}`}
                    data-testid={`evidence-remove-${item.id}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceUploadPanel;
