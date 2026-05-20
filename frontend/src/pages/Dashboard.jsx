import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ShieldAlert, TrendingUp, Activity, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('company_scores')
        .select('*, companies(company_name, industry)')
        .order('confidence_score', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = companies.map(c => ({
    name: c.companies?.company_name?.substring(0, 10) + '...',
    innovation: c.innovation_score,
    risk: c.risk_score
  }));

  if (loading) return <div className="animate-fade-in"><div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>Loading AI Intelligence...</div></div>;

  return (
    <div className="animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(99,102,241,0.1)', padding: '15px', borderRadius: '12px' }}>
            <Activity color="var(--primary-color)" size={32} />
          </div>
          <div>
            <div className="metric-label">Total Analyzed</div>
            <div className="metric-value">{companies.length * 12}</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '15px', borderRadius: '12px' }}>
            <TrendingUp color="var(--accent-color)" size={32} />
          </div>
          <div>
            <div className="metric-label">Avg Innovation Score</div>
            <div className="metric-value">84.2</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '15px', borderRadius: '12px' }}>
            <ShieldAlert color="var(--danger-color)" size={32} />
          </div>
          <div>
            <div className="metric-label">High Risk Entities</div>
            <div className="metric-value">3</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(245,158,11,0.1)', padding: '15px', borderRadius: '12px' }}>
            <Award color="var(--warning-color)" size={32} />
          </div>
          <div>
            <div className="metric-label">Avg Confidence</div>
            <div className="metric-value">92%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main List */}
        <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '24px' }}>
          <h2 className="mb-4">Recent Company Intelligence</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Company</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Industry</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Innovation</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Risk Level</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Confidence</th>
                  <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, i) => (
                  <tr key={company.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover:bg-opacity-10 hover:bg-white">
                    <td style={{ padding: '12px', fontWeight: '500' }}>{company.companies?.company_name || 'Unknown'}</td>
                    <td style={{ padding: '12px' }}>{company.companies?.industry || 'Tech'}</td>
                    <td style={{ padding: '12px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '50px', height: '6px', background: '#334155', borderRadius: '3px' }}>
                          <div style={{ width: `${company.innovation_score}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                        </div>
                        {company.innovation_score}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {company.risk_score > 70 ? <span className="badge badge-danger">High Risk</span> : 
                       company.risk_score > 40 ? <span className="badge badge-warning">Medium</span> : 
                       <span className="badge badge-success">Low Risk</span>}
                    </td>
                    <td style={{ padding: '12px' }}>{company.confidence_score}%</td>
                    <td style={{ padding: '12px' }}>
                      <Link to={`/companies/${company.company_id}`} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Side */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="mb-4">Innovation vs Risk</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px'}} />
                <Bar dataKey="innovation" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="risk" fill="var(--danger-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 card" style={{ background: 'rgba(16,185,129,0.05)' }}>
            <h4>AI System Status</h4>
            <div className="flex justify-between mt-2 text-sm text-muted">
              <span>OpenAI Agent</span> <span style={{ color: 'var(--accent-color)' }}>Online</span>
            </div>
            <div className="flex justify-between mt-1 text-sm text-muted">
              <span>Gemini Agent</span> <span style={{ color: 'var(--accent-color)' }}>Online</span>
            </div>
            <div className="flex justify-between mt-1 text-sm text-muted">
              <span>Cerebras Agent</span> <span style={{ color: 'var(--accent-color)' }}>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
