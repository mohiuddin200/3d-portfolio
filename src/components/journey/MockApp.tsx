"use client";

import { memo, useLayoutEffect, useRef, type Ref } from "react";
import { gsap } from "@/lib/gsap";
import { buildJourneyTimeline, progressForStage } from "./journeyTimeline";

interface MockAppProps {
  /** When set, renders a static snapshot of this stage (no scroll driving). */
  stage?: number;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

const MEMBERS = [
  ["Aylin Demir", "Pro", "Active"],
  ["Jonas Weber", "Basic", "Active"],
  ["Mira Novak", "Pro", "Paused"],
  ["Leo Fischer", "Team", "Active"],
  ["Sara Khan", "Basic", "Trial"],
  ["Omar Haddad", "Pro", "Active"],
];

const STATS = [
  ["Members", "1,284"],
  ["MRR", "€12.4k"],
  ["Churn", "1.8%"],
];

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block size-1.5 rounded-full ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* Wireframe overlay: dashed boxes in the same layout as the skin        */
/* ------------------------------------------------------------------ */
function Wire() {
  const box = "rounded border border-dashed border-white/25";
  return (
    <div data-j="wire" className="absolute inset-0 flex p-2 gap-2">
      <div className={`${box} w-[14%] shrink-0`} />
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className={`${box} h-[11%]`} />
        <div className="grid grid-cols-3 gap-2 h-[17%]">
          <div className={box} />
          <div className={box} />
          <div className={box} />
        </div>
        <div className="flex gap-2 flex-1 min-h-0">
          <div className={`${box} flex-[2]`} />
          <div className={`${box} flex-1`} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Real skin                                                            */
/* ------------------------------------------------------------------ */
function Skin() {
  return (
    <div data-j="skin" className="absolute inset-0 flex text-[8px] leading-none text-white/70">
      {/* Sidebar */}
      <aside className="w-[14%] shrink-0 border-r border-white/8 bg-white/[0.03] p-2 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="size-3 rounded bg-gold" />
          <span className="h-1.5 w-8 rounded bg-white/40" />
        </div>
        {["Overview", "Members", "Billing", "Reports", "Settings"].map((item, i) => (
          <div
            key={item}
            className={`flex items-center gap-1.5 rounded px-1.5 py-1 ${i === 1 ? "bg-gold/15 text-gold" : "text-white/45"}`}
          >
            <span className={`size-1.5 rounded-sm ${i === 1 ? "bg-gold" : "bg-white/30"}`} />
            <span>{item}</span>
          </div>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col p-2 gap-2 min-w-0 relative overflow-hidden">
        {/* Topbar */}
        <div className="h-[11%] flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] px-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-[9px]">Members</span>
            <span data-j="filter" className="rounded-full border border-gold/60 bg-gold/15 px-1.5 py-0.5 text-gold">
              Plan: Pro
            </span>
            <span className="rounded-full border border-white/10 px-1.5 py-0.5 text-white/40">Active</span>
          </div>
          <div className="relative flex items-center">
            <span data-j="signin" className="rounded bg-gold px-2 py-1 text-black font-semibold">
              Sign in
            </span>
            <span data-j="avatar" className="absolute right-0 flex items-center gap-1.5">
              <span className="h-1.5 w-7 rounded bg-white/30" />
              <span className="size-4 rounded-full bg-linear-to-br from-gold to-amber-700 ring-1 ring-gold/50" />
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 h-[17%]">
          {STATS.map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/8 bg-white/[0.02] p-2 flex flex-col justify-between">
              <span className="text-white/40">{label}</span>
              <span className="text-white text-[11px] font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* Table + chat */}
        <div className="flex gap-2 flex-1 min-h-0">
          <div className="flex-[2] rounded-md border border-white/8 bg-white/[0.02] p-2 flex flex-col gap-1 min-w-0 relative">
            <div className="grid grid-cols-[2fr_1fr_1fr] text-white/35 pb-1 border-b border-white/8">
              <span>Name</span>
              <span>Plan</span>
              <span>Status</span>
            </div>
            <div className="relative flex-1">
              {/* Skeleton */}
              <div data-j="skeleton" className="absolute inset-0 flex flex-col gap-1.5 pt-1">
                {MEMBERS.map((_, i) => (
                  <div key={i} className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center h-3">
                    <span className="h-1.5 rounded bg-white/10 w-[70%]" />
                    <span className="h-1.5 rounded bg-white/10 w-[50%]" />
                    <span className="h-1.5 rounded bg-white/10 w-[60%]" />
                  </div>
                ))}
              </div>
              {/* Real rows */}
              <div className="absolute inset-0 flex flex-col gap-1.5 pt-1">
                {MEMBERS.map(([name, plan, status]) => (
                  <div key={name} data-j="row" className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center h-3">
                    <span className="text-white/80 truncate">{name}</span>
                    <span className={plan === "Pro" ? "text-gold" : "text-white/50"}>{plan}</span>
                    <span className="flex items-center gap-1 text-white/50">
                      <Dot className={status === "Active" ? "bg-emerald-400" : status === "Trial" ? "bg-sky-400" : "bg-amber-400"} />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 rounded-md border border-white/8 bg-white/[0.02] p-2 flex flex-col gap-1.5 min-w-0 relative">
            <div className="flex items-center gap-1 text-white/40 pb-1 border-b border-white/8">
              <span className="size-1.5 rounded-full bg-gold" />
              Assistant
            </div>
            <div className="relative flex-1">
              <div data-j="chat-empty" className="absolute inset-0 flex items-center justify-center text-white/25 text-center px-2">
                Ask anything about your members
              </div>
              <div className="absolute inset-0 flex flex-col gap-1.5">
                <div className="self-end max-w-[90%] rounded-md rounded-br-none bg-white/10 px-1.5 py-1 text-white/80">
                  Who is likely to churn this month?
                </div>
                <div className="max-w-[95%] rounded-md rounded-bl-none border border-gold/30 bg-gold/10 px-1.5 py-1 text-white/85 flex flex-col gap-1">
                  <span data-j="chat-line">3 members show churn signals.</span>
                  <span data-j="chat-line">Mira Novak paused 12 days ago.</span>
                  <span data-j="chat-line" className="text-gold">Want me to draft a win-back email?</span>
                </div>
                <div data-j="chat-typing" className="flex items-center gap-0.5 pl-1">
                  <Dot className="bg-gold/70" />
                  <Dot className="bg-gold/50" />
                  <Dot className="bg-gold/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side sheet */}
        <div
          data-j="sheet"
          className="absolute top-2 right-2 bottom-2 w-[42%] rounded-md border border-white/12 bg-[#101010] p-2.5 flex flex-col gap-2 shadow-[-12px_0_32px_rgba(0,0,0,0.6)] will-change-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-[9px] font-medium">New member</span>
            <span className="text-white/35">✕</span>
          </div>
          {["Full name", "Email", "Plan"].map((f) => (
            <div key={f} className="flex flex-col gap-1">
              <span className="text-white/40">{f}</span>
              <span className="h-4 rounded border border-white/10 bg-white/[0.04]" />
            </div>
          ))}
          <span className="mt-auto rounded bg-gold py-1 text-center text-black font-semibold">Save member</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone: a compact version of the same product                         */
/* ------------------------------------------------------------------ */
function Phone() {
  return (
    <div
      data-j="phone"
      className="absolute -right-[4%] -bottom-[6%] w-[24%] aspect-[9/18] rounded-[14%/7%] border-[3px] border-white/20 bg-[#0a0a0a] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.7)] will-change-transform"
    >
      <div className="mx-auto mb-1.5 h-1 w-1/3 rounded-full bg-white/20" />
      <div className="flex flex-col gap-1.5 text-[7px] text-white/70">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-white font-medium">Members</span>
          <span className="size-3 rounded-full bg-linear-to-br from-gold to-amber-700" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {STATS.slice(0, 2).map(([l, v]) => (
            <div key={l} className="rounded border border-white/8 bg-white/[0.03] p-1 flex flex-col gap-0.5">
              <span className="text-white/40 text-[6px]">{l}</span>
              <span className="text-white font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {MEMBERS.slice(0, 5).map(([name, , status]) => (
            <div key={name} className="flex items-center justify-between rounded border border-white/8 bg-white/[0.02] px-1 py-1">
              <span className="truncate text-white/80">{name}</span>
              <Dot className={status === "Active" ? "bg-emerald-400" : "bg-amber-400"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frame                                                                */
/* ------------------------------------------------------------------ */
function MockAppBase({ stage, ref, className = "" }: MockAppProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  // Static snapshot: build the same choreography and seek to the stage's clean state.
  useLayoutEffect(() => {
    if (stage === undefined || !innerRef.current) return;
    const root = innerRef.current;
    const ctx = gsap.context(() => {
      const tl = buildJourneyTimeline(root);
      tl.progress(progressForStage(stage));
    }, root);
    root.style.visibility = "visible";
    return () => ctx.revert();
  }, [stage]);

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      aria-hidden
      className={`relative w-full select-none ${stage !== undefined ? "invisible" : ""} ${className}`}
    >
      {/* Desktop window */}
      <div
        data-j="desktop"
        className="relative w-full aspect-[16/10] rounded-xl border border-white/12 bg-[#0a0a0a] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] will-change-transform"
      >
        {/* Window chrome */}
        <div className="h-[8%] min-h-6 flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-2.5">
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="ml-2 flex-1 max-w-[45%] h-3 rounded-sm bg-white/[0.06] flex items-center px-1.5 text-[7px] text-white/35">
            app.yourproduct.com
          </span>
          <span
            data-j="deploy"
            className="ml-auto flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 text-[7px] text-emerald-300"
          >
            <Dot className="bg-emerald-400" />
            Deployed
          </span>
        </div>
        {/* Body */}
        <div className="absolute inset-x-0 bottom-0 top-[8%]">
          <Skin />
          <Wire />
        </div>
      </div>

      <Phone />
    </div>
  );
}

export const MockApp = memo(MockAppBase);
