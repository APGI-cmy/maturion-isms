export default function AuditActions() {
  return (
    <div className="flex gap-2">
      <button className="rounded-md bg-primary px-3 py-2 text-sm text-white hover:bg-primary/90">
        Edit
      </button>
      <button className="rounded-md bg-destructive px-3 py-2 text-sm text-white hover:bg-destructive/90">
        Delete
      </button>
    </div>
  );
}
