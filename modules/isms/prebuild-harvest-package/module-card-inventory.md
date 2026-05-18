# Module-Card Inventory and Target Naming Map — ISMS Public Landing

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: ISMS_app_description.md §5 and §16
**Version**: v1.0.0

---

## 1. Required Module Cards

The ISMS public landing page MUST include module discovery cards for the following 7 modules (minimum authority set):

| Card # | Canonical Module Name | Legacy Card Name | Route Target | App/Module Owner |
|---|---|---|---|---|
| 1 | **Maturity Roadmap / MMM** | "Maturity Development Journey" | `/marketing/maturity-roadmap` | MMM module |
| 2 | **Risk Management** | "Risk Management Framework" | `/marketing/risk-management` | Risk Management module |
| 3 | **Project Implementation Tracker / PIT** | "Action Management System" | `/marketing/project-implementation` | PIT module |
| 4 | **Data Analytics & Remote Assurance** | "Access Analytics" | `/marketing/data-analytics-assurance` | Data/Remote Assurance module |
| 5 | **Systems Integration / RADAM** | "Video Surveillance Analysis" | `/marketing/systems-integration` | Systems Integration / RADAM module |
| 6 | **Skills Development Portal** | "Security Skills Accelerator" | `/marketing/skills-development` | Skills Development module |
| 7 | **Incident & Intelligence Hub** | (not in legacy Index.tsx cards — ADD NEW) | `/marketing/incident-intelligence` | Incident & Intelligence module |

---

## 2. Module Card Required Fields

Each module card MUST include:

| Field | Requirement | Example |
|---|---|---|
| Title | Canonical module name | "Maturity Roadmap / MMM" |
| One-line value proposition | Clear, concise benefit statement | "Build, assess, and improve maturity using governed Domain→MPS→Criteria models." |
| Hover/preview detail | 1-2 sentences of expanded description | "Shows baseline assessment, framework setup/import, evidence-led scoring..." |
| Click-through behavior | Navigate to module marketing page | `onClick={() => navigate(ROUTES.MARKETING_MATURITY_ROADMAP)}` |
| Ask Maturion affordance | Optional AI help button/link | "Ask Maturion about this module" |
| Subscription/sign-up path note | Link or label indicating subscribe path | "Subscription unlocks full workspace" |
| Status badge | "Available" or "Coming Soon" | Badge component |

---

## 3. Individual Card Specifications

### Card 1 — Maturity Roadmap / MMM

```
Title: Maturity Roadmap / MMM
One-liner: Build, assess, and improve organisational maturity with governed frameworks.
Hover detail: Baseline assessment across 5 domains, evidence-led scoring, AI evaluation, 
              maturity roadmap generation, and auditor-reviewed progression.
CTA route: /marketing/maturity-roadmap
Ask Maturion: "Ask Maturion about my maturity baseline and next-level priorities."
Subscription note: Free assessment available. Full workspace on subscription.
Status: Available
Icon: Target (lucide)
```

### Card 2 — Risk Management

```
Title: Risk Management
One-liner: Identify, score, prioritise, and treat enterprise security risk.
Hover detail: Threat and vulnerability assessment, control effectiveness measurement, 
              risk register management, and NIST/ISO-aligned treatment planning.
CTA route: /marketing/risk-management
Ask Maturion: "Ask Maturion to explain top risks and treatment options."
Subscription note: Subscription unlocks full risk register and workflows.
Status: Coming Soon
Icon: AlertTriangle (lucide)
```

### Card 3 — Project Implementation Tracker / PIT

```
Title: Project Implementation Tracker / PIT
One-liner: Turn findings and strategies into governed execution work.
Hover detail: Project→milestone→deliverable→task structure with evidence-backed 
              completion tracking and implementation accountability.
CTA route: /marketing/project-implementation
Ask Maturion: "Ask Maturion to convert recommendations into executable implementation plans."
Subscription note: Subscription provides governed execution spaces.
Status: Coming Soon
Icon: Wrench (lucide)
```

### Card 4 — Data Analytics & Remote Assurance

```
Title: Data Analytics & Remote Assurance
One-liner: Continuously validate control performance with data-driven assurance.
Hover detail: System integrations, anomaly detection, assurance scoring, and live 
              operational data ingestion with AI-powered risk signal analysis.
CTA route: /marketing/data-analytics-assurance
Ask Maturion: "Ask Maturion what the latest assurance signals imply for risk and maturity."
Subscription note: Subscription enables connector setup and assurance dashboards.
Status: Coming Soon
Icon: BarChart (lucide)
```

### Card 5 — Systems Integration / RADAM

```
Title: Systems Integration / RADAM
One-liner: Connect operational systems to produce trusted automation and evidence streams.
Hover detail: System connectors for surveillance, access control, HR, SCADA, and operations. 
              Cross-system logic verification and automated telemetry ingestion.
CTA route: /marketing/systems-integration
Ask Maturion: "Ask Maturion which integrations should be prioritised first."
Subscription note: Subscription unlocks integration setup and evidence feed activation.
Status: Coming Soon
Icon: Database (lucide)
```

### Card 6 — Skills Development Portal

```
Title: Skills Development Portal
One-liner: Build workforce capability aligned to controls, evidence, and maturity outcomes.
Hover detail: Learning pathways, role-based upskilling, competency tracking, and 
              certificate generation linked to module objectives.
CTA route: /marketing/skills-development
Ask Maturion: "Ask Maturion which skills gaps block current maturity progression."
Subscription note: Subscription enables managed learning paths.
Status: Coming Soon
Icon: GraduationCap (lucide)
```

### Card 7 — Incident & Intelligence Hub

```
Title: Incident & Intelligence Hub
One-liner: Capture incidents and intelligence signals to improve control decisions.
Hover detail: Incident logging, investigation support, threat-drift signal detection, 
              and cross-module evidence linkage for AI-guided response.
CTA route: /marketing/incident-intelligence
Ask Maturion: "Ask Maturion to summarise incident patterns and response priorities."
Subscription note: Subscription enables full incident lifecycle management.
Status: Coming Soon
Icon: Zap (lucide)
```

---

## 4. Card Layout Pattern (from legacy Index.tsx)

The legacy card layout uses a grid with hover effects:

```tsx
// Card structure pattern (harvest from legacy):
<Card 
  className="cursor-pointer hover:shadow-lg transition-shadow"
  onClick={() => navigate(ROUTES.MARKETING_<MODULE>)}
>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${card.bgGradient}`}>
        <Icon className={`h-6 w-6 ${card.iconColor}`} />
      </div>
      <Badge variant="secondary">{card.status}</Badge>
    </div>
    <CardTitle className="mt-3">{card.title}</CardTitle>
    <CardDescription>{card.oneLiner}</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">{card.hoverDetail}</p>
    <Button variant="outline" size="sm" className="mt-4">
      Learn More <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  </CardContent>
</Card>
```

---

## 5. Card Grid Layout

```tsx
// 3-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {MODULE_CARDS.map(card => <ModuleCard key={card.id} {...card} />)}
</div>
```

---

## 6. Free Assessment Card (Special — Maturity Roadmap)

The free assessment CTA on the landing page must clearly indicate it is tied to the **Maturity Roadmap / MMM module**:

```
CTA text: "Start Free Maturity Assessment"
Sub-text: "Powered by the Maturity Roadmap module"
Route: /free-assessment
```

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
