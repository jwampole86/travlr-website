import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ChevronLeft } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import AreaGallery from "@/components/AreaGallery";

const AREA_DATA = {
  "Palm Desert": {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f9945aff077ee02e61835e/f3fbc7a9e_Screenshot2026-02-24at112242PM.png",
    description:
      "Palm Desert is the beating heart of the Coachella Valley — home to the upscale El Paseo shopping district, world-class golf, The Living Desert zoo, and a year-round calendar of arts and dining. Our Palm Desert homes range from modern architectural masterpieces perched in the Cahuilla Hills to sprawling resort-style estates with two pools, lazy rivers, and private pickleball courts.",
    gallery: [
      "https://media.base44.com/images/public/68f9945aff077ee02e61835e/751514953_generated_image.png",
      "https://media.base44.com/images/public/68f9945aff077ee02e61835e/f3fbc7a9e_Screenshot2026-02-24at112242PM.png",
      "https://media.base44.com/images/public/68f9945aff077ee02e61835e/4c80f753e_generated_image.png",
      "https://media.base44.com/images/public/68f9945aff077ee02e61835e/02f5f1c05_generated_image.png",
      "https://media.base44.com/images/public/68f9945aff077ee02e61835e/81133c48d_generated_image.png",
    ]
  },
  "La Quinta": {
    img: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/623268b90_generated_image.png",
    description:
      "La Quinta is the desert's golf capital, anchored by the legendary PGA West community with its TPC Stadium, Greg Norman, and Jack Nicklaus Tournament courses. Old Town La Quinta offers charming dining and boutiques, while the surrounding mountains frame luxury villas with golf course and mountain views just minutes from the Empire Polo Fields.",
    gallery: [
      "https://images.unsplash.com/photo-1535131749006-b7f58395099b?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c891e2b5f98b?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1610530460358-fs63323b0890?w=1200&q=80",
    ]
  },
  "Palm Springs": {
    img: "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=1200&q=80",
    description:
      "Palm Springs is an iconic desert resort town famous for its mid-century modern architecture, Rat Pack Hollywood history, and the Palm Springs Aerial Tramway. The Racquet Club West neighborhood blends estate-sized properties with walkable access to downtown's hotels, restaurants, and design shops — all set against striking mountain backdrops.",
    gallery: [
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=1200&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc5950?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c891e2b5f98b?w=1200&q=80",
      "https://images.unsplash.com/photo-1535131749006-b7f58395099b?w=1200&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=80",
    ]
  },
  Indio: {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f9945aff077ee02e61835e/f29348609_Screenshot2026-02-24at101804PM.png",
    description:
      "Indio is the 'City of Festivals,' home to the Empire Polo Club where Coachella and Stagecoach take over the desert each spring. Beyond the festivals, Indio offers date groves, the Riverside County Fair, and easy access to golf, casinos, and a growing collection of luxury vacation homes minutes from the polo grounds.",
    gallery: [
      "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c891e2b5f98b?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1535131749006-b7f58395099b?w=1200&q=80",
    ]
  },
  Coachella: {
    img: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&q=80",
    description:
      "Coachella is a fast-growing desert city minutes from the Empire Polo Fields and the festival action. Our Coachella homes offer a serene, design-forward escape — Bali- and Tulum-inspired retreats with saltwater pools, fire pits, and putting greens, perfectly positioned for festival-goers and sun-seekers alike.",
    gallery: [
      "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c891e2b5f98b?w=1200&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    ]
  },
  "Bermuda Dunes": {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    description:
      "Bermuda Dunes is an exclusive gated golf community just minutes from Palm Desert and La Quinta. Known for the Bermuda Dunes Country Club and its tranquil, private setting, it's home to some of the desert's most spectacular resort-style estates — including properties with lazy rivers, pickleball courts, and panoramic mountain views.",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1535131749006-b7f58395099b?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c891e2b5f98b?w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1610530460358-fs63323b0890?w=1200&q=80",
    ]
  }
};

export default function AreaPage() {
  const { areaName } = useParams();
  const decodedName = decodeURIComponent(areaName || "");
  const area = AREA_DATA[decodedName];

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", "area", decodedName],
    queryFn: async () => {
      const all = await base44.entities.Property.list();
      return all.filter((p) => p.location === decodedName);
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[420px] w-full overflow-hidden bg-[#f8f6f3]">
        {area?.img && (
          <img
            src={area.img}
            alt={decodedName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className={`absolute inset-0 ${area?.img ? "bg-black/40" : "bg-gradient-to-br from-[#b89968]/30 to-[#f8f6f3]"}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-[44px] font-light tracking-[0.15em] md:tracking-[0.2em] text-center px-4 drop-shadow-lg">
            {decodedName.toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        {area?.description ? (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-gray-600 leading-relaxed text-lg tracking-wide">
              {area.description}
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#b89968] tracking-[0.2em] text-sm uppercase mb-3">Coming Soon</p>
            <p className="text-gray-600 leading-relaxed text-lg tracking-wide">
              TRAVLR is expanding to {decodedName}. Check back soon for our hand-picked homes in this destination.
            </p>
          </div>
        )}

        {/* Destination Photo Gallery */}
        {area?.gallery && (
          <AreaGallery images={area.gallery} title={decodedName} />
        )}

        <div className="text-center mb-10">
          <h2 className="text-[28px] tracking-[0.2em] font-light text-gray-700 mb-2">
            VACATION HOMES IN {decodedName.toUpperCase()}
          </h2>
          <p className="text-gray-500 text-sm tracking-wider">
            {properties.length} {properties.length === 1 ? "home" : "homes"} available
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No properties found in this area.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}