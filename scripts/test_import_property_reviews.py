import importlib.util
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "import_property_reviews", Path(__file__).with_name("import-property-reviews.py")
)
importer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(importer)


def source(rating='<p class="c-review__rating">4/5</p>'):
    return (
        '<script type="application/ld+json">'
        '{"@type":"VacationRental","name":"Test Home"}</script>'
        '<section id="guest-reviews-index"><article class="c-review">'
        '<h3 class="c-review__title">Lovely &amp; peaceful</h3>'
        '<p class="c-review__meta">by Guest '
        '<time datetime="2025-10-01">2025-10-01</time></p>'
        + rating
        + '<div class="c-review__body">First line.<br />'
        '<p>Second <strong>line</strong>.</p> Final line.</div></article></section>'
    )


class ImportTests(unittest.TestCase):
    def parse(self, page):
        with patch.object(importer.subprocess, "run", return_value=SimpleNamespace(stdout=page)):
            return importer.import_listing(("test-home", "home-a"))[1]

    def test_exact_text_dates_and_ratings(self):
        listing = self.parse(source())
        review = listing["reviews"][0]
        self.assertEqual(review["guest_name"], "Guest")
        self.assertEqual(review["title"], "Lovely & peaceful")
        self.assertEqual(review["comment"], "First line.\nSecond line. Final line.")
        self.assertEqual(review["published_date"], "2025-10-01")
        self.assertEqual(review["rating"], 4)
        self.assertEqual(review["property_id"], "home-a")
        self.assertEqual(listing["source_url"],
                         "https://www.staytravlr.com/vacation-rental/test-home/")

    def test_unrated_review_does_not_get_a_fabricated_score(self):
        self.assertIsNone(self.parse(source(""))["reviews"][0]["rating"])

    def test_wrong_property_fails_explicitly(self):
        with self.assertRaisesRegex(ValueError, "identity mismatch"):
            self.parse(source().replace('"name":"Test Home"', '"name":"Other Home"'))

    def test_invalid_rating_fails_explicitly(self):
        with self.assertRaisesRegex(ValueError, "invalid author or rating"):
            self.parse(source('<p class="c-review__rating">6/5</p>'))

    def test_future_date_fails_explicitly(self):
        with self.assertRaisesRegex(ValueError, "future-dated"):
            self.parse(source().replace("2025-10-01", "2099-10-01"))


if __name__ == "__main__":
    unittest.main()
