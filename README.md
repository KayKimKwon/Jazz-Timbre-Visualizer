# Jazz Timbre Spectrum Visualizer

A real-time frequency spectrum visualizer for comparing jazz styles, built for a GE (General Education) course presentation. Load audio clips of different jazz styles and compare their timbral fingerprints side by side through FFT analysis.

---

## What it does

- Analyzes audio files in real time using the **Web Audio API**
- Displays a **log-scaled FFT spectrum** with frequency bands color-coded by instrument family
- Supports **9 jazz styles**: Swing, Bebop, Cool Jazz, Modal Jazz, Hard Bop, Free Jazz, Asian American Jazz, Latin Jazz, Fusion Jazz
- **Compare mode** — load two styles side by side to directly compare their frequency profiles
- **Auto-normalization** — adjusts volume levels so comparisons reflect timbral differences, not just loudness

## Frequency Color Guide

| Color | Band | Instrument Family |
|---|---|---|
| 🔴 Red | 20–60 Hz | Sub Bass |
| 🟠 Orange | 60–250 Hz | Bass / Double Bass |
| 🟡 Yellow | 250–500 Hz | Low Mid / Trombone |
| 🟢 Green | 500–2k Hz | Mid / Trumpet / Sax |
| 🔵 Blue | 2k–6k Hz | High Mid / Harmonics |
| 🟣 Purple | 6k+ Hz | Air / Cymbals |

---

## How to run it

### Requirements
- A modern browser (Chrome recommended — most reliable Web Audio API support)
- [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension

### Setup

1. Clone or download this repository
2. Place your audio files in the `songs/` folder with these exact filenames:
```
songs/
  Sing, Sing, Sing.mp3       ← Swing
  Hot House.mp3              ← Bebop
  Moon Dreams.mp3            ← Cool Jazz
  So What.mp3                ← Modal Jazz
  Moanin'.mp3                ← Hard Bop
  Lonely Woman.mp3           ← Free Jazz
  Butterfly Lovers Song.mp3  ← Asian American Jazz
  Oye Como Va.mp3            ← Latin Jazz
  Chameleon.mp3              ← Fusion Jazz
```
3. Open the project folder in VS Code
4. Right-click `index.html` and select **Open with Live Server**
5. The app opens in your browser at `localhost:5500`

> ⚠️ Do not open `index.html` by double-clicking it — audio will not work without a local server due to browser security restrictions.

---

## How it works

### Web Audio API pipeline
```
MP3 file → AudioContext → GainNode → AnalyserNode → speakers
                                          ↓
                                      FFT data (array of 0–255)
                                          ↓
                                      Canvas drawing
```

### Key concepts

**FFT (Fast Fourier Transform)** — the browser decomposes the audio signal into its constituent frequencies, producing an array of 16,384 numbers. Each number represents the energy present at a particular frequency at that moment in time.

**Log scale** — human hearing is logarithmic, so the x-axis uses `Math.log10()` to space frequencies naturally. Without this, the interesting musical content would be compressed into the left 10% of the screen.

**Normalization** — each file's peak amplitude is calculated on load and a `GainNode` compensates, bringing all clips to the same loudness level for fair comparison.

---

## Project structure

```
jazz-visualizer/
  songs/          ← audio files (not included, see setup)
  index.html      ← page structure
  style.css       ← styling
  script.js       ← all audio and visualization logic
  README.md
```

---

## Built with

- Vanilla JavaScript — no frameworks
- Web Audio API — audio analysis
- Canvas API — real-time drawing
- Google Fonts — Cormorant Garamond, DM Mono

---

## Academic context

This project was built as a visual aid for a GE course presentation on jazz history and style evolution. The spectrum visualizer makes timbral differences between jazz styles visible — allowing direct comparison of frequency profiles across Swing, Bebop, Cool Jazz, Modal Jazz, Hard Bop, Free Jazz, Asian American Jazz, Latin Jazz, and Fusion.
