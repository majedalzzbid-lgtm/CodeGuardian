import { useState } from "react";
import { Check, GitPullRequest, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { RefactorSuggestion } from "@/lib/dashboard-data";
import { useI18n } from "@/lib/i18n";

interface Props {
  refactor: RefactorSuggestion;
  hasFindings?: boolean;
}

type PrState = "idle" | "generating" | "ready" | "creating" | "created";

export function DiffViewer({ refactor, hasFindings = true }: Props) {
  const { t } = useI18n();
  const [pr, setPr] = useState<PrState>(hasFindings ? "ready" : "idle");
  const [prUrl, setPrUrl] = useState<string | null>(null);

  const generate = () => {
    if (pr === "generating") return;
    setPr("generating");
    setTimeout(() => setPr("ready"), 1400);
  };

  const approve = () => {
    if (pr !== "ready") return;
    setPr("creating");
    setTimeout(() => {
      setPrUrl(`https://github.com/org/repo/pull/${Math.floor(Math.random() * 900) + 100}`);
      setPr("created");
    }, 1800);
  };

  // Simulated before/after report — driven by refactor context
  const before = { security: 34, performance: 62, coverage: 41 };
  const after = { security: 96, performance: 88, coverage: 79 };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel" dir="ltr">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("diff.selfUpdate")}
            </h3>
            <div className="font-mono text-[11px] text-foreground/80">{refactor.file_path}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-accent-purple/30 bg-accent-purple/10 px-2 py-1 text-[10px] font-bold uppercase text-accent-purple">
            {pr === "created" ? t("diff.prCreated") : pr === "ready" ? t("diff.ready") : pr === "generating" ? t("diff.generating") : t("diff.idle")}
          </span>
        </div>
      </div>

      {/* Before / After metrics report */}
      <div className="grid grid-cols-3 gap-3 border-b border-white/5 bg-black/10 p-4">
        <MetricReport icon={<ShieldCheck className="size-3.5" />} label={t("diff.security")} before={before.security} after={after.security} unit="%" />
        <MetricReport icon={<Zap className="size-3.5" />} label={t("diff.performance")} before={before.performance} after={after.performance} unit="%" />
        <MetricReport icon={<Check className="size-3.5" />} label={t("diff.coverage")} before={before.coverage} after={after.coverage} unit="%" />
      </div>

      <div className="grid grid-cols-1 font-mono text-xs md:grid-cols-2">
        <div className="border-b border-white/5 bg-red-500/5 p-4 md:border-b-0 md:border-r">
          <div className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">
            {t("diff.current")}
          </div>
          <div className="space-y-1">
            {refactor.old_code.map((l) => (
              <div key={l.line} className={`flex gap-4 ${l.changed ? "bg-red-500/20" : "opacity-50"}`}>
                <span className="w-4 text-right">{l.line}</span>
                <span className="whitespace-pre">{l.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-500/5 p-4">
          <div className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">
            {t("diff.optimized")}
          </div>
          <div className="space-y-1">
            {refactor.new_code.map((l) => (
              <div key={l.line} className={`flex gap-4 ${l.changed ? "bg-green-500/20" : "opacity-50"}`}>
                <span className="w-4 text-right">{l.line}</span>
                <span className="whitespace-pre">{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 border-t border-white/5 bg-black/40 p-4 sm:flex-row sm:items-center">
        <div className="text-[11px] text-muted-foreground">
          {pr === "created" && prUrl ? (
            <span className="break-all font-mono text-accent-cyan">{prUrl}</span>
          ) : (
            <span>{t("diff.approveHint")}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={generate}
            disabled={pr === "generating" || pr === "creating"}
            className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground/90 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {pr === "generating" ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            {t("diff.generate")}
          </button>
          <button
            onClick={approve}
            disabled={pr !== "ready" || !hasFindings}
            className="relative flex items-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-accent-cyan to-accent-purple px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-bg-deep shadow-[0_0_18px_oklch(0.60_0.27_310/0.35)] transition-all hover:shadow-[0_0_26px_oklch(0.60_0.27_310/0.55)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {pr === "creating" ? (
              <><Loader2 className="size-3.5 animate-spin" /> {t("diff.creating")}</>
            ) : pr === "created" ? (
              <><Check className="size-3.5" /> {t("diff.approved")}</>
            ) : (
              <><GitPullRequest className="size-3.5" /> {t("diff.approve")}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricReport({ icon, label, before, after, unit }: { icon: React.ReactNode; label: string; before: number; after: number; unit: string }) {
  const delta = after - before;
  const positive = delta >= 0;
  return (
    <div className="rounded-lg border border-white/5 bg-black/40 p-3">
      <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5">{icon}{label}</span>
        <span className={`font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}>{positive ? "+" : ""}{delta}{unit}</span>
      </div>
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="text-muted-foreground line-through">{before}{unit}</span>
        <span className="text-muted-foreground/50">→</span>
        <span className="font-bold text-foreground">{after}{unit}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple transition-[width] duration-700"
          style={{ width: `${after}%` }}
        />
      </div>
    </div>
  );
}
