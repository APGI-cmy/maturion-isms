export function toTrimmedText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function hasTrimmedText(value: unknown): boolean {
  return toTrimmedText(value).length > 0;
}

export function toDisplayText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

export function toDisplayNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}
