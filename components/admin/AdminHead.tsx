'use client';

import { useEffect } from 'react';

export function AdminHead() {
  useEffect(() => {
    // Remove existing apple-touch-icon links to avoid conflicts
    const existingAppleIcons = document.querySelectorAll('link[rel="apple-touch-icon"]');
    existingAppleIcons.forEach((icon) => icon.remove());

    // Remove existing manifest links to avoid conflicts
    const existingManifests = document.querySelectorAll('link[rel="manifest"]');
    existingManifests.forEach((manifest) => manifest.remove());

    // Create and append admin-specific manifest with cache busting
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = `/admin-manifest.json?v=${Date.now()}`;
    document.head.appendChild(manifestLink);

    // Create and append Apple touch icons
    const appleIcon180 = document.createElement('link');
    appleIcon180.rel = 'apple-touch-icon';
    appleIcon180.sizes = '180x180';
    appleIcon180.href = '/icons/icon-180x180.png';
    document.head.appendChild(appleIcon180);

    const appleIcon152 = document.createElement('link');
    appleIcon152.rel = 'apple-touch-icon';
    appleIcon152.sizes = '152x152';
    appleIcon152.href = '/icons/icon-152x152.png';
    document.head.appendChild(appleIcon152);

    // Create and append Apple meta tags
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Portfolio Admin' },
    ];

    const createdMetas: HTMLMetaElement[] = [];
    metaTags.forEach((tag) => {
      // Remove existing meta tag if exists
      const existing = document.querySelector(`meta[name="${tag.name}"]`);
      if (existing) existing.remove();

      // Create new meta tag
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
      createdMetas.push(meta);
    });

    // Cleanup function
    return () => {
      manifestLink.remove();
      appleIcon180.remove();
      appleIcon152.remove();
      createdMetas.forEach((meta) => meta.remove());
    };
  }, []);

  return null;
}
