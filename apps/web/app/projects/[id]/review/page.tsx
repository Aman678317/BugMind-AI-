import PullRequestReview from '../../../../components/PullRequestReview';

export default function ReviewPage({ params, searchParams }: { params: { id: string }, searchParams: { runId?: string } }) {
  const runId = searchParams.runId || "demo-run-id";
  
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-ui font-bold mb-2">Final Verification</h1>
        <p className="text-text-secondary">The code has passed all sandbox tests. Review the final diff and PR context before opening.</p>
      </div>
      
      <PullRequestReview projectId={params.id} validationRunId={runId} />
    </main>
  );
}
