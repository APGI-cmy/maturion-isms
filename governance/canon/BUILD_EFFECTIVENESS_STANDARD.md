# BUILD EFFECTIVENESS STANDARD

## Status
Canonical Governance Specification  
Version: v1  
Authority: Foreman (FM)

---

## 1. Purpose

This standard defines how Build Effectiveness is computed and reported.

Build Effectiveness measures the correctness and completeness of the original build over time.
It decreases only when failures are discovered that prove original incompleteness.

Improvements are tracked separately and do not change effectiveness.

---

## 2. Core Rule

Each build begins with:

- `INITIAL_EFFECTIVENESS: 100`

Current effectiveness is computed as:

- `CURRENT_EFFECTIVENESS = 100 - SUM(PENALTY_POINTS for all recorded failures)`

Effectiveness is bounded:

- Minimum: 0
- Maximum: 100

Effectiveness cannot increase.

---

## 3. Required Artifact Location

For each build:

architecture/builds/<build-id>/effectiveness.md

yaml
Copy code

---

## 4. Effectiveness Report Schema (Normative)

The effectiveness report MUST contain:

- `EFFECTIVENESS_SCHEMA_VERSION: v1`
- `BUILD_ID: <string>`
- `INITIAL_EFFECTIVENESS: 100`
- `CURRENT_EFFECTIVENESS: <0-100>`
- `TOTAL_FAILURES: <integer>`
- `TOTAL_PENALTY_POINTS: <integer>`
- `LAST_UPDATED_UTC: <YYYY-MM-DD>`

It MUST also include a section listing each failure and penalty:

- `FAILURE_REFERENCES:` (list of filenames)
- `PENALTY_SUMMARY:` (per failure, points)

---

## 5. Validity Rules

An effectiveness report is invalid if:
- It is missing required markers
- `CURRENT_EFFECTIVENESS` does not equal `100 - TOTAL_PENALTY_POINTS` (bounded at 0)
- `TOTAL_FAILURES` does not equal the number of failure records present
- Failure references do not match actual failure files

---

End of BUILD EFFECTIVENESS STANDARD
