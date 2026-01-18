# UVOWORLD - City Building Game

Modern pixel-art city building game with real-time collaboration.

## Features
- 🏙️ Build & design your own worlds
- 👥 Real-time collaboration
- 📱 Mobile-friendly controls
- 💾 Save/load with versioning
- 🌐 Public sharing & browsing
- 🎮 Simulation with economy system

## Setup

1. **Clone repository**
```bash
git clone https://github.com/yourusername/uvoworld.git
cd uvoworld
```

2. **Firebase Setup**
- Create project at [firebase.google.com](https://firebase.google.com)
- Enable Authentication, Firestore, Storage
- Copy config to `index.html` (line ~40)
- Deploy rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

3. **Assets**
- Place all PNG assets in `/asset/` folder
- Use prompts in `halaman/prompts_batch.txt` to generate assets

4. **Development**
- Serve locally using any HTTP server:
```bash
python3 -m http.server 8000
```
- Open `http://localhost:8000`

## Project Structure
```
/UVOWORLD/
├── index.html          # Main entry point
├── asset/              # All game assets
├── halaman/            # HTML pages
│   ├── editor.html     # World editor
│   ├── viewer.html     # Public viewer
│   ├── settings.html   # User settings
│   ├── auth.html       # Login/register
│   └── prompts_batch.txt # AI asset prompts
├── styles/             # CSS files
│   └── global.css      # Global styles
└── (scripts/)          # JavaScript modules (optional)
```

## Development Notes
- Uses Firebase for backend
- Canvas 2D for rendering
- LZString for data compression
- Mobile-first responsive design
- Pixel-art aesthetic

## Next Steps
1. Replace Firebase config in `index.html`
2. Generate assets using provided prompts
3. Implement core game systems:
   - World saving/loading
   - Tile rendering engine
   - Simulation logic
4. Add multiplayer collaboration
5. Optimize performance for mobile

## License
MIT License
