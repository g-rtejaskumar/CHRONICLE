import React, { useEffect, useState } from "react";
import Container from "../components/container/Container";
import { PostForm } from "../components";
import Reveal from "../components/Reveal";
import appwriteService from '../appwrite/config';
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getShowcasePost } from "../data/showcasePosts";

function EditPosts() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug)
                .then((postData) => {
                    if (postData) {
                        setPost(postData);
                    } else {
                        const fallback = getShowcasePost(slug);
                        if (fallback) setPost(fallback);
                        else {
                            toast.error("Story not found");
                            navigate('/');
                        }
                    }
                })
                .catch(() => {
                    const fallback = getShowcasePost(slug);
                    if (fallback) setPost(fallback);
                    else {
                        toast.error("Failed to load post for editing");
                        navigate('/');
                    }
                })
                .finally(() => setLoading(false));
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

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
        <div className="relative min-h-[85vh] py-12">
            <div className="orb orb-violet" style={{ width: "32rem", height: "32rem", top: "-6rem", left: "-8rem", opacity: 0.25 }} />
            <div className="orb orb-pink" style={{ width: "24rem", height: "24rem", bottom: "10%", right: "-6rem", opacity: 0.2 }} />

            <Container className="relative z-10">
                <div className="mb-10 text-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-violet-400" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-300" />
                            </span>
                            Chronicle Creator Studio
                        </div>
                    </Reveal>

                    <Reveal delay={80}>
                        <h1 className="font-display mt-5 text-4xl font-extrabold sm:text-5xl text-white">
                            Refine Your <span className="text-gradient">Story</span>
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
                            Update your manuscript, change cover artwork, or alter status before returning to the collective feed.
                        </p>
                    </Reveal>
                </div>

                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPosts;