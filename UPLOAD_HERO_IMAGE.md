# Upload Gambar Hero Kolase

## Status Saat Ini
✅ HTML sudah diupdate untuk menggunakan gambar kolase tunggal
✅ CSS sudah dioptimalkan untuk responsif di semua ukuran layar
⏳ **Menunggu:** File gambar `hero-church-collage.webp` disimpan ke folder `assets/images/`

## Langkah-Langkah Upload

### 1. Siapkan Gambar
- Gambar kolase tiga gereja yang Anda kirim: `Kolase_Tiga_Gereja_di_Bawah_Langit_Biru.png`
- Convert ke WebP format (untuk optimasi ukuran file)
  - Online: https://cloudconvert.com/png-to-webp
  - Atau gunakan: `ffmpeg -i input.png -c:v libwebp output.webp`
  - Atau gunakan: ImageMagick `magick input.png output.webp`

### 2. Simpan File
- Nama file: `hero-church-collage.webp` (PENTING: nama harus persis ini)
- Lokasi: `assets/images/hero-church-collage.webp`
- Path lengkap: `C:\Users\Anya\.openclaw\workspace\WebsiteGKJTUKinasih\assets\images\hero-church-collage.webp`

### 3. Verifikasi
Setelah upload, cek di browser:
- Desktop: https://gkjtu-kinasih.web.app/ (pastikan gambar terlihat di hero section)
- Tablet: Resize browser ke 768px
- Mobile: Resize browser ke 375px

## Spesifikasi Gambar

| Property | Value |
|----------|-------|
| Format | WebP atau PNG |
| Nama File | hero-church-collage.webp |
| Ukuran Rekomendasi | 1200x900px (min), 2400x1800px (ideal) |
| Aspect Ratio | 4:3 (desktop), 16:10 (tablet), 4:5 (mobile) |
| Max File Size | 500KB (WebP) atau 1MB (PNG) |

## CSS Responsif

```css
Desktop (>860px):    aspect-ratio: 4/3
Tablet (600-860px): aspect-ratio: 16/10
Mobile (<600px):    aspect-ratio: 4/5
```

Gambar akan:
- ✅ Memenuhi area hero tanpa distorsi
- ✅ Menampilkan ketiga foto gereja dengan jelas
- ✅ Responsif di semua ukuran
- ✅ Mempertahankan kualitas visual

## Testing Checklist

- [ ] Gambar terlihat di desktop
- [ ] Gambar responsif di tablet
- [ ] Gambar responsif di mobile
- [ ] Tidak ada bagian penting yang terpotong
- [ ] Teks hero (judul, tombol) masih terlihat jelas
- [ ] Loading time cepat

## Jika Ada Masalah

1. **Gambar tidak muncul?** → Cek console browser (F12) untuk error
2. **Gambar terpotong?** → Ubah ukuran file atau aspect ratio
3. **Loading lambat?** → Kompres WebP lebih kecil atau gunakan format lain

---

**Status:** Siap untuk upload gambar kolase ✅
