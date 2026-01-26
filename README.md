# Namaz - Islamic Prayer Times Web App

A Progressive Web App (PWA) that displays the five daily Islamic prayer times based on your location.

## Features

- 📅 Today's 5 prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha)
- ⏰ Next prayer countdown
- 📍 Automatic location detection
- 🌙 Hijri (Islamic) date display
- 📱 PWA - Install on your phone like a native app
- 🔒 Privacy-focused - all calculations done locally, no backend

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Prayer Calculations**: [adhan-js](https://github.com/batoulapps/adhan-js)
- **Calculation Method**: ISNA (North America)
- **Default Location**: NYC/NJ area

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Deployment

Deployed on Vercel. Push to `main` branch triggers automatic deployment.

## Usage on iPhone

1. Visit the deployed URL in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. App will appear on your home screen

## Project Structure

```
src/
├── components/       # React components
├── services/         # Prayer calculation & geolocation
├── hooks/            # Custom React hooks
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```
