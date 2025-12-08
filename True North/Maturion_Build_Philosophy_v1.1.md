Maturion Build Philosophy & True North
Version 1.0 (working standard)
0. Purpose
This document defines how we design, build, and verify applications in the Maturion ecosystem.
It is written so that:
•	Foreman knows what a “complete” architecture looks like
•	Builder Agents know what they must build to, and what “done” means
•	Johan (non-coder) can confidently check app health, QA status, and security/compliance
•	Legacy, regressions and half-baked features are systematically prevented
Core principles:
1.	One Build – We design the architecture once, properly, and build to it. No drifting, no forks.
2.	True North – A single, evolving architectural compass that all modules obey.
3.	QA from Architecture – QA is generated from architecture and used to verify the build.
4.	Continuous Improvement – When reality exposes a gap, we fix the architecture + QA, not just the code.
5.	No Legacy – Anything not wired or compliant is either updated or removed. No zombie components.
________________________________________
1. Roles & Responsibilities
1.1 Foreman (Architecture & QA Owner)
•	Designs and maintains architecture for each app/module:
o	Functional requirements
o	Data model
o	Integrations
o	UI/UX behaviour
o	Security & compliance requirements
o	AI behaviour & constraints
o	Admin backoffice & watchdog
•	Designs and maintains QA specification:
o	Always derived from architecture
o	Encodes expectations as checks/tests
o	Ensures full coverage (no “forgotten” parts)
•	Updates architecture & QA when:
o	Something in production does not work
o	A new requirement is discovered
o	A previous assumption was wrong
•	Enforces One Build + True North across all modules.
1.2 Builder Agents (Implementation)
•	Implement code strictly according to Foreman architecture.
•	Do not change architecture or QA; only build until QA is fully green.
•	Fix failing tests without hacking around QA.
•	Propose improvements or missing architectural details back to Foreman.
1.3 Johan (Product Owner + Human QA)
•	Designs business intent and validates UX, domain correctness, and real-world applicability.
•	Uses the Admin Backoffice QA Dashboard:
o	Runs one-click QA
o	Inspects high-level and drill-down results
o	Does not manually test UI until QA is green
•	Drives philosophical and business evolution:
o	Approves architectural changes
o	Validates that improvements align with the vision.
________________________________________
2. The Build Lifecycle
Every new app/module follows this loop:
1.	Architecture First
o	Foreman designs a detailed architecture that describes:
	What the app does
	How it behaves
	How it integrates
	How it is secured
	How it is administered
	How its AI behaves
o	Architecture must represent a fully functional, deployed app, not just a feature list.
2.	QA Specification from Architecture
o	Foreman derives QA from architecture:
	Each architectural element has one or more QA checks.
	If it is important enough to be in the architecture, it must be testable.
3.	Implementation by Builder
o	Builder gets:
	Architecture spec
	QA spec
o	Builder implements code until all QA checks pass (green).
4.	Automated QA Run
o	Full QA is run:
	After every phase or build
	After each new component is added
o	Pass/Fail results visible in:
	CI / dev tools
	Admin Backoffice QA Dashboard.
5.	Human UX & Business Review (Johan)
o	Only once QA is green:
	Johan checks UI & UX
	Confirms behaviour matches business expectations
	Confirms domain correctness.
6.	If something doesn’t work: root cause analysis
o	There are only three acceptable root causes:
1.	Missing architectural element
→ It was never specified, so it couldn’t be tested or built.
2.	Omitted or misaligned QA
→ Architecture defined it, but QA didn’t test it properly.
3.	Implementation bug
→ Architecture & QA are correct, code is wrong.
o	Response:
	If (1) → Update architecture + QA, then rebuild.
	If (2) → Update QA to match architecture, then rebuild.
	If (3) → Fix code until QA is green again.
7.	Continuous Learning
o	Every discovered gap results in:
	An architecture update
	A QA update
o	The system gets better over time, not just the code.
________________________________________
3. What a “Complete Architecture” Must Contain
To avoid incomplete AI-generated architectures, we define a mandatory structure.
For every app/module, architecture must at least cover:
3.1 Functional Design
•	Clear purpose of the app
•	User roles and permissions
•	Main user journeys (scenarios)
•	Edge cases and error conditions
•	Human-in-the-loop points (where manual judgement is needed)
3.2 Data & Domain Model
•	Entities and relationships (e.g. org, domain, MPS, criteria, audit, incident, risk, PIT task…)
•	Field definitions, types, constraints
•	Lifecycle of key entities (create → update → archive/delete)
•	Links to other modules and to the Maturity Roadmap.
3.3 Integrations & Wiring
•	External systems and APIs (e.g. analytics, SCADA, HR, finance, access control, etc.)
•	Internal services (AI gateway, auth, notifications, logging, remote assurance hub)
•	Events, webhooks, or messaging patterns
•	“Wiring map”: what connects to what, and why.
3.4 Security & Compliance
•	Authentication & authorisation rules for each feature
•	Data protection rules:
o	Personal information
o	Audit logs
o	Encryption at rest/in transit
•	Compliance requirements:
o	POPIA / GDPR-like privacy obligations
o	Information security controls (e.g. ISO 27001 principles)
o	Public platform usage constraints.
3.5 UI & UX Behaviour
•	Screen layouts and navigation structure
•	Behaviour of forms, tables, filters, dashboards
•	Loading, errors, success messages
•	Accessibility considerations (e.g. clear language, obvious states)
•	Consistent design system, shared components, branding.
3.6 AI Behaviour
•	Specific roles AI plays:
o	Advisor, evaluator, report writer, watchdog, tutor, etc.
•	Allowed knowledge sources (internal/external)
•	Rules for:
o	Evidence evaluation
o	Suggesting actions
o	Escalating to humans
•	Safety & correctness constraints:
o	When AI must refuse or defer
o	Logging of AI decisions for later review.
3.7 Admin Backoffice & Watchdog
•	Admin screens:
o	QA dashboard
o	Security & health checks
o	Performance metrics
o	AI audit & behaviour overview
•	Watchdog rules:
o	Security violations
o	Integration failures
o	AI anomalies (e.g. not using required knowledge sources)
o	Standards compliance checks.
________________________________________
4. QA System Design
QA is not an afterthought; it is a direct product of the architecture.
4.1 QA Categories
For each app/module, QA must at minimum include:
1.	Architecture Conformance
o	All specified features exist
o	Required screens/routes/endpoints exist
o	Required entities and fields exist
2.	Wiring & Integration
o	All declared integrations are present and reachable
o	Event flows are in place
o	No “floating” components: everything that should be wired, is wired
3.	Behaviour & UX
o	Critical flows function end-to-end
o	Permissions enforced correctly
o	Error states behave as specified
o	Important UI elements respond as intended (e.g. save, search, filters)
4.	Security & Compliance
o	Unauthorised access denied
o	Sensitive data does not leak
o	Configured security headers/standards are present
o	Logging is appropriate and not leaking secrets
o	Information handling aligns with applicable regulations
5.	AI Quality
o	AI consulted required knowledge sources
o	AI considered all relevant components (e.g. domains, MPS, risk context)
o	AI did not fabricate data where real data should be used
o	AI followed escalation rules to human where necessary
6.	Regression
o	Previously passing tests stay green after changes
o	No reappearance of “fixed” bugs/behaviours.
4.2 Wiring Checks & Anti-Legacy
To minimise legacy components:
•	Every component, integration, or feature declared in architecture must:
o	Have a wired path in the system
o	Be exercised by at least one QA scenario.
•	QA should detect:
o	Dead code / unused endpoints
o	Unused UI components
o	Configurations that never get executed
When something is not wired:
•	It’s either:
o	A legacy component that should be removed
o	Or something that was intended but not fully integrated → architecture/QA must be updated and completed.
Decision rule:
“If it can’t be wired or explained, it doesn’t belong in the system.”
________________________________________
5. QA in the Admin Backoffice (Your One-Click View)
Each app includes an Admin Backoffice QA dashboard.
5.1 High-Level View
•	Single button: “Run Full QA”
•	Summary:
100 tests performed
80 passed, 20 failed
→ 80% build success
•	Overall status:
o	Green = acceptable
o	Amber = degraded
o	Red = unacceptable
5.2 Drill-down by Category
Examples:
•	Wiring:
o	20 tests
o	10 passed / 10 failed → 50% wiring incomplete
•	Security:
o	30 tests
o	30 passed → 100% green
•	AI Behaviour:
o	15 tests
o	12 passed / 3 failed
Clicking each category shows:
•	Individual tests
•	Their status (pass/fail)
•	Explanations in plain English, not code.
5.3 Plain-Language Explanations
Each failed test must say:
•	What was expected in business terms
•	What was found
•	What likely needs fixing
Example:
Test: “Only authorised admins can change audit templates.”
Result: Failed.
Explanation: A non-admin test account was able to access the audit template editor.
Impact: Users without proper authority could change how audits are performed.
Next step: Restrict this screen to admin role only.
This allows you to:
•	Understand what’s wrong
•	Prioritise fixes
•	Communicate clearly with builders and Foreman.
________________________________________
6. Watchdog & Security Monitoring
Each app must have an internal Watchdog service.
6.1 Watchdog Responsibilities
•	Monitor:
o	Security violations (failed logins, suspicious activities)
o	Data access patterns
o	Integration health (webhooks, APIs)
o	AI behaviour anomalies
o	Standard compliance signals (where automatable)
•	Generate:
o	Alerts to admins
o	Logs for audit
o	Inputs into Remote Assurance / analytics
6.2 AI Watchdog
•	Verifies that AI:
o	Uses required knowledge sources when giving advice
o	References valid standards and policies
o	Stays within its allowed domain
o	Defers to humans when required.
________________________________________
7. AI Chat Interfaces
Every app has two faces for its AI:
1.	Admin / Designer Interface (Backoffice)
o	Talks to you (the app designer)
o	Accepts instructions about:
	Configuration
	Architecture changes
	QA updates you want Foreman to consider
o	Can help you interrogate:
	QA results
	Watchdog outputs
	System health
2.	User Interface (Front Office)
o	Guides the user through their journey (audit, risk, training, etc.)
o	Explains steps
o	Suggests improvements
o	Keeps within the security and compliance boundaries defined in architecture.
________________________________________
8. Continuous Improvement Loop
The philosophy must keep evolving, but in a controlled way:
1.	Something breaks or is missing in real usage.
2.	You or the users notice and report it.
3.	Foreman:
o	Updates architecture to include the new insight
o	Updates QA to check for this in the future
4.	Builders:
o	Implement changes until QA is green again
5.	The doctrine:
o	Becomes richer over time
o	Avoids repeating the same mistakes
o	Minimises rework and legacy.
Over time, this process itself can become a training programme for non-technical app designers:
“How to think like an architect, even if you can’t code.”
________________________________________
9. Summary (Core Rules)
You can keep this as the short version:
1.	Architecture first.
o	It must describe a fully working, deployed app, not a sketch.
2.	QA from architecture, never the other way around.
o	If it’s in the architecture, it’s tested.
o	If it’s not tested, it doesn’t really exist.
3.	Builders only build.
o	They work until QA is fully green.
o	They don’t edit architecture or QA.
4.	Three root causes only.
o	Missing architecture
o	Missing/misaligned QA
o	Implementation bug
5.	No legacy.
o	Wiring checks detect dead/unused parts.
o	Unwired = remove or complete properly.
6.	One-click QA for Johan.
o	If QA fails, you don’t even look at the UI.
o	If QA passes, you evaluate UX and real-world suitability.
7.	Watchdog in every app.
o	Security, health, AI, compliance always monitored.
8.	Continuous learning.
o	Every problem improves the architecture + QA, not just the code.
________________________________________
If you like this as a Version 1, we can:
•	Tighten any areas you want
•	Turn this into:
o	A “Foreman Operating Manual”
o	A training module for future app designers
•	And next, start applying it to the Master Control Document and then to the Manual Audit Tool architecture.
DEVELOPER MODE

ChatGPT can make mistakes. OpenAI doesn't use Security Risk Mitigating Solutions workspace data to train its m

