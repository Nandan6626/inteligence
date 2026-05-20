import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompanyAnalysis from './pages/CompanyAnalysis';
import { Database, Upload, BarChart3, Search, Settings } from 'lucide-react';
import UploadModal from './components/UploadModal';

function App() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <Router>
      <div className="flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', backgroundColor: 'var(--surface-color)', padding: '20px', borderRight: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-4 mb-8">
            <div style={{ background: 'var(--primary-color)', padding: '8px', borderRadius: '8px' }}>
              <Database size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 0 }}>IntelAI</h2>
          </div>
          
          <nav className="flex flex-col gap-2" style={{ flexDirection: 'column' }}>
            <Link to="/" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--text-main)' }}>
              <BarChart3 size={18} style={{ marginRight: '10px' }} /> Dashboard
            </Link>
            <button onClick={() => setIsUploadOpen(true)} className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--text-main)' }}>
              <Upload size={18} style={{ marginRight: '10px' }} /> Upload Data
            </button>
            <Link to="/companies" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--text-main)' }}>
              <Search size={18} style={{ marginRight: '10px' }} /> Companies
            </Link>
            <Link to="/settings" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--text-main)' }}>
              <Settings size={18} style={{ marginRight: '10px' }} /> Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-gradient">Company Intelligence</h1>
              <p style={{ color: 'var(--text-muted)' }}>Multi-Agent AI Analysis Platform</p>
            </div>
            <div className="flex gap-4">
              <input type="text" placeholder="Search companies..." className="input-field" style={{ width: '300px' }} />
              <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>Analyze New</button>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies/:id" element={<CompanyAnalysis />} />
            <Route path="/companies" element={<Dashboard />} />
          </Routes>
        </main>

        {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
      </div>
    </Router>
  );
}

export default App;
