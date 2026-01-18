# UVOWORLD - Game Simulasi Kota Pixel

UVOWORLD adalah game simulasi kota berbasis web dengan tema pixel-art, mirip Theotown. Game ini dibangun sebagai aplikasi web statis dengan backend Firebase.

## Fitur Utama

✅ Autentikasi pengguna (Daftar/Login/Logout)
✅ Buat dan kelola dunia pribadi
✅ Mode publik dan kolaboratif
✅ Editor tile-based untuk membangun kota
✅ Simulasi ekonomi dan populasi sederhana
✅ Responsif dan mobile-friendly

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Grafik**: Canvas 2D dengan pixel-art assets
- **Hosting**: Firebase Hosting (recommended)

## Setup Awal

### 1. Clone Repository
```bash
git clone https://github.com/username/uvoworld.git
cd uvoworld
```

### 2. Setup Firebase
1. Buat proyek baru di Firebase Console
2. Tambahkan aplikasi Web
3. Dapatkan konfigurasi Firebase
4. Update `firebaseConfig` di `index.html`

### 3. Deploy Rules
1. Buka Firebase Console
2. Navigasi ke Firestore Database
3. Tambahkan rules dari `firestore.rules`
4. Navigasi ke Storage
5. Tambahkan rules dari `storage.rules`

### 4. Jalankan Secara Lokal
Buka `index.html` di browser atau gunakan server lokal:
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx serve .
```
