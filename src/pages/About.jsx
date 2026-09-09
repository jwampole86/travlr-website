import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80"
          alt="About TRAVLR"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] md:tracking-[0.2em] text-white text-center px-4">
            ABOUT TRAVLR
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed tracking-wide mb-4">
              TRAVLR Vacation Homes was founded with a simple mission: to provide exceptional luxury vacation rental experiences
              in America's most sought-after destinations. We believe that where you stay matters just as much as where you go.
            </p>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              Our carefully curated collection of properties spans from the majestic mountains of Aspen and Vail to the vibrant
              cityscapes of Miami and Seattle, each handpicked to ensure the highest standards of luxury, comfort, and style.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-6">
              What Sets Us Apart
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
                  Curated Excellence
                </h3>
                <p className="text-gray-600 leading-relaxed tracking-wide">
                  Every property in our portfolio is personally inspected and selected for its unique character,
                  exceptional amenities, and prime location.
                </p>
              </div>
              <div>
                <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
                  White-Glove Service
                </h3>
                <p className="text-gray-600 leading-relaxed tracking-wide">
                  Our dedicated concierge team is available 24/7 to ensure your stay is seamless, from pre-arrival
                  planning to departure.
                </p>
              </div>
              <div>
                <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
                  Local Expertise
                </h3>
                <p className="text-gray-600 leading-relaxed tracking-wide">
                  We provide insider knowledge and recommendations to help you experience each destination like a local.
                </p>
              </div>
              <div>
                <h3 className="text-xl tracking-wider font-medium text-gray-700 mb-3">
                  Luxury Standards
                </h3>
                <p className="text-gray-600 leading-relaxed tracking-wide">
                  From premium linens to gourmet kitchens, every detail is thoughtfully considered to exceed your expectations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f8f6f3] p-6 md:p-8 rounded-sm">
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-6">
              Our Commitment
            </h2>
            <p className="text-gray-600 leading-relaxed tracking-wide">
              At TRAVLR, we're committed to creating unforgettable vacation experiences. Whether you're seeking
              a mountain retreat, a beach escape, or an urban adventure, we're here to make your stay extraordinary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}