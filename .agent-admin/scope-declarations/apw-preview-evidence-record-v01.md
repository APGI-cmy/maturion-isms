# Scope Declaration - APW Specialist Controlled Preview Evidence Record v0.1

**Scope ID**: APW-PREVIEW-EVIDENCE-RECORD-V01  
**Repository**: `APGI-cmy/maturion-isms`  
**Wave**: APW Specialist Controlled Preview Evidence Record v0.1  
**Authority**: CS2 - Johan Ras  
**Operating Role**: Foreman-led governed evidence capture  
**Task Type**: evidence record only  
**Implementation Status**: No runtime or production configuration change by this PR

---

## 1. Purpose

This wave records the evidence required by `Maturion/prebuild/runtime-activation-readiness/APW-Controlled-Preview-Runbook-v0.1.md` after Batch 9 deferred broader enablement pending preview evidence.

The purpose is to separate actual preview proof from production approval.

---

## 2. In Scope

This wave may:

- create the APW Specialist controlled-preview evidence record;
- list the evidence that can be verified from repository history;
- mark live runtime checks that require user/operator verification;
- preserve the decision state until evidence is supplied;
- define the evidence checklist needed before any later enablement decision.

---

## 3. Out of Scope

This wave does not:

- change application runtime code;
- change production environment variables;
- enable APW Specialist in production;
- mutate Supabase or other database state;
- mutate runtime registry records;
- add embeddings, vector search, or retrieval services;
- expose APW Specialist directly to public users;
- make APW Specialist the final public response authority;
- approve production activation.

---

## 4. Evidence Standard

The required evidence is the Batch 8 runbook preview record:

- date and time of preview;
- target environment;
- flag value before and after preview;
- health check result;
- prompt, route and output samples;
- rollback result;
- reviewer decision.

---

## 5. Current Evidence Boundary

At creation, this wave records repository-known facts and marks live runtime checks as `PENDING_USER_VERIFICATION`.

No live runtime result is treated as verified unless the user/operator supplies the result or an accessible system source records it.
