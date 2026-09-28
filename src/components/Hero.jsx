import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "./container/Container";
import ParticleCanvas from "./ParticleCanvas";

const LINE_ONE = ["Stories", "crafted", "to"];
const LINE_TWO = ["feel", "alive."];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Hero() {
  const sceneRef = useRef(null);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || prefersReducedMotion()) return undefined;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const paint = () => {
      frame = 0;
      scene.style.setProperty("--px", targetX.toFixed(3));
      scene.style.setProperty("--py", targetY.toFixed(3));
    };

    const handleMove = (event) => {
      const el = scene;
      const rect = el.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    scene.addEventListener("pointermove", handleMove);
    scene.addEventListener("pointerleave", handleLeave);

    return () => {
      scene.removeEventListener("pointermove", handleMove);
      scene.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  let wordIndex = 0;
  const renderWord = (word, gradient = false) => {
    const delay = 180 + wordIndex * 90;
    wordIndex += 1;
    return (
      <span
        key={`${word}-${delay}`}
        className={`word ${gradient ? "text-gradient" : ""}`}
        style={{ "--word-delay": `${delay}ms` }}
      >
        {word}
      </span>
    );
  };

  return (
    <section
      ref={sceneRef}
      className="scene-tilt relative isolate overflow-hidden min-h-[min(90vh,920px)] flex items-center py-24 noise"
      style={{ "--px": 0, "--py": 0 }}
    >
      {/* 3D Interactive Particle Constellation Canvas */}
      <ParticleCanvas />

      {/* Ambient Lighting Orbs */}
      <div className="orb orb-violet parallax-layer" style={{ "--depth": 26, width: "36rem", height: "36rem", top: "-8rem", left: "-6rem" }} />
      <div className="orb orb-cyan parallax-layer" style={{ "--depth": 34, width: "28rem", height: "28rem", bottom: "-6rem", right: "-4rem" }} />
      <div className="orb orb-pink parallax-layer" style={{ "--depth": 18, width: "22rem", height: "22rem", top: "35%", right: "22%", opacity: 0.32 }} />

      {/* 3D Perspective Grid Floor */}
      <div className="grid-floor parallax-layer" style={{ "--depth": 10 }} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,6,12,0.85)_100%)]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Chronicle · Immersive 3D Journal
            </div>

            <h1
              className="word-stage font-display mt-8 text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="flex flex-wrap gap-x-[0.26em]">{LINE_ONE.map((w) => renderWord(w))}</span>
              <span className="flex flex-wrap gap-x-[0.26em]">{LINE_TWO.map((w) => renderWord(w, true))}</span>
            </h1>

            <p
              className="parallax-layer mx-auto mt-7 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0"
              style={{ "--depth": -8 }}
            >
              Every article is wrapped in cinematic motion — depth, light, and
              interactive 3D physics that turn standard publishing into an experience
              readers never forget.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a href="#featured" className="btn-3d btn-primary">
                Explore the feed
                <span aria-hidden="true">→</span>
              </a>
              {authStatus ? (
                <Link to="/add-post" className="btn-3d btn-ghost">
                  Write a story ✦
                </Link>
              ) : (
                <Link to="/signup" className="btn-3d btn-ghost">
                  Start writing free
                </Link>
              )}
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-400 lg:justify-start">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-[#05060c] bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_4px_14px_rgba(139,92,246,0.5)]"
                    style={{ opacity: 1 - i * 0.18 }}
                  />
                ))}
              </div>
              <p>
                <span className="font-semibold text-white">2,400+</span> creators
                crafting with 3D depth
              </p>
            </div>
          </div>

          {/* 3D Holographic Scene Showcase */}
          <div className="relative hidden h-[460px] lg:block" style={{ transformStyle: "preserve-3d" }}>
            {/* Background 3D Floating Geometry */}
            <div className="parallax-layer absolute left-6 top-4 h-40 w-64 rotate-[-8deg] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 shadow-[0_30px_60px_-30px_rgba(139,92,246,0.9)] backdrop-blur-xl float-slow" style={{ "--depth": 42 }} />
            <div className="parallax-layer absolute right-0 top-32 h-44 w-72 rotate-[7deg] rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 shadow-[0_30px_60px_-30px_rgba(34,211,238,0.9)] backdrop-blur-xl float-slower" style={{ "--depth": 30 }} />
            <div className="parallax-layer absolute bottom-6 left-16 h-44 w-72 rotate-[-3deg] rounded-3xl border border-white/10 bg-gradient-to-br from-amber-300/20 to-pink-500/10 shadow-[0_30px_60px_-30px_rgba(251,191,36,0.8)] backdrop-blur-xl float-fast" style={{ "--depth": 54 }} />

            {/* Orbital Rings */}
            <div className="parallax-layer absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/40 spin-slow" style={{ "--depth": 14 }} />
            <div className="parallax-layer absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ "--depth": 8 }} />

            {/* Central 3D Glass Master Card */}
            <div className="parallax-layer absolute left-1/2 top-1/2 w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/20 bg-[#0b0e1b]/90 p-6 shadow-[0_50px_90px_-30px_rgba(0,0,0,1)] backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.03]" style={{ "--depth": 22 }}>
              <div className="relative h-34 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/70 via-fuchsia-500/40 to-cyan-400/60 p-3">
                <span className="absolute top-2.5 right-2.5 rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                  Interactive 3D
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.4),transparent_60%)]" />
              </div>
              <div className="mt-5 h-3.5 w-4/5 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              <div className="mt-3 h-3 w-3/5 rounded-full bg-white/30" />
              <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <span className="flex items-center gap-1.5 text-violet-300 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                  Editor&rsquo;s pick
                </span>
                <span className="text-cyan-300 font-bold">4 min read</span>
              </div>
            </div>

            {/* Floating Glass Floating Badges */}
            <div className="parallax-layer absolute right-0 bottom-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold text-amber-200 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(251,191,36,0.3)] float-slower" style={{ "--depth": 46 }}>
              ★ 4.9 average reader rating
            </div>
            <div className="parallax-layer absolute right-4 top-6 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold text-cyan-200 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(34,211,238,0.3)] float-fast" style={{ "--depth": 50 }}>
              ● 37 readers live in feed
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-slate-400 sm:flex">
        <span>Scroll</span>
        <span className="relative block h-10 w-px bg-white/15">
          <span className="scroll-dot absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
        </span>
      </div>
    </section>
  );
}

export default Hero;
