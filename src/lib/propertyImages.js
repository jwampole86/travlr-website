import propertyPhotoGalleries from "@/data/propertyPhotoGalleries.json";

const GENERIC_FALLBACK_IMAGE =
  "photo-1613490493576-7fde63acd811";

const getPropertySlug = (property) =>
  (property?.slug || property?.name || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getPropertyImages = (property) => {
  const verifiedGallery = propertyPhotoGalleries[getPropertySlug(property)];
  if (verifiedGallery) return verifiedGallery;
  if (!Array.isArray(property?.images)) return [];

  return Array.from(
    new Set(
      property.images.filter(
        (image) =>
          typeof image === "string" &&
          image.trim() &&
          !image.includes(GENERIC_FALLBACK_IMAGE)
      ).map((image) => image.trim())
    )
  );
};
