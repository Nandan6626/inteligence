import { useCompanies } from "@/hooks/useCompanies";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, Target, AlertTriangle, CheckCircle2 } from "lucide-react";

const SkillMapping = () => {
  const { data: companies = [] } = useCompanies();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const s = skillInput.trim().toLowerCase();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const results = useMemo(() => {
    if (skills.length === 0 || companies.length === 0) return [];

    return companies.map((company) => {
      const techStack = (company.tech_stack || "").toLowerCase();
      const aiLevel = (company.ai_ml_adoption_level || "").toLowerCase();
      const automationLevel = (company.automation_level || "").toLowerCase();
      const relevance = (company.skill_relevance || "").toLowerCase();

      const corpus = `${techStack} ${aiLevel} ${automationLevel} ${relevance}`;

      const matched = skills.filter((s) => corpus.includes(s));
      const gaps = skills.filter((s) => !corpus.includes(s));
      const score = skills.length > 0 ? matched.length / skills.length : 0;

      let fit: "High" | "Medium" | "Low" = "Low";
      if (score >= 0.7) fit = "High";
      else if (score >= 0.4) fit = "Medium";

      return { company, matched, gaps, score, fit };
    }).sort((a, b) => b.score - a.score);
  }, [companies, skills]);

  const fitColors = {
    High: "bg-success/10 text-success border-success/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="container py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Skill Mapping</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your skills to find matching companies and identify gaps
        </p>
      </div>

      {/* Skill input */}
      <div className="max-w-lg mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a skill (e.g., Kubernetes, Python, AWS)..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className="h-9 text-sm"
          />
          <Button onClick={addSkill} size="sm" className="h-9 px-3">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 text-xs">
                {skill}
                <button onClick={() => removeSkill(skill)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {companies.length === 0 ? (
        <div className="text-center py-16">
          <Target className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No companies available</h3>
          <p className="text-sm text-muted-foreground">
            Connect your database to use skill mapping.
          </p>
        </div>
      ) : skills.length > 0 && results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div key={idx} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-card-foreground">
                    {result.company.name || "Unnamed"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.company.category}
                  </p>
                </div>
                <Badge className={`${fitColors[result.fit]} border text-xs`}>
                  {result.fit} Fit
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {result.matched.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      <span className="text-xs font-medium text-foreground">Matched Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.matched.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs bg-success/5 border-success/20 text-success">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.gaps.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      <span className="text-xs font-medium text-foreground">Skill Gaps</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.gaps.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs bg-warning/5 border-warning/20 text-warning">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : skills.length > 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No matching results found.
        </p>
      ) : null}
    </div>
  );
};

export default SkillMapping;
