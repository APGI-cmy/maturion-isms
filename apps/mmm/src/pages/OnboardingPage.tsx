import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';

// ─── Options harvested from legacy MaturitySetup.tsx ───────────────────────
const INDUSTRY_OPTIONS = [
  'Mining', 'Energy', 'Finance', 'Healthcare', 'Manufacturing',
  'Technology', 'Government', 'Construction', 'Retail', 'Transportation', 'Other',
];

const REGION_OPTIONS = [
  'North America', 'Europe', 'Asia Pacific', 'Latin America',
  'Middle East & Africa', 'Southern Africa', 'Global',
];

const RISK_CONCERN_OPTIONS = [
  'Cyber Attacks', 'Insider Threats', 'Data Breaches', 'Supply Chain Risks',
  'Regulatory Compliance', 'Physical Security', 'Business Continuity', 'Third-party Risks',
];

const COMPLIANCE_OPTIONS = [
  'ISO 27001', 'NIST', 'SOC 2', 'PCI DSS', 'GDPR', 'HIPAA', 'SOX', 'COBIT',
];

const THREAT_LEVELS = ['Basic', 'Moderate', 'Advanced'] as const;
type ThreatLevel = typeof THREAT_LEVELS[number];

const TOTAL_STEPS = 10;

interface WizardData {
  // Step 2 — Your Information
  fullName: string;
  title: string;
  bio: string;
  // Step 3 — Organisation Identity
  companyName: string;
  tier: string;
  // Step 4 — Industry, Region & Context
  industryTags: string[];
  customIndustry: string;
  regionOperating: string;
  // Step 5 — Website & Domain Footprint
  primaryWebsiteUrl: string;
  linkedDomainsRaw: string;
  // Step 6 — Risk, Threat & Compliance
  riskConcerns: string[];
  complianceCommitments: string[];
  threatSensitivityLevel: ThreatLevel;
  // Step 7 — Branding
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  // Step 8 — Documents (notes only)
  documentNotes: string;
  // Step 9 — Model Name
  modelName: string;
}

function initialData(): WizardData {
  return {
    fullName: '', title: '', bio: '',
    companyName: '', tier: 'STARTER',
    industryTags: [], customIndustry: '', regionOperating: '',
    primaryWebsiteUrl: '', linkedDomainsRaw: '',
    riskConcerns: [], complianceCommitments: [],
    threatSensitivityLevel: 'Basic',
    primaryColor: '#0066cc', secondaryColor: '#00cc99', textColor: '#ffffff',
    documentNotes: '',
    modelName: '',
  };
}

function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
}

// ─── Step components ────────────────────────────────────────────────────────

function StepWelcome() {
  return (
    <div className="wizard-step">
      <div className="wizard-step__icon" aria-hidden="true">🎯</div>
      <h2 className="wizard-step__title">Get To Know You</h2>
      <p className="wizard-step__body">
        Welcome to Maturion. To build your AI-tailored maturity roadmap we need to understand your
        organisation, your industry, your risk profile, and your security maturity goals.
      </p>
      <p className="wizard-step__body">
        This takes about 3–5 minutes. Your answers will power your personalised Maturity Model and
        AI-generated framework recommendations.
      </p>
      <p className="wizard-step__hint">
        You can go back to any step before submitting. Nothing is saved until you complete the final step.
      </p>
    </div>
  );
}

function StepYourInfo({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Your Information</h2>
      <p className="wizard-step__hint">Tell us about yourself as the primary administrator for this maturity model.</p>
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input id="fullName" className="form-control" placeholder="Your full name"
          value={data.fullName} onChange={e => onChange({ fullName: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title / Role *</label>
        <input id="title" className="form-control" placeholder="e.g. CISO, Security Manager, IT Director"
          value={data.title} onChange={e => onChange({ title: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="bio">Short Bio (optional)</label>
        <textarea id="bio" className="form-control" rows={3}
          placeholder="Brief description of your background and experience..."
          value={data.bio} onChange={e => onChange({ bio: e.target.value })} />
      </div>
    </div>
  );
}

function StepOrgIdentity({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Organisation Identity</h2>
      <p className="wizard-step__hint">Your organisation name and plan tier.</p>
      <div className="form-group">
        <label htmlFor="org-name">Organisation Name *</label>
        <input id="org-name" className="form-control" placeholder="Acme Corporation"
          value={data.companyName} onChange={e => onChange({ companyName: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="org-tier">Plan Tier</label>
        <select id="org-tier" className="form-control"
          value={data.tier} onChange={e => onChange({ tier: e.target.value })}>
          <option value="STARTER">Starter</option>
          <option value="PROFESSIONAL">Professional</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
      </div>
    </div>
  );
}

function StepIndustryRegion({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Industry, Region & Operating Context</h2>
      <p className="wizard-step__hint">
        This context helps Maturion AI select the most relevant maturity domains and controls for your organisation.
      </p>
      <div className="form-group">
        <label>Industry (select all that apply)</label>
        <div className="wizard-checkbox-grid">
          {INDUSTRY_OPTIONS.map(opt => (
            <label key={opt} className="wizard-checkbox">
              <input type="checkbox" checked={data.industryTags.includes(opt)}
                onChange={() => onChange({ industryTags: toggleItem(data.industryTags, opt) })} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      {data.industryTags.includes('Other') && (
        <div className="form-group">
          <label htmlFor="customIndustry">Custom Industry</label>
          <input id="customIndustry" className="form-control" placeholder="Describe your industry..."
            value={data.customIndustry} onChange={e => onChange({ customIndustry: e.target.value })} />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="regionOperating">Primary Region of Operation</label>
        <select id="regionOperating" className="form-control"
          value={data.regionOperating} onChange={e => onChange({ regionOperating: e.target.value })}>
          <option value="">Select region…</option>
          {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  );
}

function StepWebsiteDomains({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Website & Domain Footprint</h2>
      <p className="wizard-step__hint">
        Your public web presence helps Maturion AI understand your organisation&rsquo;s digital exposure and tailor
        threat recommendations accordingly.
      </p>
      <div className="form-group">
        <label htmlFor="primaryWebsiteUrl">Primary Website URL</label>
        <input id="primaryWebsiteUrl" className="form-control" type="url" placeholder="https://example.com"
          value={data.primaryWebsiteUrl} onChange={e => onChange({ primaryWebsiteUrl: e.target.value })} />
      </div>
      <div className="form-group">
        <label htmlFor="linkedDomainsRaw">Linked Domains (comma-separated, optional)</label>
        <input id="linkedDomainsRaw" className="form-control" placeholder="portal.example.com, api.example.com"
          value={data.linkedDomainsRaw} onChange={e => onChange({ linkedDomainsRaw: e.target.value })} />
      </div>
    </div>
  );
}

function StepRiskCompliance({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Risk, Threat & Compliance Profile</h2>
      <p className="wizard-step__hint">
        This profile powers your AI-tailored maturity roadmap. Select all that apply.
      </p>
      <div className="form-group">
        <label>Risk Concerns</label>
        <div className="wizard-checkbox-grid">
          {RISK_CONCERN_OPTIONS.map(opt => (
            <label key={opt} className="wizard-checkbox">
              <input type="checkbox" checked={data.riskConcerns.includes(opt)}
                onChange={() => onChange({ riskConcerns: toggleItem(data.riskConcerns, opt) })} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Compliance Commitments</label>
        <div className="wizard-checkbox-grid">
          {COMPLIANCE_OPTIONS.map(opt => (
            <label key={opt} className="wizard-checkbox">
              <input type="checkbox" checked={data.complianceCommitments.includes(opt)}
                onChange={() => onChange({ complianceCommitments: toggleItem(data.complianceCommitments, opt) })} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label>Threat Sensitivity Level</label>
        <div className="wizard-radio-group">
          {THREAT_LEVELS.map(lvl => (
            <label key={lvl} className="wizard-radio">
              <input type="radio" name="threatLevel" value={lvl}
                checked={data.threatSensitivityLevel === lvl}
                onChange={() => onChange({ threatSensitivityLevel: lvl })} />
              <span>{lvl}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBranding({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Branding & Visual Identity</h2>
      <p className="wizard-step__hint">
        Your brand colours will be used in reports and maturity dashboards generated by Maturion.
      </p>
      <div className="form-group">
        <label htmlFor="primaryColor">Primary Brand Colour</label>
        <div className="wizard-color-row">
          <input id="primaryColor" type="color" className="wizard-color-swatch"
            value={data.primaryColor} onChange={e => onChange({ primaryColor: e.target.value })} />
          <input className="form-control" placeholder="#0066cc"
            value={data.primaryColor} onChange={e => onChange({ primaryColor: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="secondaryColor">Secondary Brand Colour</label>
        <div className="wizard-color-row">
          <input id="secondaryColor" type="color" className="wizard-color-swatch"
            value={data.secondaryColor} onChange={e => onChange({ secondaryColor: e.target.value })} />
          <input className="form-control" placeholder="#00cc99"
            value={data.secondaryColor} onChange={e => onChange({ secondaryColor: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="textColor">Text / Foreground Colour</label>
        <div className="wizard-color-row">
          <input id="textColor" type="color" className="wizard-color-swatch"
            value={data.textColor} onChange={e => onChange({ textColor: e.target.value })} />
          <input className="form-control" placeholder="#ffffff"
            value={data.textColor} onChange={e => onChange({ textColor: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function StepDocuments({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">AI-Ready Documents (Optional)</h2>
      <p className="wizard-step__hint">
        You can supply policy documents, existing frameworks, or security standards to help Maturion AI
        understand your organisation&rsquo;s existing posture. Document upload is available after onboarding via the
        Framework workspace.
      </p>
      <div className="form-group">
        <label htmlFor="documentNotes">Document Notes (optional)</label>
        <textarea id="documentNotes" className="form-control" rows={4}
          placeholder="List key documents you plan to supply (e.g. ISO 27001 policy, existing ISMS framework)…"
          value={data.documentNotes} onChange={e => onChange({ documentNotes: e.target.value })} />
      </div>
      <p className="wizard-step__hint wizard-step__hint--info">
        You can skip this step. Documents can be uploaded after you complete onboarding.
      </p>
    </div>
  );
}

function StepModelName({ data, onChange }: { data: WizardData; onChange: (patch: Partial<WizardData>) => void }) {
  function generateSuggestion() {
    if (data.companyName) {
      const abbr = data.companyName.split(' ').map(w => w.charAt(0).toUpperCase()).join('');
      const suggestion = `${data.companyName} ${abbr}MS — Maturity Standard`;
      onChange({ modelName: suggestion });
    }
  }
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Maturity Model Name & Intent</h2>
      <p className="wizard-step__hint">
        Name your maturity model. This name appears on all reports and certificates Maturion generates.
      </p>
      <div className="form-group">
        <label htmlFor="modelName">Model Name</label>
        <input id="modelName" className="form-control"
          placeholder="e.g. Acme Corporation ISMS — Maturity Standard"
          value={data.modelName} onChange={e => onChange({ modelName: e.target.value })} />
      </div>
      {data.companyName && (
        <button type="button" className="btn btn-outline" style={{ marginTop: 0 }} onClick={generateSuggestion}>
          Suggest a name
        </button>
      )}
    </div>
  );
}

function StepReview({ data }: { data: WizardData }) {
  const linkedDomains = data.linkedDomainsRaw
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  return (
    <div className="wizard-step">
      <h2 className="wizard-step__title">Review & Confirm</h2>
      <p className="wizard-step__hint">
        Please review your details before submitting. Click Back to make changes.
      </p>
      <div className="wizard-review">
        <div className="wizard-review__section">
          <h4>Your Information</h4>
          <p><strong>Name:</strong> {data.fullName || '—'}</p>
          <p><strong>Title:</strong> {data.title || '—'}</p>
          {data.bio && <p><strong>Bio:</strong> {data.bio}</p>}
        </div>
        <div className="wizard-review__section">
          <h4>Organisation</h4>
          <p><strong>Name:</strong> {data.companyName || '—'}</p>
          <p><strong>Plan:</strong> {data.tier}</p>
        </div>
        <div className="wizard-review__section">
          <h4>Industry & Region</h4>
          <p><strong>Industries:</strong> {data.industryTags.join(', ') || '—'}</p>
          {data.customIndustry && <p><strong>Custom:</strong> {data.customIndustry}</p>}
          <p><strong>Region:</strong> {data.regionOperating || '—'}</p>
        </div>
        <div className="wizard-review__section">
          <h4>Web Footprint</h4>
          <p><strong>Website:</strong> {data.primaryWebsiteUrl || '—'}</p>
          {linkedDomains.length > 0 && <p><strong>Domains:</strong> {linkedDomains.join(', ')}</p>}
        </div>
        <div className="wizard-review__section">
          <h4>Risk & Compliance</h4>
          <p><strong>Risk concerns:</strong> {data.riskConcerns.join(', ') || '—'}</p>
          <p><strong>Compliance:</strong> {data.complianceCommitments.join(', ') || '—'}</p>
          <p><strong>Threat sensitivity:</strong> {data.threatSensitivityLevel}</p>
        </div>
        <div className="wizard-review__section">
          <h4>Branding</h4>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: data.primaryColor, width: 24, height: 24, borderRadius: 4, display: 'inline-block', border: '1px solid #ccc' }} />
            <span style={{ background: data.secondaryColor, width: 24, height: 24, borderRadius: 4, display: 'inline-block', border: '1px solid #ccc' }} />
            <span style={{ background: data.textColor, width: 24, height: 24, borderRadius: 4, display: 'inline-block', border: '1px solid #ccc' }} />
          </div>
        </div>
        {data.modelName && (
          <div className="wizard-review__section">
            <h4>Model Name</h4>
            <p>{data.modelName}</p>
          </div>
        )}
      </div>
      <p className="wizard-step__hint wizard-step__hint--info">
        By submitting you confirm that the above information is correct. This context will power your
        AI-tailored Maturion maturity roadmap.
      </p>
    </div>
  );
}

// ─── Main Wizard Component ───────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function patch(changes: Partial<WizardData>) {
    setData(prev => ({ ...prev, ...changes }));
  }

  function validateStep(s: number): string | null {
    if (s === 2 && (!data.fullName.trim() || !data.title.trim())) {
      return 'Full Name and Title are required.';
    }
    if (s === 3 && !data.companyName.trim()) {
      return 'Organisation Name is required.';
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setValidationError(null);
    setStep(s => Math.max(s - 1, 1));
  }

  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const linkedDomains = data.linkedDomainsRaw
        .split(',')
        .map(d => d.trim())
        .filter(Boolean);
      const context = {
        fullName: data.fullName,
        title: data.title,
        bio: data.bio,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        textColor: data.textColor,
        modelName: data.modelName,
        primaryWebsiteUrl: data.primaryWebsiteUrl,
        linkedDomains,
        industryTags: data.industryTags,
        customIndustry: data.customIndustry,
        regionOperating: data.regionOperating,
        riskConcerns: data.riskConcerns,
        complianceCommitments: data.complianceCommitments,
        threatSensitivityLevel: data.threatSensitivityLevel,
        documentNotes: data.documentNotes,
      };
      const { data: result, error } = await supabase.functions.invoke('mmm-org-create', {
        headers: await getEdgeInvokeHeaders(),
        body: { name: data.companyName, tier: data.tier, context },
      });
      if (error) throw new Error(error.message || 'Failed to create org');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] }); // NBR-001: invalidate org cache
      navigate('/framework-origin');
    },
  });

  const stepTitles = [
    'Welcome',
    'Your Information',
    'Organisation Identity',
    'Industry, Region & Context',
    'Website & Domain Footprint',
    'Risk, Threat & Compliance',
    'Branding & Visual Identity',
    'AI-Ready Documents',
    'Maturity Model Name',
    'Review & Confirm',
  ];

  return (
    <main className="setup-page">
      <div className="container">
        <div className="setup-card setup-card--wizard">
          {/* Progress bar */}
          <div className="wizard-progress" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
            <div className="wizard-progress__bar">
              <div
                className="wizard-progress__fill"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <p className="wizard-progress__label">
              Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}
            </p>
          </div>

          {/* Step content */}
          {step === 1 && <StepWelcome />}
          {step === 2 && <StepYourInfo data={data} onChange={patch} />}
          {step === 3 && <StepOrgIdentity data={data} onChange={patch} />}
          {step === 4 && <StepIndustryRegion data={data} onChange={patch} />}
          {step === 5 && <StepWebsiteDomains data={data} onChange={patch} />}
          {step === 6 && <StepRiskCompliance data={data} onChange={patch} />}
          {step === 7 && <StepBranding data={data} onChange={patch} />}
          {step === 8 && <StepDocuments data={data} onChange={patch} />}
          {step === 9 && <StepModelName data={data} onChange={patch} />}
          {step === 10 && <StepReview data={data} />}

          {/* Validation error */}
          {validationError && (
            <p role="alert" className="wizard-validation-error">
              {validationError}
            </p>
          )}

          {/* Submit error */}
          {mutation.isError ? (
            <p role="alert" className="text-sm text-red-600">
              We couldn&apos;t create your organisation. Please review your details and try again.
            </p>
          ) : null}

          {/* Navigation */}
          <div className="wizard-nav">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={back}
                disabled={mutation.isPending}>
                ← Back
              </button>
            )}
            {step < TOTAL_STEPS && (
              <button type="button" className="btn btn-primary" onClick={next}
                style={{ marginLeft: 'auto' }}>
                Next →
              </button>
            )}
            {step === TOTAL_STEPS && (
              <button type="button" className="btn btn-primary" style={{ marginLeft: 'auto' }}
                onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Complete Setup →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

