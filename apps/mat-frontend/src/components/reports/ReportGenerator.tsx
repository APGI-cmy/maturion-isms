/**
 * Report Generator Component
 * FRS: FR-024 (Report Generation)
 * TRS: TR-053
 * Task: 5.6.5
 */
import { useState } from 'react';
import { useGenerateReport } from '../../lib/hooks/useScoring';
import { FileText, Download, Loader2 } from 'lucide-react';

interface ReportGeneratorProps {
  auditId: string;
  auditTitle: string;
}

export function ReportGenerator({ auditId, auditTitle }: ReportGeneratorProps) {
  const generateReport = useGenerateReport();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'xlsx'>('pdf');

  const handleGenerate = async () => {
    try {
      const result = await generateReport.mutateAsync({ auditId, format: selectedFormat });
      
      // Download the report
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `${auditTitle}-report.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`${selectedFormat.toUpperCase()} report generated successfully!`);
    } catch (err) {
      alert(`Failed to generate report: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="report-generator bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generate Audit Report</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="report-format" className="block text-sm font-medium text-gray-700 mb-2">
            Report Format
          </label>
          <select
            id="report-format"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdf">PDF (Portable Document Format)</option>
            <option value="docx">DOCX (Microsoft Word)</option>
            <option value="xlsx">XLSX (Microsoft Excel)</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Report Contents</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Executive Summary</li>
            <li>✓ Audit Scope and Methodology</li>
            <li>✓ Maturity Scores by Domain/MPS/Criteria</li>
            <li>✓ Gap Analysis and Recommendations</li>
            <li>✓ Evidence Summary</li>
            <li>✓ Appendices (Detailed Findings)</li>
          </ul>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generateReport.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {generateReport.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating {selectedFormat.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Generate {selectedFormat.toUpperCase()} Report
            </>
          )}
        </button>

        {generateReport.isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-yellow-800">
              ⏳ Report generation may take 30-60 seconds for large audits. Please wait...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
