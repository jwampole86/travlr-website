import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, HelpCircle, FileText, Shield } from "lucide-react";

export default function GuestResources() {
  const navigate = useNavigate();
  const faqs = [
    {
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies by property. Most properties offer a full refund if cancelled 30 days before check-in. Please review the specific policy for your selected property."
    },
    {
      question: "When can I check in and out?",
      answer: "Standard check-in time is 4:00 PM and check-out is 11:00 AM. Early check-in or late check-out may be available upon request for an additional fee."
    },
    {
      question: "Are pets allowed?",
      answer: "Select properties are pet-friendly. Use our advanced filters to find pet-friendly options. Additional pet fees may apply."
    },
    {
      question: "Is there parking available?",
      answer: "Most properties include complimentary parking. Specific parking details are provided in each property's amenities list."
    },
    {
      question: "How do I get the keys?",
      answer: "We'll provide detailed check-in instructions via email 48 hours before your arrival, including access codes or key pickup information."
    }
  ];

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
      <div className="h-[400px] w-full bg-[#3a3a3a] flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] md:tracking-[0.2em] text-white text-center px-4">
          GUEST RESOURCES
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 leading-relaxed tracking-wide">
            Find answers to common questions about your stay
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#f8f6f3] p-6 rounded-sm">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-[#b89968] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed tracking-wide">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center p-6 border-2 border-gray-200 rounded-sm cursor-pointer hover:border-[#b89968] transition-colors" onClick={() => navigate("/rental-agreement")}>
            <FileText className="w-10 h-10 text-[#b89968] mx-auto mb-4" />
            <h3 className="text-lg tracking-wider font-medium text-gray-700 mb-2">
              Rental Agreement
            </h3>
            <p className="text-sm text-gray-600">
              Standard short-term rental terms and conditions
            </p>
          </div>

          <div className="text-center p-6 border-2 border-gray-200 rounded-sm cursor-pointer hover:border-[#b89968] transition-colors" onClick={() => navigate("/shipment-authorization")}>
            <FileText className="w-10 h-10 text-[#b89968] mx-auto mb-4" />
            <h3 className="text-lg tracking-wider font-medium text-gray-700 mb-2">
              Shipment Authorization
            </h3>
            <p className="text-sm text-gray-600">
              Authorization for grocery stocking and deliveries
            </p>
          </div>

          <div className="text-center p-6 border-2 border-gray-200 rounded-sm cursor-pointer hover:border-[#b89968] transition-colors" onClick={() => navigate("/credit-card-authorization")}>
            <FileText className="w-10 h-10 text-[#b89968] mx-auto mb-4" />
            <h3 className="text-lg tracking-wider font-medium text-gray-700 mb-2">
              Credit Card Authorization
            </h3>
            <p className="text-sm text-gray-600">
              Payment authorization for reservations and incidentals
            </p>
          </div>

          <div className="text-center p-6 border-2 border-gray-200 rounded-sm cursor-pointer hover:border-[#b89968] transition-colors" onClick={() => window.open("https://www.csatravelprotection.com", "_blank", "noopener,noreferrer")}>
            <Shield className="w-10 h-10 text-[#b89968] mx-auto mb-4" />
            <h3 className="text-lg tracking-wider font-medium text-gray-700 mb-2">
              Travel Insurance
            </h3>
            <p className="text-sm text-gray-600">
              Protect your vacation with CSA Travel Protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}