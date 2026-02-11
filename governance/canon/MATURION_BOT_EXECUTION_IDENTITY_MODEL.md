# MATURION BOT EXECUTION IDENTITY MODEL

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-10  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to CONSTITUTION.md, PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md

---

## 1. Purpose

This canon defines the **Maturion Bot Execution Identity** used for cross-repo governance automation. It exists to guarantee that automation is **execution-only**, least-privilege, and cannot bypass constitutional safeguards.

---

## 2. Execution Identity Definition

**Maturion Bot** is a non-judgment execution identity. It is **not** an agent and does not make discretionary governance decisions.

**Maturion Bot responsibilities**:
- Execute pre-approved workflows deterministically
- Create PRs for governance alignment
- Dispatch ripple events per canon
- Record audit evidence and outcomes

**Maturion Bot prohibitions**:
- ❌ No direct push to `main`
- ❌ No branch protection edits
- ❌ No governance canon edits without CS2 authorization
- ❌ No discretionary approvals or overrides

---

## 3. Required Secrets

The following secrets are mandatory in repos using the governance implementation pack:

- `MATURION_BOT_TOKEN` (fine-grained PAT, execution identity)
- `RIPPLE_DISPATCH_TOKEN` (fine-grained PAT, dispatch-only)

**Secret handling**:
- Stored in GitHub Actions secrets only
- Never logged or echoed
- Rotated per policy (see Section 6)

---

## 4. Least-Privilege Permissions

**Minimum permissions for `MATURION_BOT_TOKEN`**:
- Contents: Read/Write (to open alignment PRs on non-protected branches)
- Pull requests: Read/Write
- Issues: Read/Write (for escalation only)
- Actions: Read

**Explicitly forbidden permissions**:
- ❌ Administration
- ❌ Secrets management
- ❌ Branch protection override

**RIPPLE_DISPATCH_TOKEN** must be **dispatch-only** with:
- Repository dispatch: Write
- Contents: Read (registry)

---

## 5. Write Restrictions

All automation writes **must** occur via PRs created by Maturion Bot. Direct pushes to `main` are forbidden.

**Enforcement rule**:
- If any automation attempts a direct push to `main`, execution must halt and raise incident response.

---

## 6. Token Rotation + Incident Response

**Rotation policy**:
- Rotate both tokens every 90 days
- Immediate rotation on any suspected leak

**Leak response**:
1. Revoke token immediately
2. Create incident issue in governance repo
3. Re-issue fine-grained token with least privilege
4. Document incident in `.agent-admin/governance/`

---

## 7. Audit Logging Requirements

Every automation run must record:
- Actor (`Maturion Bot`)
- Workflow name and run ID
- Trigger reason (dispatch or schedule)
- Target repository
- Outcome (SUCCESS/FAILURE)
- Evidence paths written

**Canonical audit location**:
- `.agent-admin/governance/`

Audit logs are mandatory for all governance execution workflows.
