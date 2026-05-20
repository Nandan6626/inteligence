import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, CheckCircle, Cpu, Search, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'
  
  // Single Company State
  const [companyName, setCompanyName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [runId, setRunId] = useState(null);
  const [runStatus, setRunStatus] = useState(null);
  const [completedCompanyId, setCompletedCompanyId] = useState(null);
  
  // Bulk CSV State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const pollingIntervalRef = useRef(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleSingleAnalysis = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setAnalyzing(true);
    setRunStatus({
      status: 'queued',
      stage: 'initializing',
      progress: 5
    });

    try {
      const response = await axios.post('http://localhost:8000/api/v1/agent/generate', {
        company_name: companyName.trim()
      });
      const { run_id } = response.data;
      setRunId(run_id);
      startPolling(run_id);
    } catch (err) {
      console.error(err);
      alert('Failed to start analysis pipeline');
      setAnalyzing(false);
    }
  };

  const startPolling = (id) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/agent/status/${id}`);
        const data = response.data;
        setRunStatus(data);
        
        if (data.status === 'completed') {
          clearInterval(pollingIntervalRef.current);
          setCompletedCompanyId(data.result_preview?.company_id || 'new');
        } else if (data.status === 'failed') {
          clearInterval(pollingIntervalRef.current);
          alert(`Analysis failed: ${data.error || 'Unknown error'}`);
          setAnalyzing(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await axios.post('http://localhost:8000/api/v1/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBulkSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStageLabel = (stage) => {
    switch (stage) {
      case 'initializing': return 'Queuing research tasks...';
      case 'entry': return 'Auto-discovering company details & website...';
      case 'groq_generate': return 'OpenAI/Groq LLM agent gathering data...';
      case 'groq_validate': return 'Groq agent validating constraints...';
      case 'gemini_generate': return 'Google Gemini LLM agent extracting parameters...';
      case 'gemini_validate': return 'Gemini agent running validation...';
      case 'cerebras_generate': return 'Cerebras LLM agent cross-referencing...';
      case 'cerebras_validate': return 'Cerebras agent checking validation...';
      case 'consolidate': return 'Consolidating consensus findings & scores...';
      case 'excel': return 'Saving 163-parameter profile to database...';
      case 'completed': return 'Research complete!';
      default: return 'Running multi-agent analysis...';
    }
  };

  const isAgentActive = (agentName) => {
    if (!runStatus) return false;
    const stage = runStatus.stage;
    if (stage === 'completed') return false;
    if (stage === 'consolidate' || stage === 'excel') return false;
    
    if (agentName === 'groq' && (stage.includes('groq') || stage === 'entry')) return true;
    if (agentName === 'gemini' && (stage.includes('gemini') || stage === 'entry')) return true;
    if (agentName === 'cerebras' && (stage.includes('cerebras') || stage === 'entry')) return true;
    return false;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '550px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        {!analyzing && !bulkSuccess ? (
          <>
            <h2 className="mb-4 text-gradient">Analyze New Entity</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Select an option below to begin multi-agent corporate intelligence analysis.</p>
            
            {/* Elegant Tab System */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '25px' }}>
              <button 
                onClick={() => setActiveTab('single')} 
                style={{
                  flex: 1, padding: '12px', background: 'transparent', border: 'none', 
                  color: activeTab === 'single' ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: '600', borderBottom: activeTab === 'single' ? '2px solid var(--primary-color)' : 'none',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Single Company
              </button>
              <button 
                onClick={() => setActiveTab('bulk')} 
                style={{
                  flex: 1, padding: '12px', background: 'transparent', border: 'none', 
                  color: activeTab === 'bulk' ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: '600', borderBottom: activeTab === 'bulk' ? '2px solid var(--primary-color)' : 'none',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Bulk Dataset CSV
              </button>
            </div>

            {activeTab === 'single' ? (
              <form onSubmit={handleSingleAnalysis}>
                <div className="input-group" style={{ marginBottom: '25px' }}>
                  <label className="input-label">Company Name</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input 
                      type="text" 
                      placeholder="Enter company name (e.g. OpenAI, SpaceX, Blinkit)" 
                      className="input-field" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={{ width: '100%', paddingLeft: '40px' }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    💡 Just enter the company name. The multi-agent pipeline will automatically discover its industry, official website, and strategic details to perform the research.
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="badge badge-success">Auto-Discovery Enabled</span>
                  <button type="submit" className="btn btn-primary" disabled={!companyName.trim()}>
                    Start AI Analysis
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div 
                  style={{ 
                    border: '2px dashed var(--primary-color)', borderRadius: '12px', padding: '40px', 
                    textAlign: 'center', backgroundColor: 'rgba(99,102,241,0.05)', cursor: 'pointer', marginBottom: '20px'
                  }}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <UploadCloud size={48} color="var(--primary-color)" style={{ margin: '0 auto 10px' }} />
                  <p>{file ? file.name : "Click to browse or drag and drop CSV file here"}</p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".csv" 
                    style={{ display: 'none' }} 
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="badge badge-warning">Parallel Ingestion Queue</span>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpload}
                    disabled={!file || uploading}
                  >
                    {uploading ? 'Processing...' : 'Run Analysis Pipeline'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : analyzing ? (
          /* Live Progress Visualizer */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <h3 className="mb-2">Analyzing {companyName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px' }}>
              {runStatus ? getStageLabel(runStatus.stage) : 'Initializing multi-agent pipeline...'}
            </p>

            {/* Glowing progress ring/spinner */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', position: 'relative' }}>
              {runStatus && runStatus.status === 'completed' ? (
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-color)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.4)', animation: 'fadeIn 0.5s ease'
                }}>
                  <ShieldCheck size={48} color="var(--accent-color)" />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <Loader2 size={80} color="var(--primary-color)" className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
                  <Cpu size={32} color="var(--secondary-color)" style={{ position: 'absolute', left: '24px', top: '24px' }} />
                </div>
              )}
            </div>

            {/* Agent Parallel Status Blocks */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              <div style={{
                flex: 1, padding: '12px', background: isAgentActive('groq') ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isAgentActive('groq') ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: '8px', opacity: (runStatus && runStatus.status === 'completed') ? 1 : (isAgentActive('groq') ? 1 : 0.4),
                transition: 'all 0.3s'
              }}>
                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: isAgentActive('groq') ? 'var(--primary-color)' : '#94a3b8' }}>OpenAI Agent</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  {runStatus && runStatus.status === 'completed' ? '✅ Complete' : (isAgentActive('groq') ? '⚡ Researching' : 'Idle')}
                </div>
              </div>
              <div style={{
                flex: 1, padding: '12px', background: isAgentActive('gemini') ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isAgentActive('gemini') ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: '8px', opacity: (runStatus && runStatus.status === 'completed') ? 1 : (isAgentActive('gemini') ? 1 : 0.4),
                transition: 'all 0.3s'
              }}>
                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: isAgentActive('gemini') ? 'var(--primary-color)' : '#94a3b8' }}>Gemini Agent</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  {runStatus && runStatus.status === 'completed' ? '✅ Complete' : (isAgentActive('gemini') ? '⚡ Analyzing' : 'Idle')}
                </div>
              </div>
              <div style={{
                flex: 1, padding: '12px', background: isAgentActive('cerebras') ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isAgentActive('cerebras') ? 'var(--primary-color)' : 'var(--border-color)'}`,
                borderRadius: '8px', opacity: (runStatus && runStatus.status === 'completed') ? 1 : (isAgentActive('cerebras') ? 1 : 0.4),
                transition: 'all 0.3s'
              }}>
                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: isAgentActive('cerebras') ? 'var(--primary-color)' : '#94a3b8' }}>Cerebras Agent</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  {runStatus && runStatus.status === 'completed' ? '✅ Complete' : (isAgentActive('cerebras') ? '⚡ Cross-ref' : 'Idle')}
                </div>
              </div>
            </div>

            {/* Glowing progress bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '25px' }}>
              <div style={{
                width: `${runStatus ? runStatus.progress : 10}%`, height: '100%',
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                borderRadius: '4px', transition: 'width 0.4s ease',
                boxShadow: '0 0 10px rgba(99,102,241,0.5)'
              }}></div>
            </div>

            {/* Action buttons */}
            {runStatus && runStatus.status === 'completed' ? (
              <div className="flex gap-4 justify-between">
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1 }} 
                  onClick={() => {
                    setAnalyzing(false);
                    setCompanyName('');
                    setRunStatus(null);
                    setCompletedCompanyId(null);
                  }}
                >
                  Analyze Another
                </button>
                <button 
                  className="btn btn-primary animate-fade-in" 
                  style={{ flex: 1.5 }}
                  onClick={() => {
                    onClose();
                    navigate(`/companies/${completedCompanyId}`);
                  }}
                >
                  View Deep Insights
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Please keep this window open while the agents compile the 163-parameter golden profile.
              </div>
            )}
          </div>
        ) : (
          /* Bulk Success Screen */
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircle size={64} color="var(--accent-color)" style={{ margin: '0 auto 20px', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.3))' }} />
            <h3>Upload Successful</h3>
            <p style={{ color: 'var(--text-muted)' }}>Agents are now processing the bulk dataset in parallel. Keep an eye on the Dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
