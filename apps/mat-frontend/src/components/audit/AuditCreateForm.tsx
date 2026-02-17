import { useState } from 'react';

interface AuditCreateFormProps {
  onSubmit?: (data: AuditFormData) => void;
  onCancel?: () => void;
}

interface AuditFormData {
  name: string;
  description: string;
  auditType: string;
  startDate: string;
  targetDomain?: string;
}

const AuditCreateForm = ({ onSubmit, onCancel }: AuditCreateFormProps) => {
  const [formData, setFormData] = useState<AuditFormData>({
    name: '',
    description: '',
    auditType: 'full',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Audit Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="auditType" className="block text-sm font-medium text-gray-700 mb-2">
          Audit Type
        </label>
        <select
          id="auditType"
          name="auditType"
          value={formData.auditType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="full">Full Audit</option>
          <option value="partial">Partial Audit</option>
          <option value="followup">Follow-up Audit</option>
        </select>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Create Audit
        </button>
      </div>
    </form>
  );
};

export default AuditCreateForm;
