import { AlertTriangle, FileCode, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Evidence {
  agent: string;
  type: string;
  reference: any;
}

interface RootCauseReportProps {
  report: {
    status: string;
    severity?: string;
    problem_summary?: string;
    confidence_score?: number;
    affected_files?: string[];
    alternative_hypotheses?: any[];
    recommended_fix?: string;
    evidence?: Evidence[];
  };
}

export default function RootCauseReport({ report }: RootCauseReportProps) {
  
  const getSeverityColor = (severity?: string) => {
    switch(severity) {
      case 'critical': return 'text-accent-danger bg-accent-danger/10 border-accent-danger/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-accent-warning bg-accent-warning/10 border-accent-warning/20';
      default: return 'text-text-secondary bg-bg-base border-border-subtle';
    }
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-bg-base';
    if (score >= 85) return 'bg-accent-success/20 text-accent-success';
    if (score >= 60) return 'bg-accent-warning/20 text-accent-warning';
    return 'bg-accent-danger/20 text-accent-danger';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border-subtle bg-bg-base flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <ShieldAlert size={20} className="text-accent-danger" />
              Root Cause Identified
            </h3>
            {report.severity && (
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${getSeverityColor(report.severity)}`}>
                {report.severity}
              </span>
            )}
          </div>
          
          {report.confidence_score !== undefined && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(report.confidence_score)}`}>
              {report.confidence_score}% Confidence
            </div>
          )}
        </div>
        
        <div className="p-6 bg-bg-base border-b border-border-subtle">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Problem Summary</h4>
          <p className="text-text-primary leading-relaxed text-[15px]">
            {report.problem_summary || "No summary provided."}
          </p>
        </div>

        {/* Evidence Section */}
        {report.evidence && report.evidence.length > 0 && (
          <div className="p-6 bg-bg-surface">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Evidence</h4>
            <div className="space-y-4">
              {report.evidence.map((ev, idx) => (
                <div key={idx} className="border border-border-subtle rounded-lg bg-bg-base overflow-hidden">
                  <div className="px-4 py-2 bg-bg-surface border-b border-border-subtle flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-mono text-text-secondary">
                      <FileCode size={14} />
                      {ev.reference.file}:{ev.reference.line}
                    </span>
                    <span className="text-accent-primary font-medium">{ev.agent}</span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-text-primary">
                      <code>{ev.reference.snippet}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fix & Impact Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent-success" />
            Recommended Fix
          </h4>
          <div className="p-4 bg-bg-base rounded-lg border border-border-subtle flex-1">
            <p className="text-sm leading-relaxed">
              {report.recommended_fix || "No fix recommended yet."}
            </p>
          </div>
          <div className="mt-4 flex gap-3">
             <button className="flex-1 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors text-sm">
               Propose Patch Plan
             </button>
             <button className="px-4 py-2 border border-border-subtle text-text-secondary rounded-lg font-medium hover:bg-bg-base transition-colors text-sm">
               Mark Incorrect
             </button>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Affected Files</h4>
          <ul className="space-y-2 mb-6">
            {report.affected_files?.map((file, idx) => (
              <li key={idx} className="text-sm font-mono text-text-primary bg-bg-base p-2 rounded border border-border-subtle break-all">
                {file}
              </li>
            ))}
            {(!report.affected_files || report.affected_files.length === 0) && (
              <li className="text-sm text-text-secondary italic">None identified</li>
            )}
          </ul>
          
          {report.alternative_hypotheses && report.alternative_hypotheses.length > 0 && (
            <details className="group border border-border-subtle rounded-lg bg-bg-base overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex items-center justify-between hover:bg-bg-surface transition-colors">
                Alternative Hypotheses ({report.alternative_hypotheses.length})
                <span className="text-text-secondary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 border-t border-border-subtle text-sm text-text-secondary space-y-3">
                {report.alternative_hypotheses.map((alt, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-text-primary">{alt.summary}</p>
                    <p>{alt.reason}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
        
      </div>
    </div>
  );
}
