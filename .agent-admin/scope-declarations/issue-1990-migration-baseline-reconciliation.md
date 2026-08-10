# Scope Declaration — Issue #1990 Migration-Baseline Reconciliation

**Authority:** CS2-directed separate bounded reconciliation lane  
**Owner:** foreman-v2-agent  
**Starting point:** `main` at `9c464c14931d40deb980a388be7e27ca3097c958`

## Objective

Make repository migration filenames exactly match the four versions already recorded in production, while preserving the corresponding SQL bodies byte-for-byte.

## Authorised mapping

| Existing source filename | Authoritative production filename |
|---|---|
| `20260722090000_pit_stage12_slice4_project_persistence.sql` | `20260722102655_pit_stage12_slice4_project_persistence.sql` |
| `20260722105000_pit_slice4_privilege_hardening.sql` | `20260722104224_pit_slice4_privilege_hardening.sql` |
| `20260723130000_pit_slice4_rpc_only_mutation_boundary.sql` | `20260723141559_pit_slice4_rpc_only_mutation_boundary.sql` |
| `20260728094338_mmm_rls_seven_policy_private_helper_alignment.sql` (PR #1973) | `20260728070417_mmm_rls_private_helper_policy_reconciliation.sql` |

The MMM SQL source is taken from the exact PR #1973 head and is not changed semantically.

## Non-negotiable boundaries

- No production database mutation.
- No DDL, grant, policy, function, data, Edge Function, Vercel, or application-runtime semantic change.
- No duplicate migration bodies.
- No change to PR #1973's intended seven-policy logic.
- The lane ends in a disposable GitHub-backed preview proof; it does not merge #1973 or close #1959.

## Required evidence

1. byte-for-byte content hash preservation;
2. focused filename/version uniqueness check;
3. production migration inventory parity check;
4. successful isolated preview replay with MMM and PIT schema present;
5. current-head QP, ECAP and independent IAA.