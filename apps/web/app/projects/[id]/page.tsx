import { Activity, BookOpen, MessageSquareText, BrainCircuit, Github, Clock } from 'lucide-react';
import FeatureCard from '../../../../components/FeatureCard';

export default function ProjectDashboard({ params }: { params: { id: string } }) {
  // Mock data for Sprint 11
  const project = {
    name: "acme-corp/payment-gateway",
    status: "Connected",
    lastSync: "2 hours ago"
  };

  const recentActivity = [
    { type: 'investigation', title: 'Payment timeout issue', time: '1 hour ago', status: 'Completed' },
    { type: 'chat', title: 'Asked about retry mechanism', time: '3 hours ago', status: 'Session saved' },
    { type: 'doc', title: 'Architecture Summary', time: '1 day ago', status: 'Published' }
  ];

  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold font-ui flex items-center gap-2">
              <Github size={24} className="text-text-secondary" />
              {project.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-success"></span>
                {project.status}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Synced {project.lastSync}
              </span>
            </div>
          </div>
          <div>
            <button className="px-4 py-2 bg-bg-base border border-border-subtle rounded-lg text-sm font-medium hover:bg-border-subtle transition-colors">
              Trigger Sync
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            href={`/projects/${params.id}/docs`}
            title="Architecture Docs"
            description="Review and publish AI-generated documentation covering the executive summary, folder structure, and component architecture."
            icon={<BookOpen size={24} />}
          />
          <FeatureCard 
            href={`/projects/${params.id}/chat`}
            title="Codebase Chat"
            description="Ask questions about the repository. BugMind uses semantic search to fetch relevant code and explain how things work."
            icon={<MessageSquareText size={24} />}
          />
          <FeatureCard 
            href={`/projects/${params.id}/investigate`}
            title="Autonomous Investigation"
            description="Provide a bug description or stack trace and watch the AI autonomously track down the root cause."
            icon={<BrainCircuit size={24} />}
          />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-accent-primary" />
            Recent Activity
          </h2>
          <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            {recentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-4 ${
                  idx !== recentActivity.length - 1 ? 'border-b border-border-subtle' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-text-secondary">
                    {activity.type === 'investigation' && <BrainCircuit size={18} />}
                    {activity.type === 'chat' && <MessageSquareText size={18} />}
                    {activity.type === 'doc' && <BookOpen size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-text-secondary">{activity.time}</p>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 bg-bg-base border border-border-subtle rounded text-xs text-text-secondary">
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
