'use client';

import { Event } from '@/app/types/events';

interface SocialShareProps {
  event: Event;
  url: string;
}

export default function SocialShare({ event, url }: SocialShareProps) {
  const shareText = `Join me at ${event.title}!`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="flex space-x-4">
      {Object.entries(shareLinks).map(([platform, link]) => (
        <button
          key={platform}
          onClick={() => window.open(link, '_blank', 'width=600,height=400')}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          Share on {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </button>
      ))}
    </div>
  );
}