import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Container from "../components/container/Container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useTilt from "../hooks/useTilt";
import { getShowcasePost } from "../data/showcasePosts";
import { resolveImageSource, handleImageError } from "../utils/imageHelper";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readingTime(content = "") {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { slug } = useParams();
    const navigate = useNavigate();
    const imageTiltRef = useTilt({ max: 8, lift: -8 });

    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug)
                .then((postData) => {
                    if (postData) {
                        setPost(postData);
                    } else {
                        const fallback = getShowcasePost(slug);
                        if (fallback) {
                            setPost(fallback);
                        } else {
                            toast.error("Story not found");
                            navigate("/");
                        }
                    }
                })
                .catch(() => {
                    const fallback = getShowcasePost(slug);
                    if (fallback) {
                        setPost(fallback);
                    } else {
                        toast.error("Failed to load article");
                        navigate("/");
                    }
                })
                .finally(() => setLoading(false));
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    const deletePost = async () => {
        if (!post) return;
        if (!window.confirm("Are you sure you want to permanently delete this chronicle?")) return;

        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                if (post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                toast.success("Story removed from the feed");
                navigate("/");
            } else {
                toast.error("Failed to delete story");
            }
        } catch (error) {
            console.error("Delete post error:", error);
            toast.error("An error occurred while deleting the story");
        }
    };

    const handleShare = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Story link copied to clipboard!");
            } else {
                const dummy = document.createElement("input");
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
                toast.success("Story link copied to clipboard!");
            }
        } catch {
            toast.success("Story link ready to share!");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center py-20">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <span className="pulse-ring absolute h-16 w-16 rounded-full border border-violet-400/60" />
                    <span className="h-4 w-4 animate-ping rounded-full bg-gradient-to-br from-violet-400 to-cyan-300" />
                </div>
            </div>
        );
    }

    return post ? (
        <div className="relative py-10">
            {/* Scroll Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
            />

            <div className="orb orb-violet" style={{ width: "30rem", height: "30rem", top: "-5rem", left: "-8rem", opacity: 0.22 }} />
            <div className="orb orb-cyan" style={{ width: "24rem", height: "24rem", top: "35%", right: "-6rem", opacity: 0.2 }} />

            <Container className="relative z-10 max-w-4xl">
                {/* Navigation & Action Bar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-cyan-400/50 hover:text-white"
                    >
                        <span>←</span>
                        <span>Back to feed</span>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Share</span>
                        </button>

                        {isAuthor && (
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/edit-post/${post.$id}`}
                                    className="rounded-full border border-violet-400/40 bg-violet-600/20 px-4 py-2 text-xs font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-600/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={deletePost}
                                    className="rounded-full border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-200 transition-all duration-300 hover:bg-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        {!isAuthor && userData && (
                            <Link
                                to={`/edit-post/${post.$id}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-600/15 px-3.5 py-2 text-xs font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-600/30 hover:border-violet-400/60"
                            >
                                <span>✦ Remix Story</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Article Header */}
                <header className="mb-10">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">
                            {readingTime(post.content)} min read
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{formatDate(post.$createdAt)}</span>
                    </div>

                    <h1 className="font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl text-white">
                        {post.title}
                    </h1>
                </header>

                {/* 3D Featured Image Frame */}
                {post.featuredImage && (
                    <div className="scene mb-12">
                        <div
                            ref={imageTiltRef}
                            className="tilt relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-2 shadow-[0_30px_90px_-30px_rgba(139,92,246,0.5)] backdrop-blur-2xl"
                        >
                            <span className="spotlight" />
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px] bg-[#05060c]">
                                <img
                                    src={resolveImageSource(post.featuredImage, post.title || post.$id)}
                                    alt={post.title}
                                    onError={(e) => handleImageError(e, post.title || post.$id)}
                                    className="h-full w-full object-cover"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060c]/40 via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Body Content */}
                <article className="card-3d glass noise relative rounded-[32px] border border-white/10 p-8 sm:p-12 lg:p-16">
                    <div className="prose-chronicle">
                        {parse(post.content || "")}
                    </div>

                    {/* Author Footer Card */}
                    <div className="mt-14 border-t border-white/10 pt-8 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-lg font-bold text-white shadow-[0_10px_25px_-10px_rgba(139,92,246,1)]">
                                {post.authorName ? post.authorName.charAt(0) : "C"}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{post.authorName || "Chronicle Staff Writer"}</p>
                                <p className="text-xs text-slate-400">{post.authorRole || "Published on Chronicle Journal"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="btn-3d btn-ghost text-xs py-2.5 px-5"
                            >
                                Share article ✦
                            </button>
                            <Link to="/all-posts" className="btn-3d btn-primary text-xs py-2.5 px-5">
                                Read more stories →
                            </Link>
                        </div>
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}