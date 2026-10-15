import React, { useEffect, useState } from "react";

export default function PropertyImage({ src, alt, className = "", onClick }) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} photo unavailable`}
        className={`${className} flex items-center justify-center bg-[#f8f6f3] text-center text-sm text-gray-500`}
      >
        Photos coming soon
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
