import { gsap } from "@/lib/gsap";
import { JOURNEY_STAGES } from "@/data/journey";

/** Number of stages. The timeline runs N time units, one per stage. */
export const N = JOURNEY_STAGES.length;
/** Scroll distance per stage while pinned, as a percentage of viewport height. */
export const STAGE_VH = 60;
/** Half-width (in stage units) of the "hold" around a stage's clean state where snap stays idle. */
export const HOLD = 0.3;

const TRANSITION = 0.4;
/** Time at which the transition INTO stage k begins. */
const at = (k: number) => k - TRANSITION / 2;

/** Scroll progress (0..1) at which stage k is in its clean, fully-built state. */
export const progressForStage = (k: number) => (k + 0.5) / N;

/** Stage index for a given scroll progress. */
export const stageForProgress = (p: number) => Math.min(N - 1, Math.max(0, Math.floor(p * N)));

/**
 * Soft snap: only pull the page to the nearest clean state when it stopped
 * inside a transition band. Inside a hold, or at the pin's lead-in/tail, leave it.
 */
export const softSnap = (p: number) => {
  const t = p * N;
  if (t < 0.5 || t > N - 0.5) return p;
  const centre = Math.round(t - 0.5) + 0.5;
  return Math.abs(t - centre) <= HOLD ? p : centre / N;
};

/**
 * Builds the choreography for the mock app. Every tween is explicit (set/fromTo)
 * so seeking straight to any progress is deterministic. Only opacity, transforms
 * and clip-path are animated.
 */
export function buildJourneyTimeline(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const D = TRANSITION;
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  // Initial state (stage 0: wireframe only)
  gsap.set(q("[data-j=skin]"), { autoAlpha: 0 });
  gsap.set(q("[data-j=wire]"), { autoAlpha: 1 });
  gsap.set(q("[data-j=sheet]"), { xPercent: 110 });
  gsap.set(q("[data-j=filter]"), { opacity: 0.35 });
  gsap.set(q("[data-j=skeleton]"), { autoAlpha: 1 });
  gsap.set(q("[data-j=row]"), { autoAlpha: 0, y: 8 });
  gsap.set(q("[data-j=signin]"), { autoAlpha: 1 });
  gsap.set(q("[data-j=avatar]"), { autoAlpha: 0, scale: 0.6 });
  gsap.set(q("[data-j=chat-empty]"), { autoAlpha: 1 });
  gsap.set(q("[data-j=chat-line]"), { clipPath: "inset(0 100% 0 0)" });
  gsap.set(q("[data-j=chat-typing]"), { autoAlpha: 0 });
  gsap.set(q("[data-j=desktop]"), { xPercent: 0, scale: 1, transformOrigin: "left center" });
  gsap.set(q("[data-j=phone]"), { autoAlpha: 0, x: 40, scale: 0.9, transformOrigin: "right bottom" });
  gsap.set(q("[data-j=deploy]"), { autoAlpha: 0, y: -6 });

  // 1 · Style: wireframe crossfades into the real skin
  tl.to(q("[data-j=wire]"), { autoAlpha: 0, duration: D }, at(1))
    .to(q("[data-j=skin]"), { autoAlpha: 1, duration: D }, at(1));

  // 2 · Interaction: a filter activates and a side sheet slides in
  tl.to(q("[data-j=filter]"), { opacity: 1, duration: D / 2 }, at(2))
    .to(q("[data-j=skeleton]"), { opacity: 0.35, duration: D / 2 }, at(2))
    .to(q("[data-j=sheet]"), { xPercent: 0, duration: D }, at(2));

  // 3 · Data & auth: sheet closes, real rows stream in, the user is signed in
  tl.to(q("[data-j=sheet]"), { xPercent: 110, duration: D / 2 }, at(3))
    .to(q("[data-j=skeleton]"), { autoAlpha: 0, duration: D / 3 }, at(3))
    .to(q("[data-j=row]"), { autoAlpha: 1, y: 0, stagger: D / 12, duration: D / 3 }, at(3) + D / 4)
    .to(q("[data-j=signin]"), { autoAlpha: 0, duration: D / 3 }, at(3) + D / 2)
    .to(q("[data-j=avatar]"), { autoAlpha: 1, scale: 1, duration: D / 3 }, at(3) + D / 2);

  // 4 · AI: the assistant answers, line by line
  tl.to(q("[data-j=chat-empty]"), { autoAlpha: 0, duration: D / 4 }, at(4))
    .to(q("[data-j=chat-typing]"), { autoAlpha: 1, duration: D / 4 }, at(4))
    .to(q("[data-j=chat-line]"), { clipPath: "inset(0 0% 0 0)", stagger: D / 4, duration: D / 3 }, at(4) + D / 4)
    .to(q("[data-j=chat-typing]"), { autoAlpha: 0, duration: D / 4 }, at(4) + D * 0.9);

  // 5 · Ship: desktop makes room, a phone appears, it's deployed
  tl.to(q("[data-j=desktop]"), { xPercent: -8, scale: 0.9, duration: D }, at(5))
    .to(q("[data-j=phone]"), { autoAlpha: 1, x: 0, scale: 1, duration: D }, at(5))
    .to(q("[data-j=deploy]"), { autoAlpha: 1, y: 0, duration: D / 2 }, at(5) + D / 2);

  // Pad to exactly N units so tl.progress(x) maps 1:1 with scroll progress
  tl.to({}, { duration: 0 }, N);

  return tl;
}
