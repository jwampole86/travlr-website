import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, Check, Phone, Mail, MapPin, Sparkles, Utensils, ShoppingBag, HeartPulse, Ticket, Flag } from "lucide-react";

const conciergeServices = [
  ["Private Chef Services", "Let us find someone to prepare a meal for you.", "https://www.staytravlr.com/wp-content/uploads/2022/10/travlr-chef.jpg", Utensils],
  ["Daily Housekeeping", "Request to add daily cleaning to your stay.", "https://www.staytravlr.com/wp-content/uploads/2022/10/strut-oasis-pool.jpg", Sparkles],
  ["Local Recommendations", "Discover top-rated restaurants, shops, trails, and desert experiences selected by our local team.", "https://www.staytravlr.com/wp-content/uploads/2023/01/AdobeStock_213541453-scaled.jpg", MapPin],
  ["Villa Pre-Stocking", "Let us prepare your home for your arrival with groceries, essentials, and your preferred favorites.", "https://www.staytravlr.com/wp-content/uploads/2022/11/Groceries.jpg", ShoppingBag],
  ["In-Home Spa Treatments", "Pamper yourself in the comfort of your vacation villa.", "https://www.staytravlr.com/wp-content/uploads/2023/01/AdobeStock_454830486-scaled.jpg", HeartPulse],
  ["Restaurant Reservations", "Dine at one of our top-rated restaurants with reservations arranged before you arrive.", "https://www.staytravlr.com/wp-content/uploads/2017/11/eba3ea_5f275fdd562d402f8537fb313f2b003c_mv2.jpg", Utensils],
  ["Golf Course Booking", "Golf at one of the beautiful courses across the Coachella Valley.", "https://www.staytravlr.com/wp-content/uploads/2020/05/The-American-Express-Golf-Image.jpg", Flag],
  ["Event Tickets", "We can connect you with cultural events, concerts, festivals, and unforgettable desert experiences.", "https://www.staytravlr.com/wp-content/uploads/2017/10/events-img.jpg", Ticket],
];

export default function GuestServices() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to={createPageUrl("Home")} className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
          alt="Guest Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] md:tracking-[0.2em] text-white text-center px-4">
            GUEST SERVICES
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
        <div className="mb-12 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:mb-20">
          <img src="https://www.staytravlr.com/wp-content/uploads/2023/03/1.png" alt="TRAVLR concierge planning a personalized desert experience" className="h-full min-h-[260px] w-full rounded-sm object-cover" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#b89968]">Creating personalized travel experiences</p>
            <h2 className="mt-4 text-3xl font-light tracking-wider text-gray-800 md:text-4xl">We're Here to Help</h2>
            <p className="mt-5 text-gray-600 leading-relaxed tracking-wide">Top-rated restaurants, world-class spas, beautiful golf courses, shopping, historical tours, and more await during your stay. Our local area experts offer complimentary concierge services to help you make the most of your time in the desert.</p>
            <p className="mt-4 text-gray-600 leading-relaxed tracking-wide">From restaurant reservations and spa bookings to golf tee times, event tickets, and grocery shopping, every detail can be arranged before you arrive.</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm"><a href="tel:+19495398862" className="inline-flex items-center gap-2 text-[#b89968] hover:underline"><Phone className="h-4 w-4" />(949) 539-8862</a><a href="mailto:info@staytrvlr.com" className="inline-flex items-center gap-2 text-[#b89968] hover:underline"><Mail className="h-4 w-4" />info@staytrvlr.com</a></div>
          </div>
        </div>

        <div className="mb-12 text-center md:mb-16"><h2 className="text-2xl font-light uppercase tracking-[0.2em] text-gray-700 md:text-[36px]">Concierge Services</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed tracking-wide text-gray-600">Enhance your experience with thoughtful services arranged around the way you want to travel.</p></div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {conciergeServices.map(([title, description, image, Icon]) => (
            <article key={title} className="group overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[1.35] overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-black/10" /><div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#b89968]"><Icon className="h-5 w-5" /></div></div>
              <div className="p-6"><h3 className="text-lg font-medium tracking-wider text-gray-700">{title}</h3><p className="mt-3 min-h-[48px] text-sm leading-6 tracking-wide text-gray-600">{description}</p><Link to={createPageUrl("Contact")} className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#b89968] hover:text-[#a68858]"><Check className="h-4 w-4" /> Enhance My Experience</Link></div>
            </article>
          ))}
        </div>

        <div className="bg-white border-2 border-[#b89968]/20 p-6 md:p-8 rounded-sm">
          <h3 className="text-2xl font-light tracking-wider text-gray-800 mb-4">
            Our Services Include
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>Pre-arrival grocery stocking and meal preparation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>Restaurant reservations and activity bookings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>Private chef and catering arrangements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>Transportation and airport transfers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>In-home spa and wellness services</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#b89968] mt-1">•</span>
              <span>Equipment rentals (ski, bike, etc.)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}