'use client';

import { useState } from 'react';
import { Play, Search, FileCode, BrainCircuit, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import RootCauseReport from './RootCauseReport';

interface InvestigationStep {
  action_type: string;
  details: any;
  created_at: string;
}

interface InvestigationResponse {
  id: string;
  status: 'running' | 'completed' | 'failed';
  root_cause_hypothesis?: string;
  confidence_score?: number;
  steps: InvestigationStep[];
}

interface InvestigationViewProps {
  projectId: string;
}

export default function InvestigationView({ projectId }: InvestigationViewProps) {
  const [bugDesc, setBugDesc] = useState('');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [steps, setSteps] = useState<InvestigationStep[]>([]);
  const [result, setResult] = useState<any>(null);
  const [analysisMode, setAnalysisMode] = useState<'static' | 'runtime'>('static');

  const handleStart = async () => {
    if (!bugDesc.trim()) return;
    
    setIsInvestigating(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/investigations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bug_description: bugDesc })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        console.error("Investigation failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsInvestigating(false);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search size={16} />;
      case 'read_file': return <FileCode size={16} />;
      case 'analyze': return <BrainCircuit size={16} />;
      default: return <CheckCircle2 size={16} />;
    }
  };

  const getStepDescription = (step: InvestigationStep) => {
    switch (step.action_type) {
      case 'search': return `Searched codebase for: "${step.details.query}"`;
      case 'read_file': return `Read file: ${step.details.file}`;
      case 'analyze': return `Analyzed logic: ${step.details.findings}`;
      default: return 'Unknown action';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Input Section */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Describe the Bug</h2>
        <textarea
          className="w-full bg-bg-base border border-border-subtle rounded-lg p-4 text-sm font-mono focus:outline-none focus:border-accent-primary transition-colors min-h-[120px] resize-y"
          placeholder="Paste error logs, stack traces, or describe the unexpected behavior..."
          value={bugDesc}
          onChange={(e) => setBugDesc(e.target.value)}
          disabled={isInvestigating}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!bugDesc.trim() || isInvestigating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-primary text-white font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isInvestigating ? (
              <><Loader2 size={18} className="animate-spin" /> Investigating...</>
            ) : (
              <><Play size={18} /> Start Investigation</>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {(steps.length > 0 || isInvestigating) && (
        <div className="flex flex-col gap-6">
          
          {/* Analysis Mode Toggle */}
          <div className="flex justify-end">
            <div className="inline-flex bg-bg-surface border border-border-subtle rounded-lg p-1">
              <button 
                onClick={() => setAnalysisMode('static')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  analysisMode === 'static' 
                    ? 'bg-bg-base text-text-primary shadow-sm border border-border-subtle' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Static Analysis
              </button>
              <button 
                onClick={() => setAnalysisMode('runtime')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  analysisMode === 'runtime' 
                    ? 'bg-bg-base text-accent-primary shadow-sm border border-border-subtle' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse"></div>
                Runtime-Observed (Live)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Timeline */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Investigation Trace</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-subtle">
              
              {result?.steps.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-bg-surface bg-bg-base text-accent-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {getStepIcon(step.action_type)}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-bg-base p-4 rounded-lg border border-border-subtle shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm capitalize text-accent-primary">{step.action_type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {getStepDescription(step)}
                    </div>
                  </div>
                </div>
              ))}

              {isInvestigating && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-bg-surface bg-bg-base text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 text-sm text-text-secondary italic">
                    BugMind is thinking...
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Hypothesis / Report Card */}
          <div className="flex flex-col gap-6">
            {result?.status === 'completed' && (
              <RootCauseReport report={result as any} />
            )}
            
            {isInvestigating && (
               <div className="bg-bg-surface border border-border-subtle border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-[300px] text-text-secondary opacity-50">
                 <BrainCircuit size={48} className="mb-4 animate-pulse" />
                 <p>Analyzing execution paths and running static checks...</p>
               </div>
            )}
          </div>

          </div>
        </div>
      )}

    </div>
  );
}
