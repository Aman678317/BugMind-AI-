'use client';

import { useState } from 'react';
import { Github, Folder, Upload, Database, Lock } from 'lucide-react';

type ConnectionType = 'oauth_github' | 'zip_upload' | 'local_sync';
type DataBoundary = 'hosted' | 'self_hosted';

export default function RepositoryConnection() {
  const [connectionType, setConnectionType] = useState<ConnectionType>('oauth_github');
  const [dataBoundary, setDataBoundary] = useState<DataBoundary>('hosted');
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    setStatus('loading');
    try {
      // 1. Create project
      const orgId = "00000000-0000-0000-0000-000000000001"; // Stubbed org ID
      
      const createRes = await fetch('http://localhost:8000/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repoUrl || 'My Repository',
          org_id: orgId,
          repo_connection_type: connectionType,
          repo_url: repoUrl,
        })
      });
      
      if (!createRes.ok) throw new Error('Failed to create project');
      const project = await createRes.json();

      // 2. Trigger connection/ingestion
      const connectRes = await fetch(`http://localhost:8000/api/v1/projects/${project.id}/connect`, {
        method: 'POST'
      });

      if (!connectRes.ok) throw new Error('Failed to start ingestion');
      
      setStatus('success');
      setMessage('Repository connected! Ingestion queued.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-bg-surface border border-border-subtle rounded-xl shadow-lg">
      <h1 className="text-2xl font-ui font-semibold mb-6">Connect Repository</h1>
      
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">1. Connection Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setConnectionType('oauth_github')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-colors ${connectionType === 'oauth_github' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-secondary hover:border-text-primary'}`}
          >
            <Github size={24} />
            <span className="font-medium">GitHub OAuth</span>
          </button>

          <button 
            onClick={() => setConnectionType('zip_upload')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-colors ${connectionType === 'zip_upload' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-secondary hover:border-text-primary'}`}
          >
            <Upload size={24} />
            <span className="font-medium">ZIP Upload</span>
          </button>

          <button 
            onClick={() => setConnectionType('local_sync')}
            className={`p-4 rounded-lg border flex flex-col items-center gap-3 transition-colors ${connectionType === 'local_sync' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-border-subtle text-text-secondary hover:border-text-primary'}`}
          >
            <Folder size={24} />
            <span className="font-medium">Local Sync</span>
          </button>
        </div>
      </div>

      {connectionType === 'oauth_github' && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Repository URL</h2>
          <input 
            type="text" 
            placeholder="e.g. organization/repository"
            className="w-full bg-bg-base border border-border-subtle rounded-md p-3 text-text-primary focus:outline-none focus:border-accent-primary"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
          />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">2. Data Boundary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setDataBoundary('hosted')}
            className={`p-4 rounded-lg border flex items-center gap-4 transition-colors text-left ${dataBoundary === 'hosted' ? 'border-accent-primary bg-accent-primary/10' : 'border-border-subtle hover:border-text-primary'}`}
          >
            <Database size={24} className={dataBoundary === 'hosted' ? 'text-accent-primary' : 'text-text-secondary'} />
            <div>
              <div className="font-medium mb-1">Hosted LLM (Default)</div>
              <div className="text-sm text-text-secondary">Fastest to start. Code is securely sent to BugMind's hosted models.</div>
            </div>
          </button>

          <button 
            onClick={() => setDataBoundary('self_hosted')}
            className={`p-4 rounded-lg border flex items-center gap-4 transition-colors text-left ${dataBoundary === 'self_hosted' ? 'border-accent-primary bg-accent-primary/10' : 'border-border-subtle hover:border-text-primary'}`}
          >
            <Lock size={24} className={dataBoundary === 'self_hosted' ? 'text-accent-primary' : 'text-text-secondary'} />
            <div>
              <div className="font-medium mb-1">Self-Hosted / BYO-LLM</div>
              <div className="text-sm text-text-secondary">Enterprise. Data never leaves your VPC. Requires setup.</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-subtle">
        <div className="text-sm">
          {status === 'error' && <span className="text-accent-danger">{message}</span>}
          {status === 'success' && <span className="text-accent-success">{message}</span>}
        </div>
        <button 
          onClick={handleConnect}
          disabled={status === 'loading'}
          className="bg-accent-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Connecting...' : 'Start Ingestion'}
        </button>
      </div>
    </div>
  );
}
