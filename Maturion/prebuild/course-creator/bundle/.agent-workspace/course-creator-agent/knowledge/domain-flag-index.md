# Course Creator domain flags

Version: 1.1.0. Effective date: 2026-11-26. Domain: course-creation.

| Flag | State | Meaning |
| --- | --- | --- |
| COURSE_CREATOR_BUNDLE | COMMISSIONING_REQUESTED | Issue #2075 authorises factory review, assurance and registration; completion still needs evidence |
| COURSE_CREATOR_RUNTIME | RECEIPT_GATED | Only the authenticated accepted runtime registration/preflight can establish activation; these knowledge flags do not enable it |
| MATURION_REPORTING | REQUIRED | Every specialist result returns to maturion-agent for review |
| QA_SUITE_WRITE | PROHIBITED | Read current requirements; never change the suite |
| FROZEN_PASS_RETENTION | REQUIRED | Preserve genuine unchanged independent passes |
| ROOT_CAUSE_AFTER_FOUR | REQUIRED | Stop and diagnose before any exceptional fifth loop |
| INDEPENDENT_ASSURANCE | REQUIRED_PENDING | Local validation does not satisfy IAA |
| SOURCE_AND_TENANT_ISOLATION | REQUIRED | Customer sources and lessons remain scoped |
| LU02_CURRENT_SCOPE | EXCLUDED | Johan will test LU2 himself |

Registry and routing are proposals in `governance/`; none of these flags enable a live route.

The proposed AIMC persona is `course-creator-advisor` (module `course-creator`, capability `document-generation`). `course-crafter-advisor` remains the unchanged legacy ISMS-specific persona. All capability roles and reviewer execution remain controller-owned; this specialist cannot delegate laterally.
