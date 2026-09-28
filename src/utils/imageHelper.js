import appwriteService from "../appwrite/config";
import { DEFAULT_COVERS } from "../data/showcasePosts";

export function getFallbackImage(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_COVERS.length;
  return DEFAULT_COVERS[index];
}

export function resolveImageSource(featuredImage, fallbackSeed = "") {
  if (!featuredImage) {
    return getFallbackImage(fallbackSeed);
  }

  const str = String(featuredImage).trim();
  if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:")) {
    return str;
  }

  try {
    const preview = appwriteService.getFilePreview(str);
    if (preview) return preview;
  } catch (err) {
    console.warn("Could not generate Appwrite file preview, using fallback", err);
  }

  return getFallbackImage(fallbackSeed || str);
}

export function handleImageError(event, fallbackSeed = "") {
  const target = event.currentTarget || event.target;
  if (!target) return;

  const fallback = getFallbackImage(fallbackSeed);
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
