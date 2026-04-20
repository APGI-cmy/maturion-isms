# IAA Assurance Token

**Token**: IAA-session-layer-down-818bab2a-wave-layer-down-818bab2a-20260420-PASS
**Type**: PHASE_B_BLOCKING_TOKEN
**Verdict**: ASSURANCE-TOKEN (PASS)

---

## Token Metadata

- **PR**: maturion-isms#1434
- **Wave**: layer-down-818bab2a-governance-propagation-20260420
- **Issue**: maturion-isms#1414
- **IAA Session**: session-layer-down-818bab2a-20260420 (re-invocation)
- **Producing Agent**: governance-liaison-isms-agent
- **Invocation**: Re-invocation following REJECTION-001 (REJECTION-PACKAGE issued first pass)
- **Date**: 2026-04-20
- **Adoption Phase**: PHASE_B_BLOCKING

---

## Checks Executed

| Check ID | Description | Result |
|----------|-------------|--------|
| A-001 | IAA invocation evidence present | PASS ✅ |
| A-002 | No class exemption claimed | PASS ✅ |
| CORE-020 | No partial pass — all artifacts verifiable | PASS ✅ |
| CORE-021 | Zero severity tolerance | PASS ✅ |
| CERT-001 | PREHANDOVER proof present and complete | PASS ✅ |
| CERT-002 | Session memory present and complete | PASS ✅ |
| CERT-003 | FAIL-ONLY-ONCE attestation embedded | PASS ✅ |
| CERT-004 | iaa_audit_token field present (pre-populated per A-029) | PASS ✅ |
| OVL-KG-ADM-002 | Version/state consistency (canonical_version = local_version, ALIGNED) | PASS ✅ |
| SB-001/AGCFPP-001 | No .github/agents/ files in PR diff | PASS ✅ |
| SB-002 | Hash accuracy (sha256sum verified against inventory entries) | PASS ✅ |
| SB-003 | Scope containment (single authorized file + ceremony artifacts only) | PASS ✅ |
| T-01–T-04 | Substantive correctness (versions, hashes, metadata) | PASS ✅ |
| MERGE-GATE | Merge gate parity (JSON valid, hashes verified, scope clean) | PASS ✅ |

**Total**: 14 checks — 14 PASS, 0 FAIL

---

## IAA Agent Response (verbatim)

See full verdict in session memory: `.agent-workspace/independent-assurance-agent/memory/session-layer-down-818bab2a-re-invocation-20260420.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Contract**: v2.9.0 | **Adoption Phase**: PHASE_B_BLOCKING
**Merge Authority**: CS2 ONLY
