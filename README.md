# 🎨 Pixel Editor

A beautiful, modern pixel art editor built with vanilla JavaScript and Vite.

## Features

### Canvas Sizes
- Square canvas only
- Supported sizes: 2x2, 4x4, 8x8, 16x16, 32x32, 64x64, 128x128, 256x256, 512x512
- Default: 16x16

### Brush Sizes
- **Single Pixel (1x1)**: Perfect for detailed work
- **4x4**: Medium brush for faster filling
- **8x8**: Large brush for quick backgrounds

### Color Selection
- Color picker with full spectrum
- 8 preset colors for quick access:
  - Black, White
  - Red, Green, Blue
  - Yellow, Magenta, Cyan

### Export
- Export your pixel art as PNG
- Exports at actual pixel dimensions (no grid lines)
- Automatically named with canvas size

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Use

1. **Start the editor**: Run `npm run dev` and open the provided URL
2. **Choose canvas size**: Select from the dropdown (2x2 to 512x512)
3. **Select brush size**: Click on 1x1, 4x4, or 8x8 brush
4. **Pick a color**: Use the color picker or click preset colors
5. **Draw**: Click and drag on the canvas to draw
6. **Export**: Click "Export PNG" to save your artwork

## Technical Details

- **Build Tool**: Vite for fast development and optimized builds
- **Pure JavaScript**: No frameworks, just vanilla JS
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Full touch event support for tablets and phones
- **Image Rendering**: Crisp pixel rendering (no anti-aliasing)
- **Hot Module Replacement**: Instant updates during development

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- CSS Grid
- ES6 JavaScript

## File Structure

```
pixel-editor/
├── index.html       # Main HTML structure
├── main.js          # Entry point (imports CSS and JS)
├── style.css        # Styling and layout
├── script.js        # Editor functionality
├── package.json     # Dependencies and scripts
├── vite.config.js   # Vite configuration
└── README.md        # This file
```

## Tips

- Use smaller canvas sizes (16x16, 32x32) for icons and sprites
- Use larger brushes (4x4, 8x8) to fill backgrounds quickly
- The grid helps you see individual pixels clearly
- Exported images maintain perfect pixel clarity

Enjoy creating pixel art! 🎮

