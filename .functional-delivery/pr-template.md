# Functional Delivery Evidence Template

Use this file as the baseline for product-facing PR evidence.

```
PR: #<number>
Issue: #<number>
Current head SHA reviewed: <git rev-parse HEAD>
Product/user journey: <journey summary>
User journey tested: yes/no
CTA/API map: present/missing
Backend target proof: present/missing
Screenshots or recording: present/missing
Preview/live URL: <url or n/a>
Pass/fail result: <pass|fail|partial>
Known partials: <none or list>
Known limitations: <none or list>
Partial scope accepted by CS2: yes/no/not_applicable
Builder QA functional report reference: <path/url>
ECAP/admin-gate report reference: <path/url>
IAA final assurance reference: <path/url>

ADMIN_PASS: yes/no
FUNCTIONAL_PASS: yes/no
VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
# Optional alias for compatibility with existing templates/gates:
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL
```

## CTA/API Mapping Table (minimum)

| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| <cta> | <intent> | <route/component> | <target> | <storage> | <success> | <failure> | <proof> |
