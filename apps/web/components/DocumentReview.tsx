'use client';

import { useState, useEffect } from 'react';
import { Save, Check, FileText, FolderTree, Blocks, Edit3, Eye } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  doc_type: 'summary' | 'structure' | 'architecture';
  status: 'draft' | 'published' | 'outdated';
  last_updated: string;
}

interface DocumentReviewProps {
  projectId: string;
}

export default function DocumentReview({ projectId }: DocumentReviewProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/documents`);
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
          if (data.length > 0) {
            setActiveDocId(data[0].id);
            setEditedContent(data[0].content);
          }
        }
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocs();
  }, [projectId]);

  const activeDoc = documents.find(d => d.id === activeDocId);

  const handleTabSwitch = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setActiveDocId(docId);
      setEditedContent(doc.content);
      setEditMode(false);
    }
  };

  const handlePublish = async () => {
    if (!activeDoc) return;
    setIsPublishing(true);
    
    try {
      const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/documents/${activeDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent, status: 'published' })
      });
      
      if (res.ok) {
        // Update local state
        setDocuments(docs => docs.map(d => 
          d.id === activeDoc.id ? { ...d, content: editedContent, status: 'published' } : d
        ));
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to publish document", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'summary': return <FileText size={18} />;
      case 'structure': return <FolderTree size={18} />;
      case 'architecture': return <Blocks size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 flex gap-6 h-[80vh]">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-bg-surface border border-border-subtle rounded-xl p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2 px-2">Documents</h2>
        
        {documents.map(doc => (
          <button
            key={doc.id}
            onClick={() => handleTabSwitch(doc.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeDocId === doc.id 
                ? 'bg-accent-primary/10 text-accent-primary font-medium' 
                : 'text-text-primary hover:bg-bg-base'
            }`}
          >
            {getIconForType(doc.doc_type)}
            <span className="truncate flex-1">{doc.title}</span>
            {doc.status === 'draft' && (
              <span className="w-2 h-2 rounded-full bg-accent-warning"></span>
            )}
            {doc.status === 'published' && (
              <span className="w-2 h-2 rounded-full bg-accent-success"></span>
            )}
          </button>
        ))}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 bg-bg-surface border border-border-subtle rounded-xl flex flex-col overflow-hidden">
        {activeDoc ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-base">
              <div>
                <h1 className="text-xl font-semibold">{activeDoc.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                  <span className={`px-2 py-0.5 rounded capitalize ${
                    activeDoc.status === 'published' ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-warning/20 text-accent-warning'
                  }`}>
                    {activeDoc.status}
                  </span>
                  <span>Last updated: {new Date(activeDoc.last_updated).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-subtle hover:bg-bg-surface text-sm font-medium transition-colors"
                >
                  {editMode ? <><Eye size={16}/> Preview</> : <><Edit3 size={16}/> Edit</>}
                </button>
                
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing || (activeDoc.status === 'published' && editedContent === activeDoc.content)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-accent-primary text-white font-medium hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPublishing ? 'Publishing...' : <><Check size={16}/> Approve & Publish</>}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              {editMode ? (
                <textarea
                  className="w-full h-full p-6 bg-transparent resize-none outline-none font-mono text-sm text-text-primary leading-relaxed"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Write markdown here..."
                />
              ) : (
                <div className="w-full h-full p-6 overflow-y-auto prose prose-invert max-w-none">
                  {/* For Sprint 6, we're just rendering raw text in a PRE block since we didn't add a markdown renderer yet. In a real app we'd use react-markdown here */}
                  <pre className="whitespace-pre-wrap font-sans text-text-primary bg-transparent p-0 m-0 border-none">{editedContent}</pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>Select a document to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
