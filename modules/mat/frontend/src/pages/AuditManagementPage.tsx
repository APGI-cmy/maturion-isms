/**
 * Audit Management Page
 * FRS: FR-001 (Create Audit), FR-002 (Audit Listing), FR-003 (Audit Deletion)
 * TRS: TR-047
 * Task: 5.6.2 (Audit Management CRUD)
 */
import { AuditCreationForm } from '../components/audits/AuditCreationForm';
import { AuditList } from '../components/audits/AuditList';

export function AuditManagementPage() {
  return (
    <div className="audit-management-page p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Audit Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Form - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <AuditCreationForm />
        </div>
        
        {/* Audit List - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <AuditList />
        </div>
      </div>
    </div>
  );
}
