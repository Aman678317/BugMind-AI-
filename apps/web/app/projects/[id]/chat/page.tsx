import ChatInterface from '../../../../../components/ChatInterface';

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-ui font-bold">Investigation Chat</h1>
        <p className="text-text-secondary mt-1">Talk to your codebase. Ask questions, trace execution paths, or drop in a stack trace.</p>
      </div>
      
      <ChatInterface projectId={params.id} />
    </main>
  );
}
