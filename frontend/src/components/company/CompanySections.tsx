import { Company } from "@/types/company";

interface Props {
  company: Company;
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b last:border-b-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

export function SectionBusiness({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Pain Points Addressed" value={company.pain_points_addressed} />
      <Field label="Focus Sectors" value={company.focus_sectors} />
      <Field label="Offerings" value={company.offerings_description} />
      <Field label="Top Customers" value={company.top_customers} />
      <Field label="Core Value Proposition" value={company.core_value_proposition} />
      <Field label="Unique Differentiators" value={company.unique_differentiators} />
      <Field label="Competitive Advantages" value={company.competitive_advantages} />
      <Field label="Weaknesses & Gaps" value={company.weaknesses_gaps} />
      <Field label="Key Challenges" value={company.key_challenges_needs} />
      <Field label="Key Competitors" value={company.key_competitors} />
      <Field label="TAM" value={company.tam} />
      <Field label="SAM" value={company.sam} />
      <Field label="SOM" value={company.som} />
      <Field label="Market Share" value={company.market_share_percentage} />
      <Field label="Go-to-Market Strategy" value={company.go_to_market_strategy} />
      <Field label="Strategic Priorities" value={company.strategic_priorities} />
      <Field label="Future Projections" value={company.future_projections} />
    </div>
  );
}

export function SectionCulture({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Work Culture" value={company.work_culture_summary} />
      <Field label="Hiring Velocity" value={company.hiring_velocity} />
      <Field label="Employee Turnover" value={company.employee_turnover} />
      <Field label="Avg Retention Tenure" value={company.avg_retention_tenure} />
      <Field label="Manager Quality" value={company.manager_quality} />
      <Field label="Psychological Safety" value={company.psychological_safety} />
      <Field label="Feedback Culture" value={company.feedback_culture} />
      <Field label="Diversity Metrics" value={company.diversity_metrics} />
      <Field label="D&I Score" value={company.diversity_inclusion_score} />
      <Field label="Ethical Standards" value={company.ethical_standards} />
      <Field label="Layoff History" value={company.layoff_history} />
      <Field label="Burnout Risk" value={company.burnout_risk} />
      <Field label="Mission Clarity" value={company.mission_clarity} />
    </div>
  );
}

export function SectionLearning({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Training Spend" value={company.training_spend} />
      <Field label="Onboarding Quality" value={company.onboarding_quality} />
      <Field label="Learning Culture" value={company.learning_culture} />
      <Field label="Exposure Quality" value={company.exposure_quality} />
      <Field label="Mentorship Availability" value={company.mentorship_availability} />
      <Field label="Internal Mobility" value={company.internal_mobility} />
      <Field label="Promotion Clarity" value={company.promotion_clarity} />
      <Field label="Tools Access" value={company.tools_access} />
      <Field label="Role Clarity" value={company.role_clarity} />
      <Field label="Early Ownership" value={company.early_ownership} />
      <Field label="Work Impact" value={company.work_impact} />
      <Field label="Execution/Thinking Balance" value={company.execution_thinking_balance} />
      <Field label="Automation Level" value={company.automation_level} />
      <Field label="Cross-Functional Exposure" value={company.cross_functional_exposure} />
      <Field label="Exit Opportunities" value={company.exit_opportunities} />
      <Field label="Skill Relevance" value={company.skill_relevance} />
      <Field label="Network Strength" value={company.network_strength} />
      <Field label="Global Exposure" value={company.global_exposure} />
      <Field label="External Recognition" value={company.external_recognition} />
    </div>
  );
}

export function SectionCompensation({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Fixed vs Variable Pay" value={company.fixed_vs_variable_pay} />
      <Field label="Bonus Predictability" value={company.bonus_predictability} />
      <Field label="ESOPs / Incentives" value={company.esops_incentives} />
      <Field label="Family Health Insurance" value={company.family_health_insurance} />
      <Field label="Relocation Support" value={company.relocation_support} />
      <Field label="Lifestyle Benefits" value={company.lifestyle_benefits} />
      <Field label="Leave Policy" value={company.leave_policy} />
      <Field label="Health Support" value={company.health_support} />
    </div>
  );
}

export function SectionLogistics({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Remote Policy" value={company.remote_policy_details} />
      <Field label="Typical Hours" value={company.typical_hours} />
      <Field label="Overtime Expectations" value={company.overtime_expectations} />
      <Field label="Weekend Work" value={company.weekend_work} />
      <Field label="Flexibility Level" value={company.flexibility_level} />
      <Field label="Location Centrality" value={company.location_centrality} />
      <Field label="Public Transport" value={company.public_transport_access} />
      <Field label="Cab Policy" value={company.cab_policy} />
      <Field label="Airport Commute" value={company.airport_commute_time} />
      <Field label="Office Zone Type" value={company.office_zone_type} />
      <Field label="Area Safety" value={company.area_safety} />
      <Field label="Safety Policies" value={company.safety_policies} />
      <Field label="Infrastructure Safety" value={company.infrastructure_safety} />
      <Field label="Emergency Preparedness" value={company.emergency_preparedness} />
    </div>
  );
}

export function SectionFinancials({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Annual Revenue" value={company.annual_revenue} />
      <Field label="Annual Profit" value={company.annual_profit} />
      <Field label="Revenue Mix" value={company.revenue_mix} />
      <Field label="Valuation" value={company.valuation} />
      <Field label="YoY Growth Rate" value={company.yoy_growth_rate} />
      <Field label="Profitability Status" value={company.profitability_status} />
      <Field label="Key Investors" value={company.key_investors} />
      <Field label="Recent Funding" value={company.recent_funding_rounds} />
      <Field label="Total Capital Raised" value={company.total_capital_raised} />
      <Field label="Burn Rate" value={company.burn_rate} />
      <Field label="Runway (Months)" value={company.runway_months} />
      <Field label="Burn Multiplier" value={company.burn_multiplier} />
      <Field label="ESG Ratings" value={company.esg_ratings} />
      <Field label="Regulatory Status" value={company.regulatory_status} />
      <Field label="Legal Issues" value={company.legal_issues} />
      <Field label="Supply Chain Dependencies" value={company.supply_chain_dependencies} />
      <Field label="Geopolitical Risks" value={company.geopolitical_risks} />
      <Field label="Macro Risks" value={company.macro_risks} />
    </div>
  );
}

export function SectionTechnology({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Tech Stack" value={company.tech_stack} />
      <Field label="Technology Partners" value={company.technology_partners} />
      <Field label="Intellectual Property" value={company.intellectual_property} />
      <Field label="R&D Investment" value={company.r_and_d_investment} />
      <Field label="AI/ML Adoption Level" value={company.ai_ml_adoption_level} />
      <Field label="Cybersecurity Posture" value={company.cybersecurity_posture} />
      <Field label="Innovation Roadmap" value={company.innovation_roadmap} />
      <Field label="Product Pipeline" value={company.product_pipeline} />
      <Field label="Tech Adoption Rating" value={company.tech_adoption_rating} />
      <Field label="Partnership Ecosystem" value={company.partnership_ecosystem} />
    </div>
  );
}

export function SectionLeadership({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="CEO" value={company.ceo_name} />
      <Field label="CEO LinkedIn" value={company.ceo_linkedin_url} />
      <Field label="Key Leaders" value={company.key_leaders} />
      <Field label="Board Members" value={company.board_members} />
      <Field label="Warm Intro Pathways" value={company.warm_intro_pathways} />
      <Field label="Decision Maker Access" value={company.decision_maker_access} />
      <Field label="Primary Email" value={company.primary_contact_email} />
      <Field label="Primary Phone" value={company.primary_phone_number} />
      <Field label="Contact Person" value={company.contact_person_name} />
      <Field label="Contact Title" value={company.contact_person_title} />
      <Field label="Contact Email" value={company.contact_person_email} />
      <Field label="Contact Phone" value={company.contact_person_phone} />
    </div>
  );
}

export function SectionBrand({ company }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-0 animate-fade-in">
      <Field label="Website" value={company.website_url} />
      <Field label="Website Quality" value={company.website_quality} />
      <Field label="Website Rating" value={company.website_rating} />
      <Field label="Traffic Rank" value={company.website_traffic_rank} />
      <Field label="Social Media Followers" value={company.social_media_followers} />
      <Field label="Glassdoor Rating" value={company.glassdoor_rating} />
      <Field label="Indeed Rating" value={company.indeed_rating} />
      <Field label="Google Rating" value={company.google_rating} />
      <Field label="LinkedIn" value={company.linkedin_url} />
      <Field label="Twitter" value={company.twitter_handle} />
      <Field label="Facebook" value={company.facebook_url} />
      <Field label="Instagram" value={company.instagram_url} />
      <Field label="Marketing Video" value={company.marketing_video_url} />
      <Field label="Customer Testimonials" value={company.customer_testimonials} />
      <Field label="Awards & Recognitions" value={company.awards_recognitions} />
      <Field label="Brand Sentiment Score" value={company.brand_sentiment_score} />
      <Field label="Event Participation" value={company.event_participation} />
    </div>
  );
}
