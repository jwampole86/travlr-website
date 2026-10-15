export const sortProperties = (properties, reviewCounts, sortBy = "reviews") =>
  [...properties].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-low" || sortBy === "price-high") {
      const aPriced = Number.isFinite(a.price_per_night);
      const bPriced = Number.isFinite(b.price_per_night);
      if (aPriced !== bPriced) return aPriced ? -1 : 1;
      if (aPriced && a.price_per_night !== b.price_per_night) {
        return sortBy === "price-low"
          ? a.price_per_night - b.price_per_night
          : b.price_per_night - a.price_per_night;
      }
    }
    return (
      (reviewCounts[b.id] || 0) - (reviewCounts[a.id] || 0) ||
      a.name.localeCompare(b.name)
    );
  });

export const getMostReviewedProperties = (properties, reviewCounts, limit = 6) =>
  sortProperties(properties, reviewCounts).slice(0, limit);
