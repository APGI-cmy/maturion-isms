interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}
const RoleGuard = ({ children }: RoleGuardProps) => {
  return <>{children}</>;
};
export default RoleGuard;
