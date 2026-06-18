import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, X, Upload, RotateCcw, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  api,
  type BiasResponse,
  type Candidate,
  type JD,
  type RankResponse,
  type SampleBrief,
} from "@/lib/api";

export const Route = createFileRoute("/")({
  component: SignalPage,
});

/* ============================== shared bits ============================== */

function Eyebrow({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-signal text-sm tracking-[0.2em]">{number}</span>
      <span className="font-mono text-mist text-xs tracking-[0.2em] uppercase whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}

function Stat({
  value,
  label,
  amber = false,
}: {
  value: string | number;
  label: string;
  amber?: boolean;
}) {
  return (
    <div className="bg-panel border border-line rounded-[10px] px-4 py-3 min-w-0 flex-1">
      <div
        className={cn(
          "font-mono font-bold text-[22px] leading-tight truncate",
          amber ? "text-signal" : "text-text",
        )}
        title={String(value)}
      >
        {value}
      </div>
      <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-1">
        {label}
      </div>
    </div>
  );
}

function Chip({
  children,
  variant = "amber",
}: {
  children: React.ReactNode;
  variant?: "amber" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border",
        variant === "amber"
          ? "border-signal/60 text-signal"
          : "border-line text-mist",
      )}
    >
      {children}
    </span>
  );
}

function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin", className)} />;
}

/* ============================== Match meter ============================== */

function Meter({
  label,
  value,
  index,
}: {
  label: string;
  value: number;
  index: number;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono uppercase text-[10px] tracking-[0.2em] text-mist w-12 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-[7px] bg-line rounded-full overflow-hidden min-w-0">
        <div
          className="meter-fill h-full rounded-full"
          style={{
            width: `${pct}%`,
            animationDelay: `${index * 90}ms`,
            background: "linear-gradient(90deg, #c2923a 0%, #E6B450 100%)",
          }}
        />
      </div>
      <span className="font-mono text-[12px] text-text w-8 text-right shrink-0">
        {String(Math.round(pct)).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ============================== Candidate Card ============================== */

function CandidateCard({ c, rank }: { c: Candidate; rank: number }) {
  const meters = [
    { label: "HARD", value: c.breakdown.hard_skills },
    { label: "EXP", value: c.breakdown.experience },
    { label: "SOFT", value: c.breakdown.soft_skills },
    { label: "DOMAIN", value: c.breakdown.domain },
  ];

  const subline = [
    c.profile.current_title,
    ...c.profile.companies.slice(0, 2),
    `${c.profile.years_experience} yrs`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="bg-panel border border-line rounded-[14px] p-5 md:p-6 transition-colors duration-200 hover:border-signal">
      <header className="flex items-start gap-4">
        <div className="font-mono text-signal border border-signal/60 rounded-md px-2 py-1 text-sm shrink-0">
          {String(rank).padStart(2, "0")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-[19px] text-text leading-tight">
              {c.name}
            </h3>
            <Chip>{c.profile.background_type}</Chip>
          </div>
          <p className="text-mist text-[12.5px] mt-1 font-sans">{subline}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono font-bold text-signal text-[34px] leading-none">
            {Math.round(c.overall_score)}
          </div>
          <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-1">
            match
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-5">
        {meters.map((m, i) => (
          <Meter key={m.label} label={m.label} value={m.value} index={i} />
        ))}
      </div>

      <p className="mt-5 text-text border-l-2 border-signal pl-4 text-[14px] leading-relaxed">
        {c.fit_summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div>
          <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
            Gaps
          </div>
          <ul className="space-y-1.5 text-[13.5px] text-text">
            {c.gaps.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-mist">—</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
            Probe in interview
          </div>
          <ul className="space-y-1.5 text-[13.5px] text-text">
            {c.probe_in_interview.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-mist">—</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
          Interview signal
        </div>
        <ul className="space-y-1.5 text-[13.5px] text-text">
          {c.interview_questions.map((q, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-signal font-mono text-[11px] mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ============================== Noise row ============================== */

function NoiseRow({ c, rank }: { c: Candidate; rank: number }) {
  const pct = Math.max(0, Math.min(100, c.overall_score));
  return (
    <div className="flex items-center gap-4 bg-panel/50 border border-line rounded-[10px] px-4 py-2.5 opacity-[0.82] hover:opacity-100 transition-opacity">
      <span className="font-mono text-mist text-[12px] w-8 shrink-0">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0 truncate text-[13px]">
        <span className="text-text">{c.name}</span>
        <span className="text-mist"> — {c.profile.current_title}</span>
      </div>
      <div className="h-[5px] w-[120px] bg-line rounded-full overflow-hidden shrink-0">
        <div className="h-full bg-signal" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[12px] text-text w-8 text-right shrink-0">
        {String(Math.round(pct)).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ============================== Bias panel ============================== */

function BiasPanel({ b }: { b: BiasResponse }) {
  const color = b.is_homogeneous ? "warn" : "good";
  return (
    <div
      className={cn(
        "border rounded-[14px] p-5 md:p-6 bg-panel",
        color === "warn" ? "border-warn" : "border-good",
      )}
    >
      <h3
        className={cn(
          "font-display font-semibold text-[20px] leading-tight",
          color === "warn" ? "text-warn" : "text-good",
        )}
      >
        {b.is_homogeneous
          ? `Shortlist looks homogeneous — homogeneity ${b.homogeneity_score}/100`
          : `Shortlist looks balanced — homogeneity ${b.homogeneity_score}/100`}
      </h3>

      <Section title="Patterns detected">
        <ul className="space-y-1.5">
          {b.patterns.map((p, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] text-text">
              <span className="text-mist">—</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Strong candidates you may be overlooking">
        <ul className="space-y-1.5">
          {b.overlooked_candidates.map((o, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] text-text">
              <span className="text-mist">—</span>
              <span>
                <span className="font-display font-semibold">{o.name}</span> — {o.reason}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Recommendations">
        <ul className="space-y-1.5">
          {b.recommendations.map((r, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] text-text">
              <span className="text-mist">—</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

/* ============================== Page ============================== */

function SignalPage() {
  // Sidebar / control
  const [health, setHealth] = useState<{ ok: boolean; model: string } | null>(null);
  const [healthErr, setHealthErr] = useState(false);
  const [shortlistSize, setShortlistSize] = useState(8);

  // Stage 01
  const [briefs, setBriefs] = useState<SampleBrief[]>([]);
  const [briefId, setBriefId] = useState<string>("");
  const [jdText, setJdText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [jd, setJd] = useState<JD | null>(null);
  const [jdFileLoading, setJdFileLoading] = useState(false);
  const jdFileInputRef = useRef<HTMLInputElement | null>(null);

  // Stage 02
  const [files, setFiles] = useState<File[]>([]);
  const [useSamples, setUseSamples] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stage 03
  const [ranking, setRanking] = useState(false);
  const [rank, setRank] = useState<RankResponse | null>(null);
  const [bias, setBias] = useState<BiasResponse | null>(null);
  const [auditing, setAuditing] = useState(false);
  const [regenName, setRegenName] = useState<string>("");
  const [regenerating, setRegenerating] = useState(false);

  /* ---- bootstrap ---- */
  useEffect(() => {
    api.health()
      .then((h) => setHealth(h))
      .catch(() => setHealthErr(true));
    api.sampleBriefs()
      .then((r) => setBriefs(r.briefs))
      .catch(() => {/* silent — non-critical */});
  }, []);

  /* ---- derived ---- */
  const totalInPile = useSamples ? 20 : files.length;
  const canRun = !!jd && (useSamples || files.length > 0);
  const shortlist = useMemo(
    () => (rank ? rank.results.slice(0, shortlistSize) : []),
    [rank, shortlistSize],
  );
  const belowCut = useMemo(
    () => (rank ? rank.results.slice(shortlistSize) : []),
    [rank, shortlistSize],
  );

  useEffect(() => {
    if (shortlist.length && !shortlist.find((c) => c.name === regenName)) {
      setRegenName(shortlist[0]?.name ?? "");
    }
  }, [shortlist, regenName]);

  /* ---- actions ---- */
  async function handleParse() {
    if (!jdText.trim()) return;
    setParsing(true);
    try {
      const parsed = await api.parseJD(jdText);
      setJd(parsed);
    } catch (e) {
      toast.error(errMsg(e, "Couldn't parse the role."));
    } finally {
      setParsing(false);
    }
  }

  function handleLoadBrief() {
    const b = briefs.find((x) => x.id === briefId);
    if (!b) {
      toast.error("Pick a sample brief first.");
      return;
    }
    setJdText(b.text);
  }

  async function handleJdFile(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    const allowed = [".pdf", ".docx", ".txt"];
    if (!allowed.some((ext) => f.name.toLowerCase().endsWith(ext))) {
      toast.error(`${f.name} isn't supported — use PDF, DOCX, or TXT.`);
      return;
    }
    setJdFileLoading(true);
    try {
      const { text } = await api.extractText(f);
      setJdText(text);
      toast.success(`Loaded ${f.name} — review it, then parse the role.`);
    } catch (e) {
      toast.error(errMsg(e, "Couldn't read that file."));
    } finally {
      setJdFileLoading(false);
    }
  }

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const allowed = [".pdf", ".docx", ".txt"];
    const next: File[] = [];
    for (const f of Array.from(list)) {
      const ok = allowed.some((ext) => f.name.toLowerCase().endsWith(ext));
      if (!ok) {
        toast.error(`${f.name} isn't supported — use PDF, DOCX, or TXT.`);
        continue;
      }
      next.push(f);
    }
    setFiles((prev) => [...prev, ...next]);
  }

  async function handleRank() {
    if (!jd) return;
    setRanking(true);
    setBias(null);
    try {
      const r = await api.rank({ jd, shortlist_size: shortlistSize, use_samples: useSamples, files });
      setRank(r);
    } catch (e) {
      toast.error(errMsg(e, "Couldn't reach the API. Is the backend running on " + (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000") + "?"));
    } finally {
      setRanking(false);
    }
  }

  async function handleBias() {
    if (!rank) return;
    setAuditing(true);
    try {
      const b = await api.bias(rank.results, shortlistSize);
      setBias(b);
    } catch (e) {
      toast.error(errMsg(e, "Couldn't audit the shortlist."));
    } finally {
      setAuditing(false);
    }
  }

  async function handleRegenerate() {
    if (!jd || !rank || !regenName) return;
    const target = rank.results.find((c) => c.name === regenName);
    if (!target) return;
    setRegenerating(true);
    try {
      const { interview_questions } = await api.regenerateQuestions(jd, target, 5);
      setRank({
        ...rank,
        results: rank.results.map((c) =>
          c.name === regenName ? { ...c, interview_questions } : c,
        ),
      });
      toast.success("Fresh questions generated.");
    } catch (e) {
      toast.error(errMsg(e, "Couldn't regenerate questions."));
    } finally {
      setRegenerating(false);
    }
  }

  /* ============================== render ============================== */
  return (
    <div className="min-h-screen text-text">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6 md:py-10 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-panel/40 border border-line rounded-[12px] p-5">
            <div className="font-mono text-signal text-[11px] tracking-[0.2em] uppercase">
              ◉ Control
            </div>

            <div className="mt-5 space-y-1.5">
              <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist">
                Model
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    healthErr ? "bg-warn" : health ? "bg-signal signal-pulse" : "bg-mist",
                  )}
                />
                {healthErr ? (
                  <span className="text-[12px] text-warn">API unreachable</span>
                ) : health ? (
                  <span className="font-mono text-[11px] text-signal border border-signal/40 rounded px-2 py-0.5 truncate">
                    {health.model}
                  </span>
                ) : (
                  <span className="text-[12px] text-mist">Connecting…</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist block mb-2">
                Shortlist size — the signal cut
              </label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[shortlistSize]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(v) => setShortlistSize(v[0] ?? 8)}
                  className="flex-1"
                />
                <span className="font-mono text-signal text-[14px] w-6 text-right">
                  {shortlistSize}
                </span>
              </div>
              <p className="text-[11.5px] text-mist mt-2 leading-snug">
                Everyone below the cut drops to the noise floor.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          {/* Hero */}
          <section className="relative border-t-2 border-signal pt-8 pb-10 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-100"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(242,169,59,0.04) 0px, rgba(242,169,59,0.04) 1px, transparent 1px, transparent 5px)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 font-mono text-signal text-[11px] tracking-[0.2em] uppercase">
                <span className="h-2 w-2 rounded-full bg-signal signal-pulse" />
                Signal · Talent Analyzer
              </div>
              <h1 className="font-display font-bold text-[36px] md:text-[42px] leading-[1.05] tracking-[-0.02em] mt-4">
                <span className="text-text">Surface the signal.</span>
                <br />
                <span className="text-signal">Explain the call.</span>
              </h1>
              <p className="text-mist mt-4 max-w-[46ch] text-[14.5px] leading-relaxed">
                Screen the whole pile. Hear the few candidates who matter through the noise —
                scored on meaning, not keywords, with every judgement on the record.
              </p>
            </div>
          </section>

          {/* Stage 01 — SOURCE */}
          <section className="mt-10">
            <Eyebrow number="01" label="Source · The role" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <Textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste a job description, or load a sample brief →"
                  className="bg-panel border-line text-text placeholder:text-mist/60 min-h-[190px] resize-y rounded-[10px] focus-visible:border-signal focus-visible:ring-signal/30"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-3">
                <div>
                  <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
                    Sample brief
                  </div>
                  <Select value={briefId} onValueChange={setBriefId}>
                    <SelectTrigger className="bg-panel border-line text-text rounded-[10px] h-11 focus:border-signal focus:ring-signal/30">
                      <SelectValue placeholder="Choose a brief…" />
                    </SelectTrigger>
                    <SelectContent className="bg-panel border-line text-text">
                      {briefs.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleLoadBrief}
                  className="bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11"
                >
                  Load this brief
                </Button>

                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px bg-line" />
                  <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist">or</span>
                  <div className="flex-1 h-px bg-line" />
                </div>

                <input
                  ref={jdFileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => { handleJdFile(e.target.files); e.target.value = ""; }}
                />
                <Button
                  variant="secondary"
                  onClick={() => jdFileInputRef.current?.click()}
                  disabled={jdFileLoading}
                  className="bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11"
                >
                  {jdFileLoading
                    ? <><Spinner className="h-4 w-4" /> Reading…</>
                    : <><FileUp className="h-4 w-4" /> Upload JD file</>}
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <Button
                onClick={handleParse}
                disabled={!jdText.trim() || parsing}
                className="bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium"
              >
                {parsing ? <><Spinner className="h-4 w-4" /> Parsing…</> : "Parse the role"}
              </Button>
            </div>

            {jd && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat value={jd.title} label="role" amber />
                  <Stat value={jd.experience_level} label="level" />
                  <Stat value={jd.must_have.length} label="must-haves" />
                  <Stat value={jd.hard_skills.length} label="hard skills" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel border border-line rounded-[12px] p-5">
                  <div>
                    <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
                      Must-have
                    </div>
                    <ul className="space-y-1.5 text-[13.5px]">
                      {jd.must_have.map((x, i) => (
                        <li key={i} className="flex gap-2"><span className="text-mist">—</span><span>{x}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
                      Nice-to-have
                    </div>
                    <ul className="space-y-1.5 text-[13.5px]">
                      {jd.nice_to_have.map((x, i) => (
                        <li key={i} className="flex gap-2"><span className="text-mist">—</span><span>{x}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {jd.hard_skills.map((s) => (
                      <Chip key={s} variant="amber">{s}</Chip>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jd.soft_skills.map((s) => (
                      <Chip key={s} variant="muted">{s}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Stage 02 — INTAKE */}
          <section className="mt-12">
            <Eyebrow number="02" label="Intake · The pile" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "bg-panel border-2 border-dashed rounded-[12px] p-6 text-center transition-colors cursor-pointer",
                    dragOver ? "border-signal" : "border-line hover:border-signal/60",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                  />
                  <Upload className="h-6 w-6 text-signal mx-auto mb-2" />
                  <div className="text-[14px] text-text">Drop CVs here, or click to browse</div>
                  <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-2">
                    Upload CVs (PDF / DOCX / TXT) — batch upload supported
                  </div>
                </div>

                {files.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 bg-panel border border-line rounded-[8px] px-3 py-2 text-[13px]">
                        <span className="flex-1 truncate">{f.name}</span>
                        <button
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-mist hover:text-warn"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-3">
                <Button
                  onClick={() => setUseSamples((v) => !v)}
                  className={cn(
                    "rounded-[10px] h-11 border",
                    useSamples
                      ? "bg-signal/10 border-signal text-signal hover:bg-signal/20"
                      : "bg-panel-2 border-line text-text hover:bg-panel-2/80",
                  )}
                >
                  Use 20 sample candidates
                </Button>
                {useSamples && (
                  <p className="text-[12px] text-mist">
                    20 bundled sample CVs will be analyzed.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat value={totalInPile} label="CVs in the pile" amber />
              <Stat value="local" label="parsed without api" />
            </div>
          </section>

          {/* Stage 03 — ANALYSIS */}
          <section className="mt-12">
            <Eyebrow number="03" label="Analysis · The signal" />

            <Button
              onClick={handleRank}
              disabled={!canRun || ranking}
              className="bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium"
            >
              {ranking ? <><Spinner className="h-4 w-4" /> Scoring…</> : "Run analysis"}
            </Button>
            {!canRun && !ranking && (
              <p className="text-[12.5px] text-mist mt-2">
                Parse a role and load some CVs to run the analysis.
              </p>
            )}

            {ranking && (
              <div className="mt-6 bg-panel border border-line rounded-[12px] p-6 flex items-center gap-4">
                <Spinner className="h-5 w-5 text-signal" />
                <div className="text-[14px]">
                  Scoring {totalInPile} candidates against the role…
                </div>
              </div>
            )}

            {rank && !ranking && (
              <div className="mt-6 space-y-8">
                {/* stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat value={rank.count} label="screened" />
                  <Stat value={Math.min(shortlistSize, rank.count)} label="surfaced" amber />
                  <Stat
                    value={`${Math.round(rank.elapsed_seconds)}s`}
                    label={rank.elapsed_seconds < 60 ? "under 60s ✓" : "elapsed"}
                  />
                  <Stat value={rank.api_calls} label="api calls" />
                </div>

                {rank.errors.length > 0 && (
                  <div className="border border-signal/40 bg-signal/5 rounded-[10px] p-3 text-[12.5px] text-signal">
                    {rank.errors.length} file{rank.errors.length === 1 ? "" : "s"} failed to parse:{" "}
                    {rank.errors.map((e) => e.file).join(", ")}
                  </div>
                )}

                {/* shortlist */}
                <div>
                  <div className="font-mono uppercase tracking-[0.2em] text-[11px] text-signal mb-4">
                    · Signal — the shortlist
                  </div>
                  <div className="space-y-4">
                    {shortlist.map((c, i) => (
                      <CandidateCard key={c.name + i} c={c} rank={i + 1} />
                    ))}
                  </div>
                </div>

                {/* regenerate row */}
                {shortlist.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-3">
                      <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2">
                        Regenerate interview questions for
                      </div>
                      <Select value={regenName} onValueChange={setRegenName}>
                        <SelectTrigger className="bg-panel border-line rounded-[10px] h-11 focus:border-signal">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-panel border-line">
                          {shortlist.map((c, i) => (
                            <SelectItem key={c.name + i} value={c.name}>
                              #{i + 1} {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        variant="secondary"
                        onClick={handleRegenerate}
                        disabled={regenerating || !regenName}
                        className="bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11 w-full"
                      >
                        {regenerating ? (
                          <><Spinner className="h-4 w-4" /> Regenerating…</>
                        ) : (
                          <><RotateCcw className="h-4 w-4" /> Regenerate questions</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* noise floor */}
                {belowCut.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist whitespace-nowrap">
                        Noise floor · {belowCut.length} below the cut
                      </span>
                      <div className="flex-1 border-t border-dashed border-line" />
                    </div>
                    <div className="space-y-2">
                      {belowCut.map((c, i) => (
                        <NoiseRow key={c.name + i} c={c} rank={shortlistSize + i + 1} />
                      ))}
                    </div>
                  </div>
                )}

                {/* bias */}
                <div>
                  <Eyebrow number="·" label="Diversity scan" />
                  {!bias && (
                    <Button
                      onClick={handleBias}
                      disabled={auditing}
                      className="bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium"
                    >
                      {auditing ? <><Spinner className="h-4 w-4" /> Auditing…</> : "Audit the shortlist for bias"}
                    </Button>
                  )}
                  {bias && <BiasPanel b={bias} />}
                </div>
              </div>
            )}
          </section>

          <footer className="mt-16 pb-10 border-t border-line pt-6">
            <div className="font-mono uppercase tracking-[0.2em] text-[10px] text-mist">
              Signal · Talent Analyzer — front-end · {API_DISPLAY()}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function API_DISPLAY() {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";
}

function errMsg(e: unknown, fallback: string): string {
  if (e instanceof TypeError) return fallback;
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}
