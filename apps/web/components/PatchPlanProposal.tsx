import { useState, useEffect } from 'react';
import { Bot, FileCode, CheckCircle2, XCircle, ChevronRight, Loader2, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PatchPlan {
  id: string;
  plan_strategy: string;
  target_files: string[];
  status: 'pending_review' | 'approved' | 'rejected';
}

export default function PatchPlanProposal({ projectId, investigationId }: { projectId: string, investigationId: string }) {
  const [plan, setPlan] = useState<PatchPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch from /api/v1/patch-plans?investigationId=...
    setTimeout(() => {
      setPlan({
        id: "plan-1",
        plan_strategy: "### Step 1: Implement Retry Logic\nAdd a wrapper around the `processPayment` function in `src/payments/service.ts` to implement exponential backoff.\n\n### Step 2: Update Unit Tests\nUpdate `src/payments/retry.test.ts` to mock network failures and ensure the backoff is respected.",
        target_files: ["src/payments/service.ts", "src/payments/retry.test.ts"],
        status: "pending_review"
      });
      setLoading(false);
    }, 1000);
  }, [investigationId]);

  const handleAction = (status: 'approved' | 'rejected') => {
    if (!plan) return;
    setPlan({ ...plan, status });
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-text-secondary" /></div>;
  }

  if (!plan) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Patch Plan Proposal</h2>
          <p className="text-sm text-text-secondary">BugMind has drafted a strategy to fix the issue. Please review before code generation begins.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Strategy Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Proposed Strategy</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-text-primary">
              <ReactMarkdown>{plan.plan_strategy}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Target Files */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Target Files</h3>
            <ul className="space-y-2">
              {plan.target_files.map((file, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-text-primary bg-bg-base p-2 rounded border border-border-subtle">
                  <FileCode size={14} className="text-text-secondary" />
                  <span className="truncate" title={file}>{file}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Bar */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-3">
             <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Review Action</h3>
             
             {plan.status === 'pending_review' ? (
               <>
                 <button 
                   onClick={() => handleAction('approved')}
                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-success text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                 >
                   <CheckCircle2 size={18} />
                   Approve & Write Code
                 </button>
                 <button 
                   onClick={() => handleAction('rejected')}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-bg-base border border-border-subtle text-text-primary rounded-lg font-medium hover:bg-border-subtle transition-colors"
                 >
                   <XCircle size={18} className="text-text-secondary" />
                   Reject / Modify
                 </button>
               </>
             ) : (
               <div className={`p-4 rounded-lg flex items-center gap-3 ${
                 plan.status === 'approved' ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-danger/10 text-accent-danger'
               }`}>
                 {plan.status === 'approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                 <span className="font-semibold">
                   {plan.status === 'approved' ? 'Plan Approved' : 'Plan Rejected'}
                 </span>
               </div>
             )}
             
             {plan.status === 'approved' && (
                <div className="mt-4 pt-4 border-t border-border-subtle text-sm text-text-secondary text-center">
                  BugMind is now writing code in the Sandbox...
                  <div className="mt-2 flex justify-center">
                    <Loader2 className="animate-spin text-accent-primary" />
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
