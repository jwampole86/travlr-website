import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, Clock, Phone, Mail, Headphones } from "lucide-react";

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
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-4">
            We're Here to Help
          </h2>
          <p className="text-gray-600 leading-relaxed tracking-wide">
            Our dedicated team is available to assist you before, during, and after your stay.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-[#f8f6f3] p-6 md:p-8 rounded-sm">
            <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#b89968]" />
            </div>
            <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
              24/7 Concierge
            </h3>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              Round-the-clock assistance for any questions or needs during your stay.
            </p>
          </div>

          <div className="bg-[#f8f6f3] p-6 md:p-8 rounded-sm">
            <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-[#b89968]" />
            </div>
            <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
              Direct Contact
            </h3>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              Call or text us at <a href="tel:+19495398862" className="text-[#b89968] hover:underline">(949) 539-8862</a> for immediate assistance.
            </p>
          </div>

          <div className="bg-[#f8f6f3] p-6 md:p-8 rounded-sm">
            <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#b89968]" />
            </div>
            <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
              Email Support
            </h3>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              Reach us at <a href="mailto:info@staytrvlr.com" className="text-[#b89968] hover:underline">info@staytrvlr.com</a> for non-urgent inquiries.
            </p>
          </div>

          <div className="bg-[#f8f6f3] p-6 md:p-8 rounded-sm">
            <div className="w-12 h-12 bg-[#b89968]/10 rounded-full flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6 text-[#b89968]" />
            </div>
            <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
              Personal Assistance
            </h3>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              Custom arrangements for dining, activities, and special requests.
            </p>
          </div>
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