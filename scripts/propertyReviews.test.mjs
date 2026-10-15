import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { mergePropertyReviews } from "../src/lib/propertyReviews.js";

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
    assert.equal(imported.source_url, `https://www.staytravlr.com/vacation-rental/${slug}/`);
    assert.ok(imported.reviews.length > 0);
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
  assert.equal(Object.keys(data).length, 24);
  assert.ok(count >= 2000, `Expected at least 2,000 genuine source reviews, found ${count}`);
});
