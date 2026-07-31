import { Activity, Bug, Clock, GitMerge, TrendingDown, TrendingUp, Zap } from 'lucide-react';

export default async function DashboardPage() {
  // In a real app we'd fetch this from the backend
  // const res = await fetch('http://localhost:8000/api/v1/analytics/overview');
  // const data = await res.json();
  
  // Mocking the data directly for the Server Component prototype
  const data = {
    kpis: {
      total_bugs_caught: 1248,
      autonomous_fix_rate: 87.5,
      mttr_hours: 1.2,
      mttr_reduction_pct: 94.0
    },
    recent_activity: [
      { id: "1", type: "pr_merged", project: "api-gateway", description: "Merged fix for intermittent payment failures", timestamp: "2 hours ago" },
      { id: "2", type: "investigation_started", project: "frontend-web", description: "Started investigation: Layout shift on mobile checkout", timestamp: "5 hours ago" },
      { id: "3", type: "bug_detected", project: "auth-service", description: "Spike in 401 Unauthorized errors detected", timestamp: "1 day ago" }
    ]
  };

  const getIcon = (type: string) => {
    if (type === 'pr_merged') return <GitMerge size={16} className="text-accent-success" />;
    if (type === 'investigation_started') return <Activity size={16} className="text-accent-warning" />;
    return <Bug size={16} className="text-accent-danger" />;
  };

  return (
    <main className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-ui font-bold text-text-primary">Executive Dashboard</h1>
            <p className="text-text-secondary mt-1">Cross-project analytics and BugMind ROI metrics.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle rounded-lg px-4 py-2 text-sm font-medium text-text-secondary">
            Last 30 Days
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-secondary">Total Bugs Caught</h3>
              <Bug size={18} className="text-accent-primary" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{data.kpis.total_bugs_caught}</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-accent-success">
              <TrendingUp size={14} /> <span>+12% vs last month</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-secondary">Autonomous Fix Rate</h3>
              <Zap size={18} className="text-accent-warning" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{data.kpis.autonomous_fix_rate}%</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-accent-success">
              <TrendingUp size={14} /> <span>+4.2% vs last month</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-secondary">Mean Time To Resolution</h3>
              <Clock size={18} className="text-text-secondary" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{data.kpis.mttr_hours} <span className="text-xl text-text-secondary font-normal">hrs</span></div>
            <div className="flex items-center gap-1 mt-2 text-sm text-accent-success">
              <TrendingDown size={14} /> <span>-94% from 20 hrs</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-accent-success/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-success/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-accent-success">Est. Engineering Hours Saved</h3>
            </div>
            <div className="text-3xl font-bold text-text-primary relative z-10">23,400+</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-text-secondary relative z-10">
              Across 5 connected projects
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-bg-surface border border-border-subtle rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Resolution Volume (30 Days)</h3>
            
            {/* CSS-based Mock Chart */}
            <div className="h-64 flex items-end justify-between gap-1 mt-4">
              {Array.from({ length: 30 }).map((_, i) => {
                const height1 = 20 + Math.random() * 60; // Detected
                const height2 = height1 * (0.6 + Math.random() * 0.3); // Resolved
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                    <div className="w-full bg-accent-primary/20 rounded-t-sm" style={{ height: \`\${height1}%\` }}>
                       <div className="w-full bg-accent-primary rounded-t-sm absolute bottom-0" style={{ height: \`\${height2}%\` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-primary/20"></div> Bugs Detected</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-primary"></div> Resolved Autonomously</div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Global Activity Feed</h3>
            
            <div className="space-y-6">
              {data.recent_activity.map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center shrink-0">
                    {getIcon(activity.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{activity.description}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      <span className="font-mono bg-bg-base px-1.5 py-0.5 rounded border border-border-subtle">{activity.project}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-medium text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 rounded-lg transition-colors">
              View All Activity
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
