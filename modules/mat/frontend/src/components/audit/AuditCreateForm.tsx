/**
 * Audit Creation Form Component
 * FRS: FR-001 (Audit Creation)
 * TRS: TR-047
 */
export function AuditCreateForm() {
  return (
    <form className="audit-create-form">
      <h3>Create New Audit</h3>
      <input type="text" placeholder="Audit name" aria-label="Audit name" />
      <button type="submit">Create</button>
    </form>
  );
}
