import { useState } from "react";

export default function SkeletonImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative bg-gray-100 overflow-hidden ${className}`}>
    
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-20"
        }`}
      />
    </div>
  );
}
