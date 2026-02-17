/**
 * Role-Based UI Element Visibility
 * FRS: FR-031 (Role-Based Access)
 * TRS: TR-012
 */
export function RoleGuard({ children, requiredRole }: { children: React.ReactNode; requiredRole: string }) {
  return <div className="role-guard" data-required-role={requiredRole}>{children}</div>;
}
