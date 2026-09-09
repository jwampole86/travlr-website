import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronDown, ChevronLeft, HelpCircle, FileText, Shield } from "lucide-react";

export default function GuestResources() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    {
      question: "What time is check-in and check out?",
      answer: "Check in is after 3 PM local time, and check out is no later than 11 AM. Early check in and late check out may be available for your reservation upon request. Please reach out for cost and availability."
    },
    {
      question: "Will I need to meet the property manager to get a key?",
      answer: "Most TRAVLR homes use convenient self check-in with access instructions delivered before arrival. If a personal welcome or key handoff is needed for your home, our team will coordinate it with you in advance."
    },
    {
      question: "Do you provide daily cleaning service?",
      answer: "Daily housekeeping can be added to your stay for an additional fee, subject to availability. Ask our concierge team to arrange cleaning around your schedule."
    },
    {
      question: "Can we have the pool heated?",
      answer: "Pool heating is available at select homes and may require an additional fee. Contact us before arrival so we can confirm availability and arrange it for your dates."
    },
    {
      question: "What is provided with my accommodations?",
      answer: "Homes include linens, towels, kitchen basics, and the amenities listed on the property's page. Your pre-arrival information will include home-specific details and anything you may want to bring."
    },
    {
      question: "May I ship a package to my vacation home?",
      answer: "Package delivery can often be coordinated, but arrangements vary by home and arrival timing. Contact our concierge before shipping anything so we can confirm the correct address and delivery plan."
    },
    {
      question: "Do you allow pets?",
      answer: "Some homes are pet-friendly. Please confirm the home's policy before booking, and note that additional pet fees or restrictions may apply."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Cancellation terms vary by property and are shown with your reservation details. Please review the specific policy for your selected home before booking, or contact our team with questions."
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
          FAQS
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
            <div key={idx} className="border-b border-gray-200">
              <button type="button" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} aria-expanded={openFaq === idx} className="flex w-full items-center justify-between gap-4 py-5 text-left">
                <span className="flex items-center gap-4"><HelpCircle className="h-5 w-5 flex-shrink-0 text-[#b89968]" /><span className="text-base font-medium uppercase tracking-[0.08em] text-gray-800">{faq.question}</span></span>
                <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#b89968] transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && <p className="pb-6 pl-9 text-gray-600 leading-relaxed tracking-wide">{faq.answer}</p>}
            </div>
          ))}
        </div>

        <div className="mb-12 flex flex-col items-center justify-between gap-5 bg-[#d8c09a] px-6 py-8 text-center sm:flex-row sm:text-left md:mb-16 md:px-10">
          <div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#705d41]">Ready to make the most of your stay?</p><h2 className="mt-2 text-2xl font-light tracking-wider text-[#3d4a53]">Start your vacation now.</h2></div>
          <Link to={createPageUrl("SearchResults")} className="inline-flex items-center bg-[#5d6670] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-[#46515a]">Explore Collection</Link>
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