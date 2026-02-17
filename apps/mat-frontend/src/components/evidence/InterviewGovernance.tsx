import React from 'react';

export default function InterviewGovernance() {
  const [consentGiven, setConsentGiven] = React.useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Interview Consent & Governance</h2>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2">Governance Requirements</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Interviewee must provide explicit consent</li>
            <li>Recording must be stored securely</li>
            <li>Data retention policy: 7 years</li>
            <li>Access restricted to audit team members</li>
          </ul>
        </div>
        <div className="p-4 border border-gray-200 rounded">
          <h3 className="font-semibold mb-3">Consent Form</h3>
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                I consent to this interview being recorded for audit purposes. I understand that the recording will be stored securely and used only for compliance assessment.
              </span>
            </label>
          </div>
          <button
            disabled={!consentGiven}
            className={`mt-4 w-full px-4 py-2 rounded ${
              consentGiven
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed with Interview
          </button>
        </div>
      </div>
    </div>
  );
}
