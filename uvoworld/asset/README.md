# UVOWORLD - ASSET FOLDER

Tempatkan semua file asset di sini. Struktur yang disarankan:

/asset/
├── tiles/           # Tile game (32x32, 48x48, 64x64)
│   ├── terrain/     # Grass, water, mountain
│   ├── roads/       # Road tiles
│   ├── buildings/   # Houses, shops, factories
│   └── deco/        # Trees, parks, decorations
├── ui/              # UI elements
│   ├── icons/       # UI icons (64x64)
│   ├── buttons/     # Button states
│   └── panels/      # Panel backgrounds
├── avatars/         # User avatars (uploaded)
├── thumbs/          # World thumbnails
└── fonts/           # Custom fonts (opsional)

Format: PNG dengan transparansi
Warna: Palette konsisten (max 16-32 warna per sprite untuk pixel art)
Ukuran: Kelipatan 16px (16, 32, 48, 64, 128)

Warna palette referensi:
- Biru tua: #1a1a2e
- Biru medium: #16213e
- Biru muda: #0f3460
- Aksen: #e94560
- Hijau: #4CAF50
- Kuning: #FFC107
