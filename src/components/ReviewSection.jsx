import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Star, User } from "lucide-react";
import { format } from "date-fns";

const AIRBNB_HOST_REVIEWS_URL = "https://www.airbnb.com/users/profile/1462768828819189174?previous_page_name=PdpHomeMarketplace";
const sourcedHostReviews = [
  {
    id: "airbnb-host-steve",
    guest_name: "Steve",
    rating: 5,
    title: "Guest Review",
    comment: "We had a great stay and really enjoyed the property. The views are absolutely amazing, and the infinity pool was definitely one of the highlights.",
  },
  {
    id: "airbnb-host-francine",
    guest_name: "Francine",
    rating: 5,
    title: "Guest Review",
    comment: "Everything was great. Had a great stay with family! Thank you!",
  },
];

export default function ReviewSection({ propertyId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    rating: 5,
    title: "",
    comment: "",
    stay_date: ""
  });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const allReviews = await base44.entities.Review.filter({ property_id: propertyId });
      return allReviews
        .filter((review) => !review.approval_status || review.approval_status === "approved")
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  });

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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const displayedReviews = reviews.length > 0 ? reviews : sourcedHostReviews;

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
            {reviews.length > 0 ? "Guest Reviews" : "Reviews from Airbnb"}
          </h2>
          {displayedReviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={reviews.length > 0 ? Math.round(averageRating) : 5} />
              {reviews.length > 0 ? (
                <><span className="text-lg font-medium text-gray-800">{averageRating}</span><span className="text-gray-500">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span></>
              ) : (
                <span className="text-sm text-gray-500">Public excerpts from Jen&apos;s Airbnb host profile</span>
              )}
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

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
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
                          {review.stay_date && `Stayed ${format(new Date(review.stay_date), "MMMM yyyy")}`}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
                    )}
                    <p className="text-gray-600 leading-relaxed">&quot;{review.comment}&quot;</p>
                    {review.id.startsWith("airbnb-") && (
                      <a href={AIRBNB_HOST_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-[#b89968] underline hover:text-[#a68858]">
                        View source on Airbnb <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}