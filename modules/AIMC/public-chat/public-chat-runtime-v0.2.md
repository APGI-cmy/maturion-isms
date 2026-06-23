# Maturion Public Chat Runtime v0.2

## Status Header

| Field | Value |
|---|---|
| Module | AIMC / Maturion |
| Component | Public chat runtime |
| Version | v0.2 |
| Status | Drafted for PR validation |
| Authority | CS2 - Johan Ras |
| Date | 2026-06-23 |

---

## Purpose

Upgrade `/api/v1/public-chat` from the v0.1 bounded contract response to a real server-side Maturion public guidance response.

---

## Runtime Behaviour

The endpoint now builds a public Maturion prompt, includes validated page context as user-role data, flattens recent chat history into labelled user-role context, and returns a generated answer in the same response shape used by APW.

The endpoint remains public guidance only. It must route private, client-specific, or authenticated workspace needs to APGI contact or governed APGI Hub / ISMS pathways.

---

## Boundary

This wave does not change:

- Maturion agent contracts;
- specialist registry or governance canon;
- Supabase schema;
- authenticated workspace access;
- APW frontend code;
- Render settings.

---

## Files Changed

| File | Purpose |
|---|---|
| `apps/mat-ai-gateway/services/public_chat.py` | Adds server-side Maturion public guidance runtime. |
| `apps/mat-ai-gateway/routers/ai_routes.py` | Adds controlled runtime failure handling. |

---

## QA Expectations

| Check | Expected result |
|---|---|
| Valid request | 200 with generated `answer`. |
| Empty message | 422 validation error. |
| Runtime failure | 502 with stable `detail`. |
| APW contract | Response still includes `answer` and `source`. |
