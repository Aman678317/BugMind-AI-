import IngestionProgress from '../../../../../components/IngestionProgress';

export default function IngestionPage({ params }: { params: { id: string, jobId: string } }) {
  return (
    <main className="min-h-screen p-8">
      <IngestionProgress projectId={params.id} jobId={params.jobId} />
    </main>
  );
}
