# STYLE.md — Panduan Desain & UI/UX PressPoint

Dokumen ini berisi panduan gaya (style guide) yang komprehensif untuk pengembangan antarmuka (UI) frontend PressPoint. Harap patuhi panduan ini untuk menjaga konsistensi visual di seluruh aplikasi.

## 1. Palet Warna (Color Palette)

Tema warna utama PressPoint menggunakan nuansa hijau-kuning alami (earth tones) yang memberikan kesan menenangkan, profesional, dan organik. Tema ini sangat cocok menjembatani konsep medis modern dan terapi tradisional.

| Nama Warna | Hex Code | Penggunaan Utama |
|---|---|---|
| **Linen** | `#DBDDB8` | Background sekunder, area kartu (card background), status hover pada elemen terang, atau pemisah (divider) yang sangat halus. |
| **Sunflower** | `#F2EC9B` | Background utama aplikasi, warna highlight yang lembut, atau aksen peringatan (warning) pada evaluasi. |
| **Martini** | `#AFA406` | Primary action (tombol utama), indikator aktif, ikon penting, dan elemen interaktif yang butuh perhatian pengguna. |
| **Moss** | `#444305` | Teks utama (heading & body text), tombol sekunder, border tegas, dan elemen UI gelap. |

### Panduan Penerapan Warna
- **Background Utama:** Gunakan putih (`#FFFFFF`), **Sunflower** (`#F2EC9B`), atau **Linen** (`#DBDDB8`) sebagai warna dasar latar belakang untuk membedakan area konten (seperti sidebar vs area utama).
- **Teks (Typography):** Gunakan **Moss** (`#444305`) untuk semua teks utama agar kontras tetap tinggi dan mudah dibaca (aksesibilitas). Jangan gunakan hitam pekat (`#000000`).
- **Aksen & Tombol (Buttons):** Gunakan **Martini** (`#AFA406`) untuk tombol utama ("Call to Action") dipadukan dengan teks berwarna putih atau warna terang lainnya.
- **Elemen 3D:** Model 3D anatomi dapat menggunakan warna netral (abu-abu terang/putih tulang) agar kontras dengan UI. Titik area nyeri bisa menggunakan warna gradasi kemerahan, sementara **titik pijat/refleksi yang direkomendasikan** bisa menyala menggunakan warna **Martini** atau **Sunflower**.

## 2. Tipografi (Typography)

Untuk memberikan kesan modern, bersih, dan profesional (medical-grade trust), gunakan keluarga font *sans-serif* yang sangat terbaca.

- **Primary Font:** `Inter`, `Roboto`, atau `Outfit` (Pilih salah satu dari Google Fonts).
- **Fallback Font:** `sans-serif`

### Skala Tipografi
- **H1 (Judul Halaman Utama):** 32px (2rem), Bold (700), Warna: Moss `#444305`
- **H2 (Judul Bagian/Dashboard):** 24px (1.5rem), Semi-Bold (600), Warna: Moss `#444305`
- **H3 (Judul Kartu/Komponen):** 20px (1.25rem), Medium (500), Warna: Moss `#444305`
- **Body 1 (Teks Paragraf):** 16px (1rem), Regular (400), Warna: Moss `#444305` (Gunakan opacity 80% untuk teks sekunder jika diperlukan).
- **Body 2 (Keterangan/Caption):** 14px (0.875rem), Regular (400), Warna: Moss `#444305` (opacity 60%).

## 3. Komponen UI (UI Components)

### Tombol (Buttons)
- **Primary Button:** 
  - Background: Martini `#AFA406`
  - Text: Putih `#FFFFFF` (Pastikan kontras mencukupi) atau warna terang yang selaras.
  - Border Radius: 8px (Modern look).
  - Hover State: Warna slightly lebih gelap dari Martini, tambahkan bayangan halus (soft shadow) dan transisi `0.3s`.
- **Secondary Button:**
  - Background: Transparan atau Putih.
  - Border: 2px solid Moss `#444305`
  - Text: Moss `#444305`
  - Hover State: Background Linen `#DBDDB8`, teks tetap Moss.

### Kartu (Cards) & Wadah Konten
- **Background:** Putih `#FFFFFF` atau Linen `#DBDDB8`.
- **Border Radius:** 12px atau 16px untuk sudut yang membulat, memberikan kesan ramah (tidak kaku).
- **Shadow/Bayangan:** Gunakan bayangan yang sangat halus (contoh: `box-shadow: 0 4px 12px rgba(68, 67, 5, 0.08);`) untuk memberikan kedalaman (*depth*) tanpa terlihat berlebihan. Gaya *Glassmorphism* ringan juga diizinkan jika relevan.

### Input Form
- **Border:** Linen `#DBDDB8` atau abu-abu transparan.
- **Focus State:** Border berubah menjadi Martini `#AFA406` atau Moss `#444305` dengan sedikit efek glow/ring.
- **Background:** Putih polos untuk area input.

## 4. Spasi dan Tata Letak (Spacing & Layout)
- Gunakan sistem grid berbasis kelipatan **4px** atau **8px**.
- **Margin & Padding Standar:** 8px, 16px, 24px, 32px, 48px.
- Pastikan ada **White Space (Ruang Kosong)** yang cukup antar elemen. Desain yang *breathable* mengurangi kelelahan visual (cognitive load), hal ini penting untuk aplikasi berbasis kesehatan.

## 5. Micro-Interactions & Animasi
Sesuai dengan standar estetika web yang modern:
- Tambahkan transisi halus (`transition: all 0.3s ease;`) pada interaksi hover tombol, tautan, dan efek timbul pada kartu.
- Tampilkan loading state (misal: *skeleton loading* warna Linen/Sunflower atau animasi *spinner* warna Martini) saat memuat data evaluasi dari AI atau saat menunggu assessment dari backend.

## 6. Aksesibilitas & Kontras (Accessibility)
- **Kontras Teks:** Pastikan teks warna **Moss** selalu ditempatkan di atas latar belakang terang (Linen, Sunflower, atau Putih). Kombinasi ini sangat aman dan memenuhi standar aksesibilitas WCAG.
- **Hindari:** Jangan menempatkan teks putih polos langsung di atas Sunflower atau Linen karena tidak akan terbaca.
- Semua elemen interaktif wajib memiliki state `:focus` dan `:hover` yang terlihat jelas.

---
> **💡 Praktik Terbaik untuk Implementasi CSS/Tailwind:**
> Jadikan nilai Hex di atas sebagai CSS Variables atau ekstensi tema (misalnya di `tailwind.config.js` atau global `index.css`) dengan penamaan seperti `--color-linen`, `--color-sunflower`, `--color-martini`, dan `--color-moss` untuk mempermudah pemeliharaan kode.
