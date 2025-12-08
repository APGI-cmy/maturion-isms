MATURION TRUE NORTH ARCHITECTURE
Version 1.1 – Master Reference for Foreman & Builder Agents
(Updated to include Section 17: Automated Model Selection & Routing)
________________________________________
0. Purpose
This document defines the True North for the Maturion ecosystem:
Platform architecture, module integration, UX/UI standards, AI behaviour, QA, security, and the build philosophy that Foreman and Builder Agents must follow.
This is the single source of truth.
Foreman enforces it.
Builders execute it.
Johan validates UX and outcomes.
________________________________________
1. Core Principles
1.1 One-Build Philosophy
•	Architect first.
•	QA second (derived strictly from architecture).
•	Build third (until QA is 100% green).
•	No regressions, no legacy fragments.
1.2 True North
•	Uniform UI
•	Universal coding standards
•	Shared data models
•	Shared AI pipeline
•	Shared security model
•	Shared QA system
1.3 Architecture → QA → Build Loop
1.	Foreman designs/updates architecture.
2.	Foreman defines QA tests based on that architecture.
3.	Builder Agents implement features.
4.	QA runs the entire suite each time.
5.	Johan reviews UI only when QA is green.
6.	If broken → architecture/QA updated → rebuild → re-QA.
This prevents regression and enforces consistency across modules.
________________________________________
2. Product Overview
Maturion is an AI-driven Operational Resilience Platform and Integrated Security Management System (ISMS) enabling:
•	A 5-level Maturity Roadmap
•	Risk Management
•	Project Implementation Tracking (PIT)
•	Incident & Intelligence Tools
•	Remote Assurance & Analytics
•	Systems Integration
•	Skills Development & Course Factory
•	Policy & Procedure Builder
•	Manual Audit Tool
•	Auditor Mobile Capture App
The platform builds resilient organisations AND grows a new breed of security professionals.
________________________________________
3. Security House Model (Domains)
The Maturity module uses the house model:
•	Leadership & Governance (roof)
•	Process Integrity
•	People & Culture
•	Protection
•	Proof It Works (foundation)
Interactive only inside the Maturity module.
________________________________________
4. Organisation & Roles
Org Structure
•	APGI (system owner)
•	Mother Companies
•	Subsidiaries
•	Departments
Roles
•	Superuser
•	Owner
•	Admin
•	Technician
•	Viewer
Maturity Roles
•	Domain Implementers
•	MPS Implementers
•	Evidence Managers
•	Supervisors
•	External Auditors
________________________________________
5. Technology Blueprint
Frontend
•	React 18 + TypeScript
•	Vite
•	TailwindCSS
•	shadcn/ui
•	React Router v6
•	React Hook Form + Zod
•	React Query
•	Recharts
Backend
•	Supabase (Auth, PostgreSQL, Storage, RLS, Edge Functions, Audit logs)
DevOps
•	GitHub Actions
•	Supabase migrations
•	GitHub Pages hosting
AI
•	OpenAI Responses API
•	GPT-4.1 → GPT-5 family
•	Central AI gateway (maturion-ai)
•	Zero data retention (store: false)
•	Chunking via ai_document_chunks
________________________________________
6. UX / UI – Public Layer
6.1 Landing Page
•	Commercial, colourful, modern
•	ISMS overview
•	Module cards (hover → expand → click)
•	Free Maturity Snapshot
•	CTA to subscribe
•	Not yet showing the house model
•	Not showing the deep security philosophy
6.2 Module Info Pages
Each module has:
•	Detailed explanation
•	AI “Ask Maturion” bubble
•	Course pathway suggestions
•	CTA: Subscribe / Learn more
6.3 Security Philosophy
Located inside Skills Development Portal module, not on landing page.
________________________________________
7. Subscription & Onboarding
Subscription Page
•	Packages & pricing
•	Choose modules
•	Pay & proceed
Get-to-Know-You Page
Collects:
•	Personal profile
•	CV/bio
•	Organisation info
•	Brand
•	Threat list
•	Region & industry
•	Used for AI personalisation
________________________________________
8. Logged-In Navigation
•	Left Sidebar: Dashboard, Modules
•	Top Bar: Org selector & profile
•	AI side panel (context-aware)
________________________________________
9. Maturity Module UX
•	Maturity Overview page
•	Interactive house model
•	Domain cards with status
•	Free assessment and baseline stored
•	MPS setup & AI suggestions
•	Criteria building with AI guidance
•	Cross-domain logic automation
•	Stakeholder reviews + sign-off
•	Responsibilities assigned
•	PIT integration
•	Evidence management + AI evaluation
•	External audit workflow
•	Final maturity levels frozen
•	New journey starts for next cycle
________________________________________
10. Skills Development Portal
•	Security philosophy hub
•	Micro-learning → modules → courses → qualification
•	Course Factory (with advanced AI models)
•	Certification pathway tied to real evidence
•	Continuous professionalisation of security specialists
________________________________________
11. Risk, PIT, Incident, Analytics Modules
Each follows the module architecture template and uses:
•	Domain → MPS → Criteria logic (where applicable)
•	AI contextual assistance
•	PIT timeline (Gantt) for milestone management
•	Data analytics (Spotfire-style) with automated anomaly detection
•	Incident intake + intelligence loops
•	Remote assurance dashboards
(Full specs created separately per module.)
________________________________________
12. AI Governance
AI must obey:
•	Evidence-first criteria
•	No hallucinations
•	No fallback to Annex 1
•	No ambiguous wording
•	Abort when insufficient context
•	Strict cross-domain reasoning
•	Full logging & monitoring
•	Personality: professional, supportive, educational
AI serves:
•	MPS generation
•	Criteria refinement
•	Evidence evaluation
•	Skills recommendations
•	Risk modelling
•	Incident insights
•	PIT assistance
•	Code generation (Builders)
•	Training content creation (Course Factory)
________________________________________
13. Security Architecture
•	Supabase Auth + JWT + RLS
•	Secure schema (least privilege)
•	Input sanitisation (DOMPurify)
•	Prompt injection defence
•	Rate limits
•	Audit log
•	Watchdog security dashboard
•	Compliance with ISO 27001, NIST CSF, GDPR/POPIA
________________________________________
14. QA System
QA includes:
•	Architecture conformity tests
•	UI state + navigation tests
•	All wiring and integrations
•	Cross-domain logic validation
•	Criteria structural compliance
•	RLS tests
•	AI behavioural tests
•	Model selection correctness (Section 17)
•	Regression suite
•	Security suite
•	One-click QA dashboard
Johan looks at the UI only after QA = 100% green.
________________________________________
15. Watchdog
Monitors:
•	Security anomalies
•	AI anomalies
•	Model misselection
•	RLS violations
•	Data drift
•	Chunk integrity
•	Slow responses
•	Rate spikes
Exposes:
•	Watchdog Dashboard
•	Health Checker
•	Security Dashboard
________________________________________
16. Module Architecture Template (Mandatory)
Every new module must be designed using this template:
1.	Functional spec
2.	User journeys
3.	Data model
4.	UI layout
5.	AI usage
6.	Integrations (PIT, Evidence, Analytics)
7.	QA suite
8.	Watchdog hooks
9.	Backoffice/admin pages
Foreman reviews & approves architecture before any Builder work starts.
________________________________________
17. Automated Model Selection & Routing (NEW – Mandatory)
(This is the new section you requested.)
To reduce costs and increase performance, all AI calls go through a central routing engine inside the Supabase Edge Function called maturion-ai.
The routing engine automatically chooses the cheapest model that can reliably produce the required output.
________________________________________
17.1 Task Classification System
Every AI request is classified into one of the following task types:
1.	Simple Q&A / Guidance
2.	Criteria Evaluation & Rewrite
3.	Cross-Domain Logic Evaluation
4.	Evidence Evaluation & Maturity Scoring
5.	Coding / Technical Development
6.	Course Material Generation (Course Factory)
7.	Graphics / Video / Audio Generation
8.	Risk & Incident Modelling
9.	PIT & Timeline Reasoning
10.	General Multi-Step Reasoning Tasks
The classification is automatic and based on:
•	Input length
•	Keywords
•	Required output format
•	User role
•	Module context
•	Request structure
________________________________________
17.2 Complexity Scoring
Each request receives a complexity score based on:
•	Length of input
•	Number of documents involved
•	Technical/specialist terminology
•	Reasoning depth required
•	Presence of criteria/evidence
•	Required format strictness
•	Ambiguity detection
•	Risk or compliance level
Scores map to:
•	Low
•	Medium
•	High
•	Critical reasoning
________________________________________
17.3 Model Routing Table
The system selects models using this table:
Task Type	Default Model	Escalate When	Escalated Model
Simple Q&A	GPT-4.1-mini	context required / long input	GPT-4o
Criteria Evaluation	GPT-4o	complex criteria / multiple files	GPT-5
Cross-Domain Reasoning	GPT-4o	multi-domain chains	GPT-5
Evidence Evaluation	GPT-5	—	—
Coding Tasks	GPT-4o-mini	multi-file patches	GPT-5 or o3-coder
Course Material	GPT-5	large modules	o1-creative
Video/Graphics	GPT-5	media-required	video/vision model
Risk Modelling	GPT-4o	high-risk analysis	GPT-5
PIT Reasoning	GPT-4o	multi-dependency chains	GPT-5
General Reasoning	GPT-4o	complexity high	GPT-5
________________________________________
17.4 Routing Flow
1.	Identify task type
2.	Score complexity
3.	Choose cheapest model sufficient for quality
4.	Execute
5.	Run Watchdog for:
o	hallucinations
o	missing structure
o	criteria rule violations
o	cross-domain logic failure
o	evidence misalignment
6.	If failure occurs → retry with upgraded model
7.	Record failure to improve future routing
________________________________________
17.5 Self-Learning Model Selection
The routing engine maintains a memory:
•	Model → task → success rate
•	Escalation frequency
•	Overkill detection
•	Underpowered detection
Over time:
•	Tasks that always require GPT-5 will default to GPT-5
•	Tasks consistently solved by GPT-4o-mini automatically downgrade
•	Course Factory tasks will always escalate
•	Evidence evaluation will always stay high-tier
•	Coding tasks will pick coding-specialised models by default
This is Foreman’s responsibility to maintain.
________________________________________
17.6 QA for Model Selection
QA must test:
•	Model routing correctness
•	Escalation logic
•	Watchdog spotting bad outputs
•	No direct model calls bypassing routing engine
•	Responses conforming to required format (especially for criteria, evidence, and course content)
•	Regression tests for expensive models (cost optimisation)
________________________________________
18. Versioning & Evolution
•	This is Version 1.1
•	All changes to True North must be versioned
•	Foreman updates architecture + QA
•	Builders adjust implementation
________________________________________
✔ End of Maturion True North v1.1
You now have a world-class, enterprise-grade, fully aligned master architecture.

