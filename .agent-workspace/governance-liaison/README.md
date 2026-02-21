# `.agent-workspace/governance-liaison/`

Governance Liaison workspace for the `maturion-isms` consumer repository.

## Directory Structure

```
governance-liaison/
├── memory/               # Session memories (last 5; older sessions in .archive/)
│   └── .archive/         # Archived session memories
├── escalation-inbox/     # Active escalation documents awaiting CS2 resolution
└── personal/             # Cumulative personal-learning artefacts
    ├── lessons-learned.md
    └── patterns.md
```

## Usage

- **memory/** — Session memory files created at the end of each liaison session
  following `AGENT_HANDOVER_AUTOMATION.md v1.0.0`.
- **escalation-inbox/** — Escalation documents created when ripple PRs touch
  `.github/agents/*.md` files (CS2 approval required).  Files are archived
  (moved out of the inbox) after CS2 resolves them.
- **personal/** — Cumulative lessons and pattern recognition files updated each
  session.

## Authority

`AGENT_INDUCTION_PROTOCOL.md v1.0.0`  
`AGENT_HANDOVER_AUTOMATION.md v1.0.0`  
`GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md`
