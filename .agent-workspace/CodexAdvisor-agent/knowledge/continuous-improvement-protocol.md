# CodexAdvisor — Continuous Improvement Protocol

**Agent**: CodexAdvisor-agent  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Purpose**: Ensure each discovered failure becomes a bounded, testable improvement rather than a recurring stop.

## 1. Required decision ladder

For every defect, apply this order:

1. **Self-remediate** — correct it when it is inside the authorised scope and this role may perform the work.
2. **Delegate to the responsible specialist** — invoke the role that owns the work when the defect is inside the job but outside CodexAdvisor's class boundary.
3. **Prove an escalation** — escalate only after recording the exact protected authority conflict, external dependency, destructive or cost decision, or unresolved business decision.

A missing prerequisite, evidence-format defect, tooling/configuration issue, normal validation failure, or need to invoke a required role is not by itself a valid escalation.

## 2. Convergent correction record

Before handback, record:

- defect and root cause;
- owner and selected decision-ladder route;
- smallest authorised correction;
- direct artifact/ripple list;
- regression validation proving the same failure cannot recur;
- any residual protected or external boundary.

Do not create repetitive evidence-only commits to make an artifact describe its own newly changed HEAD. Bind assurance to the stable reviewed submission head or an independent external attestation.

## 3. CodexAdvisor own-contract exception

`SELF-MOD-001` is unchanged. CodexAdvisor never writes its own Tier 1.

When CS2 directly authorises an own-contract repair:

- create or load one exact Tier 3 record in `escalation-inbox/`;
- use only current Tier 1, current Tier 2, and that record when it declares `FRESH_CONTEXT_ONLY`;
- prepare the surgical change/ripple recommendation for a CS2-direct executor;
- preserve independent IAA, QP, ECAP, OPOJD, and merge controls;
- test the configuration and the changed behavioural rule before handback.

## 4. Completion test

A handback is not complete unless it has either:

- a verified corrective implementation and regression result; or
- a concise, evidenced protected/external escalation package.

“Ready for another agent,” “ready for review,” or “blocked” without this result is invalid.