import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingUp, Shield, Users, Star } from "lucide-react";

export default function Homeowners() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to={createPageUrl("Home")} className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80"
          alt="Homeowner Partnership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-3xl px-6">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] md:tracking-[0.2em] text-white mb-4 md:mb-6">
              PARTNER WITH TRAVLR
            </h1>
            <p className="text-base md:text-xl text-white/90 tracking-wide">
              Maximize your property's potential with our comprehensive luxury vacation rental management
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-4">
            Why Choose TRAVLR
          </h2>
          <p className="text-gray-600 leading-relaxed tracking-wide max-w-3xl mx-auto">
            We provide everything you need to successfully manage your luxury vacation rental,
            from marketing to guest services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="flex gap-6">
            <div className="w-16 h-16 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-[#b89968]" />
            </div>
            <div>
              <h3 className="text-2xl font-light tracking-wider text-gray-800 mb-3">
                Maximum Revenue
              </h3>
              <p className="text-gray-600 leading-relaxed tracking-wide">
                Our dynamic pricing strategy and premium marketing ensure your property achieves
                optimal occupancy rates and rental income.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-16 h-16 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-[#b89968]" />
            </div>
            <div>
              <h3 className="text-2xl font-light tracking-wider text-gray-800 mb-3">
                Property Protection
              </h3>
              <p className="text-gray-600 leading-relaxed tracking-wide">
                Comprehensive insurance coverage, thorough guest screening, and regular property
                inspections protect your investment.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-16 h-16 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-8 h-8 text-[#b89968]" />
            </div>
            <div>
              <h3 className="text-2xl font-light tracking-wider text-gray-800 mb-3">
                Full-Service Management
              </h3>
              <p className="text-gray-600 leading-relaxed tracking-wide">
                We handle everything: guest communications, cleaning, maintenance, and 24/7
                concierge services.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-16 h-16 bg-[#b89968]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-8 h-8 text-[#b89968]" />
            </div>
            <div>
              <h3 className="text-2xl font-light tracking-wider text-gray-800 mb-3">
                Premium Positioning
              </h3>
              <p className="text-gray-600 leading-relaxed tracking-wide">
                Your property joins an exclusive collection of luxury rentals, attracting
                high-quality guests who respect your home.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f8f6f3] p-6 md:p-12 rounded-sm mb-12">
          <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-8 text-center">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Professional photography and videography",
              "Multi-channel marketing (Airbnb, VRBO, direct bookings)",
              "Dynamic pricing optimization",
              "Guest screening and verification",
              "24/7 guest support and concierge services",
              "Professional cleaning and turnover",
              "Regular property maintenance and inspections",
              "Detailed financial reporting",
              "Linen and toiletry management",
              "Strategic revenue management"
            ].map((service, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#b89968] rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how TRAVLR can help you maximize your property's potential while
            providing exceptional experiences for your guests.
          </p>
          <Link to="/estimate">
            <Button className="bg-[#b89968] hover:bg-[#a68858] text-white px-8 py-6 text-sm tracking-wider">
              GET YOUR ESTIMATE
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}