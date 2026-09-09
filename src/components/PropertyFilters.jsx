import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal, X } from "lucide-react";
import BottomSheetSelect from "@/components/BottomSheetSelect";

const ALL_LOCATIONS = [
  "Bermuda Dunes",
  "Coachella",
  "Indio",
  "La Quinta",
  "Palm Desert",
  "Palm Springs",
  "Aspen",
  "Breckenridge",
  "Vail",
  "Las Vegas",
  "Seattle",
  "Bellevue",
  "Miami",
];

export default function PropertyFilters({ filters, onFilterChange, onSearch, locations = [] }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const locationOptions = [...ALL_LOCATIONS, ...locations.filter(l => !ALL_LOCATIONS.includes(l))];

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onFilterChange({ ...filters, amenities: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      location: "all",
      bedrooms: "all",
      maxPrice: "",
      propertyType: "all",
      petFriendly: false,
      wheelchairAccessible: false,
      amenities: []
    });
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        {/* Basic Filters */}
        <div className="grid md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
              Location
            </label>
            <BottomSheetSelect
              value={filters.location}
              onValueChange={(value) => onFilterChange({ ...filters, location: value })}
              placeholder="All Locations"
              options={[{ value: "all", label: "All Locations" }, ...locationOptions.map((loc) => ({ value: loc, label: loc }))]}
            />
          </div>

          <div>
            <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
              Bedrooms
            </label>
            <BottomSheetSelect
              value={filters.bedrooms}
              onValueChange={(value) => onFilterChange({ ...filters, bedrooms: value })}
              placeholder="Any"
              options={[
                { value: "all", label: "Any" },
                { value: "3", label: "3+" },
                { value: "4", label: "4+" },
                { value: "5", label: "5+" },
                { value: "6", label: "6+" },
                { value: "7", label: "7+" },
                { value: "8", label: "8+" },
                { value: "9", label: "9+" },
                { value: "10", label: "10+" },
              ]}
            />
          </div>

          <div>
            <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
              Max Price/Night
            </label>
            <Input
              type="number"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={onSearch}
              className="w-full bg-[#b89968] hover:bg-[#a68858] text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[#b89968] hover:text-[#a68858]"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 mt-4 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Property Type */}
              <div>
                <label className="text-xs tracking-wider text-gray-600 mb-2 block uppercase font-medium">
                  Property Type
                </label>
                <BottomSheetSelect
                  value={filters.propertyType || "all"}
                  onValueChange={(value) => onFilterChange({ ...filters, propertyType: value })}
                  placeholder="All Types"
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "house", label: "House" },
                    { value: "villa", label: "Villa" },
                    { value: "estate", label: "Estate" },
                    { value: "condo", label: "Condo" },
                    { value: "cabin", label: "Cabin" },
                    { value: "penthouse", label: "Penthouse" },
                    { value: "chalet", label: "Chalet" },
                  ]}
                />
              </div>

              {/* Accessibility & Pet Options */}
              <div className="space-y-3">
                <label className="text-xs tracking-wider text-gray-600 block uppercase font-medium">
                  Additional Options
                </label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petFriendly"
                    checked={filters.petFriendly || false}
                    onCheckedChange={(checked) => onFilterChange({ ...filters, petFriendly: checked })}
                  />
                  <label htmlFor="petFriendly" className="text-sm text-gray-700 cursor-pointer">
                    Pet-Friendly
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wheelchairAccessible"
                    checked={filters.wheelchairAccessible || false}
                    onCheckedChange={(checked) => onFilterChange({ ...filters, wheelchairAccessible: checked })}
                  />
                  <label htmlFor="wheelchairAccessible" className="text-sm text-gray-700 cursor-pointer">
                    Wheelchair Accessible
                  </label>
                </div>
              </div>
            </div>

            {/* Property Highlights & Amenities — migrated from staytravlr.com taxonomy */}
            {[
              { title: "Property Highlights", items: ["Detached Casita", "Gated Property", "Gated Community", "Walking Distance to Music Festivals", "Pool with a View", "Estate Property", "New Construction", "Newly Remodeled", "Access to Hiking Trails", "EV Charger", "Golf Course Views"] },
              { title: "Outdoor Amenities", items: ["Bocce Ball", "Putting Green", "Hammock Garden", "Pickleball Court", "Basketball Court", "Outdoor Firepit", "Outdoor Kitchen", "Al Fresco Dining", "Two Pools", "Large Open Lawn", "Outdoor Sound System", "Sand Volleyball Court", "Ping Pong", "Outdoor Shower", "Offsite Tennis Court Access"] },
              { title: "Interior Amenities", items: ["Remote Workspace", "Movie Theater", "Open Concept Great Room", "Hi-Speed WiFi", "Smart Home Technology", "Pool Table", "Game Room", "Peloton Bike", "Gym"] },
              { title: "Comfort & Convenience", items: ["Hot Tub", "Corn Hole", "Covered Parking Available"] }
            ].map((group) => (
              <div key={group.title} className="border-t pt-4">
                <label className="text-xs tracking-wider text-[#b89968] mb-3 block uppercase font-medium">
                  {group.title}
                </label>
                <div className="grid md:grid-cols-4 gap-3">
                  {group.items.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={(filters.amenities || []).includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}