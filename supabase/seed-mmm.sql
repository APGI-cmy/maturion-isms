-- =============================================================================
-- MMM Wave B1 — Seed Data
-- Wave Slug: mmm-build-wave-b1-schema
-- Architecture Reference: modules/MMM/04-architecture/architecture.md §A5.2
-- Builder: schema-builder
-- Date: 2026-04-20
-- Issue: maturion-isms#1428
-- =============================================================================
-- Creates test fixtures for D9/D10 test suite:
--   - 2 test organisations (for cross-org isolation testing)
--   - 1 sample framework (status = PUBLISHED)
--   - 2 domains
--   - 3 MPS per domain (6 total)
--   - 3 criteria per MPS (18 total)
--   - Level descriptors for each criterion
-- =============================================================================

-- Use deterministic UUIDs for reproducible test data
-- Organisation A (primary test org)
INSERT INTO public.mmm_organisations (id, name, slug, tier, subscription_status, evidence_freshness_days)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Organisation Alpha',
    'test-org-alpha',
    'ENTERPRISE',
    'ACTIVE',
    30
) ON CONFLICT (id) DO NOTHING;

-- Organisation B (cross-org isolation test org)
INSERT INTO public.mmm_organisations (id, name, slug, tier, subscription_status, evidence_freshness_days)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Test Organisation Beta',
    'test-org-beta',
    'TRIAL',
    'TRIAL',
    30
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Framework (PUBLISHED) belonging to Organisation A
-- =============================================================================
INSERT INTO public.mmm_frameworks (id, organisation_id, name, version, status, source_type, origin_mode)
VALUES (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'ISO 27001 Maturity Framework',
    1,
    'PUBLISHED',
    'STANDARD',
    'MANUAL'
) ON CONFLICT (id) DO NOTHING;

-- Framework belonging to Organisation B (for cross-org isolation tests)
INSERT INTO public.mmm_frameworks (id, organisation_id, name, version, status, source_type, origin_mode)
VALUES (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'NIST CSF Framework (Beta Org)',
    1,
    'DRAFT',
    'STANDARD',
    'MANUAL'
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Domain 1 — Information Security Governance
-- =============================================================================
INSERT INTO public.mmm_domains (id, framework_id, name, code, sort_order)
VALUES (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Information Security Governance',
    'ISG',
    1
) ON CONFLICT (id) DO NOTHING;

-- Domain 2 — Risk Management
INSERT INTO public.mmm_domains (id, framework_id, name, code, sort_order)
VALUES (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000001',
    'Risk Management',
    'RM',
    2
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- MPS for Domain 1 (3 MPS)
-- =============================================================================
INSERT INTO public.mmm_maturity_process_steps (id, domain_id, name, code, sort_order, intent_statement)
VALUES
    (
        '00000000-0000-0000-0003-000000000101',
        '00000000-0000-0000-0002-000000000001',
        'Policy Framework',
        'ISG-001',
        1,
        'Establish and maintain an information security policy framework aligned to business objectives.'
    ),
    (
        '00000000-0000-0000-0003-000000000102',
        '00000000-0000-0000-0002-000000000001',
        'Roles and Responsibilities',
        'ISG-002',
        2,
        'Define, assign, and communicate information security roles and responsibilities.'
    ),
    (
        '00000000-0000-0000-0003-000000000103',
        '00000000-0000-0000-0002-000000000001',
        'Management Commitment',
        'ISG-003',
        3,
        'Demonstrate and sustain senior management commitment to information security.'
    )
ON CONFLICT (id) DO NOTHING;

-- MPS for Domain 2 (3 MPS)
INSERT INTO public.mmm_maturity_process_steps (id, domain_id, name, code, sort_order, intent_statement)
VALUES
    (
        '00000000-0000-0000-0003-000000000201',
        '00000000-0000-0000-0002-000000000002',
        'Risk Identification',
        'RM-001',
        1,
        'Identify and catalogue information security risks across the organisation.'
    ),
    (
        '00000000-0000-0000-0003-000000000202',
        '00000000-0000-0000-0002-000000000002',
        'Risk Assessment',
        'RM-002',
        2,
        'Assess the likelihood and impact of identified risks using a defined methodology.'
    ),
    (
        '00000000-0000-0000-0003-000000000203',
        '00000000-0000-0000-0002-000000000002',
        'Risk Treatment',
        'RM-003',
        3,
        'Select and implement risk treatment options for identified risks.'
    )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Criteria — 3 per MPS (18 criteria total)
-- =============================================================================

-- MPS ISG-001 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000010101', '00000000-0000-0000-0003-000000000101', 'Policy documented and approved', 'ISG-001-C001', 1, 2),
    ('00000000-0000-0000-0004-000000010102', '00000000-0000-0000-0003-000000000101', 'Policy reviewed annually', 'ISG-001-C002', 2, 3),
    ('00000000-0000-0000-0004-000000010103', '00000000-0000-0000-0003-000000000101', 'Policy communicated to all staff', 'ISG-001-C003', 3, 3)
ON CONFLICT (id) DO NOTHING;

-- MPS ISG-002 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000010201', '00000000-0000-0000-0003-000000000102', 'CISO or equivalent role defined', 'ISG-002-C001', 1, 2),
    ('00000000-0000-0000-0004-000000010202', '00000000-0000-0000-0003-000000000102', 'Security responsibilities documented', 'ISG-002-C002', 2, 2),
    ('00000000-0000-0000-0004-000000010203', '00000000-0000-0000-0003-000000000102', 'Segregation of duties applied', 'ISG-002-C003', 3, 4)
ON CONFLICT (id) DO NOTHING;

-- MPS ISG-003 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000010301', '00000000-0000-0000-0003-000000000103', 'Security budget allocated', 'ISG-003-C001', 1, 3),
    ('00000000-0000-0000-0004-000000010302', '00000000-0000-0000-0003-000000000103', 'Security on board agenda', 'ISG-003-C002', 2, 4),
    ('00000000-0000-0000-0004-000000010303', '00000000-0000-0000-0003-000000000103', 'Management security training completed', 'ISG-003-C003', 3, 3)
ON CONFLICT (id) DO NOTHING;

-- MPS RM-001 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000020101', '00000000-0000-0000-0003-000000000201', 'Risk register maintained', 'RM-001-C001', 1, 2),
    ('00000000-0000-0000-0004-000000020102', '00000000-0000-0000-0003-000000000201', 'Asset inventory linked to risks', 'RM-001-C002', 2, 3),
    ('00000000-0000-0000-0004-000000020103', '00000000-0000-0000-0003-000000000201', 'Threat intelligence feeds active', 'RM-001-C003', 3, 4)
ON CONFLICT (id) DO NOTHING;

-- MPS RM-002 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000020201', '00000000-0000-0000-0003-000000000202', 'Risk assessment methodology documented', 'RM-002-C001', 1, 2),
    ('00000000-0000-0000-0004-000000020202', '00000000-0000-0000-0003-000000000202', 'Qualitative risk scoring applied', 'RM-002-C002', 2, 3),
    ('00000000-0000-0000-0004-000000020203', '00000000-0000-0000-0003-000000000202', 'Risk assessments performed annually', 'RM-002-C003', 3, 3)
ON CONFLICT (id) DO NOTHING;

-- MPS RM-003 criteria
INSERT INTO public.mmm_criteria (id, mps_id, name, code, sort_order, maturity_level_target)
VALUES
    ('00000000-0000-0000-0004-000000020301', '00000000-0000-0000-0003-000000000203', 'Risk treatment plan documented', 'RM-003-C001', 1, 2),
    ('00000000-0000-0000-0004-000000020302', '00000000-0000-0000-0003-000000000203', 'Controls mapped to risks', 'RM-003-C002', 2, 3),
    ('00000000-0000-0000-0004-000000020303', '00000000-0000-0000-0003-000000000203', 'Residual risk accepted by management', 'RM-003-C003', 3, 4)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Level descriptors — level 1–3 for first criterion of each MPS (sample)
-- =============================================================================
INSERT INTO public.mmm_level_descriptors (id, criterion_id, level, descriptor_text)
VALUES
    -- ISG-001-C001 level descriptors
    ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0004-000000010101', 1, 'No information security policy exists.'),
    ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0004-000000010101', 2, 'Policy exists but is not formally approved or widely communicated.'),
    ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0004-000000010101', 3, 'Policy formally approved, published, and communicated to all relevant staff.'),
    ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0004-000000010101', 4, 'Policy regularly reviewed, updated, and aligned to business strategy.'),
    ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0004-000000010101', 5, 'Policy is continuously improved based on threat intelligence and industry benchmarks.'),
    -- RM-001-C001 level descriptors
    ('00000000-0000-0000-0005-000000000011', '00000000-0000-0000-0004-000000020101', 1, 'No risk register maintained.'),
    ('00000000-0000-0000-0005-000000000012', '00000000-0000-0000-0004-000000020101', 2, 'Ad-hoc risk list maintained informally.'),
    ('00000000-0000-0000-0005-000000000013', '00000000-0000-0000-0004-000000020101', 3, 'Formal risk register maintained and reviewed quarterly.')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Assessment for Organisation A
-- =============================================================================
INSERT INTO public.mmm_assessments (id, organisation_id, framework_id, status, started_at)
VALUES (
    '00000000-0000-0000-0006-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'IN_PROGRESS',
    now()
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Audit session for Organisation A
-- =============================================================================
INSERT INTO public.mmm_audit_sessions (id, organisation_id, framework_id, status)
VALUES (
    '00000000-0000-0000-0007-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'ACTIVE'
) ON CONFLICT (id) DO NOTHING;
