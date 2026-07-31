import DocumentReview from '../../../../../components/DocumentReview';

export default function DocumentReviewPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-ui font-bold">Architecture Overview</h1>
        <p className="text-text-secondary mt-2">Review and approve the AI-generated documentation drafts to establish your project baseline.</p>
      </div>
      
      <DocumentReview projectId={params.id} />
    </main>
  );
}
