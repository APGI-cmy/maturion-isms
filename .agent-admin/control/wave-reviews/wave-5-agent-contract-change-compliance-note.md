# Wave 5 Agent Contract Change Compliance Note

```yaml
agent_contract_change_compliance:
  wave: "Wave 5 — Foreman Tier 1 simplification"
  changed_contract: ".github/agents/foreman-v2-agent.md"
  policy: "AGCFPP-001"
  status: "DRAFT_BRANCH_ONLY_NOT_MERGE_READY"
  codexadvisor_review_required: true
  iaa_review_required: true
  cs2_acceptance_required: true
  may_leave_draft_before_reviews: false
  may_merge_before_reviews: false
```

## Note

Wave 5 changes the Foreman agent contract body. This is permitted only inside the isolated draft cleanup branch until the required review posture is satisfied.

Before Wave 5 is marked final, and before this PR leaves draft state, the PR must record:

- CodexAdvisor review or CS2-approved equivalent for the Foreman contract rewrite;
- IAA review of the Foreman contract rewrite impact;
- CS2 acceptance that the relocation map preserves controls rather than deleting them.

This note does not approve the contract change. It records the outstanding compliance requirement so it cannot be missed before final merge.
