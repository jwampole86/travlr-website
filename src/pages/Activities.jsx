import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mountain, Utensils, Compass, MapPin, Music, Snowflake, Waves, Sparkles } from "lucide-react";

export default function Activities() {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Desert Hiking & Jeep Tours",
      icon: Mountain,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/ea201cf30_generated_image.png",
      destinations: ["Palm Springs", "Palm Desert", "Joshua Tree"],
      description:
        "Explore the otherworldly landscapes of the Coachella Valley and high desert. From easy nature walks to rugged backcountry trails, the region rewards every level of adventurer with sweeping mountain views and golden-light sunrises.",
      highlights: [
        "Indian Canyons palm-oasis trails",
        "Joshua Tree National Park rock formations",
        "Guided open-air jeep tours of the San Andreas Fault",
        "Sunrise hikes on the Art Smith Trail"
      ]
    },
    {
      title: "World-Class Golf",
      icon: Compass,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/623268b90_generated_image.png",
      destinations: ["La Quinta", "Palm Desert", "Indian Wells"],
      description:
        "Tee off on some of the most celebrated courses in the country, set against dramatic mountain backdrops. The Coachella Valley is a year-round golf destination with over 100 courses, from championship tournament layouts to relaxed resort play.",
      highlights: [
        "PGA West Stadium & Jack Nicklaus courses",
        "Desert Willow Golf Resort",
        "Indian Wells Golf Resort",
        "Troon North public-access play"
      ]
    },
    {
      title: "Music Festivals",
      icon: Music,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/1887ab954_generated_image.png",
      destinations: ["Indio", "Palm Springs"],
      description:
        "The desert is the world's festival capital. Walk from your vacation home to the gates of Coachella and Stagecoach, or catch intimate shows under the stars. Our homes put you close to the action with space to relax and recover in between.",
      highlights: [
        "Coachella Valley Music & Arts Festival",
        "Stagecoach Country Music Festival",
        "Desert Daze & Splash House",
        "Intimate live venues in downtown Palm Springs"
      ]
    },
    {
      title: "Skiing & Snow Sports",
      icon: Snowflake,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/1f8cc3b87_generated_image.png",
      destinations: ["Aspen", "Vail", "Breckenridge"],
      description:
        "Carve fresh powder across Colorado's legendary resorts. From Aspen's four mountains to Vail's expansive back bowls and Breckenridge's family-friendly terrain, our mountain homes put you minutes from the lifts with ski-in access and après-ski comfort.",
      highlights: [
        "Aspen Snowmass — four mountains, one pass",
        "Vail's legendary Back Bowls",
        "Breckenridge peak-to-peak terrain",
        "Ski-in / ski-out home access"
      ]
    },
    {
      title: "Coastal & Waterfront",
      icon: Waves,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/1e9dfbb42_generated_image.png",
      destinations: ["Miami", "Seattle"],
      description:
        "Soak up the sun on South Beach or kayak the calm waters of Puget Sound. Our coastal homes pair beachfront and waterfront living with easy access to boating, paddleboarding, sailing, and waterfront dining.",
      highlights: [
        "South Beach & Biscayne Bay",
        "Private yacht & boat charters",
        "Lake Union & Puget Sound kayaking",
        "Waterfront dining at sunset"
      ]
    },
    {
      title: "Fine Dining & Nightlife",
      icon: Utensils,
      image: "https://media.base44.com/images/public/68f9945aff077ee02e61835e/7e0d0adea_generated_image.png",
      destinations: ["Las Vegas", "Miami", "Seattle", "Palm Springs"],
      description:
        "From Michelin-starred tasting menus to hidden neighborhood gems, every TRAVLR destination offers a standout culinary scene. End the night at a rooftop lounge, a speakeasy, or a show — then retreat to the quiet of your private home.",
      highlights: [
        "Celebrity-chef restaurants on the Strip",
        "Rooftop bars & speakeasies",
        "Private in-home chef experiences",
        "Seasonal farm-to-table menus"
      ]
    }
  ];

  const guideLinks = [
    ["Journeys to Palm Springs", "https://www.staytravlr.com/see-and-do/journeys-to-palm-springs/"],
    ["Palm Desert Travel Information", "https://www.staytravlr.com/see-and-do/palm-desert-travel-information/"],
    ["Dine", "https://www.staytravlr.com/see-and-do/dine/"],
    ["Hike", "https://www.staytravlr.com/see-and-do/hiking-palm-desert/"],
    ["Palm Desert Shops", "https://www.staytravlr.com/see-and-do/palm-desert-shops/"],
    ["Tennis", "https://www.staytravlr.com/see-and-do/tennis/"],
    ["Golf", "https://www.staytravlr.com/see-and-do/golf/"],
    ["Music Festivals", "https://www.staytravlr.com/see-and-do/music-festivals/"],
    ["Sporting Events", "https://www.staytravlr.com/see-and-do/sporting-events/"],
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
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

      {/* Hero */}
      <div className="relative h-[400px] md:h-[480px] w-full overflow-hidden">
        <img
          src="https://media.base44.com/images/public/68f9945aff077ee02e61835e/fd69dc9fc_generated_image.png"
          alt="See & Do"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] md:tracking-[0.2em] text-white mb-4">
            SEE & DO
          </h1>
          <p className="text-sm md:text-base text-white/85 tracking-wide max-w-2xl leading-relaxed">
            Curated experiences across every TRAVLR destination — from desert trails to mountain peaks to coastal waters
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-[1100px] mx-auto px-6 pt-12 md:pt-20 pb-4 text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-wider text-gray-800 mb-5">
          Experiences Worth Traveling For
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed tracking-wide">
          Each TRAVLR destination offers something unforgettable. Whether you're chasing powder in the Rockies,
          dancing in the desert, or drifting along a coastline, our concierge team can build the perfect itinerary —
          with gear, guides, reservations, and private experiences arranged before you arrive.
        </p>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-6"><div className="flex flex-wrap justify-center gap-2 border-y border-gray-200 py-5">{guideLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="border border-gray-200 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-600 transition-colors hover:border-[#b89968] hover:text-[#b89968]">{label}</a>)}</div></div>

      {/* Activities Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="group">
                <div className="relative overflow-hidden aspect-[16/10] rounded-sm mb-5">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                  <div className="absolute top-5 left-5">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-[#b89968]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h3 className="text-xl md:text-2xl font-light tracking-wider text-gray-800">
                    {activity.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.destinations.map((dest) => (
                    <span
                      key={dest}
                      className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-[#b89968] bg-[#b89968]/10 px-2.5 py-1 rounded-sm"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {dest}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed tracking-wide mb-5">
                  {activity.description}
                </p>

                <ul className="space-y-2">
                  {activity.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-gray-700">
                      <Sparkles className="w-4 h-4 text-[#b89968] flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concierge CTA */}
      <div className="bg-[#f8f6f3] py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-gray-800 mb-4">
            Let Us Plan Your Experience
          </h2>
          <p className="text-gray-600 leading-relaxed tracking-wide mb-8 max-w-2xl mx-auto">
            From tee times and lift tickets to private chefs and guided tours, our concierge team handles every detail.
            Tell us what you have in mind and we'll build it into your stay.
          </p>
          <Button
            onClick={() => navigate(createPageUrl("Contact"))}
            className="bg-[#b89968] hover:bg-[#a68858] text-white px-8 py-3 text-[11px] tracking-[0.15em] font-medium rounded-sm"
          >
            CONTACT CONCIERGE
          </Button>
        </div>
      </div>
    </div>
  );
}