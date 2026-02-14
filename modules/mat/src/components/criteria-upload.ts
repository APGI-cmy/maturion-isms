/**
 * Criteria Upload Form Component Logic
 * Architecture: modules/mat/02-architecture/ui-component-architecture.md §4
 * Implements drag-and-drop criteria document upload with progress tracking.
 * TR-049: Evidence Upload Component (adapted for criteria document upload)
 */

/** Supported file types for criteria upload */
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
] as const;

export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];

export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx'] as const;

/** Maximum file size: 50MB */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

/** Upload state machine */
export type UploadState = 'idle' | 'validating' | 'uploading' | 'processing' | 'complete' | 'error';

/** Upload progress information */
export interface UploadProgress {
  state: UploadState;
  fileName: string;
  fileSize: number;
  mimeType: string;
  percentComplete: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

/** Validation result for upload files */
export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

/** Drop zone state for drag-and-drop UI */
export interface DropZoneState {
  isDragOver: boolean;
  isAccepting: boolean;
  ariaLabel: string;
  role: string;
  tabIndex: number;
}

/**
 * Validates a file before upload
 * TR-049: Client Validation — File type, size, extension checked before upload
 */
export function validateUploadFile(
  fileName: string,
  fileSize: number,
  mimeType: string
): FileValidationResult {
  const errors: string[] = [];

  // Check file extension
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(extension as typeof SUPPORTED_EXTENSIONS[number])) {
    errors.push(`Unsupported file type: ${extension}. Supported types: ${SUPPORTED_EXTENSIONS.join(', ')}`);
  }

  // Check MIME type
  if (!SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)) {
    errors.push(`Unsupported MIME type: ${mimeType}`);
  }

  // Check file size
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const maxMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    errors.push(`File size ${(fileSize / (1024 * 1024)).toFixed(1)}MB exceeds maximum ${maxMB}MB`);
  }

  // Check for empty files
  if (fileSize === 0) {
    errors.push('File is empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates initial upload progress state
 */
export function createUploadProgress(fileName: string, fileSize: number, mimeType: string): UploadProgress {
  return {
    state: 'idle',
    fileName,
    fileSize,
    mimeType,
    percentComplete: 0,
    startedAt: undefined,
    completedAt: undefined,
  };
}

/**
 * Advances upload progress to next state
 */
export function advanceUploadState(
  progress: UploadProgress,
  newState: UploadState,
  percentComplete?: number,
  error?: string
): UploadProgress {
  return {
    ...progress,
    state: newState,
    percentComplete: percentComplete ?? progress.percentComplete,
    error,
    startedAt: progress.startedAt ?? (newState === 'validating' ? new Date().toISOString() : undefined),
    completedAt: newState === 'complete' || newState === 'error' ? new Date().toISOString() : undefined,
  };
}

/**
 * Creates initial drop zone state with accessibility attributes
 * TR-033: WCAG 2.1 AA compliance
 */
export function createDropZoneState(): DropZoneState {
  return {
    isDragOver: false,
    isAccepting: false,
    ariaLabel: 'Drop criteria document here or click to browse. Supported formats: PDF, DOCX. Maximum size: 50MB.',
    role: 'button',
    tabIndex: 0,
  };
}

/**
 * Processes a drag event and updates drop zone state
 */
export function handleDragEvent(
  state: DropZoneState,
  eventType: 'dragenter' | 'dragover' | 'dragleave' | 'drop'
): DropZoneState {
  switch (eventType) {
    case 'dragenter':
    case 'dragover':
      return { ...state, isDragOver: true, isAccepting: true };
    case 'dragleave':
      return { ...state, isDragOver: false, isAccepting: false };
    case 'drop':
      return { ...state, isDragOver: false, isAccepting: false };
    default:
      return state;
  }
}
