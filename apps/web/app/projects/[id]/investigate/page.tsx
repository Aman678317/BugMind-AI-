import InvestigationView from '../../../../../components/InvestigationView';

export default function InvestigatePage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-ui font-bold mb-3">Autonomous Debugging</h1>
        <p className="text-text-secondary">Describe the issue and watch BugMind trace the execution paths to find the root cause.</p>
      </div>
      
      <InvestigationView projectId={params.id} />
    </main>
  );
}
