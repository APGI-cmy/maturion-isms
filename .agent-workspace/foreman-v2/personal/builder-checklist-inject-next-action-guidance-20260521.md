# Builder Checklist — inject-next-action-guidance

Builder: `qa-builder`  
Issue: #1718  
PR: #1719

- [ ] Use trusted default-branch code only under `pull_request_target`; no PR branch checkout or execution.
- [ ] Reuse existing checkpoint / active-state data sources where possible.
- [ ] Ensure the producer next-action comment uses exactly one sticky marker: `<!-- producer-next-action-shortfall -->`.
- [ ] Ensure the comment updates in place and does not create duplicates.
- [ ] Keep the new guidance advisory only; do not weaken `handover-claim-gate`.
- [ ] Keep `/prepare-handover`, `PRE_HANDOVER_CHECKPOINT`, and `ECAP_PRE_HANDOVER_CHECKPOINT` as deliberate checkpoint triggers.
- [ ] Update trigger-phrase handling so final-summary / handover-intent phrases are centralized or demonstrably kept in parity.
- [ ] Add or update focused regressions for synchronize/open/update triggers and current-head blocker summary behavior.
- [ ] Validate with the existing regression commands used by the touched surfaces.
