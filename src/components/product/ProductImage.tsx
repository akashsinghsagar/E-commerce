'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ProductImageProps extends Omit<ImageProps, 'onError'> {
  fallbackText?: string;
}

/**
 * Image component with graceful fallback for missing product images.
 * Displays a styled placeholder if the image fails to load.
 */
export default function ProductImage({ fallbackText, alt, ...props }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-beige-200 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-taupe/30 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-xs text-muted font-medium">
            {fallbackText || alt || 'Image'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
