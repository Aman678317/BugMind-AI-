import PatchPlanProposal from '../../../../components/PatchPlanProposal';

export default function PatchPlanPage({ params, searchParams }: { params: { id: string }, searchParams: { investigationId?: string } }) {
  const invId = searchParams.investigationId || "demo-inv-id";
  
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-ui font-bold mb-2">Code Strategy Review</h1>
        <p className="text-text-secondary">BugMind requires your approval on its strategy before it begins writing code.</p>
      </div>
      
      <PatchPlanProposal projectId={params.id} investigationId={invId} />
    </main>
  );
}
