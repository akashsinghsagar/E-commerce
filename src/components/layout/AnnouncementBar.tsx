'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const announcements = [
  'Free Shipping on orders above ₹999',
  'New Collection: The Festive Edit — Now Live',
  'Handcrafted with love by Indian artisans',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-espresso text-white relative" id="announcement-bar">
      <div className="container-narrow flex items-center justify-center py-2.5">
        <p
          className="text-xs tracking-widest uppercase text-center font-sans animate-fade-in"
          key={currentIndex}
        >
          {announcements[currentIndex]}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
