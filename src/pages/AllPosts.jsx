import React, { useState, useEffect, useMemo } from "react";
import Container from "../components/container/Container";
import PostCard from '../components/PostCard';
import Reveal from '../components/Reveal';
import appwriteService from '../appwrite/config';
import { Link } from "react-router-dom";
import { getAllMergedPosts } from "../data/showcasePosts";

const FILTER_TOPICS = [
    "All",
    "Engineering",
    "Design",
    "AI",
    "Startups",
    "Product",
    "Culture",
];

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("All");

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts([])
            .then((res) => {
                const live = res?.documents || [];
                setPosts(getAllMergedPosts(live));
            })
            .catch((err) => {
                console.warn("Appwrite getPosts error, falling back to showcase library", err);
                setPosts(getAllMergedPosts([]));
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                !searchTerm ||
                (post.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (post.content?.toLowerCase() || "").includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;
            if (selectedTopic === "All") return true;

            const matchesCategory = (post.category || "").toLowerCase() === selectedTopic.toLowerCase();
            const textMatches = `${post.title} ${post.content}`.toLowerCase().includes(selectedTopic.toLowerCase());
            return matchesCategory || textMatches;
        });
    }, [posts, searchTerm, selectedTopic]);

    return (
        <div className="relative min-h-[85vh] py-14">
            <div className="orb orb-violet" style={{ width: "28rem", height: "28rem", top: "-4rem", left: "-6rem", opacity: 0.25 }} />
            <div className="orb orb-cyan" style={{ width: "22rem", height: "22rem", bottom: "10%", right: "-4rem", opacity: 0.2 }} />

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                            </span>
                            Chronicle Archive · Complete Library
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <h1 className="font-display mt-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl text-white">
                            Explore the <span className="text-gradient">Collective Feed</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
                            Discover thoughtfully crafted essays, architectural deep-dives, and creative dispatches from writers across the globe.
                        </p>
                    </Reveal>
                </div>

                {/* Search & Topic Filters */}
                <Reveal delay={140} className="mb-12 space-y-6">
                    <div className="mx-auto max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles by title, ideas or keywords..."
                                className="w-full rounded-2xl border border-white/15 bg-white/[0.05] py-4 pl-12 pr-12 text-sm text-slate-100 placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:bg-white/[0.08] focus:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {FILTER_TOPICS.map((topic) => {
                            const active = selectedTopic === topic;
                            return (
                                <button
                                    key={topic}
                                    onClick={() => setSelectedTopic(topic)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                                        active
                                            ? "border border-cyan-400/50 bg-gradient-to-r from-violet-600/70 to-cyan-500/70 text-white shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                            : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                                    }`}
                                >
                                    {topic}
                                </button>
                            );
                        })}
                    </div>
                </Reveal>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="card-3d h-64 animate-pulse p-5"
                                style={{ animationDelay: `${i * 120}ms` }}
                            >
                                <div className="h-32 w-full rounded-2xl bg-white/10" />
                                <div className="mt-5 h-4 w-4/5 rounded-full bg-white/10" />
                                <div className="mt-3 h-4 w-2/5 rounded-full bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <Reveal variant="3d" className="mx-auto max-w-xl text-center">
                        <div className="scene relative glass rounded-[28px] p-10 noise border border-white/10">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-3xl shadow-[0_20px_40px_-20px_rgba(139,92,246,0.8)]">
                                🔍
                            </div>
                            <h3 className="font-display text-2xl font-bold text-white">No stories match your filter</h3>
                            <p className="mt-2 text-sm text-slate-300">
                                {searchTerm || selectedTopic !== "All"
                                    ? "Try adjusting your search terms or clearing your topic filter."
                                    : "No posts have been published yet. Be the first creator to share your story!"}
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                                {(searchTerm || selectedTopic !== "All") && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedTopic("All");
                                        }}
                                        className="btn-3d btn-ghost"
                                    >
                                        Clear filters
                                    </button>
                                )}
                                <Link to="/add-post" className="btn-3d btn-primary">
                                    Publish a story →
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                            <span>Showing {filteredPosts.length} {filteredPosts.length === 1 ? "story" : "stories"}</span>
                            <span>Curated feed</span>
                        </div>
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post, index) => (
                                <Reveal
                                    key={post.$id}
                                    variant="3d"
                                    delay={(index % 3) * 90}
                                    className="h-full"
                                >
                                    <PostCard {...post} />
                                </Reveal>
                            ))}
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}

export default AllPosts;