import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import useTilt from "../../hooks/useTilt";
import { PRESET_COVERS } from "../../data/showcasePosts";
import { resolveImageSource, handleImageError } from "../../utils/imageHelper";

const CATEGORIES = [
  "Engineering",
  "Design",
  "AI",
  "Startups",
  "Product",
  "Culture"
];

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, getValues, control, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            category: post?.category || "Engineering",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isLoading, setIsLoading] = useState(false);
    
    const isCuratedOrNotAuthor = post && (post.userId === "editorial-staff" || (userData?.$id && post.userId !== userData.$id));

    // Image selection state
    const isUrlImage = post?.featuredImage && (post.featuredImage.startsWith("http://") || post.featuredImage.startsWith("https://"));
    const [imageMode, setImageMode] = useState(isUrlImage ? "url" : "presets");
    const [customUrl, setCustomUrl] = useState(isUrlImage ? post.featuredImage : "");
    const [selectedPreset, setSelectedPreset] = useState(isUrlImage ? "" : (post?.featuredImage || PRESET_COVERS[0].url));
    const [localFilePreview, setLocalFilePreview] = useState(null);

    const previewTiltRef = useTilt({ max: 12, lift: -10 });

    const watchTitle = watch("title");
    const watchStatus = watch("status");
    const watchCategory = watch("category");
    const watchImage = watch("image");
    const watchContent = watch("content");

    useEffect(() => {
        if (watchImage && watchImage[0]) {
            const url = URL.createObjectURL(watchImage[0]);
            setLocalFilePreview(url);
            return () => URL.revokeObjectURL(url);
        }
        return undefined;
    }, [watchImage]);

    // Calculate word count & reading time
    const cleanContent = (watchContent || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = cleanContent ? cleanContent.split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Resolve current preview image
    let currentImageSrc = "";
    if (imageMode === "file") {
        currentImageSrc = localFilePreview || (post?.featuredImage ? resolveImageSource(post.featuredImage) : "");
    } else if (imageMode === "presets") {
        currentImageSrc = selectedPreset;
    } else {
        currentImageSrc = customUrl;
    }

    const submit = async (data) => {
        setIsLoading(true);
        try {
            let finalImageId = "";

            if (imageMode === "file" && data.image && data.image[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    if (post?.featuredImage && !post.featuredImage.startsWith("http")) {
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                    finalImageId = file.$id;
                } else {
                    toast.error("File upload failed. Defaulting to curated cover image.");
                    finalImageId = selectedPreset || PRESET_COVERS[0].url;
                }
            } else if (imageMode === "presets" && selectedPreset) {
                finalImageId = selectedPreset;
            } else if (imageMode === "url" && customUrl.trim()) {
                finalImageId = customUrl.trim();
            } else if (post?.featuredImage) {
                finalImageId = post.featuredImage;
            } else {
                finalImageId = PRESET_COVERS[0].url;
            }

            const postPayload = {
                ...data,
                featuredImage: finalImageId,
                category: data.category || "Engineering",
            };

            if (post && !isCuratedOrNotAuthor) {
                const dbPost = await appwriteService.updatePost(post.$id, postPayload);

                if (dbPost) {
                    toast.success("Chronicle story updated successfully!");
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    toast.error("Failed to update post. Please try again.");
                }
            } else {
                let submitSlug = postPayload.slug;
                if (post && isCuratedOrNotAuthor && submitSlug === post.$id) {
                    submitSlug = `${submitSlug.slice(0, 28)}-${Math.random().toString(36).slice(2, 6)}`;
                }

                const dbPost = await appwriteService.createPost({
                    ...postPayload,
                    slug: submitSlug,
                    userId: userData?.$id || "anonymous-author"
                });

                if (dbPost) {
                    toast.success(post ? "Story published to your feed as a new chronicle!" : "Story published to the feed!");
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    toast.error("Failed to publish post. Please check Appwrite permissions.");
                }
            }
        } catch (error) {
            console.error("PostForm submit error:", error);
            toast.error(error.message || "An error occurred while saving the post.");
        } finally {
            setIsLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s+/g, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 36);

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="grid gap-8 lg:gap-10 lg:grid-cols-[1.7fr_1fr]">
            {/* Main Editor Column */}
            <div className="card-3d glass rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 lg:p-10 noise border border-white/10 space-y-6">
                <div className="border-b border-white/10 pb-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                            {post ? (isCuratedOrNotAuthor ? "Duplicate & Publish Story" : "Edit Article") : "Draft New Story"}
                        </h2>
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            {wordCount} words · ~{readingTime} min read
                        </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                        Craft your story with rich text, interactive preview, and high-definition visual assets.
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Article Title"
                        placeholder="E.g., The Architecture of Tomorrow's Web"
                        {...register("title", { required: true })}
                        error={errors.title ? "Title is required" : undefined}
                    />

                    <Input
                        label="Slug / URL Path"
                        placeholder="the-architecture-of-tomorrows-web"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                        error={errors.slug ? "Slug is required" : undefined}
                    />

                    {/* Category Selector */}
                    <div>
                        <label className="inline-block mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Category / Topic
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => {
                                const active = (watchCategory || "Engineering") === cat;
                                return (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => setValue("category", cat, { shouldValidate: true })}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                            active
                                                ? "border border-cyan-400 bg-gradient-to-r from-violet-600/60 to-cyan-500/60 text-white shadow-[0_0_14px_rgba(34,211,238,0.4)]"
                                                : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                        <input type="hidden" {...register("category")} />
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2 pt-2">
                    <RTE label="Article Content" name="content" control={control} defaultValue={getValues("content")} />
                    {errors.content && <p className="text-rose-400 text-xs mt-1">Article content is required</p>}
                </div>
            </div>

            {/* Sidebar Column: Settings & Live 3D Card Preview */}
            <div className="space-y-6 sm:space-y-8">
                {/* Publishing Options Card */}
                <div className="card-3d glass rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 noise border border-white/10 space-y-6">
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                        <span>✦</span> Publishing Controls
                    </h3>

                    {/* Cover Image Selector Mode */}
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Featured Cover Image
                        </label>

                        {/* Image Mode Switcher */}
                        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/5 p-1 border border-white/10 text-xs font-semibold text-slate-300">
                            <button
                                type="button"
                                onClick={() => setImageMode("presets")}
                                className={`py-1.5 rounded-xl transition-all ${imageMode === "presets" ? "bg-white/15 text-white shadow-sm" : "hover:text-white"}`}
                            >
                                Presets
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                className={`py-1.5 rounded-xl transition-all ${imageMode === "url" ? "bg-white/15 text-white shadow-sm" : "hover:text-white"}`}
                            >
                                Image URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("file")}
                                className={`py-1.5 rounded-xl transition-all ${imageMode === "file" ? "bg-white/15 text-white shadow-sm" : "hover:text-white"}`}
                            >
                                Upload
                            </button>
                        </div>

                        {/* Mode 1: Curated Presets */}
                        {imageMode === "presets" && (
                            <div className="space-y-2 pt-1">
                                <p className="text-[11px] text-slate-400">Select an ultra high-res editorial cover:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {PRESET_COVERS.map((preset) => {
                                        const selected = selectedPreset === preset.url;
                                        return (
                                            <button
                                                type="button"
                                                key={preset.name}
                                                onClick={() => setSelectedPreset(preset.url)}
                                                className={`group relative overflow-hidden rounded-xl border aspect-[16/10] transition-all duration-200 ${
                                                    selected
                                                        ? "border-cyan-400 ring-2 ring-cyan-400/40 scale-95 shadow-[0_0_14px_rgba(34,211,238,0.5)]"
                                                        : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                                                }`}
                                            >
                                                <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                                                <span className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] font-bold text-white leading-tight">
                                                    {preset.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Mode 2: Custom URL */}
                        {imageMode === "url" && (
                            <div className="space-y-2 pt-1">
                                <Input
                                    label=""
                                    placeholder="Paste image URL (e.g. Unsplash, CDN...)"
                                    value={customUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                />
                                <p className="text-[11px] text-slate-400">Direct links to JPG, PNG, WEBP, or SVG images.</p>
                            </div>
                        )}

                        {/* Mode 3: Local File Upload */}
                        {imageMode === "file" && (
                            <div className="space-y-2 pt-1">
                                <Input
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                    {...register("image")}
                                    error={errors.image ? "Featured image is required" : undefined}
                                />
                                <p className="text-[11px] text-slate-400">Files are uploaded to your Appwrite Storage Bucket.</p>
                            </div>
                        )}
                    </div>

                    <Select
                        options={["active", "inactive"]}
                        label="Feed Visibility"
                        {...register("status", { required: true })}
                        error={errors.status ? "Status is required" : undefined}
                    />

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="btn-3d btn-primary w-full py-3.5 text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    {post && !isCuratedOrNotAuthor ? "Updating story..." : "Publishing to feed..."}
                                </span>
                            ) : (
                                <span>{post && !isCuratedOrNotAuthor ? "Update Chronicle ✦" : "Publish Story ✦"}</span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Live 3D Card Preview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        <span>Live 3D Feed Preview</span>
                        <span className="text-[10px] text-slate-400">Interactive Tilt</span>
                    </div>

                    <div className="scene">
                        <article ref={previewTiltRef} className="tilt card-3d relative flex h-full flex-col overflow-hidden">
                            <span className="spotlight" />

                            <div className="relative overflow-hidden rounded-t-[21px]">
                                <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-violet-500/70 via-fuchsia-500/45 to-cyan-400/60">
                                    {currentImageSrc ? (
                                        <img
                                            src={currentImageSrc}
                                            alt="Preview cover"
                                            onError={(e) => handleImageError(e, watchTitle || "preview")}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <span className="font-display text-4xl font-extrabold text-white/20">
                                                Cover Image
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060c] via-transparent to-transparent opacity-60" />

                                <div className="absolute left-4 top-4 flex items-center gap-2">
                                    <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md">
                                        {readingTime} min read
                                    </span>
                                    {watchCategory && (
                                        <span className="rounded-full border border-violet-400/30 bg-violet-950/60 px-2.5 py-1 text-[10px] font-semibold text-violet-300 backdrop-blur-md">
                                            {watchCategory}
                                        </span>
                                    )}
                                </div>

                                <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md">
                                    {watchStatus === "inactive" ? "Draft" : "Published"}
                                </span>
                            </div>

                            <div className="relative flex flex-1 flex-col p-5">
                                <h4 className="font-display text-base font-bold text-white line-clamp-2">
                                    {watchTitle || "Your Story Title Here..."}
                                </h4>

                                <div className="mt-4 flex items-center justify-between pt-2 text-xs text-slate-400">
                                    <span className="tracking-wide">Today</span>
                                    <span className="inline-flex items-center gap-1 font-semibold text-violet-300">
                                        Read story →
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PostForm;