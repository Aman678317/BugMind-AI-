'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, CircleDashed, Loader2, ChevronDown, ChevronUp, FileCode2, Package, Database, HardDrive } from 'lucide-react';

interface IngestionReport {
  files_scanned: number;
  files_skipped: number;
  skip_reasons: Record<string, string>;
  detected_stack: {
    languages: string[];
    frameworks: string[];
    infrastructure: string[];
    databases: string[];
  };
}

interface IngestionProgressProps {
  projectId: string;
  jobId: string;
}

const STEPS = ['queued', 'extracting', 'detecting_stack', 'analyzing', 'completed'];

export default function IngestionProgress({ projectId, jobId }: IngestionProgressProps) {
  const [status, setStatus] = useState<string>('queued');
  const [report, setReport] = useState<IngestionReport | null>(null);
  const [reportOpen, setReportOpen] = useState(true);

  // Poll the backend for status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/ingestion-jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status);
          if (data.report) setReport(data.report);

          if (data.status === 'completed' || data.status === 'failed' || data.status === 'analyzing') {
            // For sprint 2/3 bounds we stop polling at 'analyzing'
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Failed to fetch ingestion status", err);
      }
    };

    fetchStatus(); // initial
    interval = setInterval(fetchStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [projectId, jobId]);

  const currentStepIndex = STEPS.indexOf(status) === -1 ? 0 : STEPS.indexOf(status);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-bg-surface border border-border-subtle rounded-xl shadow-lg">
      <h1 className="text-2xl font-ui font-semibold mb-2">Ingestion Progress</h1>
      <p className="text-text-secondary mb-8">We are analyzing your repository to understand its structure and stack.</p>

      {/* Timeline Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border-subtle -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent-primary -z-10 transition-all duration-500"
          style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <div key={step} className="flex flex-col items-center bg-bg-surface px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                ${isCompleted ? 'bg-accent-success text-white' : 
                  isCurrent ? 'bg-accent-primary text-white' : 'bg-bg-base border-2 border-border-subtle text-text-secondary'}`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : 
                 isCurrent ? <Loader2 size={20} className="animate-spin" /> : 
                 <CircleDashed size={20} />}
              </div>
              <span className={`text-sm font-medium capitalize tracking-wide ${isCurrent ? 'text-text-primary' : 'text-text-secondary'}`}>
                {step.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ingestion Report Panel */}
      {report && (
        <div className="border border-border-subtle rounded-lg overflow-hidden">
          <button 
            onClick={() => setReportOpen(!reportOpen)}
            className="w-full px-6 py-4 bg-bg-base flex items-center justify-between hover:bg-opacity-80 transition-colors"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Ingestion Report</h2>
              <div className="flex gap-3 text-sm">
                <span className="text-accent-success bg-accent-success/10 px-2 py-1 rounded">Scanned: {report.files_scanned}</span>
                <span className="text-accent-warning bg-accent-warning/10 px-2 py-1 rounded">Skipped: {report.files_skipped}</span>
              </div>
            </div>
            {reportOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {reportOpen && (
            <div className="p-6 bg-bg-surface border-t border-border-subtle grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Detected Stack */}
              <div>
                <h3 className="font-semibold text-text-secondary uppercase tracking-wider mb-4 text-sm">Detected Stack</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileCode2 className="text-accent-primary mt-1" size={18} />
                    <div>
                      <div className="font-medium text-sm text-text-secondary">Languages</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.detected_stack.languages.map(l => (
                          <span key={l} className="px-2 py-1 bg-bg-base border border-border-subtle rounded text-sm">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="text-accent-primary mt-1" size={18} />
                    <div>
                      <div className="font-medium text-sm text-text-secondary">Frameworks</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.detected_stack.frameworks.map(f => (
                          <span key={f} className="px-2 py-1 bg-bg-base border border-border-subtle rounded text-sm">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HardDrive className="text-accent-primary mt-1" size={18} />
                    <div>
                      <div className="font-medium text-sm text-text-secondary">Infrastructure</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.detected_stack.infrastructure.map(i => (
                          <span key={i} className="px-2 py-1 bg-bg-base border border-border-subtle rounded text-sm">{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skipped Files */}
              <div>
                <h3 className="font-semibold text-text-secondary uppercase tracking-wider mb-4 text-sm">Skipped Files Log</h3>
                <div className="bg-bg-base border border-border-subtle rounded-md p-4 h-64 overflow-y-auto font-mono text-xs">
                  {Object.entries(report.skip_reasons).map(([file, reason]) => (
                    <div key={file} className="mb-2 flex justify-between gap-4 border-b border-border-subtle pb-2 last:border-0">
                      <span className="text-text-primary break-all">{file}</span>
                      <span className="text-accent-warning shrink-0">{reason}</span>
                    </div>
                  ))}
                  {Object.keys(report.skip_reasons).length === 0 && (
                    <div className="text-text-secondary italic">No files skipped.</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
