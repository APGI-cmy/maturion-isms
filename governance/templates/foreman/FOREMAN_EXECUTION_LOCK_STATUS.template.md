# FOREMAN EXECUTION LOCK STATUS

<!-- Template version: 1.0.0 | Authority: CS2 — issue #1593 | Tier 3 operational template -->
<!-- Complete before proceeding to Phase 4. Reference in PREHANDOVER proof. -->

## Lock Status Record Metadata

```text
PR:
Current PR HEAD:
Date (UTC):
Wave:
Evaluated by: foreman-v2-agent
```

## START_LOCK

```text
Required orchestration record present:         yes/no
agents_delegated_to populated:                 yes/no
Implementation owner declared:                 yes/no
Builder QA owner declared:                     yes/no (N/A if no product/runtime files)
ECAP owner declared:                           yes/no
IAA owner declared:                            yes/no

START_LOCK: PASS | STOP_AND_FIX
```

## PRODUCT_LOCK

```text
Product/runtime files changed:                 yes/no
Functional delivery evidence present:          yes/no (N/A if no product/runtime files)
Functional delivery evidence current to HEAD:  yes/no (N/A if no product/runtime files)
Evidence path:                                 .functional-delivery/pr-<PR>.md

PRODUCT_LOCK: PASS | NOT_REQUIRED | STOP_AND_FIX
```

## ASSURANCE_LOCK

```text
IAA pre-brief present:                         yes/no
IAA pre-brief is NOT from archive path:        yes/no
IAA final assurance present:                   yes/no
IAA token non-PENDING:                         yes/no
Reviewed SHA matches current HEAD:             yes/no
PR number matches:                             yes/no
Issue number matches:                          yes/no
Token path:                                    .agent-admin/assurance/iaa-wave-record-<wave>-<date>.md

ASSURANCE_LOCK: PASS | STOP_AND_FIX
```

## HANDOVER_LOCK

```text
Pre-handover checkpoint present:               yes/no
Checkpoint is current to HEAD:                 yes/no
Checkpoint result is HANDOVER_ALLOWED:         yes/no
All required CI checks green:                  yes/no
Post-verification commits pushed:              no (must be no)
Checkpoint comment ref:

HANDOVER_LOCK: PASS | STOP_AND_FIX
```

## Final Verdict

```text
HANDOVER_ALLOWED: yes/no
RESULT: HANDOVER_ALLOWED | STOP_AND_FIX
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Template Version**: 1.0.0
**Issue**: #1593
