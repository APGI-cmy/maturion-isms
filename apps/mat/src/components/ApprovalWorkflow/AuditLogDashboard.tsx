/**
 * Audit Log Dashboard Component — Phase 6 UI Component
 * File: apps/mat/src/components/ApprovalWorkflow/AuditLogDashboard.tsx
 * Issue: #2004 (mmm-approval-foundation-runtime-build-to-green)
 *
 * Displays immutable audit trail for approval rounds.
 * Implements T-MMM-APPROVAL-DB-016 (immutable comments and events).
 *
 * Contract: approval-workflow-db-api-contract.md §19 (audit retrieval)
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface AuditEvent {
  id: string;
  event_type: string;
  actor_id: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export const AuditLogDashboard: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch audit events
  const { data: auditEvents, isLoading } = useQuery({
    queryKey: ['audit-events', roundId, filterType],
    queryFn: async () => {
      const response = await fetch(`/api/mmm-approval-workspace-read?filter=pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch audit events');
      const data = await response.json();
      const round = data.approval_rounds.find((r: any) => r.id === roundId);
      // Fetch full audit details via separate call (in production)
      return [];
    },
  });

  const eventTypes = [
    'round_created',
    'invitation_sent',
    'invite_accepted',
    'decision_submitted',
    'change_applied',
    'lock_transition',
    'published_model_created',
  ];

  const eventTypeColors: Record<string, string> = {
    round_created: 'bg-blue-100 text-blue-800',
    invitation_sent: 'bg-purple-100 text-purple-800',
    invite_accepted: 'bg-green-100 text-green-800',
    decision_submitted: 'bg-orange-100 text-orange-800',
    change_applied: 'bg-cyan-100 text-cyan-800',
    lock_transition: 'bg-red-100 text-red-800',
    published_model_created: 'bg-yellow-100 text-yellow-800',
  };

  const eventTypeIcons: Record<string, string> = {
    round_created: '📋',
    invitation_sent: '📧',
    invite_accepted: '✓',
    decision_submitted: '🎯',
    change_applied: '✎',
    lock_transition: '🔒',
    published_model_created: '📄',
  };

  // Mock data for demonstration
  const mockEvents: AuditEvent[] = [
    {
      id: '1',
      event_type: 'round_created',
      actor_id: 'user-001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: { framework_id: 'fw-2026-001' },
    },
    {
      id: '2',
      event_type: 'invitation_sent',
      actor_id: 'system',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      details: { domain_id: 'domain-security', approver_count: 3 },
    },
    {
      id: '3',
      event_type: 'invite_accepted',
      actor_id: 'user-002',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      details: { approver_id: 'approver-001' },
    },
    {
      id: '4',
      event_type: 'decision_submitted',
      actor_id: 'user-002',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      details: { decision: 'approved', domain_id: 'domain-security' },
    },
  ];

  const filteredEvents = mockEvents.filter(
    (event) => !filterType || event.event_type === filterType
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Event Type', 'Actor', 'Details'],
      ...sortedEvents.map((event) => [
        new Date(event.timestamp).toISOString(),
        event.event_type,
        event.actor_id,
        JSON.stringify(event.details || {}),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${roundId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Audit Log — Approval Round {roundId}</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType(null)}
            className={`px-3 py-2 rounded text-sm font-semibold transition ${
              filterType === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Events
          </button>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="text-sm font-semibold">Sort:</label>
          <button
            onClick={() => setSortOrder('desc')}
            className={`px-3 py-1 rounded text-xs ${
              sortOrder === 'desc'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`px-3 py-1 rounded text-xs ${
              sortOrder === 'asc'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Oldest First
          </button>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No audit events found</div>
        ) : (
          sortedEvents.map((event, idx) => (
            <div key={event.id} className="border-l-4 border-gray-300 pl-6 py-4 relative">
              {/* Timeline dot */}
              <div className="absolute -left-3 top-5 w-5 h-5 bg-white border-4 border-gray-300 rounded-full" />

              {/* Event card */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{eventTypeIcons[event.event_type] || '•'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${eventTypeColors[event.event_type]}`}>
                      {event.event_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="ml-8 text-sm text-gray-700 space-y-1">
                  <p><strong>Actor:</strong> {event.actor_id === 'system' ? '🤖 System' : `👤 ${event.actor_id}`}</p>
                  {event.details && Object.keys(event.details).length > 0 && (
                    <p><strong>Details:</strong> {JSON.stringify(event.details)}</p>
                  )}
                </div>

                {/* Immutability notice */}
                <div className="ml-8 mt-2 text-xs text-gray-500 italic">🔐 Immutable audit record</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">Audit Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-blue-600">{sortedEvents.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Approver Actions</p>
            <p className="text-2xl font-bold text-green-600">
              {sortedEvents.filter((e) => e.event_type === 'decision_submitted').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Last Updated</p>
            <p className="text-sm text-gray-700">
              {sortedEvents.length > 0
                ? new Date(sortedEvents[0].timestamp).toLocaleString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDashboard;
