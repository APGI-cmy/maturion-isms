# Interim CS2 Agent — Review Patterns

**Version**: 1.0.0
**Purpose**: Persistent review patterns loaded before each valid review trigger.

## Initial Pattern

When a claimed delivery depends on a different commit, incomplete chain, mock-only evidence, or absent approved Red QA, classify the evidence as stale or missing and return the appropriate packet.
