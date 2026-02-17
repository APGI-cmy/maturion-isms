export default function GovernanceRules() {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-4">
      <h4 className="font-semibold text-sm">Interview Governance</h4>
      <ul className="text-xs text-muted-foreground space-y-1">
        <li>• Maximum duration: 30 minutes</li>
        <li>• Requires participant consent</li>
        <li>• Auto-saved every 5 minutes</li>
      </ul>
    </div>
  );
}
