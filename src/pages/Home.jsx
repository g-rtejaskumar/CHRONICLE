import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, PostCard } from "../components";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import useReveal from "../hooks/useReveal";
import appwriteService from "../appwrite/config";
import { getAllMergedPosts } from "../data/showcasePosts";

const TOPICS = [
  "All",
  "Engineering",
  "Design",
  "AI",
  "Product",
  "Culture",
  "Startups",
];

const STATS = [
  { label: "Stories live", value: 0, suffix: "+", from: 0 },
  { label: "Writers", value: 2400, suffix: "+", from: 0 },
  { label: "Avg. read", value: 4, suffix: " min", from: 0 },
  { label: "Reader rating", value: 4.9, suffix: "/5", from: 0, decimals: 1 },
];

function CountUp({ to, suffix = "", decimals = 0, duration = 1600 }) {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(to);
      return undefined;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function SkeletonCard({ delay }) {
  return (
    <div
      className="card-3d h-64 animate-pulse p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-32 w-full rounded-2xl bg-white/10" />
      <div className="mt-5 h-4 w-4/5 rounded-full bg-white/10" />
      <div className="mt-3 h-4 w-2/5 rounded-full bg-white/10" />
    </div>
  );
}

function EmptyState() {
  return (
    <Reveal variant="3d" className="mx-auto max-w-3xl text-center">
      <div className="scene relative glass rounded-[28px] px-8 py-16 noise">
        <div className="orb orb-violet" style={{ width: "16rem", height: "16rem", top: "-5rem", right: "-4rem" }} />
        <div className="orb orb-cyan" style={{ width: "14rem", height: "14rem", bottom: "-5rem", left: "-3rem" }} />

        <div className="relative z-10">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-violet-500/40 to-cyan-400/30 text-4xl shadow-[0_30px_60px_-30px_rgba(139,92,246,1)] shake-x">
            ✦
          </div>

          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            The first story is <span className="text-gradient">yours to write.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            No posts here yet. Sign in, hit <span className="text-cyan-300">Add Post</span>{" "}
            and publish something the whole feed will see in motion.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-3d btn-primary">
              Login to read posts
            </Link>
            <Link to="/signup" className="btn-3d btn-ghost">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((response) => {
        const live = response?.documents || [];
        setPosts(getAllMergedPosts(live));
      })
      .catch((err) => {
        console.warn("Appwrite getPosts error, falling back to showcase posts", err);
        setPosts(getAllMergedPosts([]));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!window.location.hash) return undefined;
    const timer = window.setTimeout(() => {
      try {
        document.querySelector(window.location.hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch {
        /* invalid selector in hash — ignore */
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = STATS.map((stat, index) =>
    index === 0 ? { ...stat, value: posts.length } : stat
  );

  const displayedPosts = selectedTopic === "All"
    ? posts
    : posts.filter((p) => (p.category || "").toLowerCase() === selectedTopic.toLowerCase());

  return (
    <div className="relative overflow-x-hidden">
      <Hero />

      <section className="relative border-y border-white/10 bg-white/[0.02] py-14">
        <Container>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <Reveal key={stat.label} className="text-center">
                <p className="font-display text-4xl font-extrabold text-gradient-static sm:text-5xl">
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-white/[0.015] py-5">
        <div className="marquee-track gap-10 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
          {[...TOPICS.slice(1), ...TOPICS.slice(1), ...TOPICS.slice(1)].map((topic, index) => (
            <span key={`${topic}-${index}`} className="flex items-center gap-10 whitespace-nowrap">
              {topic}
              <span className="text-violet-400">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section id="featured" className="relative scroll-mt-28 py-24">
        <div className="orb orb-violet" style={{ width: "24rem", height: "24rem", top: "10%", left: "-8rem", opacity: 0.25 }} />

        <Container className="relative z-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                Featured stories
              </p>
              <h2 className="font-display mt-4 text-4xl font-extrabold sm:text-5xl">
                Fresh from the <span className="text-gradient">feed</span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <Link to="/all-posts" className="btn-3d btn-ghost">
                Browse all {posts.length} stories →
              </Link>
            </Reveal>
          </div>

          {/* Topic Filters */}
          <div className="mb-12 flex flex-wrap items-center gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  selectedTopic === topic
                    ? "border border-cyan-400/60 bg-gradient-to-r from-violet-500/40 to-cyan-400/30 text-white shadow-[0_0_16px_rgba(34,211,238,0.4)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} delay={i * 150} />
              ))}
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-400">No stories found under the {selectedTopic} topic.</p>
              <button
                onClick={() => setSelectedTopic("All")}
                className="btn-3d btn-ghost mt-4 text-xs py-2 px-4"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post, index) => (
                <Reveal
                  key={post.$id}
                  variant="3d"
                  delay={(index % 3) * 110}
                  className="h-full"
                >
                  <PostCard {...post} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="relative py-24">
        <Container>
          <Reveal variant="3d">
            <div className="scene relative overflow-hidden rounded-[32px] border border-white/10 px-8 py-16 text-center noise glass">
              <div className="orb orb-violet" style={{ width: "22rem", height: "22rem", top: "-7rem", left: "-5rem" }} />
              <div className="orb orb-pink" style={{ width: "18rem", height: "18rem", bottom: "-6rem", right: "-4rem", opacity: 0.4 }} />
              <div className="grid-floor" style={{ opacity: 0.5 }} />

              <div className="relative z-10">
                <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
                  Your words deserve a <span className="text-gradient">stage.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-slate-300">
                  Publish in seconds and watch your story land in a feed built
                  with depth, light and motion.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Link to="/add-post" className="btn-3d btn-primary">
                    Write a post
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link to="/all-posts" className="btn-3d btn-ghost">
                    Browse the library
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}

export default Home;
