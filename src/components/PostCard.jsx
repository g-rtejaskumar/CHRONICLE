import React from "react";
import { Link } from "react-router-dom";
import useTilt from "../hooks/useTilt";
import { resolveImageSource, handleImageError } from "../utils/imageHelper";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readingTime(content = "") {
  const words = stripHtml(content).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(value) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostCard({ $id, title, content, featuredImage, category, $createdAt }) {
  const tiltRef = useTilt({ max: 12, lift: -12 });
  const imageSrc = resolveImageSource(featuredImage, title || $id);

  return (
    <Link to={`/post/${$id}`} className="scene group block h-full">
      <article ref={tiltRef} className="tilt card-3d relative flex h-full flex-col">
        <span className="spotlight" />

        <div className="relative overflow-hidden rounded-t-[21px]">
          <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-violet-500/70 via-fuchsia-500/45 to-cyan-400/60">
            <img
              src={imageSrc}
              alt={title || "Story cover"}
              loading="lazy"
              onError={(e) => handleImageError(e, title || $id)}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060c] via-transparent to-transparent opacity-60" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-md transition-colors duration-300 group-hover:border-cyan-300/60">
              {readingTime(content)} min read
            </span>
            {category && (
              <span className="rounded-full border border-violet-400/30 bg-violet-950/60 px-2.5 py-1 text-[10px] font-semibold text-violet-300 backdrop-blur-md">
                {category}
              </span>
            )}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <h2 className="font-display text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-200">
            {title}
          </h2>

          <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-400">
            <span className="tracking-wide">{formatDate($createdAt)}</span>
            <span className="inline-flex items-center gap-2 font-semibold text-violet-300 transition-all duration-300 group-hover:gap-3 group-hover:text-cyan-300">
              Read article
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default PostCard;
