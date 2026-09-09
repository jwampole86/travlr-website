import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

export default function AreaGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  const next = () => setActiveIndex((i) => (i + 1) % images.length);
  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <section className="max-w-[1400px] mx-auto px-6 mb-16">
      <div className="text-center mb-8">
        <h2 className="text-[28px] tracking-[0.2em] font-light text-gray-700 mb-2">
          EXPLORE {title.toUpperCase()}
        </h2>
        <p className="text-gray-500 text-sm tracking-wider">A closer look at the destination</p>
      </div>

      {/* Main gallery image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm group">
        <img
          src={images[activeIndex]}
          alt={`${title} ${activeIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500"
          onClick={() => setLightbox(true)}
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={() => setLightbox(true)}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full transition-all flex items-center gap-1.5"
              aria-label="Expand photo"
            >
              <Expand className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-xs tracking-wider">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mt-4 -mx-1 px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
              className={`flex-shrink-0 w-24 h-20 sm:w-28 sm:h-24 overflow-hidden rounded-sm border-2 transition-all ${
                idx === activeIndex ? "border-[#b89968] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <img
            src={images[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}