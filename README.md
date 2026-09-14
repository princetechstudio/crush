# Prince ❤️ Princes — Our Story

A romantic digital love letter and proposal website, made with love from Prince to Princes.

## 🌹 Overview

This is a personal, romantic single-page landing website designed as a digital love letter. It features:

- Elegant loading screen with floating hearts
- Full-screen hero with animated hearts and particles
- A heartfelt love letter with scroll animations
- "Why You?" romantic cards with hover effects
- Beautiful name connection section (Prince ❤️ Princes)
- Relationship timeline
- "Little Things I Love About You" section
- Playful love counters
- Cinematic final message with floating particles
- The Big Question (proposal) → redirects to WhatsApp
- Celebration overlay with massive confetti
- Secret easter egg in the footer (click 💝 5 times)
- Heart cursor effect (desktop only)
- Continuous floating hearts throughout the entire page

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

## 📱 WhatsApp Integration

When Princes clicks "YES ❤️" or "YES, OF COURSE 🥹":
1. A celebration overlay appears with confetti
2. After 2.5 seconds, it opens WhatsApp with a pre-filled message to **0552380231**
3. The message reads: "Yes! I'll be your girl ❤️ — Princes"

To change the WhatsApp number, edit the `WHATSAPP_NUMBER` constant in `src/App.tsx`.

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

## 💡 Features

- **No navigation** — Clean landing page experience
- **Continuous floating hearts** — Hearts float up throughout the entire page
- **Heart cursor** — Click anywhere on desktop for heart particles
- **WhatsApp redirect** — YES buttons send to WhatsApp
- **Reduced motion support** — Respects user accessibility settings
- **No backend required** — Works as a static site
- **No login needed** — Open and enjoy
- **Performance optimized** — Smooth on low-end Android phones

## ❤️ Made with love

This website was created as a personal romantic gesture. Every detail was designed to feel genuine, elegant, and heartfelt.
