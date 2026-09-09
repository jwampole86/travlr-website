import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Check, ChevronDown } from "lucide-react";

// Renders a native-style bottom sheet picker on mobile/tablet (<= 1023px) and
// a standard desktop Select otherwise. Drop-in replacement for shadcn Select
// when the option set is a flat list of { value, label } pairs.
export default function BottomSheetSelect({
  value,
  onValueChange,
  placeholder,
  options,
  triggerClassName = "",
  id,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={triggerClassName} id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const baseTrigger =
    triggerClassName ||
    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          id={id}
          className={`${baseTrigger} focus:outline-none focus:ring-1 focus:ring-ring`}
        >
          <span className={value ? "text-foreground truncate" : "text-muted-foreground"}>
            {selectedLabel}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[75vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-xs tracking-[0.2em] uppercase text-gray-500 font-medium">
            {placeholder}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-2 pb-6">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onValueChange(o.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-md transition-colors ${
                o.value === value
                  ? "text-[#b89968] bg-[#f8f6f3] font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {o.label}
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}