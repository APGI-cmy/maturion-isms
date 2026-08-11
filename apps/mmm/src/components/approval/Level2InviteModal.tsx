import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Approver {
  id: string;
  fullName: string;
  email: string;
  approvalLevel: 'level_2' | 'level_3';
  designation: string;
  approvalScope?: string[];
}

interface Level2InviteModalProps {
  domainId: string;
  frameworkId: string;
  organisationId: string;
  domainName: string;
  mpsCount: number;
  criteriaCount: number;
  descriptorCount: number;
  onClose: () => void;
  onSubmit: (approvers: Approver[], message?: string, dueDate?: Date) => Promise<void>;
}

/**
 * Level 2 Invite Modal Component
 * Allows Level 1 users to invite Level 2 approvers for domain approval
 * 
 * Features:
 * - Display approval scope summary (domain, MPS, criteria, descriptors)
 * - Add/remove multiple approvers
 * - Validate approver details (name, email, no duplicates)
 * - Optional invite message and due date
 * - Call mmm-approval-round-create on submit
 */
export function Level2InviteModal({
  domainId,
  frameworkId,
  organisationId,
  domainName,
  mpsCount,
  criteriaCount,
  descriptorCount,
  onClose,
  onSubmit,
}: Level2InviteModalProps) {
  const [approvers, setApprovers] = useState<Approver[]>([
    { id: crypto.randomUUID(), fullName: '', email: '', approvalLevel: 'level_2', designation: '' },
  ]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const addApprover = () => {
    const newApprover: Approver = {
      id: crypto.randomUUID(),
      fullName: '',
      email: '',
      approvalLevel: 'level_2',
      designation: '',
    };
    setApprovers([...approvers, newApprover]);
    setValidationErrors({});
  };

  const removeApprover = (id: string) => {
    setApprovers(approvers.filter(a => a.id !== id));
    setValidationErrors({});
  };

  const updateApprover = (id: string, field: keyof Approver, value: any) => {
    setApprovers(approvers.map(a => (a.id === id ? { ...a, [field]: value } : a)));
    // Clear validation error for this field
    const errorKey = `${id}-${field}`;
    if (validationErrors[errorKey]) {
      const newErrors = { ...validationErrors };
      delete newErrors[errorKey];
      setValidationErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emails = new Set<string>();

    for (const approver of approvers) {
      // Validate full name
      if (!approver.fullName?.trim()) {
        errors[`${approver.id}-fullName`] = 'Full name is required';
      }

      // Validate email
      if (!approver.email?.trim()) {
        errors[`${approver.id}-email`] = 'Email is required';
      } else if (!isValidEmail(approver.email)) {
        errors[`${approver.id}-email`] = 'Invalid email format';
      } else if (emails.has(approver.email.toLowerCase())) {
        errors[`${approver.id}-email`] = 'Duplicate email address';
      }

      emails.add(approver.email.toLowerCase());

      // Validate designation
      if (!approver.designation?.trim()) {
        errors[`${approver.id}-designation`] = 'Designation/role is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitError('Please fix validation errors');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(approvers, inviteMessage, dueDate);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send invitations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Invite Level 2 Approvers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Invite domain experts to review <strong>{domainName}</strong> before Level 3 final approval
          </p>
        </div>

        {/* Approval Scope Summary */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <h3 className="font-medium text-gray-900 mb-3">Approval Scope</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Domain</p>
              <p className="text-lg font-bold text-blue-900">1</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">MPS</p>
              <p className="text-lg font-bold text-blue-900">{mpsCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Criteria</p>
              <p className="text-lg font-bold text-blue-900">{criteriaCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">Descriptors</p>
              <p className="text-lg font-bold text-blue-900">{descriptorCount}</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Approvers Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Approvers</h3>
            <div className="space-y-4">
              {approvers.map((approver, index) => (
                <div key={approver.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Approver {index + 1}</h4>
                    {approvers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApprover(approver.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div>
                      <label htmlFor={`fullName-${approver.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id={`fullName-${approver.id}`}
                        type="text"
                        value={approver.fullName}
                        onChange={(e) => updateApprover(approver.id, 'fullName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          validationErrors[`${approver.id}-fullName`]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {validationErrors[`${approver.id}-fullName`] && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors[`${approver.id}-fullName`]}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor={`email-${approver.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        id={`email-${approver.id}`}
                        type="email"
                        value={approver.email}
                        onChange={(e) => updateApprover(approver.id, 'email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          validationErrors[`${approver.id}-email`]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {validationErrors[`${approver.id}-email`] && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors[`${approver.id}-email`]}</p>
                      )}
                    </div>

                    {/* Designation */}
                    <div>
                      <label htmlFor={`designation-${approver.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Designation/Role *
                      </label>
                      <input
                        id={`designation-${approver.id}`}
                        type="text"
                        value={approver.designation}
                        onChange={(e) => updateApprover(approver.id, 'designation', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          validationErrors[`${approver.id}-designation`]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder="e.g., Risk Manager, Security Lead"
                      />
                      {validationErrors[`${approver.id}-designation`] && (
                        <p className="text-xs text-red-600 mt-1">{validationErrors[`${approver.id}-designation`]}</p>
                      )}
                    </div>

                    {/* Approval Level */}
                    <div>
                      <label htmlFor={`approvalLevel-${approver.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Approval Level
                      </label>
                      <select
                        id={`approvalLevel-${approver.id}`}
                        value={approver.approvalLevel}
                        onChange={(e) => updateApprover(approver.id, 'approvalLevel', e.target.value as 'level_2' | 'level_3')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="level_2">Level 2 (Domain Approval)</option>
                        <option value="level_3">Level 3 (Executive Approval)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addApprover}
              className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              + Add Approver
            </button>
          </div>

          {/* Optional Fields */}
          <div className="space-y-3">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Invite Message (optional)
              </label>
              <textarea
                id="message"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={3}
                placeholder="Add a message for approvers..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (optional)
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasAnyErrors}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending Invitations...' : 'Send Invitations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Level2InviteModal;
