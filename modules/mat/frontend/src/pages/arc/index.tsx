/**
 * ARC (Adaptive Review Committee) Portal
 * Wave 16.7 — GAP-013
 *
 * Provides ARC operators with a review portal to:
 *  - View pending feedback items from the AI self-learning loop
 *  - Approve or reject each item (wired to POST /api/ai/feedback/approve)
 *  - All actions are attributed to the operator (reviewedBy) and logged
 *    to audit_logs via the backend approve endpoint
 *
 * API endpoints:
 *   GET  /api/ai/feedback/pending  — lists pending feedback events
 *   POST /api/ai/feedback/approve  — approve or reject a feedback event
 *
 * Acceptance Criteria: implementation-plan.md Wave 16.7 AC-1, AC-2
 * FRS: GAP-013
 */
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSessionToken } from '../../lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PendingFeedbackItem {
  id: string;
  audit_id?: string;
  criterion_id?: string;
  recommendation?: string;
  ai_suggestion?: string;
  source?: string;
  status: 'pending' | string;
  created_at: string;
  [key: string]: unknown;
}

interface ApprovePayload {
  eventId: string;
  decision: 'approved' | 'rejected';
  reviewedBy: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Data fetching helpers
// ---------------------------------------------------------------------------

/**
 * Fetch pending feedback items from the ARC API.
 * Authenticates via the caller's Supabase session JWT (Authorization: Bearer).
 * No client-side secrets are used — the token is the Supabase session token.
 */
async function fetchPendingFeedback(token: string): Promise<PendingFeedbackItem[]> {
  const res = await fetch('/api/ai/feedback/pending', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (body as { error?: string }).error ?? `HTTP ${res.status} — failed to fetch pending feedback`,
    );
  }

  return res.json() as Promise<PendingFeedbackItem[]>;
}

/**
 * Submit an approve or reject decision for a feedback item.
 * Authenticates via the caller's Supabase session JWT (Authorization: Bearer).
 * audit_logs are written server-side by the approve endpoint
 * (see api/ai/feedback/approve.ts) using the reviewedBy field.
 *
 * @remarks
 * The approve endpoint writes to audit_logs automatically.
 * The reviewedBy field ensures each ARC action is attributable to the operator.
 */
async function submitFeedbackDecision(payload: ApprovePayload, token: string): Promise<void> {
  const res = await fetch('/api/ai/feedback/approve', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (body as { error?: string }).error ?? `HTTP ${res.status} — decision submission failed`,
    );
  }
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function usePendingFeedback() {
  const { session } = useAuth();
  return useQuery<PendingFeedbackItem[], Error>({
    queryKey: ['arc-pending-feedback'],
    queryFn: async () => {
      const token = await getSessionToken();
      if (!token) throw new Error('Not authenticated');
      return fetchPendingFeedback(token);
    },
    staleTime: 30000,
    refetchIntervalInBackground: false,
    enabled: !!session,
  });
}

function useFeedbackDecision() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ApprovePayload>({
    mutationFn: async (payload) => {
      const token = await getSessionToken();
      if (!token) throw new Error('Not authenticated');
      return submitFeedbackDecision(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arc-pending-feedback'] });
    },
  });
}

// ---------------------------------------------------------------------------
// Review card component
// ---------------------------------------------------------------------------

interface ReviewCardProps {
  item: PendingFeedbackItem;
  onApprove: (id: string) => void;
  onReject: (id: string, notes: string) => void;
  isPending: boolean;
}

function ReviewCard({ item, onApprove, onReject, isPending }: ReviewCardProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  const handleReject = useCallback(() => {
    if (!rejectNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onReject(item.id, rejectNotes);
    setRejectMode(false);
    setRejectNotes('');
  }, [rejectNotes, item.id, onReject]);

  const formattedDate = new Date(item.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
      aria-labelledby={`feedback-item-${item.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />
          <span
            id={`feedback-item-${item.id}`}
            className="text-xs font-mono text-gray-500"
          >
            {item.id}
          </span>
        </div>
        <time className="text-xs text-gray-400 flex-shrink-0" dateTime={item.created_at}>
          {formattedDate}
        </time>
      </div>

      {item.ai_suggestion || item.recommendation ? (
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mb-4">
          <p className="text-xs font-semibold text-blue-700 mb-1">AI Recommendation</p>
          <p className="text-sm text-gray-800">{item.ai_suggestion ?? item.recommendation}</p>
        </div>
      ) : null}

      {item.criterion_id && (
        <p className="text-xs text-gray-500 mb-4">
          Criterion: <span className="font-mono">{item.criterion_id}</span>
        </p>
      )}

      {!rejectMode ? (
        <div className="flex gap-3" role="group" aria-label="ARC decision">
          <button
            onClick={() => onApprove(item.id)}
            disabled={isPending}
            aria-label="Approve feedback item"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            Approve
          </button>
          <button
            onClick={() => setRejectMode(true)}
            disabled={isPending}
            aria-label="Reject feedback item"
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Reject
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor={`reject-notes-${item.id}`} className="block text-sm font-medium text-gray-700">
            Rejection reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`reject-notes-${item.id}`}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={3}
            placeholder="Provide a reason for rejection…"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Confirm Reject
            </button>
            <button
              onClick={() => {
                setRejectMode(false);
                setRejectNotes('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// ARC Portal Page (default export)
// ---------------------------------------------------------------------------

/**
 * ARC Review Portal — accessible to users with the ARC operator role.
 *
 * All approve/reject actions are posted to /api/ai/feedback/approve which
 * writes to audit_logs server-side. The reviewedBy field carries the
 * current operator's identity for full traceability in audit_logs.
 *
 * @see api/ai/feedback/approve.ts — server-side audit_logs write
 */
export default function ArcPortalPage() {
  const { user } = useAuth();
  const currentUser = user?.email ?? user?.id ?? 'unknown-operator';

  const { data: pending, isLoading, isError, error, refetch } = usePendingFeedback();
  const decisionMutation = useFeedbackDecision();

  /**
   * Approve a feedback item.
   * reviewedBy is passed to the API so audit_logs entries are attributable.
   */
  const handleApprove = useCallback(
    (eventId: string) => {
      decisionMutation.mutate(
        {
          eventId,
          decision: 'approved',
          reviewedBy: currentUser,
          /* audit_logs written by approve.ts using reviewedBy + decision */
        },
        {
          onSuccess: () => toast.success('Feedback approved and logged to audit_logs'),
          onError: (err) => toast.error(`Approval failed: ${err.message}`),
        },
      );
    },
    [decisionMutation, currentUser],
  );

  /**
   * Reject a feedback item with operator notes.
   * audit_logs entry includes notes and reviewedBy via the approve endpoint.
   */
  const handleReject = useCallback(
    (eventId: string, notes: string) => {
      decisionMutation.mutate(
        {
          eventId,
          decision: 'rejected',
          reviewedBy: currentUser,
          notes,
        },
        {
          onSuccess: () => toast.success('Feedback rejected and logged to audit_logs'),
          onError: (err) => toast.error(`Rejection failed: ${err.message}`),
        },
      );
    },
    [decisionMutation, currentUser],
  );

  return (
    <main className="space-y-6" aria-label="ARC Review Portal">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ARC Review Portal</h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Adaptive Review Committee — review and action pending AI feedback items
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          aria-label="Refresh pending feedback list"
          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Operator identity indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-blue-800">
        <ShieldCheck className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>
          Acting as ARC operator: <strong>{currentUser}</strong>
          {' '}— all actions are logged to <code className="font-mono text-xs">audit_logs</code>
          {' '}with <code className="font-mono text-xs">reviewedBy: &quot;{currentUser}&quot;</code>
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center py-16 gap-3 text-gray-500"
        >
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          <span>Loading pending feedback from /api/ai/feedback/pending…</span>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-red-800 text-sm font-medium">Failed to load pending feedback</p>
            <p className="text-red-700 text-xs mt-0.5">{error?.message}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && (!pending || pending.length === 0) && (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" aria-hidden="true" />
          <p className="font-medium text-gray-700">No pending feedback items</p>
          <p className="text-sm mt-1">All AI feedback has been reviewed. Check back later.</p>
        </div>
      )}

      {/* Pending items list */}
      {!isLoading && !isError && pending && pending.length > 0 && (
        <section aria-labelledby="pending-list-heading">
          <h2
            id="pending-list-heading"
            className="text-lg font-semibold text-gray-800 mb-4"
          >
            Pending Items ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((item) => (
              <ReviewCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                isPending={decisionMutation.isPending}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
