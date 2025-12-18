'use client';

import { useEffect } from 'react';

export function AdminHead() {
  useEffect(() => {
    // Only add meta tags if they don't exist, don't remove existing ones
    // This prevents conflicts with Next.js hydration

    // Add manifest if not exists
    if (!document.querySelector('link[rel="manifest"][href*="admin-manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/admin-manifest.json';
      manifestLink.setAttribute('data-admin', 'true');
      document.head.appendChild(manifestLink);
    }

    // Update apple-mobile-web-app-title meta tag
    let titleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
    if (titleMeta) {
      titleMeta.content = 'Portfolio Admin';
    } else {
      titleMeta = document.createElement('meta');
      titleMeta.name = 'apple-mobile-web-app-title';
      titleMeta.content = 'Portfolio Admin';
      titleMeta.setAttribute('data-admin', 'true');
      document.head.appendChild(titleMeta);
    }
  }, []);

  return null;
}
