import ValidationResults from '../../../../components/ValidationResults';

export default function ValidationPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-ui font-bold mb-2">Sandbox Validation</h1>
        <p className="text-text-secondary">Reviewing build logs and regression test results for the proposed patch.</p>
      </div>
      
      <ValidationResults projectId={params.id} />
    </main>
  );
}
