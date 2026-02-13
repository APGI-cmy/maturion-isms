# MANUAL AUDIT TOOL (MAT) – SECURITY ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| Governance       | Domain 3.7                                 |
| TRS Requirements | TR-020 through TR-031                      |

---

## 1. Authentication Mechanism (TR-020, TR-022)

- **Provider**: Supabase Auth as identity provider
- **Token**: JWT-based session tokens, 1-hour expiry, 7-day refresh token
- **MFA**: TOTP (RFC 6238) mandatory for Lead Auditors; SMS optional
- **Password Policy**: 12+ characters, uppercase + lowercase + number + special character
- **Account Lockout**: 5 failed attempts → 15-minute lockout
- **Session**: HttpOnly, Secure, SameSite=Strict cookies
- **CSRF**: SameSite cookies + anti-CSRF tokens
- **Rate Limit**: 10 requests/minute per IP on auth endpoints
- **Session Timeout**: 30 minutes inactivity auto-logout
- **Password Hashing**: bcrypt cost factor ≥ 12 or Argon2id (Supabase default)

---

## 2. Authorization Model – RBAC (TR-023)

### Roles

| Role                 | Permissions                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| Lead Auditor         | Full audit management, approve criteria, approve reports, assign users, override scores |
| Domain Auditor       | Domain-level findings, evidence, mark as ready-for-review                   |
| MPS Auditor          | MPS-level findings, evidence within assigned MPS                            |
| Evidence Contributor | Upload evidence only within assigned scope                                  |

### Permission Inheritance

- Lead Auditor inherits all unassigned domains
- Domain Auditor inherits unassigned MPS within their domain
- MPS Auditor inherits unassigned criteria within their MPS

### Row-Level Security (RLS)

- RLS enabled on ALL tenant-scoped tables
- Policies use `auth.uid()` and JWT claims (`auth.jwt() ->> 'role'`)
- Organisation isolation: users see only their organisation's data
- Role-based write restrictions at database level
- No SECURITY DEFINER functions that bypass RLS
- Automated RLS policy verification tests in CI

### RLS Policy Examples

```sql
-- Organisation isolation
CREATE POLICY "Users can only see their org data"
ON audits FOR SELECT
USING (organisation_id = (SELECT organisation_id FROM profiles WHERE id = auth.uid()));

-- Lead Auditor write access
CREATE POLICY "Lead auditors can update audits"
ON audits FOR UPDATE
USING (organisation_id = (SELECT organisation_id FROM profiles WHERE id = auth.uid()))
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'lead_auditor'
    AND organisation_id = audits.organisation_id
  )
);

-- Audit trail append-only
CREATE POLICY "Audit trail is append-only"
ON audit_trail FOR INSERT
WITH CHECK (user_id = auth.uid());
-- No UPDATE or DELETE policies exist (append-only enforcement)
```

---

## 3. Data Encryption (TR-024)

- **At Rest**: AES-256 encryption via Supabase managed encryption
- **In Transit**: TLS 1.3+ for all connections (API, database, storage)
- **Evidence Files**: Encrypted at rest via Supabase Storage encryption
- **Database Backups**: Encrypted with separate encryption keys
- **Secrets Management**: Environment variables or cloud secret manager (AWS Secrets Manager, GCP Secret Manager)
- **Certificate Pinning**: For mobile PWA where browser supports it
- **Key Rotation**: Managed by Supabase (transparent data encryption)

---

## 4. Audit Trail Design (TR-025)

- **Append-Only**: No UPDATE or DELETE operations on audit_trail table (RLS enforced)
- **Hash Chain**: SHA-256 hash of previous entry stored in each log entry
  - First entry uses SHA-256 of `"GENESIS:{audit_id}:{organisation_id}"`
  - Subsequent entries: `SHA-256(previous_hash + action + entity_id + timestamp)`
- **Log Fields**: user_id, timestamp (server UTC), action, entity_type, entity_id, before_state (JSONB), after_state (JSONB), ip_address, user_agent
- **Actions Logged**: All create, update, delete, approve, override, export, login, logout, role change, assignment change
- **Retention**: 7-year minimum
- **Export**: JSON and CSV formats for compliance review
- **Access**: Separate read-only database role for audit log access
- **Partitioning**: Monthly partitioning on created_at for performance

---

## 5. Evidence Integrity (TR-026)

- **SHA-256 Hash**: Computed server-side on every file upload
- **Hash Storage**: Stored in evidence.sha256_hash column
- **Verification Endpoint**: `GET /api/v1/evidence/{id}/verify` — recomputes hash and compares
- **Tamper Detection**: Hash mismatch triggers security alert and flags evidence
- **Content-Type Validation**: Whitelist of allowed MIME types
- **Extension Validation**: File extension must match content-type (no mismatch)
- **Antivirus**: ClamAV or cloud-native scanning on upload before storage

---

## 6. Input Validation and Sanitization (TR-027)

- **Server-Side**: All inputs validated server-side (never trust client only)
- **SQL Injection**: Prevented via PostgREST parameterized queries
- **XSS**: HTML sanitization on text inputs displayed in UI (DOMPurify)
- **File Validation**: Content-type, file size, extension, magic bytes checked
- **Schema Validation**: JSON Schema (API), Pydantic v2 (Python), Zod (TypeScript)
- **Max Input Lengths**:

| Field              | Max Length       |
|--------------------|------------------|
| Audit title        | 255 characters   |
| Justification      | 5,000 characters |
| Notes/findings     | 50,000 characters|
| Organisation name  | 255 characters   |
| Facility location  | 255 characters   |

---

## 7. API Security (TR-028)

- **Authentication**: Required for all endpoints except `GET /health`
- **Rate Limiting**: 100 req/s per user, 1,000 req/s global
- **CORS**: Restricted to known frontend origins only
- **Payload Limits**: 50MB file uploads, 1MB JSON payloads
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `Content-Security-Policy: default-src 'self'; ...`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **API Versioning**: `/api/v1/` path prefix

---

## 8. GDPR Compliance (TR-029)

- **DSAR**: Export all personal data in JSON within 72 hours via admin endpoint
- **Right to Erasure**: Anonymize personal data while preserving audit integrity (replace names with pseudonyms)
- **Consent Management**: Explicit consent with timestamp, scope, and IP recorded in consent_records table
- **Data Processing Records**: Maintained in system metadata
- **Data Minimization**: Collect only data necessary for audit function
- **Privacy by Default**: Most privacy-protective settings as default

---

## 9. POPIA Compliance (TR-030)

- **Section 4 Conditions**: Processing aligned with POPIA conditions
- **Information Officer**: Configurable designation in organisation settings
- **Special Personal Information**: Prior authorization required for processing
- **Cross-Border Transfers**: Controls configurable per organisation
- **Breach Notification**: Automated alerting within 72 hours via watchdog system

---

## 10. Data Retention (TR-031)

- **Default Retention**: 7 years for audit data
- **Audit Trail Retention**: 7 years minimum (non-configurable minimum)
- **Configurable Policies**: Per-organisation retention settings
- **Automated Expiry**: Soft-delete before permanent removal
- **Retention Logging**: All retention policy changes logged in audit trail
- **Compliance Dashboard**: Admin view showing retention status

---

## 11. Compliance Mappings

- **ISO 27001**: Information security controls evidenced in design
- **ISO 19011**: Audit management principles in workflow
- **GDPR**: Articles 5, 6, 7, 15–17, 25, 30, 32–34
- **POPIA**: Sections 4, 11, 14, 19, 22, 57, 72
