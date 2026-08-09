# Somnus - Restful Sleep Coach & Circadian Optimizer

A modern, glassmorphic Progressive Web Application designed around the **Nocturne Deep Night** design system.

## Features
- **Sleep Assessment**: 4-step onboarding questionnaire to analyze bedtime, wake schedules, sleep quality, common issues, and daily stress levels.
- **Sleep Dashboard**: Hero animated sleep score radial progress ring, last night's stats, recovery plan recommendations, and habit checklist.
- **Sleep Logger Modal**: Instant log modal to record daily sleep duration, awakenings, mood, and notes.
- **Somnus AI Coach**: Personal sleep strategy powered by Cognitive Behavioral Therapy for Insomnia (CBT-I) interactive modules and customized daily tips.
- **Sleep Insights**: Trend analytics and interactive SVG line charts tracking sleep scores over time.
- **Wind-Down Studio**: Built-in Web Audio ambient soundscape synthesizer (Rain, Ocean Surges, Pink Noise, Delta Binaural Beats) and interactive 4-7-8 breathing visualizer.
- **Data Privacy & Storage**: 100% client-side `localStorage` data persistence with JSON export/import and data reset tools.

---

## 🚀 How to Run Locally

### Option 1: Open Directly in Any Web Browser
Simply double-click [`index.html`](file:///C:/Users/abhis/.gemini/antigravity/scratch/somnus_sleep_app/index.html) or open it directly in Chrome, Edge, Safari, or Firefox!

### Option 2: Live Local Server (VS Code / Python / npx)
If using Python or any static HTTP server:
```bash
# Python
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🌐 How to Publish Online (Free Hosting)

### 1. Deploying to Vercel (Recommended - 1 Click / Command)
Using Vercel CLI:
```bash
npx vercel
```
Or drag and drop the `somnus_sleep_app` folder directly onto [vercel.com/new](https://vercel.com/new).

### 2. Deploying to Netlify
Using Netlify CLI:
```bash
npx netlify-cli deploy --prod
```
Or drag and drop the `somnus_sleep_app` folder directly onto [app.netlify.com/drop](https://app.netlify.com/drop).

### 3. Deploying to GitHub Pages
1. Push this folder to a GitHub Repository.
2. In GitHub Repository Settings -> **Pages**, set Source to `main` branch `/ (root)`.
3. Save—your app will be published live instantly at `https://<username>.github.io/<repo-name>/`!
