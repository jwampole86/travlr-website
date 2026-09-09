import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const all = await base44.entities.Review.list("-created_date", 500);
      return all.filter((review) => review.approval_status === "pending");
    },
  });

  const moderationMutation = useMutation({
    mutationFn: ({ id, approval_status }) =>
      base44.entities.Review.update(id, { approval_status }),
    onSuccess: () => queryClient.invalidateQueries(["admin-reviews"]),
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6">
          <Link to="/admin/leads" className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968]">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Admin
          </Link>
          <h1 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">Review Moderation</h1>
        </div>
      </header>
      <main className="mx-auto max-w-[1000px] px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-wider text-gray-800">Pending Reviews</h2>
          <p className="mt-2 text-sm tracking-wide text-gray-500">Approve reviews before they become visible on property pages.</p>
        </div>
        {isLoading ? (
          <p className="py-12 text-center text-gray-500">Loading pending reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="border border-gray-200 bg-[#f8f6f3] p-12 text-center text-gray-500">No reviews are waiting for approval.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-3"><h3 className="text-lg font-medium text-gray-800">{review.guest_name}</h3><span className="text-[#b89968]">{"★".repeat(review.rating || 0)}</span></div>
                    <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Property ID: {review.property_id}</p>
                    {review.title && <h4 className="mt-4 font-medium text-gray-700">{review.title}</h4>}
                    <p className="mt-2 max-w-2xl leading-7 text-gray-600">{review.comment}</p>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <Button onClick={() => moderationMutation.mutate({ id: review.id, approval_status: "approved" })} className="bg-green-700 text-white hover:bg-green-800"><Check className="mr-1 h-4 w-4" /> Approve</Button>
                    <Button variant="outline" onClick={() => moderationMutation.mutate({ id: review.id, approval_status: "rejected" })} className="border-red-200 text-red-700 hover:bg-red-50"><X className="mr-1 h-4 w-4" /> Reject</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
