"""Refresh authorized reviews from each property's official TRAVLR listing."""

import hashlib
import html
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_SOURCES = {
    "tangerine-sky": ("Vacasa", "https://www.vacasa.com/unit/1041831"),
    "the-mountain-watch": ("Vacasa", "https://www.vacasa.com/unit/1049280"),
    "the-watch-tower": ("Vacasa", "https://www.vacasa.com/unit/1049279"),
    "whidbey-island-modern-farmhouse": ("Casago", "https://casago.com/rentals/1047508/"),
    "skiers-palace": ("Vacasa", "https://www.vacasa.com/unit/57757"),
}


def slugify(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower().replace("&", "and")).strip("-")


class ReviewParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reviews = []
        self.current = None
        self.field = None
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        if tag not in {"br", "img", "hr", "input", "meta", "link", "wbr"}:
            self.depth += 1
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if tag == "article" and "c-review" in classes:
            if self.current is not None:
                raise ValueError("Nested review articles")
            self.current = {}
        if self.current is None:
            return
        fields = {
            "c-review__title": "title",
            "c-review__meta": "meta",
            "c-review__rating": "rating",
            "c-review__body": "comment",
        }
        for class_name, field in fields.items():
            if class_name in classes:
                self.field = (tag, field, self.depth)
                self.current[field] = ""
        if tag == "time":
            self.current["published_date"] = attrs["datetime"]
        if tag == "br" and self.field:
            self.current[self.field[1]] += "\n"

    def handle_data(self, data):
        if self.current is not None and self.field:
            self.current[self.field[1]] += data

    def handle_endtag(self, tag):
        if tag in {"br", "img", "hr", "input", "meta", "link", "wbr"}:
            return
        if self.field and self.field[0] == tag and self.field[2] == self.depth:
            self.field = None
        self.depth -= 1
        if tag == "article" and self.current is not None:
            self.reviews.append(self.current)
            self.current = None
            self.field = None


def import_listing(item):
    slug, property_id = item
    source_name, source_url = EXTERNAL_SOURCES.get(
        slug, ("TRAVLR", f"https://www.staytravlr.com/vacation-rental/{slug}/")
    )
    page = subprocess.run(
        ["curl", "--fail", "-L", "-sS", "--retry", "2", "--max-time", "45", source_url],
        check=True, capture_output=True, text=True,
    ).stdout
    metadata = [
        json.loads(match)
        for match in re.findall(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            page, re.S,
        )
    ]
    listing = next(
        (data for data in metadata if data.get("@type") == "VacationRental"), None
    )
    if not listing or slugify(html.unescape(listing["name"])) != slug:
        raise ValueError(f"{slug}: source listing identity mismatch")
    if slug in EXTERNAL_SOURCES:
        return import_external(slug, property_id, source_name, source_url, listing, page)
    section = re.search(
        r'<section id="guest-reviews-index"[^>]*>(.*?)</section>', page, re.S
    )
    if not section:
        raise ValueError(f"{slug}: official guest-review section missing")
    parser = ReviewParser()
    parser.feed(section[1])
    reviews = {}
    for raw in parser.reviews:
        published_date = date.fromisoformat(raw["published_date"]).isoformat()
        meta = re.fullmatch(r"by\s+(.+?)\s*" + published_date, raw["meta"].strip())
        rating_text = raw.get("rating", "").strip()
        rating = re.fullmatch(r"(\d+(?:\.\d+)?)/5", rating_text)
        if not meta or (rating_text and (not rating or not 1 <= float(rating[1]) <= 5)):
            raise ValueError(f"{slug}: invalid author or rating")
        if published_date > date.today().isoformat():
            raise ValueError(f"{slug}: future-dated review")
        review = {
            "property_id": property_id,
            "guest_name": meta[1].strip(),
            "rating": float(rating[1]) if rating else None,
            "title": raw.get("title", "").strip(),
            "comment": raw.get("comment", "").strip(),
            "published_date": published_date,
        }
        signature = json.dumps(review, sort_keys=True, ensure_ascii=True)
        review_id = "travlr-" + hashlib.sha256(signature.encode()).hexdigest()[:20]
        reviews[review_id] = {"id": review_id, **review}
    if not reviews:
        raise ValueError(f"{slug}: no guest reviews found")
    print(f"{slug}: {len(reviews)} reviews", flush=True)
    return slug, {
        "property_id": property_id,
        "source_url": source_url,
        "source_name": source_name,
        "source_review_count": len(reviews),
        "imported_on": date.today().isoformat(),
        "reviews": sorted(reviews.values(), key=lambda r: r["published_date"], reverse=True),
    }


def import_external(slug, property_id, source_name, source_url, listing, page):
    aggregate = listing.get("aggregateRating")
    if aggregate:
        total = int(aggregate["reviewCount"])
    elif re.search(r"\breview_count:\s*0\s*,", page):
        total = 0
    else:
        raise ValueError(f"{slug}: cannot verify source review count")
    reviews = {}
    for raw in listing.get("review", []):
        published = date.fromisoformat(raw["datePublished"]).isoformat()
        rating = float(raw["reviewRating"]["ratingValue"])
        best = float(raw["reviewRating"].get("bestRating", 5))
        if best != 5 or not 1 <= rating <= 5 or published > date.today().isoformat():
            raise ValueError(f"{slug}: invalid external review rating or date")
        review = {
            "property_id": property_id,
            "guest_name": html.unescape(raw["author"]["name"]).strip(),
            "rating": rating,
            "title": "",
            "comment": html.unescape(raw["reviewBody"]).strip(),
            "published_date": published,
        }
        if not review["guest_name"] or not review["comment"]:
            raise ValueError(f"{slug}: missing external review author or text")
        signature = json.dumps(review, sort_keys=True, ensure_ascii=True)
        review_id = "published-" + hashlib.sha256(signature.encode()).hexdigest()[:20]
        reviews[review_id] = {"id": review_id, **review}
    if len(reviews) > total or (total > 0 and not reviews):
        raise ValueError(f"{slug}: source review sample does not match published count")
    print(f"{slug}: {len(reviews)} available reviews of {total} published", flush=True)
    return slug, {
        "property_id": property_id,
        "source_url": source_url,
        "source_name": source_name,
        "source_review_count": total,
        "imported_on": date.today().isoformat(),
        "reviews": sorted(reviews.values(), key=lambda r: r["published_date"], reverse=True),
    }


def main():
    catalog = (ROOT / "src/data/referenceProperties.js").read_text()
    ids = {
        slugify(name): property_id
        for property_id, name in re.findall(r'\["([^"]+)", "([^"]+)"', catalog)
    }
    galleries = json.loads((ROOT / "src/data/propertyPhotoGalleries.json").read_text())
    listings = [
        (slug, ids[slug])
        for slug, photos in galleries.items()
        if slug in EXTERNAL_SOURCES or
        (photos and photos[0].startswith("https://gallery.streamlinevrs.com/"))
    ]
    with ThreadPoolExecutor(max_workers=3) as executor:
        imported = dict(executor.map(import_listing, listings))
    output = ROOT / "src/data/propertyReviews.json"
    output.write_text(json.dumps(imported, indent=2, ensure_ascii=True) + "\n")
    counts = {
        listing["property_id"]: listing["source_review_count"]
        for listing in imported.values()
    }
    (ROOT / "src/data/propertyReviewCounts.json").write_text(
        json.dumps(counts, indent=2, ensure_ascii=True) + "\n"
    )
    print(f"Imported {sum(len(p['reviews']) for p in imported.values())} reviews "
          f"across {len(imported)} exact property listings.")


if __name__ == "__main__":
    main()
