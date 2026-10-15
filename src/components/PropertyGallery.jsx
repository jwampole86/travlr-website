import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";
import PropertyImage from "@/components/PropertyImage";
import { getPropertyImages } from "@/lib/propertyImages";

export default function PropertyGallery({ property, compact = false }) {
  const images = getPropertyImages(property);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const activeIndex = index % (images.length || 1);
  const move = (direction) =>
    setIndex((current) => (current + direction + images.length) % images.length);
  const openPhoto = (photoIndex) => {
    setIndex(photoIndex);
    setShowGrid(false);
    setOpen(true);
  };
  const stopLink = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const controls = images.length > 1 && (
    <>
      <button
        type="button"
        aria-label={`Previous photo of ${property.name}`}
        onClick={(event) => { stopLink(event); move(-1); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={`Next photo of ${property.name}`}
        onClick={(event) => { stopLink(event); move(1); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <span aria-live="polite" className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
        {activeIndex + 1} / {images.length}
      </span>
    </>
  );

  if (compact) {
    return (
      <div className="relative h-full w-full">
        <PropertyImage key={images[activeIndex]} src={images[activeIndex]} alt={`${property.name} photo ${activeIndex + 1}`} className="h-full w-full object-cover" />
        {controls}
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
        <button type="button" className="h-full w-full" aria-label={`Enlarge photo of ${property.name}`} onClick={() => openPhoto(activeIndex)}>
          <PropertyImage key={images[activeIndex]} src={images[activeIndex]} alt={`${property.name} photo ${activeIndex + 1}`} className="h-full w-full object-cover" loading="eager" />
        </button>
        {controls}
        {images.length > 0 && (
          <button type="button" onClick={() => { setShowGrid(true); setOpen(true); }} className="absolute bottom-3 right-3 flex items-center gap-2 rounded-sm bg-white px-3 py-2 text-sm text-gray-800 shadow">
            <Grid2X2 className="h-4 w-4" /> View all {images.length} photos
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, photoIndex) => (
            <button key={src} type="button" aria-label={`View photo ${photoIndex + 1} of ${property.name}`} aria-pressed={activeIndex === photoIndex} onClick={() => setIndex(photoIndex)} className={`h-20 w-24 shrink-0 overflow-hidden rounded-sm border-2 ${activeIndex === photoIndex ? "border-[#b89968]" : "border-transparent"}`}>
              <PropertyImage src={src} alt={`${property.name} thumbnail ${photoIndex + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/90" />
          <Dialog.Content
            className="fixed inset-3 z-[101] flex flex-col rounded-sm bg-white p-4 outline-none sm:inset-8"
            aria-describedby={undefined}
            onKeyDown={(event) => {
              if (showGrid || images.length < 2) return;
              if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            }}
          >
            <div className="mb-4 flex items-center justify-between gap-3 pr-10">
              <Dialog.Title className="text-lg font-medium text-gray-800">{property.name} photos</Dialog.Title>
              {!showGrid && <button type="button" onClick={() => setShowGrid(true)} className="text-sm underline">All photos</button>}
            </div>
            <Dialog.Close aria-label="Close photo gallery" className="absolute right-4 top-4 rounded-full p-2 text-gray-800 hover:bg-gray-100"><X className="h-5 w-5" /></Dialog.Close>
            {showGrid ? (
              <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-2 content-start gap-3 overflow-y-auto md:grid-cols-3">
                {images.map((src, photoIndex) => (
                  <button key={src} type="button" aria-label={`Enlarge photo ${photoIndex + 1} of ${property.name}`} onClick={() => openPhoto(photoIndex)} className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                    <PropertyImage src={src} alt={`${property.name} photo ${photoIndex + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                <PropertyImage key={images[activeIndex]} src={images[activeIndex]} alt={`${property.name} photo ${activeIndex + 1}`} className="h-full w-full object-contain" loading="eager" />
                {controls}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
