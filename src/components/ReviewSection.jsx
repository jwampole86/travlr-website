import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Star, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { loadPropertyReviews, mergePropertyReviews } from "@/lib/propertyReviews";

export default function ReviewSection({ propertyId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    rating: 5,
    title: "",
    comment: "",
    stay_date: ""
  });

  const { data: websiteReviews = [], isLoading, isError } = useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const allReviews = await base44.entities.Review.filter({ property_id: propertyId });
      if (!Array.isArray(allReviews)) {
        throw new Error("The property review service returned an invalid response.");
      }
      return allReviews
        .filter((review) => review.property_id === propertyId)
        .filter((review) => !review.approval_status || review.approval_status === "approved")
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  });

  const {
    data: importedListing,
    isLoading: isImportLoading,
    isError: isImportError,
  } = useQuery({
    queryKey: ["imported-property-reviews", propertyId],
    queryFn: () => loadPropertyReviews(propertyId),
    staleTime: Infinity,
  });
  const reviews = mergePropertyReviews(propertyId, websiteReviews, importedListing);
  const ratedReviews = reviews.filter((review) =>
    typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5
  );

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      await base44.entities.Review.create(reviewData);
    },
    onMutate: async (reviewData) => {
      await queryClient.cancelQueries(["reviews", propertyId]);
      const previous = queryClient.getQueryData(["reviews", propertyId]);
      return { previous };
    },
    onError: (_err, _reviewData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reviews", propertyId], context.previous);
      }
    },
    onSuccess: () => {
      setSubmittedForApproval(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["reviews", propertyId]);
      setShowForm(false);
      setFormData({
        guest_name: "",
        guest_email: "",
        rating: 5,
        title: "",
        comment: "",
        stay_date: ""
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    reviewMutation.mutate({
      ...formData,
      property_id: propertyId,
      approval_status: "pending",
      source: "website_review_form"
    });
  };

  const averageRating = ratedReviews.length > 0
    ? (ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length).toFixed(1)
    : 0;

  const StarRating = ({ rating, interactive = false, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-[#c4a574] text-[#c4a574]"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:fill-[#c4a574] hover:text-[#c4a574]" : ""}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-2">
            Guest Reviews
          </h2>
          {ratedReviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-lg font-medium text-gray-800">{averageRating}</span>
              <span className="text-gray-500">({ratedReviews.length} {ratedReviews.length === 1 ? "rating" : "ratings"} shown)</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#b89968] hover:bg-[#a68858] text-white"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {submittedForApproval && (
        <div className="border border-[#b89968]/30 bg-[#fbf6ee] p-4 text-sm text-gray-600">
          Thanks for sharing your experience. Your review has been submitted for approval and will appear after an admin reviews it.
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-light tracking-wider">Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                    Your Name *
                  </label>
                  <Input
                    required
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                    Email *
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                  Rating *
                </label>
                <StarRating
                  rating={formData.rating}
                  interactive
                  onChange={(rating) => setFormData({ ...formData, rating })}
                />
              </div>

              <div>
                <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                  Review Title *
                </label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sum up your experience"
                />
              </div>

              <div>
                <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                  Your Review *
                </label>
                <Textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share details about your stay..."
                  rows={5}
                />
              </div>

              <div>
                <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                  Date of Stay
                </label>
                <Input
                  type="date"
                  value={formData.stay_date}
                  onChange={(e) => setFormData({ ...formData, stay_date: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={reviewMutation.isPending}
                className="w-full bg-[#b89968] hover:bg-[#a68858] text-white"
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {importedListing && (
        <a
          href={importedListing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#b89968] underline hover:text-[#a68858]"
        >
          {importedListing.source_name === "TRAVLR"
            ? `Read all ${importedListing.reviews.length} published reviews on TRAVLR`
            : `View reviews on ${importedListing.source_name} (${importedListing.source_review_count} published)`}
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
      {importedListing && importedListing.source_name !== "TRAVLR" && (
        <p className="text-sm text-gray-500">
          {importedListing.source_review_count > 0
            ? `Showing ${importedListing.reviews.length} reviews publicly available from the source, out of ${importedListing.source_review_count} published.`
            : `No published reviews were available on this home's ${importedListing.source_name} listing when last checked.`}
        </p>
      )}
      {(isError || isImportError) && (
        <p role="alert" className="text-sm text-gray-600">
          {reviews.length > 0
            ? "Some reviews could not be loaded. Available published reviews are shown below."
            : "We couldn't load this home's guest reviews. Please try again later."}
        </p>
      )}

      {/* Reviews List */}
      {(isLoading || isImportLoading) && reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : (isError || isImportError) && reviews.length === 0 ? (
        null
      ) : reviews.length === 0 ? (
        <p className="py-8 text-gray-500">No guest reviews have been published for this home yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, visibleCount).map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#b89968]/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#b89968]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{review.guest_name}</h4>
                        <p className="text-sm text-gray-500">
                          {review.published_date
                            ? `Reviewed ${format(parseISO(review.published_date), "MMMM d, yyyy")}`
                            : review.stay_date && `Stayed ${format(parseISO(review.stay_date), "MMMM yyyy")}`}
                        </p>
                      </div>
                      {review.rating != null && <StarRating rating={review.rating} />}
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
                    )}
                    <p className="whitespace-pre-line text-gray-600 leading-relaxed">{review.comment}</p>
                    {review.source_url && (
                      <a
                        href={review.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-[#b89968] underline hover:text-[#a68858]"
                      >
                        View original {review.source_name} review <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {visibleCount < reviews.length && (
            <Button
              variant="outline"
              onClick={() => setVisibleCount((count) => count + 6)}
              className="w-full"
            >
              Show more reviews ({reviews.length - visibleCount} remaining)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}