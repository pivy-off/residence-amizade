# Image & Video Setup Guide

## 📁 Where to Place Your Files

### 1. Hero Section (Main Banner)
Place your hero image or video here:
```
/public/images/
  - hero-image.jpg (or .png) - Main hero image
  - hero-video.mp4 (optional) - Hero video (will auto-play if present)
  - hero-video.webm (optional) - WebM version for better browser support
```

**Note:** If you add `hero-video.mp4`, it will automatically be used instead of the image.

### 2. Room Images
Add your room photos to these folders (you can add as many as you want):

```
/public/images/room-standard-single/
  - room-standard-single-1.jpg
  - room-standard-single-2.jpg
  - room-standard-single-3.jpg (add more as needed)
  - room-standard-single-4.jpg
  - etc.

/public/images/room-standard-double/
  - room-standard-double-1.jpg
  - room-standard-double-2.jpg
  - room-standard-double-3.jpg (add more as needed)
  - etc.

/public/images/room-superior-double/
  - room-superior-double-1.jpg
  - room-superior-double-2.jpg
  - room-superior-double-3.jpg (add more as needed)
  - etc.

/public/images/room-family-triple/
  - room-family-triple-1.jpg
  - room-family-triple-2.jpg
  - room-family-triple-3.jpg (add more as needed)
  - etc.
```

**Important:** After adding images, update `content/data.json` to include all image paths. For example:
```json
"images": [
  "/images/room-standard-single/room-standard-single-1.jpg",
  "/images/room-standard-single/room-standard-single-2.jpg",
  "/images/room-standard-single/room-standard-single-3.jpg",
  "/images/room-standard-single/room-standard-single-4.jpg"
]
```

### 3. Gallery Images
Replace or add to:
```
/public/images/gallery/
  - exterior-1.jpg
  - exterior-2.jpg
  - garden-1.jpg
  - garden-2.jpg
  - room-1.jpg
  - room-2.jpg
  - room-3.jpg
  - common-area-1.jpg
  - common-area-2.jpg
  - (add more as needed)
```

## 🎥 Video Formats Supported
- `.mp4` (recommended)
- `.webm` (for better browser support)
- `.mov` (will need conversion)

## 📸 Image Formats Supported
- `.jpg` / `.jpeg` (recommended)
- `.png`
- `.webp` (optimized format)

## ✅ After Adding Files

1. **Replace placeholder images** in the folders above
2. **Update `content/data.json`** to list all your room images
3. **Test the site** - images should appear automatically

## 🔧 Need Help?

If you have different file names or want me to update the code for your specific images, just tell me:
- The file names you're using
- Which room each image belongs to
- Any special requirements

I can update the code to match your file structure!
