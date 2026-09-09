import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullRefreshIndicator from "@/components/PullRefreshIndicator";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import PropertyFilters from "../components/PropertyFilters";
import PropertyCard from "../components/PropertyCard";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, differenceInCalendarDays, parse } from "date-fns";
import referenceProperties from "@/data/referenceProperties";

const toISO = (d) => (d ? format(d, "yyyy-MM-dd") : null);
const fromISO = (s) => (s ? parse(s, "yyyy-MM-dd", new Date()) : null);

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { pullDistance, refreshing } = usePullToRefresh(() =>
    queryClient.invalidateQueries(["properties"])
  );
  const initialBedrooms = searchParams.get("bedrooms");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "all",
    bedrooms: (initialBedrooms && initialBedrooms !== "any") ? initialBedrooms : "all",
    maxPrice: "",
    propertyType: "all",
    petFriendly: false,
    wheelchairAccessible: false,
    amenities: []
  });
  const [arrival, setArrival] = useState(fromISO(searchParams.get("arrival")));
  const [departure, setDeparture] = useState(fromISO(searchParams.get("departure")));

  const nights = (arrival && departure)
    ? Math.max(0, differenceInCalendarDays(departure, arrival))
    : 0;

  const setDates = (a, d) => {
    setArrival(a);
    setDeparture(d);
    const next = new URLSearchParams(searchParams);
    if (a) next.set("arrival", toISO(a)); else next.delete("arrival");
    if (d) next.set("departure", toISO(d)); else next.delete("departure");
    setSearchParams(next, { replace: true });
  };

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const properties = await base44.entities.Property.list();
        return properties.length ? properties : referenceProperties;
      } catch {
        return referenceProperties;
      }
    },
  });

  // Filter client-side so changing location / price / amenities updates the
  // grid instantly without a network refetch or page reload.
  const properties = useMemo(() => {
    let list = allProperties;
    if (filters.location !== "all") {
      list = list.filter(p => p.location === filters.location);
    }
    if (filters.bedrooms !== "all") {
      list = list.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }
    if (filters.maxPrice) {
      list = list.filter(p => p.price_per_night != null && p.price_per_night <= parseInt(filters.maxPrice));
    }
    if (filters.propertyType !== "all") {
      list = list.filter(p => p.property_type === filters.propertyType);
    }
    if (filters.petFriendly) {
      list = list.filter(p => p.pet_friendly === true);
    }
    if (filters.wheelchairAccessible) {
      list = list.filter(p => p.wheelchair_accessible === true);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      list = list.filter(p =>
        filters.amenities.every(amenity => p.amenities?.includes(amenity))
      );
    }
    return list;
  }, [allProperties, filters]);

  const locations = useMemo(
    () => [...new Set(allProperties.map(p => p.location))].sort(),
    [allProperties]
  );

  const handleSearch = () => {
    // Triggers refetch via query key change
  };

  return (
    <div className="min-h-screen bg-white">
      <PullRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <div className="max-w-[1400px] mx-auto px-6">
          <Link to={createPageUrl("Home")} className="inline-flex items-center text-sm text-gray-600 hover:text-[#b89968] transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-[0.2em] text-gray-700 mb-4">
            VACATION HOMES
          </h1>
          <p className="text-gray-500 text-sm tracking-wider">
            Discover our hand-picked selection of luxury vacation rentals
          </p>
        </div>

        {/* Date selector for pricing estimates */}
        <div className="flex flex-wrap items-center gap-3 mb-8 bg-[#f8f6f3] border border-gray-200 rounded-sm p-4">
          <span className="text-[10px] tracking-[0.2em] text-gray-500 uppercase font-medium mr-2">
            Estimate Pricing
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                {arrival ? format(arrival, "MM/dd/yyyy") : <span className="text-gray-400">Arrival</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={arrival} onSelect={(d) => setDates(d, departure)} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                {departure ? format(departure, "MM/dd/yyyy") : <span className="text-gray-400">Departure</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={departure} onSelect={(d) => setDates(arrival, d)} initialFocus />
            </PopoverContent>
          </Popover>
          {nights > 0 && (
            <span className="text-xs tracking-wider text-gray-600">
              {nights} night{nights !== 1 ? "s" : ""} — estimated totals shown on priced homes
            </span>
          )}
          {(arrival || departure) && (
            <Button variant="ghost" className="ml-auto text-xs h-8" onClick={() => setDates(null, null)}>
              Clear dates
            </Button>
          )}
        </div>

        <PropertyFilters
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
          locations={locations}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} arrival={arrival} departure={departure} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}