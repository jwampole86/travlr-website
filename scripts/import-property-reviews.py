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
    source_url = f"https://www.staytravlr.com/vacation-rental/{slug}/"
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
        if photos and photos[0].startswith("https://gallery.streamlinevrs.com/")
    ]
    with ThreadPoolExecutor(max_workers=3) as executor:
        imported = dict(executor.map(import_listing, listings))
    output = ROOT / "src/data/propertyReviews.json"
    output.write_text(json.dumps(imported, indent=2, ensure_ascii=True) + "\n")
    print(f"Imported {sum(len(p['reviews']) for p in imported.values())} reviews "
          f"across {len(imported)} exact property listings.")


if __name__ == "__main__":
    main()
