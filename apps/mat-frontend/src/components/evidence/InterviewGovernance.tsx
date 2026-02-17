export default function InterviewGovernance() {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-4">
      <h4 className="font-semibold text-sm">Interview Governance</h4>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li>• Maximum duration: 30 minutes</li>
        <li>• Requires participant consent</li>
        <li>• Auto-saved every 5 minutes</li>
        <li>• Must declare roles and purpose</li>
      </ul>
      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" required />
        <span className="text-xs">I have obtained consent from participants</span>
      </label>
    </div>
  );
}
