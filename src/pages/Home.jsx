import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import { createPageUrl } from "@/utils";

const logoUrl =
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f9945aff077ee02e61835e/98433c0c0_35C7376B-41E8-4994-AE14-22D49B92A14A-1-384x384-0.png";

const homes = [
  {
    name: "Perch",
    location: "Palm Desert, California",
    details: "5 beds · 5.5 baths · Sleeps 12",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    label: "Desert escape",
  },
  {
    name: "Santal Estate",
    location: "Indio, California",
    details: "7 beds · 6.5 baths · Sleeps 16",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
    label: "Festival season",
  },
  {
    name: "Villa Lago",
    location: "La Quinta, California",
    details: "5 beds · 5 baths · Sleeps 10",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    label: "Golf retreat",
  },
];

const destinations = [
  {
    name: "Palm Desert",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "La Quinta",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Palm Springs",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Indio",
    image:
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1000&q=85",
  },
];

const navItems = [
  { label: "Vacation homes", to: createPageUrl("SearchResults") },
  { label: "Destinations", to: "#destinations" },
  { label: "Guest services", to: createPageUrl("GuestServices") },
  { label: "About", to: createPageUrl("About") },
];

function Wordmark() {
  return (
    <Link to="/" className="group inline-flex items-center" aria-label="TRAVLR home">
      <img src={logoUrl} alt="TRAVLR Vacation Homes" className="h-14 w-14 object-contain" />
      <span className="ml-2 text-[1.45rem] font-semibold tracking-[0.22em] text-white transition-opacity group-hover:opacity-80 sm:text-2xl">
        TRAVLR
      </span>
    </Link>
  );
}

function ArrowLink({ children, to, light = false }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
        light ? "text-white hover:text-[#e3c790]" : "text-[#1f352e] hover:text-[#ad8152]"
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2 guests");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (arrival) params.set("arrival", arrival);
    if (departure) params.set("departure", departure);
    navigate(`${createPageUrl("SearchResults")}${params.size ? `?${params}` : ""}`);
  };

  const subscribe = (event) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] font-sans text-[#1d2d29]">
      <section className="relative isolate min-h-[720px] overflow-hidden bg-[#1d302a] lg:min-h-[800px]">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=90"
          alt="Sunlit luxury home with a desert pool"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#13221ddd]/30 via-[#13221d66] to-[#13221ddd]" />

        <header className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-7">
          <Wordmark />
          <nav className="hidden items-center gap-8 xl:gap-10 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) =>
              item.to.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-[#e3c790]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-[#e3c790]"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:+19495398862"
              className="flex items-center gap-2 text-xs font-medium text-white transition-colors hover:text-[#e3c790]"
            >
              <Phone className="h-4 w-4" />
              (949) 539-8862
            </a>
            <Link
              to={createPageUrl("Contact")}
              className="rounded-full border border-white/70 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#e3c790] hover:bg-[#e3c790] hover:text-[#1d302a]"
            >
              Plan a stay
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/50 text-white transition hover:bg-white hover:text-[#1d302a] lg:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {menuOpen && (
          <div className="absolute inset-x-0 top-[86px] z-20 mx-4 rounded-2xl border border-white/15 bg-[#173028]/95 p-6 shadow-2xl backdrop-blur lg:hidden">
            <nav className="flex flex-col" aria-label="Mobile navigation">
              {navItems.map((item) =>
                item.to.startsWith("#") ? (
                  <a
                    key={item.label}
                    href={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-white/10 py-4 text-sm font-medium text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-white/10 py-4 text-sm font-medium text-white"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                to={createPageUrl("Contact")}
                onClick={() => setMenuOpen(false)}
                className="mt-5 rounded-full bg-[#e3c790] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#173028]"
              >
                Plan a stay
              </Link>
            </nav>
          </div>
        )}

        <div className="mx-auto flex max-w-[1440px] flex-col px-5 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28 lg:px-12 lg:pb-20 lg:pt-36">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f0d8a8]">
              <span className="h-px w-10 bg-[#f0d8a8]" />
              Your extraordinary escape awaits
            </div>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[0.94] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-[5.7rem]">
              Discover stays that become stories.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Distinctive vacation homes, thoughtful hospitality, and every detail arranged around the way you want to travel.
            </p>
          </div>

          <form
            onSubmit={submitSearch}
            className="mt-12 grid max-w-6xl gap-2 rounded-2xl border border-white/25 bg-white/95 p-2 shadow-2xl backdrop-blur-sm md:grid-cols-[1fr_1fr_1fr_auto] md:gap-0 md:rounded-full md:p-2"
          >
            <label className="group flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f4f0e8] md:border-r md:border-[#d9d7cf] md:rounded-full">
              <CalendarDays className="h-5 w-5 shrink-0 text-[#ad8152]" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#68736e]">Check in</span>
                <input
                  type="date"
                  value={arrival}
                  onChange={(event) => setArrival(event.target.value)}
                  className="mt-1 w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-[#1d2d29] outline-none"
                  aria-label="Check-in date"
                />
              </span>
            </label>
            <label className="group flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f4f0e8] md:border-r md:border-[#d9d7cf] md:rounded-full">
              <CalendarDays className="h-5 w-5 shrink-0 text-[#ad8152]" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#68736e]">Check out</span>
                <input
                  type="date"
                  value={departure}
                  min={arrival || undefined}
                  onChange={(event) => setDeparture(event.target.value)}
                  className="mt-1 w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-[#1d2d29] outline-none"
                  aria-label="Check-out date"
                />
              </span>
            </label>
            <label className="group flex min-w-0 items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f4f0e8] md:rounded-full">
              <UsersRound className="h-5 w-5 shrink-0 text-[#ad8152]" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#68736e]">Travelers</span>
                <select
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-[#1d2d29] outline-none"
                  aria-label="Travelers"
                >
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5–8 guests</option>
                  <option>9+ guests</option>
                </select>
              </span>
              <ChevronDown className="h-4 w-4 text-[#68736e]" />
            </label>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1d352d] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#ad8152] md:rounded-full"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>

        <div className="absolute bottom-8 right-5 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/75 sm:flex lg:right-12">
          <span className="h-px w-12 bg-white/60" />
          Palm Desert, California
        </div>
      </section>

      <section className="border-b border-[#dedbd1] bg-[#f0ede4] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center sm:justify-between">
          <p className="text-xs font-medium leading-5 text-[#4d5e58]">
            Independently curated. Locally rooted. Personally hosted.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4d5e58]">
            <div className="flex text-[#ad8152]">
              {[...Array(5)].map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}
            </div>
            <span>Trusted by thousands of guests</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#4d5e58]">
            <ShieldCheck className="h-4 w-4 text-[#ad8152]" />
            <span>Verified homes, exceptional stays</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#ad8152]">The TRAVLR collection</p>
            <h2 className="mt-4 font-serif text-4xl leading-none tracking-[-0.025em] text-[#193229] sm:text-5xl">
              Remarkable places to gather, recharge, and reconnect.
            </h2>
          </div>
          <ArrowLink to={createPageUrl("SearchResults")}>Explore all homes</ArrowLink>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
          {homes.map((home) => (
            <article key={home.name} className="group">
              <Link to={createPageUrl("SearchResults")} className="block overflow-hidden rounded-[1.4rem] bg-[#e8e4da]">
                <div className="relative aspect-[4/4.8] overflow-hidden">
                  <img
                    src={home.image}
                    alt={home.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-[#284239]">
                    {home.label}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => event.preventDefault()}
                    aria-label={`Save ${home.name}`}
                    className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#284239] transition hover:bg-[#ad8152] hover:text-white"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                    <div>
                      <p className="font-serif text-3xl">{home.name}</p>
                      <p className="mt-1 text-xs text-white/85">{home.location}</p>
                    </div>
                    <ArrowRight className="mb-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2 px-1 pt-4 text-xs text-[#66716b]">
                <BedDouble className="h-4 w-4 text-[#ad8152]" />
                {home.details}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1d352d] px-5 py-20 text-white sm:px-8 md:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#e3c790]">More than a reservation</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.03] sm:text-5xl">
              Your stay, beautifully considered.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70">
              A TRAVLR stay is designed around you. Before you arrive, your dedicated local concierge is already setting the scene.
            </p>
            <div className="mt-9">
              <ArrowLink to={createPageUrl("GuestServices")} light>Discover guest services</ArrowLink>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/15 sm:grid-cols-2">
            {[
              ["A considered arrival", "Your home is prepared for the way you travel—from preferred pantry staples to poolside refreshments.", Sparkles],
              ["Local, on call", "From a hard-to-book table to an unforgettable desert trail, your concierge knows where to begin.", MapPin],
              ["Space for your people", "Homes chosen for memorable gatherings, with room for everyone to settle in.", UsersRound],
              ["Every detail handled", "Private chefs, in-home wellness, transportation, and more—thoughtfully arranged.", Check],
            ].map(([title, description, Icon]) => (
              <div key={title} className="bg-[#1d352d] p-7 sm:p-8">
                <Icon className="h-5 w-5 text-[#e3c790]" />
                <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="scroll-mt-8 bg-[#f8f6f1] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#ad8152]">Find your horizon</p>
              <h2 className="mt-4 font-serif text-4xl tracking-[-0.025em] text-[#193229] sm:text-5xl">Our desert destinations</h2>
            </div>
            <Link to={createPageUrl("Activities")} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1d352d] hover:text-[#ad8152]">
              See & do <Globe2 className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {destinations.map((destination) => (
              <Link
                key={destination.name}
                to={`/areas/${encodeURIComponent(destination.name)}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13231ccc] via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white sm:inset-x-5 sm:bottom-5">
                  <span className="font-serif text-xl sm:text-2xl">{destination.name}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28 lg:px-12">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden rounded-[2rem] bg-[#d9c8ae] lg:grid-cols-2">
          <div className="relative min-h-[330px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=85"
              alt="Bright, inviting living room"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#6d5138]">For homeowners</p>
            <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.03] text-[#193229] sm:text-5xl">
              Your remarkable home belongs in remarkable company.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#44554e]">
              Earn more and worry less with a trusted team that treats your home—and your guests—with exacting care.
            </p>
            <div className="mt-9">
              <ArrowLink to={createPageUrl("Homeowners")}>Partner with TRAVLR</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#dcd7cc] bg-[#f0ede4] px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-3xl text-[#193229]">A little getaway inspiration.</p>
            <p className="mt-2 text-sm text-[#68736e]">Thoughtful stories and local favorites, delivered occasionally.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 rounded-full bg-[#dce8df] px-6 py-4 text-sm text-[#284239]">
              <Check className="h-4 w-4" /> You&apos;re on the list.
            </div>
          ) : (
            <form onSubmit={subscribe} className="flex w-full max-w-md rounded-full border border-[#b8bbb0] bg-white p-1.5">
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#193229] outline-none placeholder:text-[#859087]"
              />
              <button type="submit" className="rounded-full bg-[#1d352d] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#ad8152]">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-[#14271f] px-5 pb-24 pt-14 text-white sm:px-8 lg:px-12 lg:pb-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center">
                <img src={logoUrl} alt="" className="h-12 w-12 object-contain" />
                <span className="ml-2 text-xl font-semibold tracking-[0.22em]">TRAVLR</span>
              </div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
                Curated vacation homes and tailor-made escapes in the places you want to be.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="https://www.instagram.com" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#e3c790] hover:text-[#e3c790]">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="mailto:info@staytrvlr.com" aria-label="Email TRAVLR" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-[#e3c790] hover:text-[#e3c790]">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3c790]">Stay</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
                <Link to={createPageUrl("SearchResults")} className="hover:text-white">Vacation homes</Link>
                <Link to={createPageUrl("GuestServices")} className="hover:text-white">Guest services</Link>
                <Link to={createPageUrl("Activities")} className="hover:text-white">Things to do</Link>
                <Link to={createPageUrl("GuestResources")} className="hover:text-white">Guest resources</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3c790]">TRAVLR</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
                <Link to={createPageUrl("About")} className="hover:text-white">About us</Link>
                <Link to={createPageUrl("Homeowners")} className="hover:text-white">For homeowners</Link>
                <Link to="/careers" className="hover:text-white">Careers</Link>
                <Link to={createPageUrl("Contact")} className="hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e3c790]">Get in touch</p>
              <div className="mt-5 space-y-4 text-sm text-white/65">
                <a href="tel:+19495398862" className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-[#e3c790]" />(949) 539-8862</a>
                <a href="mailto:info@staytrvlr.com" className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-[#e3c790]" />info@staytrvlr.com</a>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.13em] text-white/40 sm:flex-row">
            <p>© {new Date().getFullYear()} TRAVLR Vacation Homes</p>
            <div className="flex gap-5">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
