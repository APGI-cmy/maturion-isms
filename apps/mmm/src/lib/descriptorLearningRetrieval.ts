export type DescriptorLearningRecord = {
  tenantId: string;
  reuseScope: string;
  reviewStatus: string;
};

export function canUseDescriptorLearningRecordForTenant(
  record: DescriptorLearningRecord,
  currentTenantId: string,
): boolean {
  if (record.tenantId === currentTenantId) return true;

  return (
    record.reuseScope === 'approved_global_methodology_pattern' &&
    record.reviewStatus === 'approved_global'
  );
}
