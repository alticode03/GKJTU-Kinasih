## Task: Redesign Navbar dan Home Page untuk Kemudahan Pengguna Lansia

Website sudah hampir selesai. Saya ingin memperbaiki navigasi berdasarkan masukan pengguna, terutama jemaat lanjut usia yang belum terbiasa menggunakan website.

**Tujuan utama:** menyediakan navbar dua baris dengan 10 menu yang ditampilkan langsung, serta menampilkan kembali 10 menu tersebut sebagai kartu navigasi di Home Page.

### 1. Periksa implementasi yang ada
- Periksa struktur proyek, framework, routing, komponen navbar, dan Home Page yang sudah ada.
- Identifikasi 10 halaman/menu yang benar-benar tersedia di proyek.
- Gunakan nama menu dan URL aktual dari implementasi yang ada. Jangan mengarang halaman atau mengganti URL tanpa alasan.
- Pertahankan fungsi, konten, integrasi, autentikasi, dan desain halaman lainnya.
- Jangan membuat ulang website dari nol.

### 2. Navbar desktop: dua baris

Buat navbar yang menampilkan seluruh 10 menu secara langsung dalam dua baris, tanpa dropdown untuk menu-menu tersebut.

**Baris pertama — 5 menu utama:**

**Baris kedua — 5 menu tambahan:**

Ketentuan desain:
- Navbar memiliki dua baris yang rapi, konsisten, dan mudah dipahami.
- Gunakan ikon sederhana dengan label teks yang selalu terlihat.
- Setiap menu memiliki area klik minimal sekitar 48 × 48 px.
- Ukuran teks menu sekitar 16–18 px jika ruang memungkinkan.
- Berikan indikator visual yang jelas pada halaman aktif.
- Gunakan latar cream, aksen muted rose, dan gaya hangat sesuai identitas visual website saat ini.
- Pastikan seluruh menu tidak bertumpuk, terpotong, atau menimbulkan horizontal scrolling pada desktop.
- Navbar boleh sticky jika sesuai dengan implementasi sekarang, tetapi jangan sampai terlalu tinggi atau menutupi konten.

Jangan menambahkan tombol login atau pencarian jika fitur tersebut tidak diperlukan oleh website saat ini.

### 3. Home Page: tampilkan kembali 10 menu

Tambahkan bagian baru bernama **“Menu Layanan Gereja”** atau judul serupa yang jelas bagi pengguna awam.

Tempatkan bagian ini tepat setelah hero/sambutan utama agar mudah ditemukan tanpa perlu menggulir terlalu jauh.

Tampilkan seluruh 10 menu sebagai kartu navigasi.

Setiap kartu memiliki:
- Ikon yang mudah dikenali.
- Nama halaman dengan ukuran teks yang jelas.
- Area klik yang luas.
- Indikator sederhana seperti panah atau teks “Buka halaman”.
- Tautan menuju halaman yang sama dengan menu pada navbar.

Gunakan daftar 10 menu aktual dari routing proyek. Jangan membuat tautan palsu, placeholder yang tampak seperti halaman aktif, atau halaman baru hanya untuk memenuhi jumlah menu.

### 4. Layout kartu responsif

Desktop:
- Gunakan grid 5 kolom × 2 baris jika lebar layar mencukupi.
- Kartu memiliki tinggi dan jarak yang konsisten.

Tablet:
- Gunakan sekitar 3 kolom sesuai lebar layar.

Ponsel:
- Gunakan 2 kolom dengan kartu yang cukup besar untuk disentuh.
- Jangan memaksakan navbar desktop dua baris ke layar kecil.
- Gunakan navbar mobile yang sudah ada jika berfungsi baik, atau sederhanakan menjadi logo dan tombol “Menu” yang jelas.
- Panel menu mobile harus menampilkan nama menu secara lengkap, dengan area sentuh yang nyaman.

### 5. Prinsip aksesibilitas

Target pengguna mencakup orang tua yang belum terbiasa menggunakan website.

Karena itu:
- Utamakan label yang jelas daripada istilah teknis.
- Jangan mengandalkan ikon atau warna saja untuk menyampaikan informasi.
- Pastikan kontras teks memadai.
- Gunakan navigasi keyboard dan focus indicator yang terlihat.
- Gunakan elemen tautan yang semestinya untuk navigasi.
- Hindari animasi berlebihan, hover sebagai satu-satunya cara membuka menu, dan interaksi yang tidak umum.
- Pastikan tombol dan tautan berfungsi baik dengan mouse, sentuhan, dan keyboard.

### 6. Batas perubahan

- Fokus pada navbar, bagian menu Home Page, dan CSS responsif yang diperlukan.
- Jangan mengubah backend, database, skema Supabase, autentikasi, atau API.
- Jangan menghapus bagian Home Page yang sudah ada.
- Jangan mengubah konten halaman lain tanpa kebutuhan.
- Gunakan kembali komponen dan style yang tersedia jika memungkinkan.
- Hindari dependency baru dan refactor besar yang tidak diperlukan.

### 7. Verifikasi setelah implementasi

Setelah selesai:
1. Jalankan aplikasi dan periksa Home Page.
2. Pastikan 10 menu tampil di navbar desktop dalam dua baris.
3. Pastikan 10 kartu menu tampil di Home Page.
4. Uji setiap tautan agar menuju halaman yang benar.
5. Periksa tampilan desktop, tablet, dan ponsel.
6. Pastikan tidak ada teks terpotong, overflow horizontal, atau elemen bertumpuk.
7. Jalankan lint, type-check, test, dan build jika tersedia.
8. Laporkan file yang diubah, hasil pengujian, dan kendala yang masih ada.

Jangan menyatakan tugas selesai hanya karena perubahan kode sudah dibuat. Verifikasi hasil aktual dan pertahankan fungsi website yang sudah berjalan.