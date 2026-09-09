import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { calculateStayPricing } from "@/lib/pricing";

const fmt = (n) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PropertyCard({ property, arrival, departure }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(property.id);
  const detailUrl = `/PropertyDetail?id=${property.id}`;
  const hasPrice = property.price_per_night != null;
  const pricing = calculateStayPricing(
    property.price_per_night,
    property.rack_rate_per_night,
    arrival,
    departure
  );
  const showEstimate = pricing != null;

  return (
    <Link to={detailUrl} className="group cursor-pointer block">
      <div className="relative overflow-hidden mb-4 aspect-[4/3]">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {property.featured && (
          <div className="absolute top-3 right-3 bg-[#b89968] text-white px-3 py-1 text-xs tracking-wider font-medium rounded-sm">
            FEATURED
          </div>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property); }}
          aria-label={saved ? "Remove from saved homes" : "Save to favorites"}
          aria-pressed={saved}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={saved ? "w-4 h-4 text-[#e63946]" : "w-4 h-4 text-gray-700"}
            fill={saved ? "#e63946" : "none"}
            strokeWidth={2}
          />
        </button>
      </div>
      <h4 className="text-base sm:text-lg tracking-wider font-medium text-gray-700 mb-2">
        {property.name}
      </h4>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 tracking-wide mb-2">
        <MapPin className="w-4 h-4" />
        <span>{property.location}</span>
        <span>•</span>
        <Bed className="w-4 h-4" />
        <span>{property.bedrooms} Bed</span>
        <span>•</span>
        <Bath className="w-4 h-4" />
        <span>{property.bathrooms} Bath</span>
      </div>
      {showEstimate ? (
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-400 line-through">{fmt(pricing.rackTotal)}</span>
            <span className="text-lg font-semibold text-gray-900">{fmt(pricing.total)}</span>
          </div>
          <p className="text-[10px] tracking-wider text-gray-500 uppercase">
            {pricing.nights} night{pricing.nights !== 1 ? "s" : ""} · avg {fmt(pricing.avgRate)}/night · incl. taxes &amp; fees
          </p>
        </div>
      ) : hasPrice ? (
        <p className="text-[#b89968] font-medium">From {fmt(property.price_per_night)}/night</p>
      ) : (
        <p className="text-[#b89968] font-medium">Quote-based</p>
      )}
    </Link>
  );
}