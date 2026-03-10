/**
 * Audit Creation Form Component
 * FRS: FR-001 (Audit Creation)
 * TRS: TR-047
 * Task: 5.6.2 (Audit Management CRUD)
 */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateAudit } from '../../lib/hooks/useAudits';

export function AuditCreationForm() {
  const createAudit = useCreateAudit();
  const [formData, setFormData] = useState({
    title: '',
    organisation_name: '',
    facility_location: '',
    audit_period_start: '',
    audit_period_end: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Audit title is required';
    }

    const trimmedOrgName = formData.organisation_name.trim();
    if (!trimmedOrgName) {
      newErrors.organisation_name = 'Organisation name is required';
    } else if (trimmedOrgName.length > 255) {
      newErrors.organisation_name = 'Organisation name must not exceed 255 characters';
    }

    if ((formData.facility_location || '').trim().length > 255) {
      newErrors.facility_location = 'Facility location must not exceed 255 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await createAudit.mutateAsync(formData);
      // Reset form on success
      setFormData({
        title: '',
        organisation_name: '',
        facility_location: '',
        audit_period_start: '',
        audit_period_end: '',
      });
      setErrors({});
      toast.success('Audit created successfully!');
    } catch (error) {
      toast.error(`Failed to create audit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form className="audit-creation-form p-6 bg-white border border-gray-200 rounded shadow-sm" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Create New Audit</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Audit Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter audit title"
            aria-label="Audit title"
            aria-required="true"
            aria-invalid={!!errors.title}
            className={`w-full px-3 py-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1" role="alert">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="organisation_name" className="block text-sm font-medium text-gray-700 mb-1">
            Organisation Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="organisation_name"
            name="organisation_name"
            value={formData.organisation_name}
            onChange={handleChange}
            placeholder="Enter organisation name"
            maxLength={255}
            aria-label="Organisation name"
            aria-required="true"
            aria-invalid={!!errors.organisation_name}
            className={`w-full px-3 py-2 border rounded ${errors.organisation_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.organisation_name && (
            <p className="text-red-500 text-sm mt-1" role="alert">{errors.organisation_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="facility_location" className="block text-sm font-medium text-gray-700 mb-1">
            Facility Location
          </label>
          <input
            type="text"
            id="facility_location"
            name="facility_location"
            value={formData.facility_location}
            onChange={handleChange}
            placeholder="Enter facility location"
            maxLength={255}
            aria-label="Facility location"
            aria-invalid={!!errors.facility_location}
            className={`w-full px-3 py-2 border rounded ${errors.facility_location ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.facility_location && (
            <p className="text-red-500 text-sm mt-1" role="alert">{errors.facility_location}</p>
          )}
        </div>

        <div>
          <label htmlFor="audit_period_start" className="block text-sm font-medium text-gray-700 mb-1">
            Audit Period Start
          </label>
          <input
            type="date"
            id="audit_period_start"
            name="audit_period_start"
            value={formData.audit_period_start}
            onChange={handleChange}
            aria-label="Audit period start"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="audit_period_end" className="block text-sm font-medium text-gray-700 mb-1">
            Audit Period End
          </label>
          <input
            type="date"
            id="audit_period_end"
            name="audit_period_end"
            value={formData.audit_period_end}
            onChange={handleChange}
            aria-label="Audit period end"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={createAudit.isPending}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {createAudit.isPending ? 'Creating...' : 'Create Audit'}
      </button>

      {createAudit.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded" role="alert">
          <p className="text-red-800 text-sm">
            Error: {createAudit.error?.message || 'Failed to create audit'}
          </p>
        </div>
      )}
    </form>
  );
}
