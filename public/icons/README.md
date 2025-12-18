# PWA Icons

This folder contains icons for the Progressive Web App (PWA) functionality.

## Required Icons

You need to create the following icon files:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels (Apple Touch Icon)
- `icon-192x192.png` - 192x192 pixels (Android Chrome)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (Android Chrome, Splash Screen)

## How to Generate Icons

### Option 1: Using an Online Tool
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (recommended: 512x512 or larger, square)
3. Download the generated icons
4. Place them in this folder

### Option 2: Using ImageMagick (Command Line)
If you have ImageMagick installed, you can use this script:

```bash
# Start with a source image (source.png should be at least 512x512)
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

### Option 3: Using Photoshop/GIMP
1. Open your source logo
2. Create a square canvas (512x512 recommended)
3. Export/save for each required size

## Design Tips

- Use a simple, recognizable design
- Ensure good contrast
- Test on both light and dark backgrounds
- For maskable icons, keep important content in the center "safe zone" (80% of the canvas)
- Use PNG format with transparency if needed
- Consider using your brand colors

## Testing

After adding icons:
1. Build your Next.js app: `npm run build`
2. Test on mobile: Open in Chrome/Safari
3. Add to home screen
4. Verify the icon appears correctly
