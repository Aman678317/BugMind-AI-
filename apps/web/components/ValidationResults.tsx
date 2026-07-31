import { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, TerminalSquare, FlaskConical, Activity, RotateCw, GitPullRequest } from 'lucide-react';

interface ValidationRun {
  id: string;
  attempt_number: int;
  build_status: 'pass' | 'fail';
  result: 'pass' | 'fail';
  rejection_reason?: string;
  build_log: string;
  test_results: {
    total: number;
    passed: number;
    failed: number;
    coverage_delta: string;
  };
  performance_delta: any;
}

export default function ValidationResults({ projectId }: { projectId: string }) {
  const [activeTab, setActiveTab] = useState<'log' | 'tests' | 'perf'>('tests');
  const [run, setRun] = useState<ValidationRun | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock fetching the initial run
  useEffect(() => {
    // In a real app we'd fetch from /api/v1/patch-plans/mock_plan_id/validation-runs
    setTimeout(() => {
      setRun({
        id: "run-1",
        attempt_number: 1,
        build_status: "fail",
        result: "fail",
        rejection_reason: "Regression: A previously passing test (retries 3 times before failing) now fails.",
        build_log: "> jest src/payments/retry.test.ts\nFAIL src/payments/retry.test.ts\n  ✕ retries 3 times before failing (15ms)\n\n  ● retries 3 times before failing\n\n    expect(received).toBe(expected)\n\n    Expected: 3\n    Received: 1\n\nTest Suites: 1 failed, 1 total",
        test_results: { total: 45, passed: 44, failed: 1, coverage_delta: "-0.5%" },
        performance_delta: {}
      });
      setLoading(false);
    }, 1000);
  }, [projectId]);

  const handleRetry = () => {
    setLoading(true);
    // Simulate the Revise & Retry loop passing on attempt 2
    setTimeout(() => {
      setRun({
        id: "run-2",
        attempt_number: 2,
        build_status: "pass",
        result: "pass",
        build_log: "> jest src/payments/retry.test.ts\nPASS src/payments/retry.test.ts\nTest Suites: 1 passed, 1 total",
        test_results: { total: 45, passed: 45, failed: 0, coverage_delta: "+1.2%" },
        performance_delta: { p95_latency_change: "-12ms", memory_usage_change: "negligible" }
      });
      setLoading(false);
    }, 1500);
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary animate-pulse">Running secure sandbox validation...</div>;
  }

  if (!run) return null;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        run.result === 'pass' 
          ? 'bg-accent-success/10 border-accent-success/20' 
          : 'bg-accent-danger/10 border-accent-danger/20'
      }`}>
        <div className="flex items-center gap-3">
          {run.result === 'pass' ? (
            <CheckCircle2 size={24} className="text-accent-success" />
          ) : (
            <ShieldAlert size={24} className="text-accent-danger" />
          )}
          <div>
            <h2 className={`font-bold ${run.result === 'pass' ? 'text-accent-success' : 'text-accent-danger'}`}>
              {run.result === 'pass' ? 'Validation Passed' : 'Validation Failed (Regression Detected)'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Attempt {run.attempt_number} of 2
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div>
          {run.result === 'fail' ? (
             <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm font-medium hover:bg-border-subtle transition-colors">
               <RotateCw size={16} />
               Revise & Retry
             </button>
          ) : (
             <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
               <GitPullRequest size={16} />
               Open Pull Request
             </button>
          )}
        </div>
      </div>

      {run.rejection_reason && (
        <div className="bg-bg-surface border border-border-subtle p-4 rounded-lg">
          <p className="text-sm font-medium text-text-primary">Why it failed:</p>
          <p className="text-sm text-text-secondary mt-1">{run.rejection_reason}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
        <div className="flex border-b border-border-subtle bg-bg-base">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'tests' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:bg-bg-surface'}`}
          >
            <FlaskConical size={16} /> Test Results
          </button>
          <button 
            onClick={() => setActiveTab('log')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'log' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:bg-bg-surface'}`}
          >
            <TerminalSquare size={16} /> Build Log
          </button>
          <button 
            onClick={() => setActiveTab('perf')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'perf' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-secondary hover:bg-bg-surface'}`}
          >
            <Activity size={16} /> Performance Delta
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'log' && (
            <pre className="p-4 bg-bg-base border border-border-subtle rounded-lg text-xs font-mono text-text-primary overflow-x-auto whitespace-pre-wrap">
              {run.build_log}
            </pre>
          )}
          
          {activeTab === 'tests' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 border border-border-subtle rounded-lg bg-bg-base text-center">
                 <p className="text-2xl font-bold">{run.test_results.total}</p>
                 <p className="text-xs text-text-secondary uppercase">Total Tests</p>
               </div>
               <div className="p-4 border border-border-subtle rounded-lg bg-bg-base text-center">
                 <p className="text-2xl font-bold text-accent-success">{run.test_results.passed}</p>
                 <p className="text-xs text-text-secondary uppercase">Passed</p>
               </div>
               <div className="p-4 border border-border-subtle rounded-lg bg-bg-base text-center">
                 <p className={`text-2xl font-bold ${run.test_results.failed > 0 ? 'text-accent-danger' : 'text-text-primary'}`}>{run.test_results.failed}</p>
                 <p className="text-xs text-text-secondary uppercase">Failed</p>
               </div>
               <div className="p-4 border border-border-subtle rounded-lg bg-bg-base text-center">
                 <p className="text-2xl font-bold">{run.test_results.coverage_delta}</p>
                 <p className="text-xs text-text-secondary uppercase">Coverage</p>
               </div>
            </div>
          )}

          {activeTab === 'perf' && (
            <div className="text-sm text-text-secondary italic text-center py-8">
               {run.result === 'pass' ? 'Performance p95 latency improved by 12ms. Memory usage stable.' : 'Performance analysis skipped due to test failures.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
