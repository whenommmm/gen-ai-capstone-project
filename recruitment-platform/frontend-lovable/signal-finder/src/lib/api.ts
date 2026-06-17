export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export interface JD {
  title: string;
  domain: string;
  experience_level: string;
  hard_skills: string[];
  soft_skills: string[];
  must_have: string[];
  nice_to_have: string[];
  responsibilities: string[];
}

export interface SampleBrief {
  id: string;
  label: string;
  text: string;
}

export interface CandidateProfile {
  name: string;
  years_experience: number;
  current_title: string;
  skills: string[];
  education: string[];
  companies: string[];
  career_trajectory: string;
  background_type: "traditional" | "non-traditional" | "career-switcher" | "self-taught";
}

export interface Candidate {
  name: string;
  source_file: string;
  overall_score: number;
  breakdown: {
    hard_skills: number;
    soft_skills: number;
    experience: number;
    domain: number;
  };
  fit_summary: string;
  gaps: string[];
  probe_in_interview: string[];
  interview_questions: string[];
  profile: CandidateProfile;
}

export interface RankResponse {
  count: number;
  elapsed_seconds: number;
  api_calls: number;
  errors: { file: string; error: string }[];
  results: Candidate[];
}

export interface BiasResponse {
  is_homogeneous: boolean;
  homogeneity_score: number;
  patterns: string[];
  overlooked_candidates: { name: string; reason: string }[];
  recommendations: string[];
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) msg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      else if (data?.error) msg = data.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async health(): Promise<{ ok: boolean; model: string }> {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return handle(res);
  },
  async sampleBriefs(): Promise<{ briefs: SampleBrief[] }> {
    const res = await fetch(`${API_BASE_URL}/api/sample-briefs`);
    return handle(res);
  },
  async extractText(file: File): Promise<{ text: string }> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE_URL}/api/extract-text`, { method: "POST", body: fd });
    return handle(res);
  },
  async parseJD(jd_text: string): Promise<JD> {
    const res = await fetch(`${API_BASE_URL}/api/parse-jd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text }),
    });
    return handle(res);
  },
  async rank(opts: {
    jd: JD;
    shortlist_size: number;
    use_samples: boolean;
    files: File[];
  }): Promise<RankResponse> {
    const fd = new FormData();
    fd.append("jd", JSON.stringify(opts.jd));
    fd.append("shortlist_size", String(opts.shortlist_size));
    fd.append("use_samples", opts.use_samples ? "true" : "false");
    if (!opts.use_samples) {
      for (const f of opts.files) fd.append("files", f);
    }
    const res = await fetch(`${API_BASE_URL}/api/rank`, { method: "POST", body: fd });
    return handle(res);
  },
  async bias(results: Candidate[], shortlist_size: number): Promise<BiasResponse> {
    const res = await fetch(`${API_BASE_URL}/api/bias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, shortlist_size }),
    });
    return handle(res);
  },
  async regenerateQuestions(jd: JD, candidate: Candidate, n = 5): Promise<{ interview_questions: string[] }> {
    const res = await fetch(`${API_BASE_URL}/api/regenerate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd, candidate, n }),
    });
    return handle(res);
  },
};
