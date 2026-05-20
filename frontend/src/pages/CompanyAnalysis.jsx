import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const CompanyAnalysis = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      // In a real app, this would be an API call to the backend that aggregates everything
      const companyRes = await supabase.from('companies').select('*').eq('id', id).single();
      const scoresRes = await supabase.from('company_scores').select('*').eq('company_id', id).single();
      
      setData({
        company: companyRes.data,
        scores: scoresRes.data
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-fade-in"><div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>Loading Deep Analysis...</div></div>;
  if (!data || !data.company) return <div>Company not found</div>;

  const { company, scores } = data;
  
  const radarData = [
    { subject: 'Innovation', A: scores?.innovation_score || 0, fullMark: 100 },
    { subject: 'Financial Stability', A: scores?.financial_stability_score || 0, fullMark: 100 },
    { subject: 'Market Strength', A: scores?.market_strength_score || 0, fullMark: 100 },
    { subject: 'Leadership', A: scores?.leadership_score || 0, fullMark: 100 },
    { subject: 'Culture', A: scores?.culture_score || 0, fullMark: 100 },
    { subject: 'Tech Maturity', A: scores?.technology_score || 0, fullMark: 100 },
  ];

  return (
    <div className="animate-fade-in">
      <Link to="/" className="btn btn-outline mb-4" style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>
      
      <div className="glass-panel mb-8" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck color="var(--accent-color)" />
            <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>AI Confidence: {scores?.confidence_score}%</span>
          </div>
        </div>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{company.company_name}</h1>
        <div className="badge badge-warning mb-4" style={{ display: 'inline-block' }}>{company.industry}</div>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: '1.8' }}>
          {company.summary || 'Comprehensive AI-generated company profile based on multi-agent consensus.'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="grid grid-cols-1 gap-4" style={{ gridColumn: 'span 2' }}>
          {/* Detailed analysis cards */}
          <div className="card">
            <h3 className="flex items-center gap-2 mb-4"><CheckCircle2 color="var(--accent-color)" /> Strategic Positioning</h3>
            <p>{company.positioning || 'Analysis pending...'}</p>
          </div>
          
          <div className="card">
            <h3 className="flex items-center gap-2 mb-4"><AlertTriangle color="var(--warning-color)" /> TAM / SAM / SOM Analysis</h3>
            <p>{company.tam_sam_som || 'Analysis pending...'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="card" style={{ background: 'rgba(239,68,68,0.05)' }}>
              <h4 style={{ color: 'var(--danger-color)' }}>Key Risks</h4>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>High market volatility exposure</li>
                <li>Dependence on single supplier</li>
              </ul>
            </div>
            <div className="card" style={{ background: 'rgba(16,185,129,0.05)' }}>
              <h4 style={{ color: 'var(--accent-color)' }}>Key Strengths</h4>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>Strong intellectual property portfolio</li>
                <li>High employee retention rate</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="mb-4">AI Score Profile</h3>
            <div style={{ height: '300px', margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Company" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="card">
            <h4>Competitor Landscape</h4>
            <div className="flex flex-col gap-2 mt-4">
              {(company.competitors || ['Competitor A', 'Competitor B']).map((comp, idx) => (
                <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {comp}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalysis;
