import React from 'react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';

export default function FeatureCard({ 
  title, 
  description, 
  image, 
  imageAlt = "Feature illustration",
  className = "",
  usePhilosopherFont = false
}) {
  return (
    <div className={cn("bg-white rounded-2xl p-3 transition-all duration-300 border border-gray-100", usePhilosopherFont && "font-[family-name:var(--font-philosopher)]", className)}>
      {/* Illustration */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xs h-48 flex items-center justify-center rounded-2xl overflow-hidden">
          <NextImage
            src={image}
            alt={imageAlt}
            width={300}
            height={200}
            className="object-contain w-full h-full bg-gray-50 p-5"
            priority={false}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className={cn("text-xl font-bold text-gray-900 mb-4 text-center", usePhilosopherFont && "font-[family-name:var(--font-philosopher)]")}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn("text-gray-600 leading-relaxed text-center", usePhilosopherFont && "font-[family-name:var(--font-philosopher)]")}>
        {description}
      </p>
    </div>
  );
}
