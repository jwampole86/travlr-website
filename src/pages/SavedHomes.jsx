import React from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import PropertyCard from "@/components/PropertyCard";
import { createPageUrl } from "@/utils";

export default function SavedHomes() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
          {favorites.length > 0 && (
            <button
              type="button"
              onClick={clearFavorites}
              className="text-xs tracking-[0.15em] text-gray-500 hover:text-[#b89968] transition-colors"
            >
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-[0.2em] text-gray-700 mb-2 text-center">
          SAVED HOMES
        </h1>
        <p className="text-gray-500 text-sm tracking-wider text-center mb-12">
          Your favorite vacation rentals, all in one place
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">
              You haven't saved any homes yet.
            </p>
            <Link
              to={createPageUrl("SearchResults")}
              className="text-[#b89968] hover:underline tracking-wider text-sm"
            >
              BROWSE VACATION HOMES
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {favorites.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}