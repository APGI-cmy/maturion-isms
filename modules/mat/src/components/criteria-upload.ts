/**
 * Criteria Upload Form Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §4 (Evidence Upload TR-049)
 * FRS: FR-004 (Criteria Document Upload)
 * TRS: TR-049 (Evidence Upload Component)
 *
 * Implements criteria document upload form with drag-and-drop,
 * file type validation, progress tracking, and accessible UI.
 */

/**
 * Accepted file types for criteria document upload
 * FRS: FR-004 — PDF and DOCX support
 */
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

/**
 * File type display names
 */
export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
};

/**
 * Maximum file size in bytes (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Upload state for a single file
 */
export interface UploadFileState {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  progress: number;
  errorMessage?: string;
}

/**
 * Upload form state
 */
export interface UploadFormState {
  files: UploadFileState[];
  isDragOver: boolean;
  isUploading: boolean;
}

/**
 * Creates initial upload form state
 *
 * @returns Default empty upload form state
 */
export function createInitialUploadState(): UploadFormState {
  return {
    files: [],
    isDragOver: false,
    isUploading: false
  };
}

/**
 * Validates a file for upload
 *
 * @param fileName - Name of the file
 * @param fileSize - Size in bytes
 * @param mimeType - MIME type of the file
 * @returns Validation result with errors if any
 */
export function validateFile(
  fileName: string,
  fileSize: number,
  mimeType: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!ACCEPTED_FILE_TYPES.includes(mimeType as typeof ACCEPTED_FILE_TYPES[number])) {
    errors.push(`File type "${mimeType}" is not supported. Accepted types: PDF, DOCX`);
  }

  if (fileSize > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    const fileMB = (fileSize / (1024 * 1024)).toFixed(1);
    errors.push(`File size (${fileMB}MB) exceeds maximum allowed size (${maxMB}MB)`);
  }

  if (!fileName.trim()) {
    errors.push('File name is required');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Adds a validated file to the upload state
 *
 * @param state - Current upload state
 * @param fileName - File name
 * @param fileSize - File size in bytes
 * @param mimeType - MIME type
 * @returns Updated state with file added (or errors)
 */
export function addFileToUpload(
  state: UploadFormState,
  fileName: string,
  fileSize: number,
  mimeType: string
): { state: UploadFormState; errors: string[] } {
  const validation = validateFile(fileName, fileSize, mimeType);

  if (!validation.valid) {
    return { state, errors: validation.errors };
  }

  const fileState: UploadFileState = {
    id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    fileName,
    fileSize,
    mimeType,
    status: 'pending',
    progress: 0
  };

  return {
    state: {
      ...state,
      files: [...state.files, fileState]
    },
    errors: []
  };
}

/**
 * Updates upload progress for a specific file
 *
 * @param state - Current upload state
 * @param fileId - ID of file being uploaded
 * @param progress - Progress percentage (0-100)
 * @returns Updated state
 */
export function updateUploadProgress(
  state: UploadFormState,
  fileId: string,
  progress: number
): UploadFormState {
  return {
    ...state,
    files: state.files.map(f =>
      f.id === fileId
        ? { ...f, progress: Math.min(100, Math.max(0, progress)), status: progress >= 100 ? 'complete' : 'uploading' }
        : f
    )
  };
}

/**
 * Marks a file upload as failed
 *
 * @param state - Current upload state
 * @param fileId - ID of file that failed
 * @param errorMessage - Error description
 * @returns Updated state
 */
export function markUploadError(
  state: UploadFormState,
  fileId: string,
  errorMessage: string
): UploadFormState {
  return {
    ...state,
    files: state.files.map(f =>
      f.id === fileId
        ? { ...f, status: 'error', errorMessage }
        : f
    )
  };
}

/**
 * Sets drag-over state for drop zone
 *
 * @param state - Current upload state
 * @param isDragOver - Whether files are being dragged over the drop zone
 * @returns Updated state
 */
export function setDragOver(
  state: UploadFormState,
  isDragOver: boolean
): UploadFormState {
  return { ...state, isDragOver };
}

/**
 * Gets ARIA attributes for the drop zone
 *
 * @param state - Current upload state
 * @returns ARIA attributes object
 */
export function getDropZoneAriaAttributes(state: UploadFormState): Record<string, string> {
  return {
    role: 'button',
    'aria-label': 'Upload criteria document. Drag and drop or click to browse. Accepts PDF and DOCX files.',
    'aria-dropeffect': 'copy',
    tabindex: '0'
  };
}
