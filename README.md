# Sistem Perpustakaan Digital SMK Negeri 3 Manado - Frontend Demo

Frontend statis untuk aplikasi perpustakaan digital, menggunakan Firebase Auth & Firestore. Dapat di-host di GitHub Pages.

## Fitur
- Autentikasi dengan role admin/member.
- Katalog buku dengan pencarian, filter, pagination.
- Manajemen buku (admin).
- Peminjaman & pengembalian (client-side simulasi).
- Review & rating.
- Statistik dengan Chart.js.
- Manajemen anggota (admin).

## Setup
1. Buat project Firebase, aktifkan Auth & Firestore.
2. Set Firestore Rules dari `firestore.rules`.
3. Ganti placeholder di `assets/js/firebase-config.js` dengan keys Anda.
4. Import data seed dari `seed/seedData.json` via console atau emulator.
5. Push ke GitHub repo, aktifkan Pages di branch main.

## Deploy ke GitHub Pages
- Gunakan workflow di `.github/workflows/deploy-frontend.yml` untuk auto-deploy.
- Atau manual: Push ke repo, aktifkan Pages.

## Firestore Indexing
Pastikan index untuk queries pencarian (title, category, availableStock).

## Keamanan
- Client-side validation & sanitasi dengan DOMPurify.
- Firestore Rules mencegah unauthorized access.

## Run Lokal
Gunakan Firebase Emulator untuk testing offline.