export const getMostReviewedProperties = (properties, reviewCounts, limit = 6) =>
  [...properties]
    .sort((a, b) =>
      (reviewCounts[b.id] || 0) - (reviewCounts[a.id] || 0) ||
      a.name.localeCompare(b.name)
    )
    .slice(0, limit);
