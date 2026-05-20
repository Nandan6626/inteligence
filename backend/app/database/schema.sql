-- Create Tables for Enterprise AI Company Intelligence Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    summary TEXT,
    positioning TEXT,
    tam_sam_som TEXT,
    competitors JSONB,
    strategic_recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Scores Table
CREATE TABLE company_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    brand_score NUMERIC(5,2),
    innovation_score NUMERIC(5,2),
    financial_stability_score NUMERIC(5,2),
    risk_score NUMERIC(5,2),
    technology_score NUMERIC(5,2),
    culture_score NUMERIC(5,2),
    esg_score NUMERIC(5,2),
    market_strength_score NUMERIC(5,2),
    leadership_score NUMERIC(5,2),
    ai_maturity_score NUMERIC(5,2),
    confidence_score NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Validation Logs Table
CREATE TABLE validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    status VARCHAR(50),
    errors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Outputs (Raw)
CREATE TABLE ai_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    agent_name VARCHAR(100),
    raw_output JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Other domain-specific tables
CREATE TABLE financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    revenue NUMERIC(15,2),
    growth_rate NUMERIC(5,2),
    funding_total NUMERIC(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE employee_culture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    hiring_score NUMERIC(5,2),
    retention_rate NUMERIC(5,2),
    work_culture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE risk_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    financial_risk_level VARCHAR(50),
    operational_risk_level VARCHAR(50),
    market_risk_level VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
