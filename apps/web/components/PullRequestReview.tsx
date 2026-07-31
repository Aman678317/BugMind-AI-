import { useState, useEffect } from 'react';
import { GitPullRequest, GitMerge, CheckCircle2, GitBranch, Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PullRequestPreview {
  title: string;
  description: string;
}

export default function PullRequestReview({ projectId, validationRunId }: { projectId: string, validationRunId: string }) {
  const [preview, setPreview] = useState<PullRequestPreview | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Mock fetch from /api/v1/validation-runs/{id}/pull-request/preview
    setTimeout(() => {
      setPreview({
        title: "Fix: Payment API intermittent failures under load",
        description: "## Problem\nThe payment API was failing under load because it lacked retry logic.\n\n## Fix\nAdded an exponential backoff wrapper around the API call.\n\n## Validation\n✅ All tests passed in sandbox."
      });
      setLoading(false);
    }, 1000);
  }, [validationRunId]);

  const handleCreatePR = () => {
    setSubmitting(true);
    // Mock POST to /api/v1/validation-runs/{id}/pull-request
    setTimeout(() => {
      setSubmitting(false);
      setCreatedUrl("https://github.com/acme-corp/api-gateway/pull/142");
    }, 1500);
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-text-secondary" /></div>;
  }

  if (!preview) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
          <GitMerge size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Final Code Review</h2>
          <p className="text-sm text-text-secondary">BugMind has validated the fix. Review the PR context and diff before merging.</p>
        </div>
      </div>

      {createdUrl ? (
        <div className="bg-accent-success/10 border border-accent-success/20 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4">
          <CheckCircle2 size={48} className="text-accent-success" />
          <h3 className="text-xl font-bold text-text-primary">Pull Request Created!</h3>
          <p className="text-text-secondary">BugMind has pushed the branch and opened the PR on your repository.</p>
          <a 
            href={createdUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-bg-base border border-border-subtle rounded-lg font-medium hover:bg-border-subtle transition-colors mt-4"
          >
            View PR on GitHub <ExternalLink size={16} />
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* PR Context Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden">
              <div className="bg-bg-base border-b border-border-subtle p-4 flex items-center gap-3">
                 <GitPullRequest size={20} className="text-accent-primary" />
                 <h3 className="font-semibold text-text-primary">{preview.title}</h3>
              </div>
              <div className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none text-text-primary">
                  <ReactMarkdown>{preview.description}</ReactMarkdown>
                </div>
              </div>
            </div>
            
            {/* Mock Diff Viewer */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden">
              <div className="bg-bg-base border-b border-border-subtle p-4 flex items-center gap-3">
                 <h3 className="font-semibold text-sm text-text-secondary">Changes (1 file)</h3>
              </div>
              <div className="p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-x-auto">
<pre>
{`--- a/src/payments/service.ts
+++ b/src/payments/service.ts
@@ -40,3 +40,7 @@
 export async function processPayment(id: string) {
-    return await api.post('/charge', { id });
+    return withRetry(async () => {
+        return await api.post('/charge', { id });
+    }, 3);
 }`}
</pre>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4">
               <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Branch Details</h3>
               <div className="flex items-center gap-2 text-sm text-text-primary">
                 <GitBranch size={16} className="text-text-secondary" />
                 <span className="font-mono bg-bg-base px-2 py-1 rounded border border-border-subtle">bugmind/fix-payment-retry</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-text-primary mt-2">
                 <span className="text-text-secondary">Target:</span>
                 <span className="font-mono bg-bg-base px-2 py-1 rounded border border-border-subtle">master</span>
               </div>
               
               <hr className="border-border-subtle my-2" />
               
               <button 
                 onClick={handleCreatePR}
                 disabled={submitting}
                 className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
               >
                 {submitting ? <Loader2 size={18} className="animate-spin" /> : <GitPullRequest size={18} />}
                 {submitting ? "Pushing Branch..." : "Create Pull Request"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
