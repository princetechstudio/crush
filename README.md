# Prince ❤️ Princes — Our Story

A romantic digital love letter and proposal website, made with love from Prince to Princes.

## 🌹 Overview

This is a personal, romantic single-page website designed as a digital love letter. It features:

- Elegant loading screen
- Full-screen hero with floating hearts
- A heartfelt love letter
- "Why You?" romantic cards
- Beautiful name connection section
- Relationship timeline
- Photo gallery with lightbox
- "Little Things I Love About You" section
- Playful love counters
- Cinematic final message
- The Big Question (proposal)
- Celebration overlay with confetti
- Secret easter egg in the footer
- Heart cursor effect (desktop)

## 🚀 How to Run

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` folder.

## 📸 How to Add Photos

Place your photos in the `public/assets/images/` folder with these exact names:

- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`
- `photo6.jpg`

The website will automatically detect and display them. If the photos don't exist, elegant placeholders will be shown instead.

**Important:** Place images in the `public/` directory so they're served as static assets.

## 🎵 How to Add Music

Place your romantic audio file at:

```
public/assets/audio/romantic.mp3
```

The music will play softly when the proposal is accepted. If the file doesn't exist, the website works normally without audio.

## 🌐 How to Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel
1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Option 3: GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Set source to `gh-pages` branch
4. Run `npm run build` and push the `dist/` folder

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --color-primary: #7A1631;
  --color-deep: #3B0715;
  --color-romantic: #B21F45;
  --color-soft-pink: #F7C8D5;
  --color-light-pink: #FFF1F5;
  --color-gold: #D4AF37;
}
```

### Text Content
All text content is in `src/App.tsx`. Search for the section you want to modify and edit the text directly.

### Fonts
Google Fonts are loaded in `index.html`. Currently using:
- Playfair Display (headings)
- Poppins (body)
- Great Vibes (accent)

## 📱 Responsive Design

The website is fully responsive and works on:
- 320px (small phones)
- 375px (iPhone SE)
- 390px (iPhone 14)
- 414px (iPhone Plus)
- 768px (iPad)
- 1024px (iPad Pro / small laptop)
- 1440px+ (desktop)

## 🥚 Easter Egg

Click the 💝 heart in the footer 5 times to reveal a secret message!

## 💡 Tips

- The website respects `prefers-reduced-motion` for accessibility
- No backend required — works as a static site
- No login or authentication needed
- All animations are smooth and performant
- Optimized for mobile devices

## ❤️ Made with love

This website was created as a personal romantic gesture. Every detail was designed to feel genuine, elegant, and heartfelt.
