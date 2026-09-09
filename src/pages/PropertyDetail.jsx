import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  UtensilsCrossed,
  Tv,
  Wind,
  Waves,
  MapPin,
  Bed,
  Bath,
  Check,
  PawPrint,
  Accessibility,
  ExternalLink,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Phone as PhoneIcon } from "lucide-react";
import ReviewSection from "../components/ReviewSection";
import AIDescriptionGenerator from "../components/AIDescriptionGenerator";
import { calculateStayPricing } from "@/lib/pricing";
import referenceProperties from "@/data/referenceProperties";

const amenityIcons = {
  "WiFi": Wifi,
  "Parking": Car,
  "Kitchen": UtensilsCrossed,
  "TV": Tv,
  "Air Conditioning": Wind,
  "Pool": Waves,
};

const verifiedReviewLinks = {
  "Casa Roca": "https://www.vrbo.com/2756367",
  "Base Camp": "https://www.vrbo.com/1978340",
  "Perch": "https://www.vrbo.com/3794371",
  "Casa Mara": "https://www.vrbo.com/2301357",
  "Villa Bella": "https://www.vrbo.com/2744508",
};
const verifiedReviewAggregates = {
  "Casa Roca": { rating: "10.0", count: 60 },
  "Base Camp": { rating: "10.0", count: 131 },
  Perch: { rating: "10.0", count: 63 },
  "Casa Mara": { rating: "10.0", count: 92 },
  "Villa Bella": { rating: "10.0", count: 77 },
};
const airbnbHostReviewsUrl = "https://www.airbnb.com/users/profile/1462768828819189174?previous_page_name=PdpHomeMarketplace";
const airbnbListingReviews = {
  "Base Camp": { url: "https://www.airbnb.com/rooms/17210104?source_impression_id=p3_1788967214_P3ffMup3OeZ_j9O5", rating: "4.96", count: 69 },
  "Santal Estate": { url: "https://www.airbnb.com/rooms/17923295?source_impression_id=p3_1788967214_P3jK9h7e0emnaPhJ", rating: "4.99", count: 94 },
  Cappella: { url: "https://www.airbnb.com/rooms/20829909", rating: "4.82", count: 97 },
};
const directBookingLinks = {
  "Casa Roca": { url: "https://www.vrbo.com/2756367", platform: "Vrbo" },
  "Base Camp": { url: "https://www.airbnb.com/rooms/17210104?source_impression_id=p3_1788967214_P3ffMup3OeZ_j9O5", platform: "Airbnb" },
  Perch: { url: "https://www.vrbo.com/3794371", platform: "Vrbo" },
  "Casa Mara": { url: "https://www.vrbo.com/2301357", platform: "Vrbo" },
  "Villa Bella": { url: "https://www.vrbo.com/2744508", platform: "Vrbo" },
  "Santal Estate": { url: "https://www.airbnb.com/rooms/17923295?source_impression_id=p3_1788967214_P3jK9h7e0emnaPhJ", platform: "Airbnb" },
  Cappella: { url: "https://www.airbnb.com/rooms/20829909", platform: "Airbnb" },
};

export default function PropertyDetail() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const { user } = useAuth();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      try {
        const properties = await base44.entities.Property.filter({ id: propertyId });
        return properties[0] || referenceProperties.find((property) => property.id === propertyId);
      } catch {
        return referenceProperties.find((property) => property.id === propertyId);
      }
    },
    enabled: !!propertyId,
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      await base44.integrations.Core.SendEmail({
        to: "info@staytrvlr.com",
        subject: `New Booking Inquiry - ${property.name}`,
        body: `
          New booking inquiry received:

          Property: ${property.name}
          Guest Name: ${bookingData.guestName}
          Email: ${bookingData.guestEmail}
          Phone: ${bookingData.guestPhone}
          Check-in: ${bookingData.checkIn}
          Check-out: ${bookingData.checkOut}
          Message: ${bookingData.message}
        `
      });
    },
    onSuccess: () => {
      setBookingSubmitted(true);
    },
  });

  const handleBooking = (e) => {
    e.preventDefault();
    bookingMutation.mutate({
      guestName,
      guestEmail,
      guestPhone,
      checkIn: checkIn ? format(checkIn, "MM/dd/yyyy") : "",
      checkOut: checkOut ? format(checkOut, "MM/dd/yyyy") : "",
      message,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Property not found</div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const fmt = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const stayPricing = calculateStayPricing(
    property.price_per_night,
    property.rack_rate_per_night,
    checkIn,
    checkOut
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to="/SearchResults" className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-light tracking-wider text-gray-800">
              {property.name}
            </h1>
            <div className="flex gap-2">
              {property.property_type && (
                <Badge variant="outline" className="text-[#b89968] border-[#b89968]">
                  {property.property_type}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#b89968]" />
              <span className="tracking-wide">{property.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#b89968]" />
              <span className="tracking-wide">{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-[#b89968]" />
              <span className="tracking-wide">{property.bathrooms} Bathrooms</span>
            </div>
            {property.pet_friendly && (
              <div className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-[#b89968]" />
                <span className="tracking-wide">Pet-Friendly</span>
              </div>
            )}
            {property.wheelchair_accessible && (
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-[#b89968]" />
                <span className="tracking-wide">Wheelchair Accessible</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden rounded-sm">
                <img
                  src={property.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {property.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery - scrollable strip of all photos */}
            {property.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-sm border-2 transition-all ${
                      idx === currentImageIndex ? "border-[#b89968] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* AI Description Generator - admin only */}
            {user?.role === "admin" && (
              <AIDescriptionGenerator
                property={property}
                onDescriptionGenerated={(desc) => {
                  // Could update local state if needed
                }}
              />
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-4">
                About This Property
              </h2>
              <p className="text-gray-600 leading-relaxed tracking-wide">
                {property.ai_description || property.description || "Experience luxury living in this stunning vacation rental. Perfect for families and groups seeking comfort and style."}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-6">
                  Amenities
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, idx) => {
                    const Icon = amenityIcons[amenity] || Check;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-gray-700">
                        <Icon className="w-5 h-5 text-[#b89968]" />
                        <span className="tracking-wide">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {verifiedReviewAggregates[property.name] && (
              <div className="mb-5 flex flex-wrap items-center gap-3 border border-gray-200 bg-[#f8f6f3] p-4">
                <div className="flex items-center gap-1 text-[#b89968]" aria-label={`${verifiedReviewAggregates[property.name].rating} out of 10 rating`}>
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{verifiedReviewAggregates[property.name].rating}/10</span>
                </div>
                <span className="text-sm text-gray-600">Verified Vrbo rating from {verifiedReviewAggregates[property.name].count} guest reviews</span>
              </div>
            )}
            <ReviewSection propertyId={propertyId} />
            {verifiedReviewLinks[property.name] && (
              <a
                href={verifiedReviewLinks[property.name]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm tracking-wide text-[#b89968] underline transition-colors hover:text-[#a68858]"
              >
                Read verified {property.name} reviews on Vrbo
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <a
              href={airbnbListingReviews[property.name]?.url || airbnbHostReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm tracking-wide text-[#b89968] underline transition-colors hover:text-[#a68858]"
            >
              {airbnbListingReviews[property.name]
                ? `Read ${property.name} reviews on Airbnb (${airbnbListingReviews[property.name].rating}/5, ${airbnbListingReviews[property.name].count} reviews)`
                : "Read host reviews on Airbnb"}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-2xl font-light tracking-wider text-gray-800">
                  From <span className="text-[#b89968] font-medium">${property.price_per_night}</span> / night
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {directBookingLinks[property.name] && (
                  <a
                    href={directBookingLinks[property.name].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-6 flex w-full items-center justify-center gap-2 bg-[#b89968] px-4 py-4 text-sm font-medium tracking-wider text-white transition-colors hover:bg-[#a68858]"
                  >
                    Book on {directBookingLinks[property.name].platform}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {bookingSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Inquiry Sent!
                    </h3>
                    <p className="text-sm text-gray-600">
                      We'll contact you shortly to confirm your booking.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Check In
                      </label>
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        className="rounded-md border"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Check Out
                      </label>
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        className="rounded-md border"
                        disabled={(date) => date <= (checkIn || new Date())}
                      />
                    </div>

                    {stayPricing && (
                      <div className="bg-[#f8f6f3] border border-gray-200 rounded-sm p-4 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs tracking-wider text-gray-500 uppercase">
                            {stayPricing.nights} night{stayPricing.nights !== 1 ? "s" : ""} · avg {fmt(stayPricing.avgRate)}/night
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-400 line-through">{fmt(stayPricing.rackTotal)}</span>
                          <span className="text-2xl font-semibold text-gray-900">{fmt(stayPricing.total)}</span>
                        </div>
                        <p className="text-[10px] tracking-wider text-gray-500 uppercase">
                          Including taxes &amp; fees
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
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
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Message
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any special requests or questions?"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="w-full bg-[#b89968] hover:bg-[#a68858] text-white py-6 text-sm tracking-wider font-medium"
                    >
                      {bookingMutation.isPending ? "Sending..." : "REQUEST TO BOOK"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile-only floating Call Now button */}
      <a
        href="tel:+19495398862"
        className="lg:hidden fixed bottom-20 right-5 z-50 flex items-center gap-2 bg-[#b89968] hover:bg-[#a68858] text-white px-6 py-4 rounded-full shadow-xl transition-all active:scale-95"
        aria-label="Call TRAVLR now"
      >
        <PhoneIcon className="w-5 h-5" />
        <span className="text-sm font-medium tracking-wider">CALL NOW</span>
      </a>
    </div>
  );
}