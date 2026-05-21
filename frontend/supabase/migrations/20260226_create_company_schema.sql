-- Placement Compass Database Schema
-- Complete schema with all tables and sample data

-- Drop existing tables (in correct order due to foreign key dependencies)
DROP TABLE IF EXISTS public.skill_proficiency_mapping CASCADE;
DROP TABLE IF EXISTS public.skill_area_level CASCADE;
DROP TABLE IF EXISTS public.skill_proficiency CASCADE;
DROP TABLE IF EXISTS public.skill_area CASCADE;
DROP TABLE IF EXISTS public.company_skill_rating CASCADE;
DROP TABLE IF EXISTS public.company_technologies CASCADE;
DROP TABLE IF EXISTS public.company_talent_growth CASCADE;
DROP TABLE IF EXISTS public.company_people CASCADE;
DROP TABLE IF EXISTS public.company_logistics CASCADE;
DROP TABLE IF EXISTS public.company_financials CASCADE;
DROP TABLE IF EXISTS public.company_culture CASCADE;
DROP TABLE IF EXISTS public.company_compensation CASCADE;
DROP TABLE IF EXISTS public.company_business CASCADE;
DROP TABLE IF EXISTS public.company_brand_reputation CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS public.skill_area_skill_area_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.skill_area_level_skill_area_level_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.skill_proficiency_skill_proficiency_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.skill_proficiency_mapping_skill_proficiency_mapping_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.company_skill_rating_company_skill_rating_id_seq CASCADE;

-- Create sequences for auto-increment columns
CREATE SEQUENCE public.skill_area_skill_area_id_seq;
CREATE SEQUENCE public.skill_area_level_skill_area_level_id_seq;
CREATE SEQUENCE public.skill_proficiency_skill_proficiency_id_seq;
CREATE SEQUENCE public.skill_proficiency_mapping_skill_proficiency_mapping_id_seq;
CREATE SEQUENCE public.company_skill_rating_company_skill_rating_id_seq;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Companies table (main table)
CREATE TABLE public.companies (
  company_id integer NOT NULL,
  name text,
  short_name text,
  logo_url text,
  category text,
  incorporation_year text,
  overview_text text,
  nature_of_company text,
  headquarters_address text,
  operating_countries text,
  office_count text,
  office_locations text,
  employee_size text,
  vision_statement text,
  mission_statement text,
  core_values text,
  history_timeline text,
  recent_news text,
  website_url text,
  linkedin_url text,
  twitter_handle text,
  facebook_url text,
  instagram_url text,
  primary_contact_email text,
  primary_phone_number text,
  regulatory_status text,
  legal_issues text,
  esg_ratings text,
  supply_chain_dependencies text,
  geopolitical_risks text,
  macro_risks text,
  carbon_footprint text,
  ethical_sourcing text,
  marketing_video_url text,
  customer_testimonials text,
  CONSTRAINT companies_pkey PRIMARY KEY (company_id)
);

-- Company Brand Reputation
CREATE TABLE public.company_brand_reputation (
  company_id integer,
  website_quality text,
  website_rating text,
  website_traffic_rank text,
  social_media_followers text,
  glassdoor_rating text,
  indeed_rating text,
  google_rating text,
  awards_recognitions text,
  brand_sentiment_score text,
  event_participation text,
  CONSTRAINT company_brand_reputation_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Business
CREATE TABLE public.company_business (
  company_id integer,
  pain_points_addressed text,
  focus_sectors text,
  offerings_description text,
  top_customers text,
  core_value_proposition text,
  unique_differentiators text,
  competitive_advantages text,
  weaknesses_gaps text,
  key_challenges_needs text,
  key_competitors text,
  market_share_percentage text,
  sales_motion text,
  customer_concentration_risk text,
  exit_strategy_history text,
  benchmark_vs_peers text,
  future_projections text,
  strategic_priorities text,
  industry_associations text,
  case_studies text,
  go_to_market_strategy text,
  innovation_roadmap text,
  product_pipeline text,
  tam text,
  sam text,
  som text,
  CONSTRAINT company_business_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Compensation
CREATE TABLE public.company_compensation (
  company_id integer,
  leave_policy text,
  health_support text,
  fixed_vs_variable_pay text,
  bonus_predictability text,
  esops_incentives text,
  family_health_insurance text,
  relocation_support text,
  lifestyle_benefits text,
  CONSTRAINT company_compensation_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Culture
CREATE TABLE public.company_culture (
  company_id integer,
  hiring_velocity text,
  employee_turnover text,
  avg_retention_tenure text,
  diversity_metrics text,
  work_culture_summary text,
  manager_quality text,
  psychological_safety text,
  feedback_culture text,
  diversity_inclusion_score text,
  ethical_standards text,
  burnout_risk text,
  layoff_history text,
  mission_clarity text,
  sustainability_csr text,
  crisis_behavior text,
  CONSTRAINT company_culture_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Financials
CREATE TABLE public.company_financials (
  company_id integer,
  annual_revenue text,
  annual_profit text,
  revenue_mix text,
  valuation text,
  yoy_growth_rate text,
  profitability_status text,
  key_investors text,
  recent_funding_rounds text,
  total_capital_raised text,
  customer_acquisition_cost text,
  customer_lifetime_value text,
  cac_ltv_ratio text,
  churn_rate text,
  net_promoter_score text,
  burn_rate text,
  runway_months text,
  burn_multiplier text,
  CONSTRAINT company_financials_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Logistics
CREATE TABLE public.company_logistics (
  company_id integer,
  remote_policy_details text,
  typical_hours text,
  overtime_expectations text,
  weekend_work text,
  flexibility_level text,
  location_centrality text,
  public_transport_access text,
  cab_policy text,
  airport_commute_time text,
  office_zone_type text,
  area_safety text,
  safety_policies text,
  infrastructure_safety text,
  emergency_preparedness text,
  CONSTRAINT company_logistics_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company People
CREATE TABLE public.company_people (
  company_id integer,
  ceo_name text,
  ceo_linkedin_url text,
  key_leaders text,
  warm_intro_pathways text,
  decision_maker_access text,
  contact_person_name text,
  contact_person_title text,
  contact_person_email text,
  contact_person_phone text,
  board_members text,
  CONSTRAINT company_people_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Talent Growth
CREATE TABLE public.company_talent_growth (
  company_id integer,
  training_spend text,
  onboarding_quality text,
  learning_culture text,
  exposure_quality text,
  mentorship_availability text,
  internal_mobility text,
  promotion_clarity text,
  tools_access text,
  role_clarity text,
  early_ownership text,
  work_impact text,
  execution_thinking_balance text,
  automation_level text,
  cross_functional_exposure text,
  company_maturity text,
  brand_value text,
  client_quality text,
  exit_opportunities text,
  skill_relevance text,
  external_recognition text,
  network_strength text,
  global_exposure text,
  CONSTRAINT company_talent_growth_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Technologies
CREATE TABLE public.company_technologies (
  company_id integer,
  technology_partners text,
  intellectual_property text,
  r_and_d_investment text,
  ai_ml_adoption_level text,
  tech_stack text,
  cybersecurity_posture text,
  partnership_ecosystem text,
  tech_adoption_rating text,
  CONSTRAINT company_technologies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- Company Skill Rating
CREATE TABLE public.company_skill_rating (
  company_skill_rating_id integer NOT NULL DEFAULT nextval('company_skill_rating_company_skill_rating_id_seq'::regclass),
  company_id integer NOT NULL UNIQUE,
  coding text,
  data_structures_and_algorithms text,
  object_oriented_programming_and_design text,
  aptitude_and_problem_solving text,
  communication_skills text,
  ai_native_engineering text,
  devops_and_cloud text,
  sql_and_design text,
  software_engineering text,
  system_design_and_architecture text,
  computer_networking text,
  operating_system text,
  CONSTRAINT company_skill_rating_pkey PRIMARY KEY (company_skill_rating_id),
  CONSTRAINT company_skill_rating_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE
);

-- ============================================================================
-- SKILL SYSTEM TABLES
-- ============================================================================

-- Skill Area (e.g., Coding, DSA, System Design)
CREATE TABLE public.skill_area (
  skill_area_id integer NOT NULL DEFAULT nextval('skill_area_skill_area_id_seq'::regclass),
  skill_area_name text NOT NULL UNIQUE,
  CONSTRAINT skill_area_pkey PRIMARY KEY (skill_area_id)
);

-- Skill Area Level (Topics for each level 1-10 within a skill area)
CREATE TABLE public.skill_area_level (
  skill_area_level_id integer NOT NULL DEFAULT nextval('skill_area_level_skill_area_level_id_seq'::regclass),
  skill_area_id integer NOT NULL,
  level_number smallint NOT NULL CHECK (level_number >= 1 AND level_number <= 10),
  topics text NOT NULL,
  CONSTRAINT skill_area_level_pkey PRIMARY KEY (skill_area_level_id),
  CONSTRAINT skill_area_level_skill_area_id_fkey FOREIGN KEY (skill_area_id) REFERENCES public.skill_area(skill_area_id) ON DELETE CASCADE,
  CONSTRAINT skill_area_level_unique UNIQUE (skill_area_id, level_number)
);

-- Skill Proficiency (CU, AP, AS, EV, CR proficiency codes)
CREATE TABLE public.skill_proficiency (
  skill_proficiency_id integer NOT NULL DEFAULT nextval('skill_proficiency_skill_proficiency_id_seq'::regclass),
  proficiency_level smallint NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
  proficiency_code text NOT NULL CHECK (proficiency_code IN ('CU', 'AP', 'AS', 'EV', 'CR')),
  multiplier numeric DEFAULT 1.0,
  CONSTRAINT skill_proficiency_pkey PRIMARY KEY (skill_proficiency_id),
  CONSTRAINT skill_proficiency_unique UNIQUE (proficiency_level, proficiency_code)
);

-- Skill Proficiency Mapping (Links skill area levels to proficiency requirements)
CREATE TABLE public.skill_proficiency_mapping (
  skill_proficiency_mapping_id integer NOT NULL DEFAULT nextval('skill_proficiency_mapping_skill_proficiency_mapping_id_seq'::regclass),
  skill_area_level_id integer NOT NULL,
  skill_proficiency_id integer NOT NULL,
  CONSTRAINT skill_proficiency_mapping_pkey PRIMARY KEY (skill_proficiency_mapping_id),
  CONSTRAINT skill_proficiency_mapping_skill_area_level_id_fkey FOREIGN KEY (skill_area_level_id) REFERENCES public.skill_area_level(skill_area_level_id) ON DELETE CASCADE,
  CONSTRAINT skill_proficiency_mapping_skill_proficiency_id_fkey FOREIGN KEY (skill_proficiency_id) REFERENCES public.skill_proficiency(skill_proficiency_id) ON DELETE CASCADE,
  CONSTRAINT skill_proficiency_mapping_unique UNIQUE (skill_area_level_id, skill_proficiency_id)
);

-- ============================================================================
-- DATA POPULATION
-- ============================================================================

-- Insert Sample Companies
INSERT INTO public.companies (company_id, name, short_name, logo_url, category, incorporation_year, overview_text, nature_of_company, headquarters_address, operating_countries, office_count, office_locations, employee_size, vision_statement, mission_statement, core_values, history_timeline, recent_news, website_url, linkedin_url, twitter_handle, facebook_url, instagram_url, primary_contact_email, primary_phone_number, regulatory_status, legal_issues, esg_ratings, supply_chain_dependencies, geopolitical_risks, macro_risks, carbon_footprint, ethical_sourcing, marketing_video_url, customer_testimonials) VALUES
(1, 'TechCorp Solutions', 'TechCorp', 'https://example.com/logos/techcorp.png', 'Technology', '2015', 'Leading provider of enterprise software solutions with focus on AI and cloud technologies', 'Private Limited', 'Bangalore, Karnataka, India', 'India, USA, Singapore', '12', 'Bangalore, Mumbai, Delhi, Pune, Hyderabad, San Francisco', '5000-10000', 'To revolutionize enterprise technology through AI-driven solutions', 'Empowering businesses with cutting-edge technology to drive digital transformation', 'Innovation, Integrity, Customer Success, Collaboration', '2015: Founded | 2018: Series B | 2021: Unicorn Status | 2024: Global Expansion', 'Secured $200M Series D funding | Launched AI Platform 2.0 | Expanded to 5 new countries', 'https://techcorp.example.com', 'https://linkedin.com/company/techcorp', '@techcorp', 'https://facebook.com/techcorp', 'https://instagram.com/techcorp', 'careers@techcorp.example.com', '+91-80-12345678', 'Compliant', 'None', 'A+ ESG Rating', 'Cloud vendors: AWS, Azure, GCP', 'Low', 'Moderate inflation impact', '50,000 tons CO2/year', 'Ethical sourcing policy in place', 'https://youtube.com/techcorp-intro', '4.5/5 average customer rating'),
(2, 'DataFlow Analytics', 'DataFlow', 'https://example.com/logos/dataflow.png', 'Data & Analytics', '2018', 'Specialized data analytics platform for business intelligence and predictive analytics', 'Private Limited', 'Pune, Maharashtra, India', 'India, UAE', '5', 'Pune, Bangalore, Mumbai, Hyderabad, Dubai', '1000-2000', 'To make data-driven decisions accessible to every organization', 'Building the most intuitive data analytics platform for businesses of all sizes', 'Data Excellence, Transparency, Speed, Customer-Centricity', '2018: Founded | 2020: Series A | 2023: Expanded to Middle East', 'Launched real-time analytics engine | Partnership with major cloud providers', 'https://dataflow.example.com', 'https://linkedin.com/company/dataflow', '@dataflow', 'https://facebook.com/dataflow', 'https://instagram.com/dataflow', 'careers@dataflow.example.com', '+91-20-87654321', 'Compliant', 'None', 'B+ ESG Rating', 'Data centers: AWS, Azure', 'Low', 'Currency fluctuation risks', '15,000 tons CO2/year', 'Green data centers initiative', 'https://youtube.com/dataflow-demo', '4.3/5 customer satisfaction'),
(3, 'CloudNine Systems', 'CloudNine', 'https://example.com/logos/cloudnine.png', 'Cloud Infrastructure', '2016', 'Cloud infrastructure and DevOps automation platform for modern applications', 'Private Limited', 'Hyderabad, Telangana, India', 'India, USA, UK', '8', 'Hyderabad, Bangalore, Chennai, Noida, Austin, London', '3000-5000', 'To simplify cloud infrastructure for every developer', 'Democratizing cloud technology through automation and intelligent tooling', 'Simplicity, Reliability, Innovation, Open Source', '2016: Founded | 2019: Series A | 2022: Series C | 2025: IPO Prep', 'Acquired DevOps startup | Released Kubernetes management platform', 'https://cloudnine.example.com', 'https://linkedin.com/company/cloudnine', '@cloudnine', 'https://facebook.com/cloudnine', 'https://instagram.com/cloudnine', 'careers@cloudnine.example.com', '+91-40-98765432', 'Compliant', 'Patent dispute resolved in 2024', 'A ESG Rating', 'Multi-cloud: AWS, GCP, Azure', 'Moderate', 'Tech regulation changes', '30,000 tons CO2/year', 'Carbon offset program active', 'https://youtube.com/cloudnine-overview', '4.7/5 platform rating'),
(4, 'FinTech Innovations', 'FinTech Innov', 'https://example.com/logos/fintech.png', 'FinTech', '2017', 'Digital payment solutions and financial technology platform for SMEs', 'Private Limited', 'Mumbai, Maharashtra, India', 'India', '6', 'Mumbai, Delhi, Bangalore, Kolkata, Chennai, Ahmedabad', '2000-3000', 'To democratize financial services for every business', 'Enabling seamless digital payments and financial inclusion across India', 'Trust, Security, Innovation, Financial Inclusion', '2017: Founded | 2019: RBI License | 2021: Series B | 2024: Major bank partnerships', 'Processed 10B transactions | Launched UPI 2.0 integration', 'https://fintechinnovations.example.com', 'https://linkedin.com/company/fintechinnovations', '@fintechinnov', 'https://facebook.com/fintechinnovations', 'https://instagram.com/fintechinnovations', 'careers@fintechinnovations.example.com', '+91-22-11223344', 'RBI Regulated', 'Pending compliance review', 'A- ESG Rating', 'Banking partners, Payment gateways', 'High - regulatory dependent', 'Interest rate sensitivity', '8,000 tons CO2/year', 'Paperless operations', 'https://youtube.com/fintech-story', '4.2/5 merchant rating'),
(5, 'AI Research Labs', 'AI Labs', 'https://example.com/logos/ailabs.png', 'Artificial Intelligence', '2019', 'Cutting-edge AI research and product development in NLP and Computer Vision', 'Private Limited', 'Bangalore, Karnataka, India', 'India, USA', '4', 'Bangalore, San Francisco, New York, Boston', '500-1000', 'To advance AI for human benefit', 'Pioneering AI research that solves real-world problems across industries', 'Research Excellence, Ethical AI, Collaboration, Impact', '2019: Founded by IIT/Stanford alumni | 2021: Series A | 2023: Research breakthrough | 2025: Series B', 'Published 15 papers at top AI conferences | Launched enterprise AI suite', 'https://airesearchlabs.example.com', 'https://linkedin.com/company/airesearchlabs', '@ailabs', 'https://facebook.com/airesearchlabs', 'https://instagram.com/airesearchlabs', 'careers@airesearchlabs.example.com', '+91-80-55667788', 'Compliant', 'None', 'A+ ESG Rating with ethical AI focus', 'GPU cloud providers', 'Low', 'AI regulation uncertainty', '12,000 tons CO2/year', 'Responsible AI principles', 'https://youtube.com/ailabs-vision', '4.8/5 research impact score');

-- Insert Brand Reputation Data
INSERT INTO public.company_brand_reputation (company_id, website_quality, website_rating, website_traffic_rank, social_media_followers, glassdoor_rating, indeed_rating, google_rating, awards_recognitions, brand_sentiment_score, event_participation) VALUES
(1, 'Excellent', '9.2/10', 'Top 5000 globally', 'LinkedIn: 250K, Twitter: 100K, Instagram: 50K', '4.3/5', '4.2/5', '4.5/5', 'Best Tech Employer 2024, Innovation Award 2023, Top 100 Startups', '8.5/10', 'TechCrunch Disrupt, AWS Summit, Google Cloud Next'),
(2, 'Very Good', '8.8/10', 'Top 15000 globally', 'LinkedIn: 80K, Twitter: 40K, Instagram: 20K', '4.1/5', '4.0/5', '4.3/5', 'Best Analytics Platform 2024, Data Excellence Award', '8.0/10', 'Big Data Summit, Analytics Conference'),
(3, 'Excellent', '9.0/10', 'Top 8000 globally', 'LinkedIn: 150K, Twitter: 75K, Instagram: 35K', '4.4/5', '4.3/5', '4.6/5', 'DevOps Innovation Award, Cloud Excellence 2024', '8.7/10', 'KubeCon, DevOps Days, Cloud Expo'),
(4, 'Good', '8.5/10', 'Top 20000 globally', 'LinkedIn: 100K, Twitter: 60K, Instagram: 40K', '3.9/5', '3.8/5', '4.1/5', 'FinTech Disruptor 2024, Digital Payment Award', '7.8/10', 'FinTech Summit, Digital Banking Conference'),
(5, 'Excellent', '9.5/10', 'Top 3000 globally', 'LinkedIn: 120K, Twitter: 90K, Instagram: 30K', '4.6/5', '4.5/5', '4.7/5', 'AI Research Excellence, Top AI Lab 2024, Best Innovation Award', '9.2/10', 'NeurIPS, ICML, CVPR, AI Summit');

-- Insert Business Data
INSERT INTO public.company_business (company_id, pain_points_addressed, focus_sectors, offerings_description, top_customers, core_value_proposition, unique_differentiators, competitive_advantages, weaknesses_gaps, key_challenges_needs, key_competitors, market_share_percentage, sales_motion, customer_concentration_risk, exit_strategy_history, benchmark_vs_peers, future_projections, strategic_priorities, industry_associations, case_studies, go_to_market_strategy, innovation_roadmap, product_pipeline, tam, sam, som) VALUES
(1, 'Legacy system modernization, Manual processes, Lack of AI integration', 'Enterprise Software, BFSI, Healthcare, Retail', 'Enterprise AI Platform, Cloud Migration Services, Data Analytics, Custom Software Development', 'Fortune 500 companies, Major banks, Healthcare providers', 'AI-first enterprise solutions with 10x faster implementation', 'Proprietary AI models, 99.9% uptime SLA, Industry-specific solutions', 'Strong brand recognition, Large customer base, Technology leadership', 'Limited presence in Europe, Sales cycle length', 'Scaling global teams, Regulatory compliance across markets', 'Salesforce, Oracle, SAP, ServiceNow', '8% of enterprise AI market', 'Enterprise B2B with 6-12 month sales cycles', 'Low - diversified across 200+ customers', 'No exits - growth focused', 'Above average growth, Better retention', '40% YoY growth projected, Global expansion', 'Product innovation, Market expansion, Strategic acquisitions', 'NASSCOM, TiE, Software Alliance', 'Enterprise digitalization for major bank, AI transformation for retailer', 'Enterprise sales + Partner channel', 'GenAI features, Industry-specific modules, Global data centers', 'AI Copilot, Workflow automation 2.0, Mobile platform', '$50B', '$15B', '$4B'),
(2, 'Data silos, Complex analytics tools, Lack of real-time insights', 'Data Analytics, Business Intelligence, E-commerce', 'Real-time Analytics Platform, BI Dashboards, Predictive Analytics, Data Integration', 'E-commerce companies, SaaS platforms, Financial services', 'Real-time analytics with 50% lower costs than competitors', 'Fastest query engine, No-code interface, Real-time processing', 'Cost efficiency, Ease of use, Fast deployment', 'Limited enterprise sales team, Brand awareness', 'Enterprise market penetration, Feature parity with leaders', 'Tableau, PowerBI, Looker, Qlik', '3% of BI/Analytics market', 'Product-led growth with enterprise upsell', 'Moderate - top 10 customers = 40% revenue', 'No exits', 'Fast growing segment, Competitive pricing', '50% YoY growth, Enterprise focus', 'Enterprise readiness, Partner ecosystem, Product expansion', 'Data Analytics Association, Cloud Alliance', 'E-commerce analytics transformation, SaaS platform integration', 'PLG + Enterprise sales', 'AI-powered insights, Data marketplace, Mobile analytics', 'Edge analytics, Collaborative BI, Data governance', '$30B', '$8B', '$1.5B'),
(3, 'Complex cloud management, DevOps bottlenecks, Multi-cloud challenges', 'Cloud Infrastructure, DevOps, SaaS', 'Cloud Management Platform, Kubernetes Orchestration, CI/CD Tools, Infrastructure as Code', 'Tech startups, Mid-market SaaS, Digital natives', 'Simplest cloud management with automation-first approach', 'Open source core, Strong community, Multi-cloud support', 'Developer loved, Strong open source community, Technology innovation', 'Enterprise sales maturity, Global support coverage', 'Enterprise go-to-market, 24/7 support scaling', 'HashiCorp, Terraform, GitLab, Jenkins', '5% of DevOps tools market', 'Freemium to enterprise', 'Low - 500+ customers', 'No exits', 'High growth, Strong developer adoption', '45% YoY growth, IPO in 2027', 'Enterprise adoption, Platform maturity, Global expansion', 'CNCF, Linux Foundation, Cloud Native Alliance', 'Unicorn migration to multi-cloud, DevOps transformation', 'Open source + Commercial', 'AI-driven automation, Security features, Cost optimization', 'GitOps platform, Policy engine, Observability suite', '$40B', '$12B', '$3B'),
(4, 'Payment failures, High transaction costs, Poor user experience', 'FinTech, Digital Payments, SME Banking', 'Payment Gateway, Digital Wallet, SME Loan Platform, POS Systems', 'SMEs, E-commerce merchants, Retail chains', 'Lowest transaction fees with highest success rates', 'Best success rate (98%), Instant settlements, India-first design', 'Regulatory approvals, Bank partnerships, Network effects', 'Product breadth, International expansion', 'Regulatory navigation, Competition from large players', 'Razorpay, Paytm, PhonePe, Stripe', '4% of digital payment market in India', 'Direct sales + Partner networks', 'Moderate - top 20 merchants = 35% volume', 'No exits', 'Competitive growth, Good retention', '35% YoY growth, Sustained profitability', 'Product diversification, Tier 2/3 city penetration', 'Digital Payments Association, FinTech Alliance', 'National retail chain digitalization, SME lending platform', 'Direct + Channel partners', 'Credit products, International payments, Buy now pay later', 'Merchant cash advance, Invoice financing, QR 2.0', '$100B (India digital payments)', '$25B', '$5B'),
(5, 'AI implementation complexity, Lack of domain-specific models, Talent shortage', 'AI/ML, Enterprise AI, Research', 'Custom AI Models, NLP Platform, Computer Vision APIs, AI Consulting', 'Tech companies, Research institutions, Enterprises', 'Research-backed AI solutions with production-ready implementation', 'Research to production expertise, Domain-specific models, PhD-led teams', 'Research excellence, Cutting-edge technology, Top talent', 'Sales and marketing, Customer success maturity', 'Commercialization at scale, Talent retention', 'OpenAI, Google AI, Anthropic, Cohere', '2% of enterprise AI market', 'Research-driven enterprise sales', 'High - top 5 customers = 60% revenue', 'No exits', 'Highest research impact, Premium pricing', '60% YoY growth, Scaling to profitability', 'Commercialization, Product-market fit, Vertical expansion', 'AI Alliance, Research Consortium', 'Healthcare AI deployment, Financial fraud detection', 'Direct enterprise + Research partnerships', 'Multimodal AI, Reinforcement learning, AI agents', 'Healthcare AI suite, Financial AI, Manufacturing AI', '$200B', '$40B', '$4B');

-- Insert Compensation Data
INSERT INTO public.company_compensation (company_id, leave_policy, health_support, fixed_vs_variable_pay, bonus_predictability, esops_incentives, family_health_insurance, relocation_support, lifestyle_benefits) VALUES
(1, '30 days paid leave + 10 sick days + unlimited casual leave policy', 'Comprehensive health coverage, Mental health support, Gym membership', '70% fixed, 30% variable', 'High - transparent criteria, Quarterly payouts', 'Generous ESOP program - avg 0.01-0.05% for senior roles', 'Complete family coverage including parents', 'Full relocation package + spousal career support', 'WFH stipend, Learning budget $2000/year, Phone/Internet'),
(2, '25 days paid leave + 12 sick days', 'Health insurance, Annual health checkup, Telemedicine', '75% fixed, 25% variable', 'Moderate - annual basis', 'Standard ESOP program for all employees', 'Family coverage (spouse + 2 children)', 'Partial relocation support', 'Learning budget $1000/year, WFH setup'),
(3, 'Unlimited PTO policy (minimum 20 days encouraged)', 'Premium health coverage, Mental wellness program, Fitness reimbursement', '65% fixed, 35% variable', 'High - performance based quarterly', 'Aggressive ESOP - avg 0.02-0.08% equity', 'Complete family coverage including in-laws', 'Comprehensive relocation + temp housing', 'Learning $2500/year, Home office $1500, Conference budget'),
(4, '24 days paid leave + 10 sick days', 'Standard health insurance, Annual checkup', '80% fixed, 20% variable', 'Moderate - annual with clear metrics', 'Limited ESOP for senior roles only', 'Family coverage (spouse + children)', 'Basic relocation support', 'Learning budget $800/year, Internet stipend'),
(5, '28 days paid leave + 12 sick days + research time off', 'Premium health + dental + vision, Wellness program, Gym', '60% fixed, 40% variable', 'Very high - research bonuses + performance', 'Premium ESOP program - avg 0.05-0.15% for researchers', 'Comprehensive family coverage', 'Full relocation + spousal assistance + visa support', 'Conference travel, Research budget $5000, Latest hardware, Learning unlimited');

-- Insert Culture Data
INSERT INTO public.company_culture (company_id, hiring_velocity, employee_turnover, avg_retention_tenure, diversity_metrics, work_culture_summary, manager_quality, psychological_safety, feedback_culture, diversity_inclusion_score, ethical_standards, burnout_risk, layoff_history, mission_clarity, sustainability_csr, crisis_behavior) VALUES
(1, 'High - 500+ hires in 2025', '12% annual attrition', '3.5 years average tenure', '32% women engineers, 15% leaders from underrepresented groups', 'Fast-paced, collaborative, innovation-driven with strong engineering culture', 'Strong - regular manager training, 360 feedback', 'High - open communication, safe to fail philosophy', 'Structured - quarterly reviews + continuous feedback', '7.5/10', 'Strong code of conduct, Ethics committee, Whistleblower protection', 'Medium - project deadlines can be intense', 'No layoffs - managed growth responsibly', 'Very clear - communicated regularly', 'Active CSR programs, Carbon neutral by 2028 goal', 'Transparent during COVID, Supported employees'),
(2, 'Moderate - 150+ hires in 2025', '15% annual attrition', '2.8 years average tenure', '28% women engineers, 10% diverse leadership', 'Startup pace, data-driven, performance-focused culture', 'Moderate - some training gaps', 'Moderate - improving', 'Regular 1:1s and reviews', '6.8/10', 'Standard policies in place', 'Medium-High - fast pace', 'No layoffs', 'Clear but evolving', 'Basic CSR activities', 'Good support during challenges'),
(3, 'High - 400+ hires in 2025', '10% annual attrition', '4.2 years average tenure', '35% women engineers, 18% diverse leadership', 'Open source culture, transparent, engineer-led, high autonomy', 'Excellent - servant leadership model', 'Very High - radical transparency', 'Open feedback culture - real-time', '8.2/10', 'Open source ethics, Strong community guidelines', 'Low - good work-life balance', 'No layoffs - profitable', 'Extremely clear', 'Leading sustainability initiatives, Open source contributions', 'Excellent transparency and support'),
(4, 'Moderate - 200+ hires in 2025', '18% annual attrition', '2.5 years average tenure', '25% women engineers, 12% diverse leadership', 'Competitive, metrics-driven, fast-paced FinTech environment', 'Moderate - variable by team', 'Moderate - improving', 'Quarterly formal reviews', '6.5/10', 'Strong compliance focus', 'High - demanding environment', '2023 small RIF - 5% workforce', 'Clear but pressure on execution', 'Basic CSR, Financial literacy programs', 'Managed challenges well'),
(5, 'Selective - 80+ hires in 2025', '8% annual attrition', '4.8 years average tenure', '30% women researchers, 20% international team', 'Research-first, intellectual, collaborative, academia-like but faster', 'Excellent - PhD mentors, Research advisors', 'Very High - research requires experimentation', 'Continuous peer review culture', '8.5/10', 'Ethical AI principles core to mission', 'Low - research-friendly pace', 'No layoffs', 'Crystal clear - research mission', 'Active in AI ethics, Education programs', 'Exemplary - supported team through challenges');

-- Insert Financials Data  
INSERT INTO public.company_financials (company_id, annual_revenue, annual_profit, revenue_mix, valuation, yoy_growth_rate, profitability_status, key_investors, recent_funding_rounds, total_capital_raised, customer_acquisition_cost, customer_lifetime_value, cac_ltv_ratio, churn_rate, net_promoter_score, burn_rate, runway_months, burn_multiplier) VALUES
(1, '$250M ARR', '$25M profit (10% margin)', 'SaaS: 60%, Services: 30%, Licensing: 10%', '$2.5B post-money', '40% YoY', 'Profitable', 'Sequoia, Accel, Tiger Global, SoftBank', 'Series D - $200M at $2.5B (2024)', '$450M total', '$50K per enterprise customer', '$500K LTV', '1:10', '8% annual', '65 NPS', '$15M monthly', '36+ months', '0.5x (healthy)'),
(2, '$80M ARR', '-$5M (path to profitability)', 'SaaS: 85%, Services: 15%', '$800M post-money', '50% YoY', 'Near profitable', 'Matrix Partners, Nexus VP, Elevation', 'Series B - $60M at $800M (2023)', '$120M total', '$15K per customer', '$120K LTV', '1:8', '12% annual', '58 NPS', '$7M monthly', '24 months', '0.7x'),
(3, '$180M ARR', '$20M profit (11% margin)', 'SaaS: 70%, Open source support: 20%, Services: 10%', '$1.8B post-money', '45% YoY', 'Profitable', 'Lightspeed, Insight Partners, GV', 'Series C - $120M at $1.8B (2024)', '$280M total', '$30K enterprise, $500 SMB', '$300K enterprise, $5K SMB', '1:10 enterprise, 1:10 SMB', '10% annual', '72 NPS', '$10M monthly (growth investments)', '42 months', '0.4x'),
(4, '$120M ARR', '$8M profit (6.7% margin)', 'Transaction fees: 80%, SaaS: 15%, Other: 5%', '$1.2B post-money', '35% YoY', 'Profitable', 'Peak XV (Sequoia), Ribbit Capital, PayPal Ventures', 'Series B - $80M at $1.2B (2023)', '$180M total', '$2K per merchant', '$20K LTV', '1:10', '15% annual', '54 NPS', 'Cash flow positive', 'Infinite', 'N/A'),
(5, '$40M ARR', '-$15M (investment phase)', 'Research contracts: 50%, SaaS: 30%, Consulting: 20%', '$500M post-money', '60% YoY', 'Not profitable - R&D heavy', 'Y Combinator, AI Fund, General Catalyst, In-Q-Tel', 'Series B - $50M at $500M (2025)', '$85M total', '$100K per customer', '$800K LTV', '1:8', '5% annual (sticky)', '78 NPS', '$5M monthly', '18 months', '1.2x');

-- Insert Logistics Data
INSERT INTO public.company_logistics (company_id, remote_policy_details, typical_hours, overtime_expectations, weekend_work, flexibility_level, location_centrality, public_transport_access, cab_policy, airport_commute_time, office_zone_type, area_safety, safety_policies, infrastructure_safety, emergency_preparedness) VALUES
(1, 'Hybrid - 3 days office, 2 days remote. Fully remote for select roles', '9:30 AM - 6:30 PM with flexible start times', 'Occasional during releases - compensated', 'Rare - only for critical issues', 'High flexibility with core hours 11-4', 'Central business districts in all cities', 'Excellent - metro/bus connectivity', 'Cab service post 8 PM and for women employees', '45-60 mins from major airports', 'Tech parks and premium office spaces', 'Excellent - 24/7 security', 'POSH compliant, Security protocols, Visitor management', 'Grade A buildings, Fire safety, Medical room', 'Trained safety officers, Emergency drills, First aid'),
(2, 'Hybrid - 2 days office, 3 days remote. Manager discretion', '10:00 AM - 7:00 PM', 'Moderate - compensatory offs provided', 'Occasional for deployments', 'High flexibility', 'IT corridors and business parks', 'Good metro/bus access', 'Cab service post 9 PM', '40-50 mins from airports', 'Tech parks', 'Good - security present', 'Standard policies, POSH committee', 'Modern buildings, Safety compliant', 'Basic emergency preparedness'),
(3, 'Flexible - Office optional, async-first culture. 20% fully remote', '10:00 AM - 6:00 PM (flexible hours)', 'Very rare - culture discourages', 'Not expected', 'Very high - results focused', 'Modern tech hubs', 'Excellent public transport', 'Unlimited cab policy for late hours', '30-45 mins from airports', 'Premium tech parks', 'Excellent security', 'Comprehensive safety policies', 'Premium infrastructure', 'Well-prepared with regular drills'),
(4, 'Hybrid - 4 days office, 1 day remote (Ops need presence)', '9:00 AM - 6:00 PM', 'Common during month-end and releases', 'Sometimes required for operations', 'Moderate flexibility', 'Financial districts', 'Good - major locations', 'Cab service post 8 PM', '50-70 mins from airports', 'Commercial office buildings', 'Good security', 'Standard policies', 'Good infrastructure', 'Standard emergency protocols'),
(5, 'Very flexible - Office 1-2 days per week. Research-friendly', '10:00 AM - 6:00 PM (flexible research hours)', 'Rare - research-driven pace', 'Not expected', 'Very high - academic-like flexibility', 'Premium research park locations', 'Very good access', 'Flexible cab policy', '35-50 mins from major airports', 'Research parks and innovation centers', 'Excellent - secure facilities', 'Comprehensive policies', 'State-of-art infrastructure', 'Well-prepared facilities');

-- Insert People Data
INSERT INTO public.company_people (company_id, ceo_name, ceo_linkedin_url, key_leaders, warm_intro_pathways, decision_maker_access, contact_person_name, contact_person_title, contact_person_email, contact_person_phone, board_members) VALUES
(1, 'Rajesh Kumar', 'https://linkedin.com/in/rajeshkumar', 'CTO: Priya Sharma (ex-Google) | CPO: Amit Verma (ex-Microsoft) | CFO: Sunita Rao | Chief AI Officer: Dr. Vikram Singh', 'Alumni networks: IIT, Stanford | Investor intros | Conferences', 'Accessible through formal channels and investor connects', 'Sneha Gupta', 'VP Talent Acquisition', 'sneha.gupta@techcorp.example.com', '+91-80-12345679', 'Sequoia Partner, Accel Partner, Independent Directors: Dr. Anand, Ms. Lakshmi'),
(2, 'Arjun Mehta', 'https://linkedin.com/in/arjunmehta', 'CTO: Kavya Reddy (IIT-B) | VP Engineering: Rohit Desai | VP Sales: Manish Jain | Head Product: Neha Kapoor', 'IIT alumni network | Startup community', 'Moderately accessible', 'Pooja Iyer', 'Senior Recruiter', 'pooja.iyer@dataflow.example.com', '+91-20-87654322', 'Matrix Partner, Nexus VP Partner, Founder CEO'),
(3, 'Vikram Patel', 'https://linkedin.com/in/vikrampatel', 'Head of Engineering: Lisa Chen (ex-Docker) | VP Product: Sarah Johnson | Chief Architect: Open source maintainer Kumar S | CFO: David Williams', 'Open source community | Developer conferences | GitHub', 'Very accessible - open culture', 'Rahul Nair', 'Director of People', 'rahul.nair@cloudnine.example.com', '+91-40-98765433', 'Lightspeed Partner, Insight Partner, Community representatives'),
(4, 'Karan Shah', 'https://linkedin.com/in/karanshah', 'CTO: Vijay Agarwal (BITS Pilani) | COO: Ritu Malhotra | Chief Risk Officer: Suresh Kumar | VP Product: Ananya Singh', 'FinTech community | Banking connections', 'Accessible through formal channels', 'Deepa Menon', 'Head of Recruitment', 'deepa.menon@fintechinnovations.example.com', '+91-22-11223345', 'Peak XV Partner, Ribbit Partner, Banking veterans'),
(5, 'Dr. Anjali Krishnan', 'https://linkedin.com/in/anjalikrishnan', 'Chief Research Officer: Dr. Michael Zhang (Stanford PhD) | VP Engineering: Prof. Ramesh Kumar (IIT faculty) | Head of Product: Emily Watson | Chief Scientist: Dr. Pradeep Rao', 'Academic networks | AI conferences | Research publications', 'Accessible through research channels and conferences', 'Sanjay Gupta', 'Talent Partner', 'sanjay.gupta@airesearchlabs.example.com', '+91-80-55667789', 'Y Combinator Partner, Academic advisors, AI Fund Partner');

-- Insert Talent Growth Data
INSERT INTO public.company_talent_growth (company_id, training_spend, onboarding_quality, learning_culture, exposure_quality, mentorship_availability, internal_mobility, promotion_clarity, tools_access, role_clarity, early_ownership, work_impact, execution_thinking_balance, automation_level, cross_functional_exposure, company_maturity, brand_value, client_quality, exit_opportunities, skill_relevance, external_recognition, network_strength, global_exposure) VALUES
(1, '$5K per employee annually', 'Excellent - 2 week structured program', 'Strong - learning Fridays, conference support', 'High - work with Fortune 500 clients', 'Formal mentorship program', 'High - 30% internal moves', 'Clear promotion criteria and timelines', 'Best in class - latest tools and tech', 'Very clear - defined roles', 'Moderate - after 1 year', 'High - enterprise level impact', '60-40 execution-thinking', 'Moderate automation', 'High - cross-team projects common', 'Scale-up stage - some processes mature', 'Very strong in enterprise space', 'Fortune 500 companies', 'Excellent - valued by top tech companies', 'Highly relevant - modern tech stack', 'Strong in enterprise AI space', 'Strong - tier 1 connections', 'High - US and global offices'),
(2, '$2K per employee annually', 'Good - 1 week program', 'Moderate - budget for courses', 'Moderate - SMB to mid-market clients', 'Informal mentorship', 'Moderate - 20% internal moves', 'Somewhat clear - improving', 'Good tools access', 'Clear roles', 'High - early responsibility', 'Moderate - growing companies', '70-30 execution-thinking', 'Moderate automation', 'Moderate exposure', 'Growth stage - scaling processes', 'Growing brand in analytics', 'SMB and mid-market', 'Good - analytics skills valued', 'Relevant - data stack skills', 'Emerging recognition', 'Moderate networks', 'Limited - mostly India'),
(3, '$4K per employee + conference budget', 'Excellent - mentorship-based onboarding', 'Excellent - open source contribution encouraged', 'Very high - open source exposure', 'Strong mentorship culture', 'Very high - 40% internal mobility', 'Transparent and clear', 'Cutting edge tools', 'Clear with autonomy', 'Very high - ownership from day 1', 'High - widely used open source', '50-50 execution-thinking', 'High automation', 'Very high - collaborative culture', 'Scale-up with strong culture', 'Very strong - known in DevOps', 'Tech companies globally', 'Excellent - DevOps skills highly valued', 'Highly relevant - cloud native', 'Strong in open source community', 'Very strong - global community', 'High - international team'),
(4, '$1.5K per employee annually', 'Moderate - 3 day program', 'Moderate - focus on compliance training', 'Moderate - FinTech experience', 'Limited formal mentorship', 'Low - 15% internal moves', 'Somewhat unclear - improving', 'Standard tools', 'Clear but specialized', 'Moderate ownership', 'Moderate - payments industry', '80-20 execution-thinking', 'Moderate automation', 'Low - siloed teams', 'Growth stage - building processes', 'Growing in FinTech', 'SMEs and merchants', 'Good - FinTech experience valued', 'Relevant - payments tech', 'Moderate recognition', 'FinTech networks', 'Low - India focused'),
(5, '$10K per employee + unlimited research budget', 'Excellent - PhD-style mentoring', 'Exceptional - research-first culture', 'Exceptional - cutting edge AI research', 'Excellent - PhD mentor model', 'High - research to product moves', 'Clear research progression', 'State-of-art - best hardware/software', 'Clear but flexible for research', 'Very high - leading projects', 'Very high - published research impact', '30-70 execution-thinking (research heavy)', 'Low automation - custom research', 'High - cross-disciplinary research', 'Research-stage with commercialization', 'Excellent - top tier AI lab reputation', 'Leading tech companies', 'Exceptional - top AI talent exits', 'Extremely relevant - cutting edge AI', 'Very strong - research publications', 'Excellent - academia + industry', 'Very high - global research collaboration');

-- Insert Technologies Data
INSERT INTO public.company_technologies (company_id, technology_partners, intellectual_property, r_and_d_investment, ai_ml_adoption_level, tech_stack, cybersecurity_posture, partnership_ecosystem, tech_adoption_rating) VALUES
(1, 'AWS Premier Partner, Microsoft Gold, Google Cloud Partner, Databricks, Snowflake', '25 patents filed, 12 granted. Proprietary AI models', '25% of revenue in R&D - $60M annually', 'Very High - AI-first company', 'Python, Go, React, Kubernetes, AWS/Azure, TensorFlow, PyTorch, Postgres, Redis, Kafka', 'Excellent - SOC2 Type II, ISO 27001, Regular audits', 'Strong - 50+ tech partners, System integrators, Consulting firms', '9/10 - Cutting edge'),
(2, 'AWS Partner, Google Cloud, Databricks, Confluent, dbt Labs', '8 patents filed, 3 granted. Query optimization algorithms', '18% of revenue in R&D - $14M annually', 'High - AI-powered analytics', 'Python, Scala, React, Kubernetes, AWS, ClickHouse, Postgres, Apache Spark, Airflow', 'Good - SOC2 Type II in progress, ISO certified', 'Growing - 20+ partners', '8/10 - Modern stack'),
(3, 'CNCF Member, Linux Foundation, AWS Partner, Multi-cloud partnerships', '15 patents, Major open source contributions (Apache licensed)', '22% of revenue in R&D - $40M annually', 'Very High - AI for DevOps', 'Go, Rust, React, Kubernetes, Multi-cloud (AWS/GCP/Azure), Terraform, Postgres, etcd', 'Excellent - Open source security practices, Regular audits, Bug bounty', 'Very strong - Open source ecosystem, 100+ partners', '9.5/10 - Industry leading'),
(4, 'Payment gateway partners, Bank partnerships, UPI ecosystem', '10 patents in payment processing', '15% of revenue in R&D - $18M annually', 'Moderate - AI for fraud detection', 'Java, Spring Boot, React Native, AWS, MySQL, Redis, Kafka, Node.js', 'Very strong - PCI DSS certified, RBI compliant, Regular security audits', 'Moderate - Banking partnerships, Payment networks', '7.5/10 - Industry standard'),
(5, 'NVIDIA Partner, Google Cloud, AWS AI Partner, Academic partnerships (Stanford, IIT, MIT)', '20+ research papers, 5 patents pending, Open source models released', '50% of revenue in R&D - $20M annually', 'Exceptional - AI research company', 'Python, PyTorch, JAX, Kubernetes, Multi-cloud GPUs, Custom ML frameworks, Postgres, Ray', 'Excellent - Research data security, Audit compliance', 'Strong - Academic + Industry partnerships', '10/10 - Research-grade cutting edge');

-- Insert Skill Rating Data
INSERT INTO public.company_skill_rating (company_id, coding, data_structures_and_algorithms, object_oriented_programming_and_design, aptitude_and_problem_solving, communication_skills, ai_native_engineering, devops_and_cloud, sql_and_design, software_engineering, system_design_and_architecture, computer_networking, operating_system) VALUES
(1, '8', '9', '8', '8', '7', '9', '8', '7', '8', '9', '6', '6'),
(2, '7', '8', '7', '7', '7', '7', '7', '9', '7', '7', '5', '5'),
(3, '9', '8', '8', '8', '8', '7', '10', '7', '9', '9', '7', '8'),
(4, '7', '7', '7', '7', '8', '5', '6', '8', '7', '7', '6', '5'),
(5, '9', '9', '8', '9', '8', '10', '7', '6', '8', '8', '6', '7');

-- ============================================================================
-- SKILL SYSTEM DATA
-- ============================================================================

-- Insert Skill Areas
INSERT INTO public.skill_area (skill_area_name) VALUES
('Coding'),
('Data Structures and Algorithms'),
('Object Oriented Programming and Design'),
('Aptitude and Problem Solving'),
('Communication Skills'),
('AI Native Engineering'),
('DevOps and Cloud'),
('SQL and Design'),
('Software Engineering'),
('System Design and Architecture'),
('Computer Networking'),
('Operating System');

-- Insert Skill Proficiency Codes (CU, AP, AS, EV, CR for levels 1-10)
-- CU = Conceptual Understanding, AP = Application, AS = Assessment, EV = Evaluation, CR = Creation
INSERT INTO public.skill_proficiency (proficiency_level, proficiency_code, multiplier) VALUES
-- Level 1
(1, 'CU', 1.0), (1, 'AP', 1.1),
-- Level 2
(2, 'CU', 1.0), (2, 'AP', 1.2), (2, 'AS', 1.3),
-- Level 3
(3, 'CU', 1.1), (3, 'AP', 1.3), (3, 'AS', 1.4),
-- Level 4
(4, 'CU', 1.2), (4, 'AP', 1.4), (4, 'AS', 1.5), (4, 'EV', 1.6),
-- Level 5
(5, 'CU', 1.3), (5, 'AP', 1.5), (5, 'AS', 1.6), (5, 'EV', 1.7),
-- Level 6
(6, 'AP', 1.6), (6, 'AS', 1.7), (6, 'EV', 1.8), (6, 'CR', 1.9),
-- Level 7
(7, 'AP', 1.7), (7, 'AS', 1.8), (7, 'EV', 1.9), (7, 'CR', 2.0),
-- Level 8
(8, 'AS', 1.9), (8, 'EV', 2.0), (8, 'CR', 2.2),
-- Level 9
(9, 'AS', 2.0), (9, 'EV', 2.2), (9, 'CR', 2.5),
-- Level 10
(10, 'EV', 2.3), (10, 'CR', 3.0);

-- Insert Skill Area Levels with Topics

-- Coding (skill_area_id = 1)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(1, 1, 'Basic syntax, Variables, Data types, Input/Output operations, Simple conditionals'),
(1, 2, 'Loops (for, while), Arrays, Functions, String manipulation, Basic debugging'),
(1, 3, 'Recursion basics, Multi-dimensional arrays, File I/O, Exception handling, Code organization'),
(1, 4, 'Advanced recursion, Dynamic programming basics, STL/Collections, Code optimization'),
(1, 5, 'Complex algorithms implementation, Bit manipulation, Advanced STL, Code patterns'),
(1, 6, 'Design patterns in code, Generic programming, Functional programming, Performance profiling'),
(1, 7, 'Concurrent programming, Advanced design patterns, Memory management, Code architecture'),
(1, 8, 'Low-level programming, System programming, Custom data structures, Performance engineering'),
(1, 9, 'Language internals, Compiler concepts, Advanced concurrency patterns, Expert optimization'),
(1, 10, 'Language design, Creating frameworks, Pushing language boundaries, Teaching/mentoring');

-- Data Structures and Algorithms (skill_area_id = 2)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(2, 1, 'Arrays, Searching (linear, binary), Basic sorting (bubble, selection), Time complexity basics'),
(2, 2, 'Stacks, Queues, Linked lists, Hash tables basics, Space complexity'),
(2, 3, 'Trees (BST), Heaps, Advanced sorting, Recursion patterns, Complexity analysis'),
(2, 4, 'Graphs (BFS, DFS), Dynamic programming intro, Greedy algorithms, Tree traversals'),
(2, 5, 'Advanced graphs (Dijkstra, MST), Complex DP problems, Backtracking, Trie'),
(2, 6, 'Advanced graph algorithms, Segment trees, Advanced DP patterns, String algorithms'),
(2, 7, 'Network flow, Game theory, Computational geometry, Advanced trees (Red-Black, AVL)'),
(2, 8, 'Advanced algorithms design, NP problems, Approximation algorithms, Randomized algorithms'),
(2, 9, 'Algorithm research, Competitive programming at highest level, Novel solutions'),
(2, 10, 'Creating new algorithms, Research publications, Teaching advanced algorithms');

-- OOP and Design (skill_area_id = 3)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(3, 1, 'Classes and objects, Encapsulation basics, Methods and properties, Simple inheritance'),
(3, 2, 'Polymorphism, Abstraction, Interfaces, Constructors and destructors, Access modifiers'),
(3, 3, 'Composition vs inheritance, Multiple inheritance concepts, Abstract classes, Method overriding'),
(3, 4, 'SOLID principles basics, Design patterns intro (Singleton, Factory), UML basics'),
(3, 5, 'Advanced design patterns (Observer, Strategy, Decorator), Dependency injection, SOLID in practice'),
(3, 6, 'Architectural patterns (MVC, MVVM), Anti-patterns, Refactoring techniques, Clean code'),
(3, 7, 'Domain-driven design, Enterprise patterns, CQRS, Event sourcing, Microservices patterns'),
(3, 8, 'System architecture design, Distributed design patterns, Scalability patterns'),
(3, 9, 'Architecture frameworks, Complex system design, Leading architecture decisions'),
(3, 10, 'Creating design methodologies, Published architect, Industry thought leadership');

-- Aptitude and Problem Solving (skill_area_id = 4)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(4, 1, 'Basic math, Number systems, Simple patterns, Logical reasoning basics'),
(4, 2, 'Percentages, Ratios, Time-work problems, Series patterns, Boolean logic'),
(4, 3, 'Probability basics, Permutation-combination, Set theory, Analytical reasoning'),
(4, 4, 'Data interpretation, Venn diagrams, Advanced probability, Coding-decoding, Puzzles'),
(4, 5, 'Advanced puzzles, Game theory basics, Decision trees, Optimization problems'),
(4, 6, 'Complex problem decomposition, Mathematical modeling, Algorithm optimization'),
(4, 7, 'Advanced mathematical reasoning, Research problem solving, Novel approaches'),
(4, 8, 'Competitive mathematics, Complex optimization, Research methodology'),
(4, 9, 'Mathematical research, Problem creation, Competition level problem solving'),
(4, 10, 'Mathematical innovation, Published research, Creating problem-solving frameworks');

-- Communication Skills (skill_area_id = 5)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(5, 1, 'Basic spoken English, Email writing, Simple presentations, Active listening'),
(5, 2, 'Professional communication, Meeting participation, Clear verbal expression, Basic reports'),
(5, 3, 'Technical writing, Presentation skills, Persuasive communication, Feedback giving'),
(5, 4, 'Stakeholder communication, Documentation, Conflict resolution, Technical presentations'),
(5, 5, 'Cross-functional communication, Executive communication, Technical-to-non-technical translation'),
(5, 6, 'Leadership communication, Public speaking, Negotiation, Influence skills'),
(5, 7, 'Strategic communication, Crisis communication, Change management communication'),
(5, 8, 'Executive thought leadership, Conference speaking, Complex stakeholder management'),
(5, 9, 'Industry thought leadership, Published articles, Speaking at major conferences'),
(5, 10, 'Communication expert, Best-selling author, Keynote speaker, Communication training');

-- AI Native Engineering (skill_area_id = 6)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(6, 1, 'AI/ML basics, Using AI tools (ChatGPT, Copilot), Prompt engineering basics'),
(6, 2, 'Python for ML, NumPy/Pandas, Basic ML models, Jupyter notebooks, API usage'),
(6, 3, 'Supervised learning, Feature engineering, Model evaluation, TensorFlow/PyTorch basics'),
(6, 4, 'Deep learning basics, Neural networks, CNNs, Transfer learning, Model deployment'),
(6, 5, 'Advanced deep learning, NLP basics, Computer vision, Model optimization, MLOps basics'),
(6, 6, 'Transformers, LLMs, RAG, Fine-tuning models, Advanced MLOps, A/B testing'),
(6, 7, 'Custom model architectures, Research papers implementation, Large-scale ML systems'),
(6, 8, 'Novel architectures, Multi-modal AI, Distributed training, AI system design'),
(6, 9, 'AI research, Publishing papers, State-of-art contributions, Research leadership'),
(6, 10, 'AI innovation, Novel techniques, Industry-leading research, AI thought leadership');

-- DevOps and Cloud (skill_area_id = 7)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(7, 1, 'Linux basics, Command line, Git basics, Basic scripting, SSH'),
(7, 2, 'Docker basics, CI/CD concepts, Cloud basics (AWS/Azure), Basic monitoring, Nginx'),
(7, 3, 'Kubernetes basics, Terraform/IaC, CI/CD pipelines, Monitoring tools, Load balancers'),
(7, 4, 'Advanced Kubernetes, Multi-cloud, Infrastructure automation, Security basics, GitOps'),
(7, 5, 'Service mesh, Advanced IaC, Cloud architecture, Security hardening, Cost optimization'),
(7, 6, 'Platform engineering, SRE practices, Advanced observability, Chaos engineering'),
(7, 7, 'Cloud-native architecture, Multi-region deployment, Advanced security, FinOps'),
(7, 8, 'Cloud architecture at scale, Platform design, DevOps culture transformation'),
(7, 9, 'Industry-leading DevOps practices, Open source contributions, Conference speaking'),
(7, 10, 'DevOps thought leadership, Creating tools/platforms, Industry influence');

-- SQL and Design (skill_area_id = 8)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(8, 1, 'Basic SQL queries (SELECT, WHERE), Simple joins, Database basics, Data types'),
(8, 2, 'Joins (INNER, LEFT, RIGHT), Aggregations, GROUP BY, HAVING, Subqueries'),
(8, 3, 'Complex queries, Window functions, CTEs, Indexes basics, Normalization'),
(8, 4, 'Query optimization, Execution plans, Advanced joins, Views, Stored procedures'),
(8, 5, 'Database design, ER diagrams, Normalization/Denormalization, Transactions, ACID'),
(8, 6, 'Advanced database design, Partitioning, Replication, Sharding basics, NoSQL basics'),
(8, 7, 'Distributed databases, Advanced sharding, NoSQL patterns, Data modeling at scale'),
(8, 8, 'Database architecture, Multi-region databases, CAP theorem in practice, Data platform design'),
(8, 9, 'Database research, Novel data solutions, Large-scale data architecture'),
(8, 10, 'Database innovation, Industry-leading practices, Database thought leadership');

-- Software Engineering (skill_area_id = 9)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(9, 1, 'Version control basics, IDE usage, Basic testing, Code review basics, Agile intro'),
(9, 2, 'Git workflows, Unit testing, Test-driven development intro, JIRA/Project tools, Scrum basics'),
(9, 3, 'Integration testing, CI/CD basics, Code quality tools, API design, Documentation'),
(9, 4, 'Testing strategies, Clean code practices, Refactoring, API best practices, Performance basics'),
(9, 5, 'Architecture patterns, Microservices basics, Security best practices, Observability'),
(9, 6, 'System design, Distributed systems, Scalability patterns, Technical leadership'),
(9, 7, 'Platform engineering, Engineering culture, Organizational patterns, Tech strategy'),
(9, 8, 'Engineering excellence, Large-scale systems, Architecture governance, Team scaling'),
(9, 9, 'Industry-leading practices, Open source leadership, Engineering thought leadership'),
(9, 10, 'Software engineering innovation, Industry influence, Creating engineering methodologies');

-- System Design and Architecture (skill_area_id = 10)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(10, 1, 'Client-server architecture, Basic API design, Monolithic applications, HTTP basics'),
(10, 2, 'REST APIs, Database selection, Caching basics, Load balancing concepts, CDN basics'),
(10, 3, 'Microservices intro, Message queues, Scalability basics, CAP theorem, Consistency models'),
(10, 4, 'Distributed systems basics, Sharding, Replication, Service discovery, API gateway'),
(10, 5, 'Advanced microservices, Event-driven architecture, CQRS, Saga patterns, Eventual consistency'),
(10, 6, 'System design interviews, Large-scale systems, Multi-region architecture, Disaster recovery'),
(10, 7, 'Enterprise architecture, Cloud architecture patterns, Security architecture, Compliance'),
(10, 8, 'Platform architecture, Multi-cloud architecture, Global scale systems, Cost optimization'),
(10, 9, 'Industry-leading architecture, Architecture frameworks, Organizational architecture'),
(10, 10, 'Architecture innovation, Creating architecture patterns, Industry thought leadership');

-- Computer Networking (skill_area_id = 11)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(11, 1, 'OSI model basics, IP addressing, TCP/IP basics, HTTP/HTTPS, DNS basics'),
(11, 2, 'Subnetting, Routing basics, Switches vs routers, Firewalls, VPN basics'),
(11, 3, 'TCP/UDP details, Network protocols, Load balancers, Proxies, NAT'),
(11, 4, 'Advanced routing, Network security, VLANs, QoS, Network monitoring'),
(11, 5, 'Cloud networking, SDN basics, Network architecture, CDN design, DDoS protection'),
(11, 6, 'Advanced cloud networking, Service mesh, API gateway, Multi-region networking'),
(11, 7, 'Global network architecture, Network security at scale, Zero-trust networking'),
(11, 8, 'Large-scale network design, Performance optimization, Network automation'),
(11, 9, 'Industry-leading networking practices, Network innovations, Research'),
(11, 10, 'Networking thought leadership, Creating networking solutions, Industry influence');

-- Operating System (skill_area_id = 12)
INSERT INTO public.skill_area_level (skill_area_id, level_number, topics) VALUES
(12, 1, 'OS basics, File systems, Process basics, Memory basics, Command line'),
(12, 2, 'Process management, Threads, Inter-process communication, Shell scripting, System calls'),
(12, 3, 'Memory management, Virtual memory, Paging, Scheduling algorithms, Deadlocks'),
(12, 4, 'File system internals, I/O systems, Storage management, Linux internals basics'),
(12, 5, 'Advanced Linux, Kernel modules, System programming, Performance tuning'),
(12, 6, 'Kernel development basics, Device drivers, Embedded systems, Real-time OS'),
(12, 7, 'Advanced kernel development, OS architecture, Distributed OS concepts'),
(12, 8, 'OS design, Custom OS components, Container runtimes, Virtualization internals'),
(12, 9, 'OS research, Novel OS contributions, System software innovation'),
(12, 10, 'OS thought leadership, Creating OS components, Industry-leading OS work');

-- Sample Skill Proficiency Mappings (linking skill levels to proficiency requirements)
-- For brevity, showing representative mappings

-- Coding Level 1 requires CU and AP at level 1
INSERT INTO public.skill_proficiency_mapping (skill_area_level_id, skill_proficiency_id)
SELECT sal.skill_area_level_id, sp.skill_proficiency_id
FROM public.skill_area_level sal
CROSS JOIN public.skill_proficiency sp
WHERE sal.skill_area_id = 1 AND sal.level_number = 1
  AND sp.proficiency_level = 1 AND sp.proficiency_code IN ('CU', 'AP');

-- Coding Level 3 requires CU, AP, AS at level 3
INSERT INTO public.skill_proficiency_mapping (skill_area_level_id, skill_proficiency_id)
SELECT sal.skill_area_level_id, sp.skill_proficiency_id
FROM public.skill_area_level sal
CROSS JOIN public.skill_proficiency sp
WHERE sal.skill_area_id = 1 AND sal.level_number = 3
  AND sp.proficiency_level = 3 AND sp.proficiency_code IN ('CU', 'AP', 'AS');

-- Coding Level 5 requires CU, AP, AS, EV at level 5
INSERT INTO public.skill_proficiency_mapping (skill_area_level_id, skill_proficiency_id)
SELECT sal.skill_area_level_id, sp.skill_proficiency_id
FROM public.skill_area_level sal
CROSS JOIN public.skill_proficiency sp
WHERE sal.skill_area_id = 1 AND sal.level_number = 5
  AND sp.proficiency_level = 5 AND sp.proficiency_code IN ('CU', 'AP', 'AS', 'EV');

-- DSA Level 5 requires AP, AS, EV at level 5
INSERT INTO public.skill_proficiency_mapping (skill_area_level_id, skill_proficiency_id)
SELECT sal.skill_area_level_id, sp.skill_proficiency_id
FROM public.skill_area_level sal
CROSS JOIN public.skill_proficiency sp
WHERE sal.skill_area_id = 2 AND sal.level_number = 5
  AND sp.proficiency_level = 5 AND sp.proficiency_code IN ('AP', 'AS', 'EV');

-- Create indexes for better query performance
CREATE INDEX idx_company_brand_reputation_company_id ON public.company_brand_reputation(company_id);
CREATE INDEX idx_company_business_company_id ON public.company_business(company_id);
CREATE INDEX idx_company_compensation_company_id ON public.company_compensation(company_id);
CREATE INDEX idx_company_culture_company_id ON public.company_culture(company_id);
CREATE INDEX idx_company_financials_company_id ON public.company_financials(company_id);
CREATE INDEX idx_company_logistics_company_id ON public.company_logistics(company_id);
CREATE INDEX idx_company_people_company_id ON public.company_people(company_id);
CREATE INDEX idx_company_talent_growth_company_id ON public.company_talent_growth(company_id);
CREATE INDEX idx_company_technologies_company_id ON public.company_technologies(company_id);
CREATE INDEX idx_company_skill_rating_company_id ON public.company_skill_rating(company_id);
CREATE INDEX idx_skill_area_level_skill_area_id ON public.skill_area_level(skill_area_id);
CREATE INDEX idx_skill_proficiency_mapping_level_id ON public.skill_proficiency_mapping(skill_area_level_id);
CREATE INDEX idx_skill_proficiency_mapping_proficiency_id ON public.skill_proficiency_mapping(skill_proficiency_id);
CREATE INDEX idx_companies_category ON public.companies(category);
CREATE INDEX idx_companies_name ON public.companies(name);
