import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { mergePropertyReviews } from "../src/lib/propertyReviews.js";
import { getMostReviewedProperties, sortProperties } from "../src/lib/featuredProperties.js";

const review = {
  id: "published",
  property_id: "home-a",
  guest_name: "Guest",
  published_date: "2026-10-01",
  rating: 5,
  comment: '"A lovely stay."',
};
const listing = {
  property_id: "home-a",
  source_url: "https://www.staytravlr.com/vacation-rental/home-a/",
  reviews: [review],
};

test("imported reviews stay attached to their exact property", () => {
  assert.deepEqual(mergePropertyReviews("home-b", [], listing), []);
  assert.equal(mergePropertyReviews("home-a", [], listing)[0].source_url, listing.source_url);
});

test("merging removes duplicate copies without losing different guest reviews", () => {
  const websiteReview = { ...review, id: "website", comment: "A lovely stay." };
  const result = mergePropertyReviews("home-a", [websiteReview], listing);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "website");
  assert.equal(mergePropertyReviews("home-a", [
    { ...websiteReview, guest_name: "Another guest" },
  ], listing).length, 2);
});

test("reviews are newest first, and an unrelated home's reviews never appear", () => {
  const result = mergePropertyReviews("home-a", [
    { ...review, id: "new", published_date: "2026-10-10", comment: "New review" },
    { ...review, id: "wrong", property_id: "home-b" },
  ], listing);
  assert.deepEqual(result.map((item) => item.id), ["new", "published"]);
});

test("missing imported data preserves existing website reviews", () => {
  assert.deepEqual(mergePropertyReviews("home-a", [review], null), [review]);
});

test("authorized snapshot has unique, correctly scoped, source-attributed reviews", () => {
  const data = JSON.parse(readFileSync(
    new URL("../src/data/propertyReviews.json", import.meta.url), "utf8"
  ));
  const ids = new Set();
  let count = 0;
  for (const [slug, imported] of Object.entries(data)) {
    if (imported.source_name === "TRAVLR") {
      assert.equal(imported.source_url, `https://www.staytravlr.com/vacation-rental/${slug}/`);
    } else {
      assert.match(imported.source_url, /^https:\/\/(?:www\.vacasa\.com\/unit\/|casago\.com\/rentals\/)\d+\/?$/);
    }
    assert.ok(imported.source_review_count >= imported.reviews.length);
    for (const item of imported.reviews) {
      assert.equal(item.property_id, imported.property_id);
      assert.ok(!ids.has(item.id));
      ids.add(item.id);
      assert.ok(item.rating === null || (item.rating >= 1 && item.rating <= 5));
      assert.match(item.published_date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(item.guest_name);
      assert.ok(!/<\/?(?:script|div|p|br)\b/i.test(item.comment));
      count++;
    }
  }
  assert.equal(Object.keys(data).length, 29);
  assert.ok(count >= 2000, `Expected at least 2,000 genuine source reviews, found ${count}`);
});

test("featured homes are the top six verified review counts with stable name ties", () => {
  const counts = JSON.parse(readFileSync(
    new URL("../src/data/propertyReviewCounts.json", import.meta.url), "utf8"
  ));
  const listings = JSON.parse(readFileSync(
    new URL("../src/data/propertyReviews.json", import.meta.url), "utf8"
  ));
  const homes = Object.entries(listings).map(([name, listing]) => ({
    id: listing.property_id, name,
  }));
  const featured = getMostReviewedProperties(homes, counts);
  assert.equal(featured.length, 6);
  assert.deepEqual(featured.map((home) => counts[home.id]), [176, 135, 133, 132, 127, 123]);
  assert.deepEqual(featured.map((home) => home.name), [
    "delaware-estate", "legends", "paramount", "base-camp", "the-summit", "cappella",
  ]);
  for (const listing of Object.values(listings)) {
    assert.equal(counts[listing.property_id], listing.source_review_count);
  }
  const input = [{ id: "a", name: "A" }, { id: "b", name: "B" }];
  getMostReviewedProperties(input, { b: 4 });
  assert.equal(input[0].id, "a");
});

test("list ordering defaults to reviews and respects explicit price or name choices", () => {
  const homes = [
    { id: "a", name: "Alpha", price_per_night: 300 },
    { id: "b", name: "Bravo", price_per_night: 100 },
    { id: "c", name: "Charlie", price_per_night: null },
    { id: "d", name: "Delta", price_per_night: 200 },
  ];
  const counts = { a: 20, b: 5, c: 30, d: 10 };
  const ids = (sortBy) => sortProperties(homes, counts, sortBy).map((home) => home.id);
  assert.deepEqual(ids(), ["c", "a", "d", "b"]);
  assert.deepEqual(ids("price-low"), ["b", "d", "a", "c"]);
  assert.deepEqual(ids("price-high"), ["a", "d", "b", "c"]);
  assert.deepEqual(ids("name"), ["a", "b", "c", "d"]);
  assert.deepEqual(sortProperties(homes.filter((home) => home.price_per_night <= 200 &&
    home.price_per_night != null), counts).map((home) => home.id), ["d", "b"]);
  assert.deepEqual(homes.map((home) => home.id), ["a", "b", "c", "d"]);
});
