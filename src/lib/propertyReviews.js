export const loadPropertyReviews = async (propertyId) => {
  const { default: listings } = await import("@/data/propertyReviews.json");
  return Object.values(listings).find((listing) => listing.property_id === propertyId) || null;
};

const reviewDate = (review) =>
  review.published_date || review.created_date || review.stay_date || "";

export const mergePropertyReviews = (propertyId, websiteReviews, importedListing) => {
  const importedReviews = importedListing?.property_id === propertyId
    ? importedListing.reviews.map((review) => ({
        ...review,
        source_url: importedListing.source_url,
      }))
    : [];
  const seen = new Set();

  return [...websiteReviews, ...importedReviews]
    .filter((review) => review.property_id === propertyId)
    .filter((review) => {
      const signature = JSON.stringify([
        review.guest_name.trim().toLowerCase(),
        reviewDate(review).slice(0, 10),
        review.rating,
        (review.comment || "").replace(/["\u201c\u201d]/g, "").replace(/\s+/g, " ").trim(),
      ]);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    })
    .sort((a, b) => reviewDate(b).localeCompare(reviewDate(a)));
};
