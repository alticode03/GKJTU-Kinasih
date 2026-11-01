# Revisi Website - Planning Document

## 📋 Scope Perubahan

### 1. **Navbar Branding**
- ❌ Current: "GKJ TU Kinasih"
- ✅ New: "GKJTU Kinasih" (tanpa spasi TU)
- File affected: `index.html`, `pages/*.html`

### 2. **Homepage (index.html) - Remove Menu Layanan**
- ❌ Remove: 10-card "Menu Layanan Gereja" section
- ✅ Keep: Hero, Search form, Featured content (if any)
- Note: "Tentang" section dipindah dari tentang.html ke index.html

### 3. **Halaman Tentang (tentang.html) → Merge ke index.html**
- ✅ Pindah dari `pages/tentang.html` ke `index.html`:
  - Sejarah singkat
  - Visi & Misi
  - Kepengurusan (org chart)
- 🗑️ **Hapus file**: `pages/tentang.html`
- Update navbar: link "Tentang" → points to `index.html#tentang` (anchor)

### 4. **Footer Restructure**
Current structure (4 columns):
```
- GKJ TU Kinasih (about)
- Menu (5 links)
- Lokasi (1 address)
- Contact Person (IG, Email)
```

New structure (4 columns):
```
- GKJ TU Kinasih (about)
- Menu (4 links only: Home, Jadwal & Warta, Informasi, Renungan)
- Sosial Media (IG, Email, WhatsApp, etc.)
- Lokasi (3 placeholder locations)
```

**Lokasi setup:**
- Lokasi 1: Getas, Popongan, Bringin (current) ← KEEP
- Lokasi 2: [Placeholder] - Alamat Gereja 2
- Lokasi 3: [Placeholder] - Alamat Gereja 3

### 5. **Merge: warta.html + pengumuman.html + pelayanan.html → informasi.html**
- ✅ Create new: `pages/informasi.html`
- Sections:
  1. **Warta Gereja** (news/announcements from Supabase)
  2. **Pengumuman** (emergency/important notices)
  3. **Pelayanan** (ministry descriptions)
- 🗑️ **Hapus files**:
  - `pages/warta.html`
  - `pages/pengumuman.html`
  - `pages/pelayanan.html`
- Update navbar: link "Informasi" → points to `/informasi`

### 6. **Hapus Kontak Page**
- 🗑️ **Hapus file**: `pages/kontak.html`
- Update navbar: remove "Kontak" link
- Note: Contact info hanya ada di footer

### 7. **Final Navbar Structure**
```
Logo - "GKJTU Kinasih"

Navigation (5 items):
- Home (/)
- Jadwal & Warta (/jadwal)
- Informasi (/informasi) ← NEW, replaces warta+pengumuman+pelayanan
- Renungan (/renungan)
- Lainnya [dropdown]
  - Admin
  - Formulir Jemaat
  - Galeri
  - Event & Kegiatan
```

---

## 📂 Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `index.html` | Modify | Update navbar branding, remove Menu Layanan, add Tentang section with sejarah/visi/misi/kepengurusan |
| `pages/jadwal.html` | Modify | Update navbar branding only |
| `pages/renungan.html` | Modify | Update navbar branding only |
| `pages/formulir-jemaat.html` | Modify | Update navbar branding only |
| `pages/galeri.html` | Modify | Update navbar branding only |
| `pages/event.html` | Modify | Update navbar branding only |
| `pages/admin.html` | Modify | Update navbar branding only |
| `pages/persembahan.html` | Modify | Update navbar branding only |
| `css/global.css` | Modify | Update footer grid/layout if needed |
| `pages/informasi.html` | **CREATE** | Merge warta + pengumuman + pelayanan |
| `pages/tentang.html` | **DELETE** | Content moved to index.html |
| `pages/warta.html` | **DELETE** | Merged to informasi.html |
| `pages/pengumuman.html` | **DELETE** | Merged to informasi.html |
| `pages/pelayanan.html` | **DELETE** | Merged to informasi.html |
| `pages/kontak.html` | **DELETE** | Contact only in footer |

---

## 🎨 Footer Layout Reference

**Current:**
```
[GKJ TU Kinasih]  [Menu]           [Lokasi]         [Contact Person]
- About text      - Home           - Jalan Getas... - IG: @gkjtu.kinasih
                  - Tentang        - Google Maps    - Email: ...
                  - Jadwal & Warta
                  - Renungan
                  - Kontak
```

**New:**
```
[GKJ TU Kinasih]  [Menu]           [Sosial Media]   [Lokasi]
- About text      - Home           - IG: @gkjtu...  - Lokasi 1: Jalan Getas...
                  - Jadwal & Warta - Email: ...      - Maps link
                  - Informasi      - WhatsApp: ...   
                  - Renungan                         - Lokasi 2: [Placeholder]
                                                     - Lokasi 3: [Placeholder]
```

---

## ⚠️ Important Notes

1. **Sejarah/Visi/Misi in index.html**: Need content from current `tentang.html`
2. **Kepengurusan section**: Should be org chart format (visual or table)
3. **Informasi.html tabs/sections**: Need clear separation of warta/pengumuman/pelayanan
4. **Footer spacing**: 3 locations might need card layout or vertical list
5. **Navbar active states**: Update logic to match new structure
6. **Internal links**: All pages linking to deleted pages must update

---

## ✅ Checklist

- [ ] Update navbar branding to "GKJTU Kinasih"
- [ ] Remove Menu Layanan from index.html
- [ ] Add Tentang section to index.html (sejarah, visi, misi, kepengurusan)
- [ ] Update footer to 4 columns (Menu, Sosial Media, Lokasi x3)
- [ ] Create informasi.html (merge warta+pengumuman+pelayanan)
- [ ] Delete tentang.html, warta.html, pengumuman.html, pelayanan.html, kontak.html
- [ ] Update navbar links on all pages
- [ ] Update footer on all pages
- [ ] Test responsiveness on mobile/tablet
- [ ] Deploy & verify
- [ ] Commit changes

---

## 📝 Questions for You

1. **Kepengurusan format**: Should it be:
   - Visual org chart (boxes + lines)?
   - Simple list (names & roles)?
   - Table format?

2. **Informasi.html tabs**: Should sections be:
   - Tabs (click to switch)?
   - Accordion (expand/collapse)?
   - Stacked sections (scroll)?

3. **Lokasi 2 & 3**: Do you have addresses ready, or should I keep as placeholders?

4. **Navbar "Lainnya" dropdown**: Keep current items, or update?

---

**Status**: ⏳ Awaiting confirmation before implementation
