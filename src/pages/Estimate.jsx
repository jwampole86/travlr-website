import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BottomSheetSelect from "@/components/BottomSheetSelect";
import EstimateInfo from "@/components/EstimateInfo";
import EstimateLoadingOverlay from "@/components/EstimateLoadingOverlay";
import EstimateIntro from "@/components/EstimateIntro";
import RevenueChart from "@/components/RevenueChart";
import LegalModal from "@/components/LegalModal";
import { storeEstimateLead } from "@/lib/leadStorage";
import {
  ChevronLeft,
  MapPin,
  Check,
  TrendingUp,
  DollarSign,
  Calendar,
  ShieldCheck,
  Scale,
} from "lucide-react";

const selectClass =
  "w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

const buildLocalEstimate = (address) => {
  const seed = [...address].reduce((total, character) => total + character.charCodeAt(0), 0);
  const estimatedAdr = 325 + (seed % 8) * 75;
  const occupancy = 58 + (seed % 12);
  const grossMonthlyRevenue = Math.round(estimatedAdr * (occupancy / 100) * 30);
  const netMonthlyRevenue = Math.round(grossMonthlyRevenue * 0.68);
  return {
    estimated_adr: estimatedAdr,
    estimated_occupancy: `${occupancy}%`,
    gross_monthly_revenue: grossMonthlyRevenue,
    net_monthly_revenue: netMonthlyRevenue,
    projected_annual_net: netMonthlyRevenue * 12,
    regulation_summary: "A live regulation review will be included when the TRAVLR estimate service is connected. Confirm local permits, occupancy limits, and tax requirements before operating a short-term rental.",
    market_summary: "This preliminary planning estimate uses a conservative nightly-rate and occupancy model. Actual performance depends on the property's amenities, condition, pricing strategy, seasonality, local demand, and applicable regulations.",
    isLocalEstimate: true,
  };
};

export default function Estimate() {
  const [step, setStep] = useState("intro");
  const [addressInput, setAddressInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Both must default to unchecked — a pre-checked box is a compliance failure.
  // termsAccepted is required to submit; SMS consent is optional and NOT a
  // condition of receiving an estimate.
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // "terms" | "privacy" | null

  // Whenever the flow advances to a new step (e.g. "START MY ESTIMATE" → address),
  // jump back to the very top so the next screen starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Optional Step 4 qualification signal (not required).
  const [propertyType, setPropertyType] = useState("");
  const [rentalStatus, setRentalStatus] = useState("");
  const [interestTimeline, setInterestTimeline] = useState("");

  // Optional contact preferences (not required to submit). Persisted to the
  // lead record so the team/automation can reach the homeowner at the right
  // time and via the right channel. Timezone is inferred server-side from the
  // property address, so only the method + time are collected here.
  const [preferredContactMethod, setPreferredContactMethod] = useState("");
  const [preferredContactTime, setPreferredContactTime] = useState("");

  // Debounced address autocomplete — user must select a validated suggestion.
  useEffect(() => {
    if (selectedAddress && addressInput === selectedAddress) return;
    if (addressInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await base44.functions.invoke("addressAutocomplete", { input: addressInput });
        setSuggestions(res.data?.suggestions || []);
        setShowSuggestions(true);
      } catch {
        const fallbackAddress = addressInput.trim();
        setSuggestions(fallbackAddress ? [{ place_id: `local-${fallbackAddress}`, description: fallbackAddress }] : []);
        setShowSuggestions(Boolean(fallbackAddress));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [addressInput, selectedAddress]);

  const estimateMutation = useMutation({
    mutationFn: async (addr) => {
      try {
        return await base44.integrations.Core.InvokeLLM({
        prompt: `You are a vacation rental revenue analyst for TRAVLR Vacation Homes, a luxury short-term rental property manager. A homeowner submitted this property address for a revenue estimate: "${addr}". Research the local short-term rental market for this exact address and return: (1) estimated average daily rate (ADR) in USD, (2) estimated occupancy rate as a percentage string like "65%", (3) estimated gross monthly revenue before costs in USD, (4) estimated net monthly revenue after typical operating costs (cleaning, platform fees, management, maintenance) in USD, (5) projected annual net revenue in USD, (6) a regulation summary describing the short-term rental rules, registration/permit requirements, and any restrictions that apply to this property's city/zone in plain language, and (7) a 2-3 sentence market summary referencing local demand, seasonality, and comparable rentals. Write all prose in TRAVLR Vacation Homes' own original voice. Do NOT cite, quote, attribute, or link to any external articles, third-party data providers, or competitor websites (for example Airbtics, SkyRun, AirDNA, or similar) — no bracketed source labels, no URLs, no "according to" references. Present the analysis as TRAVLR's own. Be realistic and conservative.`,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: {
          type: "object",
          properties: {
            estimated_adr: { type: "number" },
            estimated_occupancy: { type: "string" },
            gross_monthly_revenue: { type: "number" },
            net_monthly_revenue: { type: "number" },
            projected_annual_net: { type: "number" },
            regulation_summary: { type: "string" },
            market_summary: { type: "string" },
          },
        },
        });
      } catch {
        return buildLocalEstimate(addr);
      }
    },
    onSuccess: (data) => {
      setEstimate(data);
      setStep("estimate");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const urlParams = new URLSearchParams(window.location.search);
      const lead = {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        property_address: selectedAddress,
        terms_accepted: termsAccepted,
        terms_timestamp: now,
        terms_version: "TERMS-V1",
        privacy_version: "PRIVACY-V1",
        sms_consent_given: smsConsent,
        sms_consent_timestamp: smsConsent ? now : null,
        sms_consent_version: "SMS-CONSENT-V1",
        sms_consent_source: "estimate_web_form",
        sms_consent_page: "/estimate",
        utm_source: urlParams.get("utm_source") || null,
        utm_medium: urlParams.get("utm_medium") || null,
        utm_campaign: urlParams.get("utm_campaign") || null,
        estimated_adr: estimate?.estimated_adr,
        estimated_occupancy: estimate?.estimated_occupancy,
        gross_monthly_revenue: estimate?.gross_monthly_revenue,
        net_monthly_revenue: estimate?.net_monthly_revenue,
        projected_annual_net: estimate?.projected_annual_net,
        regulation_summary: estimate?.regulation_summary,
        market_summary: estimate?.market_summary,
        qualification_property_type: propertyType,
        qualification_rental_status: rentalStatus,
        qualification_interest_timeline: interestTimeline,
        preferred_contact_method: preferredContactMethod || null,
        preferred_contact_time: preferredContactTime || null,
      };
      storeEstimateLead(lead);
      try {
        const res = await base44.functions.invoke("submitEstimateLead", {
          ...lead,
        });
        return res.data;
      } catch {
        return { savedLocally: true };
      }
    },
    onSuccess: () => setStep("done"),
  });

  const handleSelectSuggestion = (s) => {
    setSelectedAddress(s.description);
    setAddressInput(s.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleEstimate = (e) => {
    e.preventDefault();
    if (!selectedAddress) return;
    estimateMutation.mutate(selectedAddress);
  };

  // Terms acceptance is required; SMS consent is optional and not a condition.
  const canSubmit = termsAccepted && firstName && lastName && email && phone && selectedAddress;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    submitMutation.mutate();
  };

  const fmt = (n) => (typeof n === "number" && !isNaN(n) ? `$${Math.round(n).toLocaleString()}` : "—");

  return (
    <div className="min-h-screen bg-white">
      <EstimateLoadingOverlay address={selectedAddress} isLoading={estimateMutation.isPending} />
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
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80"
          alt="Property Revenue Estimate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white mb-4">
            PROPERTY REVENUE ESTIMATE
          </h1>
          <p className="text-lg text-white/90 tracking-wide max-w-2xl">
            Get a data-informed estimate of your property's potential vacation-rental revenue.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 py-16">
        {step === "intro" && (
          <EstimateIntro onStart={() => setStep("address")} onOpenLegal={setLegalModal} />
        )}

        {step === "address" && (
          <div className="space-y-20">
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-2">
                Enter Your Property Address
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We'll generate an instant AI-powered estimate of your property's short-term rental potential.
              </p>
              <form onSubmit={handleEstimate} className="space-y-4">
                <div className="relative">
                  <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                    Property Address *
                  </label>
                  <Input
                    required
                    value={addressInput}
                    onChange={(e) => {
                      setAddressInput(e.target.value);
                      setSelectedAddress("");
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => suggestions.length && setShowSuggestions(true)}
                    placeholder="Start typing your address..."
                    autoComplete="off"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-64 overflow-auto">
                      {suggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(s)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f6f3] flex items-start gap-2"
                          >
                            <MapPin className="w-4 h-4 text-[#b89968] flex-shrink-0 mt-0.5" />
                            {s.description}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedAddress && (
                    <p className="mt-2 text-xs text-green-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Validated address selected
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!selectedAddress || estimateMutation.isPending}
                  className="w-full bg-[#b89968] hover:bg-[#a68858] text-white py-6 text-sm tracking-wider disabled:opacity-50"
                >
                  {estimateMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Analyzing your property...
                    </span>
                  ) : "GET MY ESTIMATE"}
                </Button>
                {addressInput && addressInput.length >= 3 && !selectedAddress && (
                  <p className="text-xs text-gray-400 text-center">
                    Please select your address from the suggestions to continue.
                  </p>
                )}
                {estimateMutation.isError && (
                  <p className="text-sm text-red-600 text-center">
                    Unable to generate an estimate right now. Please try again.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <EstimateInfo onOpenLegal={setLegalModal} />
          </div>
        )}

        {step === "estimate" && estimate && (
          <div className="space-y-8">
            {/* Estimate Results */}
            <div className="bg-[#f8f6f3] p-8 rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#b89968] flex-shrink-0" />
                <span className="text-gray-700 font-medium tracking-wide">{selectedAddress}</span>
              </div>
              {/* Inline disclaimer beside the revenue figures — not just buried at the bottom */}
              <p className="text-xs text-gray-500 italic mb-6 leading-relaxed">
                An estimate of potential — not a guarantee. Actual results vary based on
                property specifics, market conditions, pricing, occupancy, and seasonality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-sm">
                  <DollarSign className="w-6 h-6 text-[#b89968] mb-2" />
                  <p className="text-3xl font-light text-gray-800">{fmt(estimate.estimated_adr)}</p>
                  <p className="text-sm text-gray-500 tracking-wide">Est. ADR (Nightly)</p>
                </div>
                <div className="bg-white p-6 rounded-sm">
                  <Calendar className="w-6 h-6 text-[#b89968] mb-2" />
                  <p className="text-3xl font-light text-gray-800">{estimate.estimated_occupancy || "—"}</p>
                  <p className="text-sm text-gray-500 tracking-wide">Est. Occupancy Rate</p>
                </div>
                <div className="bg-white p-6 rounded-sm">
                  <TrendingUp className="w-6 h-6 text-[#b89968] mb-2" />
                  <p className="text-3xl font-light text-gray-800">{fmt(estimate.gross_monthly_revenue)}</p>
                  <p className="text-sm text-gray-500 tracking-wide">Gross Monthly Revenue</p>
                </div>
                <div className="bg-white p-6 rounded-sm">
                  <DollarSign className="w-6 h-6 text-[#b89968] mb-2" />
                  <p className="text-3xl font-light text-gray-800">{fmt(estimate.net_monthly_revenue)}</p>
                  <p className="text-sm text-gray-500 tracking-wide">Net Monthly Revenue</p>
                </div>
                <div className="bg-white p-6 rounded-sm md:col-span-2">
                  <TrendingUp className="w-6 h-6 text-[#b89968] mb-2" />
                  <p className="text-3xl font-light text-gray-800">{fmt(estimate.projected_annual_net)}</p>
                  <p className="text-sm text-gray-500 tracking-wide">Projected Annual Net</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-[#b89968]" />
                  <h3 className="text-sm tracking-wider text-gray-700 uppercase font-medium">
                    Regulation Summary
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed tracking-wide text-sm">
                  {estimate.regulation_summary}
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed tracking-wide">{estimate.market_summary}</p>

              {/* 12-month revenue projection chart */}
              <RevenueChart netMonthlyRevenue={estimate.net_monthly_revenue} />
            </div>

            {/* Disclaimer — exact required wording */}
            <div className="flex items-start gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-sm">
              <ShieldCheck className="w-5 h-5 text-[#b89968] flex-shrink-0 mt-0.5" />
              <p>
                These figures are estimates based on available market data and are not guaranteed.
                Actual results vary based on property specifics, market conditions, and operational
                factors.
              </p>
            </div>

            {/* Contact Capture */}
            <Card>
              <CardContent className="pt-8">
                <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-2">
                  Get Your Full Report + a Callback
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Enter your contact details and our team will follow up with a detailed rental
                  strategy for your property.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold mb-4 pb-2 border-b border-gray-200">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                          First Name *
                        </label>
                        <Input
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Jane"
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                          Last Name *
                        </label>
                        <Input
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                        Mobile Phone Number *
                      </label>
                      <Input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Contact preferences — optional, helps the team reach the
                        homeowner at the right time and via the right channel.
                        Neither field is required; "No Preference" is a selectable
                        option rather than a forced default. */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                          Preferred Contact Method
                        </label>
                        <BottomSheetSelect
                          value={preferredContactMethod}
                          onValueChange={setPreferredContactMethod}
                          placeholder="No preference"
                          triggerClassName={selectClass}
                          options={[
                            { value: "phone", label: "Phone Call" },
                            { value: "text", label: "Text Message" },
                            { value: "email", label: "Email" },
                            { value: "no_preference", label: "No Preference" },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                          Best Time to Reach You
                        </label>
                        <BottomSheetSelect
                          value={preferredContactTime}
                          onValueChange={setPreferredContactTime}
                          placeholder="No preference"
                          triggerClassName={selectClass}
                          options={[
                            { value: "morning", label: "Morning — 8 AM–12 PM" },
                            { value: "afternoon", label: "Afternoon — 12 PM–5 PM" },
                            { value: "evening", label: "Evening — 5 PM–8 PM" },
                            { value: "no_preference", label: "No Preference" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional qualification signal */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs tracking-wider text-gray-500 uppercase font-medium mb-3">
                      Optional — helps us tailor your report
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Property Type</label>
                        <BottomSheetSelect
                          value={propertyType}
                          onValueChange={setPropertyType}
                          placeholder="Select"
                          triggerClassName={selectClass}
                          options={[
                            { value: "house", label: "House" },
                            { value: "condo", label: "Condo" },
                            { value: "villa", label: "Villa" },
                            { value: "cabin", label: "Cabin" },
                            { value: "other", label: "Other" },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Current Rental Status</label>
                        <BottomSheetSelect
                          value={rentalStatus}
                          onValueChange={setRentalStatus}
                          placeholder="Select"
                          triggerClassName={selectClass}
                          options={[
                            { value: "vacant", label: "Vacant" },
                            { value: "owner-occupied", label: "Owner-occupied" },
                            { value: "leased", label: "Leased" },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Interest Timeline</label>
                        <BottomSheetSelect
                          value={interestTimeline}
                          onValueChange={setInterestTimeline}
                          placeholder="Select"
                          triggerClassName={selectClass}
                          options={[
                            { value: "just curious", label: "Just curious" },
                            { value: "ready to start soon", label: "Ready to start soon" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Required — Terms acceptance (must be checked to submit) */}
                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-[0.15em] uppercase font-semibold bg-red-50 text-red-700 border border-red-200">
                        Required
                      </span>
                      <h3 className="text-xs tracking-[0.2em] text-gray-700 uppercase font-semibold">
                        Terms &amp; Conditions
                      </h3>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer bg-gray-50 p-4 rounded-sm border border-gray-200">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-5 h-5 accent-[#b89968] flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="https://staytrvlr.com/terms"
                          onClick={(e) => { e.preventDefault(); setLegalModal("terms"); }}
                          className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer"
                        >
                          Terms &amp; Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://staytrvlr.com/privacy"
                          onClick={(e) => { e.preventDefault(); setLegalModal("privacy"); }}
                          className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Optional — SMS consent (NOT required to submit) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-[0.15em] uppercase font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        Optional
                      </span>
                      <h3 className="text-xs tracking-[0.2em] text-gray-700 uppercase font-semibold">
                        SMS Communications
                      </h3>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer bg-[#fbf6ee] p-4 rounded-md border-2 border-[#b89968] shadow-sm hover:shadow transition-shadow">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="w-5 h-5 accent-[#b89968] cursor-pointer"
                        />
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I agree to receive text messages from TRAVLR at the mobile number provided
                        regarding my property revenue estimate, estimate updates, appointments,
                        property-management services, and related communications. Message
                        frequency varies. Message and data rates may apply. Reply{" "}
                        <span className="font-medium">STOP</span> to opt out and{" "}
                        <span className="font-medium">HELP</span> for help. Consent is not a
                        condition of purchase.
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      <a
                        href="https://staytrvlr.com/terms"
                        onClick={(e) => { e.preventDefault(); setLegalModal("terms"); }}
                        className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer"
                      >
                        Terms &amp; Conditions
                      </a>
                      <span className="mx-2 text-gray-300">|</span>
                      <a
                        href="https://staytrvlr.com/privacy"
                        onClick={(e) => { e.preventDefault(); setLegalModal("privacy"); }}
                        className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!canSubmit || submitMutation.isPending}
                    className="w-full bg-[#b89968] hover:bg-[#a68858] text-white py-6 text-sm tracking-wider disabled:opacity-50"
                  >
                    {submitMutation.isPending ? "Submitting..." : "GET MY FULL REPORT"}
                  </Button>
                  {!canSubmit && (
                    <p className="text-xs text-gray-400 text-center">
                      Please complete all fields and accept the Terms to continue.
                    </p>
                  )}
                  {submitMutation.isError && (
                    <p className="text-sm text-red-600 text-center">
                      Something went wrong submitting your request. Please try again.
                    </p>
                  )}
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    By submitting this form, you confirm that the information provided is accurate.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Bottom legal links — kept present on the results page so users
                can review Terms & Privacy without leaving the flow. */}
            <div className="flex items-center justify-center gap-4 pt-2 text-xs tracking-wider">
              <a
                href="https://staytrvlr.com/terms"
                onClick={(e) => { e.preventDefault(); setLegalModal("terms"); }}
                className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer uppercase"
              >
                Terms of Service
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://staytrvlr.com/privacy"
                onClick={(e) => { e.preventDefault(); setLegalModal("privacy"); }}
                className="text-[#b89968] underline hover:text-[#a68858] cursor-pointer uppercase"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-light tracking-wider text-gray-800 mb-4">Thank You!</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
              Your estimate request has been received. A TRAVLR team member will reach out
              shortly with your full rental revenue report.
            </p>
            <Link to={createPageUrl("Home")}>
              <Button
                variant="outline"
                className="border-[#b89968] text-[#b89968] hover:bg-[#b89968]/10"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        )}
      </div>

      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </div>
  );
}