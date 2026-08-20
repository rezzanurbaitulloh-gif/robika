import type { CurriculumStack } from "../curriculum";

export const HTML_CSS_TRACK: CurriculumStack = {
  id: "html-css",
  name: "HTML & CSS",
  icon: "palette",
  description:
    "Fondasi seluruh web: HTML menyusun struktur halaman, CSS mengatur tampilan. Kuasai keduanya untuk membangun halaman apa pun.",
  color: "sky",
  difficulty: "Pemula",
  modules: [
    {
      id: "html-pengenalan",
      title: "Pengenalan HTML",
      minutes: 10,
      topics: [
        {
          title: "Apa itu HTML?",
          body:
            "HTML (HyperText Markup Language) adalah bahasa markah yang menyusun struktur halaman web — judul, paragraf, gambar, tautan, daftar, dan form. Bukan bahasa pemrograman (tidak ada logika), melainkan cara memberi makna pada konten. Setiap elemen dibungkus tag seperti <p>...</p>. Browser membaca HTML dan menampilkannya sebagai halaman.",
          code: `<!DOCTYPE html>
<html>
  <head>
    <title>Halaman Pertamaku</title>
  </head>
  <body>
    <h1>Halo, dunia!</h1>
    <p>Ini paragraf pertama saya.</p>
  </body>
</html>`,
        },
        {
          title: "Struktur Dokumen",
          body:
            "<!DOCTYPE html> menandakan dokumen HTML5. <html> adalah akar, <head> berisi metadata (judul, charset, link CSS), <body> berisi konten yang tampak. Meta charset=\"utf-8\" memastikan huruf Indonesia (é, ï) tampil benar. Setiap tag pembuka wajib ditutup, kecuali yang void seperti <br> dan <img>.",
          code: `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Profil Saya</title>
  </head>
  <body>
    <!-- konten halaman di sini -->
    <h1>Biodata</h1>
  </body>
</html>`,
        },
        {
          title: "Heading & Paragraf",
          body:
            "Heading h1 sampai h6 menyusun hierarki judul — h1 hanya satu per halaman (penting untuk SEO). Paragraf <p> memuat teks. Elemen semantik modern: <header>, <nav>, <main>, <section>, <article>, <footer> membuat struktur lebih bermakna bagi browser dan screen reader.",
          code: `<h1>Judul Utama</h1>
<h2>Sub Judul</h2>
<h3>Sub Sub Judul</h3>
<p>Ini paragraf. Browser menampilkan
teks panjang secara otomatis.</p>

<header>Bagian atas</header>
<main>
  <section>Konten utama</section>
</main>
<footer>Bagian bawah</footer>`,
        },
        {
          title: "Teks Format",
          body:
            "Bold dengan <strong> (penting, dibaca tegas oleh screen reader) atau <b> (sekadar tebal). Italic dengan <em> (penekanan) atau <i>. Garis bawah jarang dipakai selain tautan. <br> membuat baris baru, <hr> garis pemisah. Gunakan elemen sesuai makna, bukan sekadar tampilan.",
          code: `<p>Ini <strong>teks tebal penting</strong>
dan ini <em>teks miring penekanan</em>.</p>
<p>Baris pertama<br />baris kedua</p>
<hr />
<p>H<sub>2</sub>O dan x<sup>2</sup>.</p>`,
        },
        {
          title: "Komentar & Validasi",
          body:
            "Komentar HTML ditulis <!-- ... --> — tidak tampil, berguna untuk penanda bagian. Selalu uji halaman di browser (buka file .html). Gunakan validator W3C untuk memastikan tidak ada tag salah. Struktur HTML yang valid mencegah tampilan aneh dan masalah aksesibilitas.",
          code: `<!-- ===== NAVIGASI ===== -->
<nav>
  <a href="/beranda">Beranda</a>
  <a href="/tentang">Tentang</a>
</nav>
<!-- ===== AKHIR NAVIGASI ===== -->`,
        },
      ],
      quiz: [
        {
          q: "HTML adalah bahasa untuk...",
          options: ["logika program", "menyusun struktur halaman", "mengatur warna", "query database"],
          answer: 1,
          explain: "HTML menyusun struktur/makna konten, bukan logika.",
        },
        {
          q: "Tag heading paling penting (satu per halaman) adalah...",
          options: ["<h6>", "<title>", "<h1>", "<strong>"],
          answer: 2,
          explain: "<h1> adalah judul utama — sebaiknya satu per halaman.",
        },
        {
          q: "Komentar di HTML ditulis dengan...",
          options: ["// ...", "# ...", "/* ... */", "<!-- ... -->"],
          answer: 3,
          explain: "Komentar HTML memakai <!-- dan -->.",
        },
      ],
    },
    {
      id: "html-elemen",
      title: "Tautan, Gambar & List",
      minutes: 15,
      topics: [
        {
          title: "Tautan (Link)",
          body:
            "Tag <a href=\"...\">teks</a> membuat tautan. href bisa URL lengkap, relatif (/tentang), atau anchor (#bagian). target=\"_blank\" membuka tab baru. Tambahkan atribut title untuk tooltip. Tautan adalah cara pengguna menjelajah antarmuka web.",
          code: `<a href="https://robika.com">Situs Robika</a>
<a href="/tentang">Tentang Kami</a>
<a href="#kontak">Langsung ke kontak</a>
<a href="mailto:halo@robika.com">Kirim email</a>

<section id="kontak">
  <h2>Kontak</h2>
</section>`,
        },
        {
          title: "Gambar",
          body:
            "Tag <img src=\"lokasi\" alt=\"deskripsi\" /> menampilkan gambar. alt wajib — dibaca screen reader dan tampil saat gambar gagal dimuat (juga baik untuk SEO). Atur ukuran dengan width/height atau CSS. Format umum: PNG, JPG, WebP, SVG.",
          code: `<img src="logo.png" alt="Logo Robika" width="120" />
<img src="foto.jpg" alt="Foto profil" class="avatar" />

<!-- SVG — gambar vektor tajam di semua ukuran -->
<img src="ikon.svg" alt="Ikon" width="32" />`,
        },
        {
          title: "List",
          body:
            "List tak berurutan <ul><li>, berurutan <ol><li> (dinomori otomatis), dan deskripsi <dl><dt><dd>. List sering menjadi dasar menu navigasi dan daftar konten. Nesting list untuk sub-item diperbolehkan.",
          code: `<h3>Bahan Belajar</h3>
<ul>
  <li>HTML</li>
  <li>CSS
    <ul>
      <li>Layout</li>
      <li>Warna</li>
    </ul>
  </li>
</ul>

<h3>Langkah</h3>
<ol>
  <li>Buka editor</li>
  <li>Buat file</li>
  <li>Simpan .html</li>
</ol>`,
        },
        {
          title: "Tabel Dasar",
          body:
            "Tabel dengan <table>, <thead>, <tbody>, <tr> (baris), <th> (kepala), <td> (sel). colspan menggabungkan kolom, rowspan menggabungkan baris. Tabel untuk data, bukan layout halaman. Beri <caption> untuk judul tabel yang aksesibel.",
          code: `<table>
  <caption>Skor Kuis</caption>
  <thead>
    <tr>
      <th>Nama</th>
      <th>Skor</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Bimo</td><td>90</td></tr>
    <tr><td>Sari</td><td>85</td></tr>
  </tbody>
</table>`,
        },
        {
          title: "Div & Span",
          body:
            "<div> adalah wadah blok generik untuk mengelompokkan elemen (sering menjadi target layout CSS). <span> adalah wadah inline untuk bagian kecil teks. Keduanya tidak punya makna semantik — gunakan elemen semantik dulu, baru div/span untuk keperluan styling.",
          code: `<div class="kartu">
  <h3>Kartu 1</h3>
  <p>Isi <span class="penting">penting</span> di sini.</p>
</div>

<div class="kartu">
  <h3>Kartu 2</h3>
</div>`,
        },
      ],
      quiz: [
        {
          q: "Atribut yang wajib ada pada <img> agar aksesibel adalah...",
          options: ["title", "alt", "class", "style"],
          answer: 1,
          explain: "alt mendeskripsikan gambar untuk screen reader dan saat gambar gagal dimuat.",
        },
        {
          q: "List yang dinomori otomatis menggunakan tag...",
          options: ["<ul>", "<li>", "<ol>", "<dl>"],
          answer: 2,
          explain: "<ol> (ordered list) menampilkan nomor otomatis.",
        },
        {
          q: "Tag untuk membuka tautan adalah...",
          options: ["<link>", "<a>", "<url>", "<nav>"],
          answer: 1,
          explain: "<a href=\"...\"> membuat tautan. <link> hanya untuk menghubungkan aset.",
        },
      ],
    },
    {
      id: "css-dasar",
      title: "CSS Dasar & Selector",
      minutes: 20,
      topics: [
        {
          title: "Apa itu CSS?",
          body:
            "CSS (Cascading Style Sheets) mengatur tampilan elemen HTML — warna, ukuran, jarak, font, dan posisi. Ditulis sebagai aturan: selector { properti: nilai; }. Tiga cara: inline (style=\"...\", hindari), internal (<style> di head), eksternal (file .css via <link> — terbaik).",
          code: `/* file: style.css */
h1 {
  color: #2dd4bf;
  font-size: 32px;
}

p {
  color: #94a3b8;
  line-height: 1.6;
}`,
        },
        {
          title: "Menghubungkan CSS ke HTML",
          body:
            "Hubungkan file CSS eksternal dengan <link rel=\"stylesheet\" href=\"style.css\" /> di <head>. Pisah struktur (HTML) dan tampilan (CSS) agar mudah dikelola. Perubahan satu file CSS langsung mengubah seluruh halaman yang memakainya.",
          code: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Beranda</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Judul</h1>
  </body>
</html>`,
        },
        {
          title: "Selector Dasar",
          body:
            "Selector menentukan elemen mana yang diberi gaya: elemen (h1), kelas (.nama, dipakai ulang), id (#nama, unik). Gabung: div.kartu, atau turunan: .menu a. Kelas adalah cara paling fleksibel dan paling sering dipakai.",
          code: `/* elemen */
p { color: #94a3b8; }

/* kelas — boleh dipakai banyak elemen */
.kartu {
  border: 1px solid #334155;
  padding: 16px;
}

/* id — unik per halaman */
#judul-utama { font-size: 40px; }

/* kombinasi */
nav a { color: #2dd4bf; text-decoration: none; }`,
        },
        {
          title: "Warna, Font & Teks",
          body:
            "Warna lewat nama, hex (#2dd4bf), rgb(), hsl(). font-family mengatur jenis font (fallback list), font-size ukuran, font-weight tebal. text-align rata teks, text-decoration untuk garis, line-height jarak baris. Sistem warna dan tipografi adalah 80% kesan visual sebuah halaman.",
          code: `.judul {
  color: #f8fafc;
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.tombol {
  background-color: #2dd4bf;
  color: #0b1120;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
}`,
        },
        {
          title: "Box Model",
          body:
            "Setiap elemen adalah kotak: content di tengah, lalu padding (jarak dalam), border (tepi), margin (jarak luar). Padding menambah ruang di dalam elemen; margin memisahkan antar elemen. box-sizing: border-box membuat lebar mencakup padding+border — praktik standar.",
          code: `.kartu {
  box-sizing: border-box;
  width: 300px;
  padding: 16px;      /* ruang dalam */
  border: 2px solid #334155;
  margin: 12px;       /* jarak luar */
}

* { box-sizing: border-box; }`,
        },
      ],
      quiz: [
        {
          q: "Cara terbaik menghubungkan CSS adalah...",
          options: ["inline style", "file eksternal <link>", "atribut color", "tag <css>"],
          answer: 1,
          explain: "File CSS eksternal lewat <link> memisahkan tampilan dari struktur.",
        },
        {
          q: "Selector untuk kelas .kartu ditulis...",
          options: ["kartu", "#kartu", ".kartu", "*kartu"],
          answer: 2,
          explain: "Titik (.) menandai selector kelas.",
        },
        {
          q: "Properti yang menambah ruang DI DALAM elemen adalah...",
          options: ["margin", "border", "padding", "spacing"],
          answer: 2,
          explain: "padding menambah ruang dalam; margin jarak luar.",
        },
      ],
    },
    {
      id: "css-layout",
      title: "Layout: Flexbox & Grid",
      minutes: 25,
      topics: [
        {
          title: "Flexbox",
          body:
            "display: flex membuat container satu dimensi (baris/kolom). justify-content mengatur posisi horizontal (flex-start, center, space-between), align-items vertikal. gap memberi jarak antar item. Flexbox adalah cara paling umum menata barisan elemen — tombol, menu, kartu sejajar.",
          code: `.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.baris-kartu {
  display: flex;
  flex-wrap: wrap;   /* turun ke baris berikutnya */
  gap: 16px;
}`,
        },
        {
          title: "Grid Dasar",
          body:
            "display: grid membuat layout dua dimensi (baris DAN kolom). grid-template-columns: repeat(3, 1fr) membuat 3 kolom sama lebar; 1fr = satu bagian ruang. gap jarak antar sel. Grid ideal untuk galeri, dashboard, dan kartu produk.",
          code: `.galeri {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.layout {
  display: grid;
  grid-template-columns: 200px 1fr; /* sidebar + konten */
}`,
        },
        {
          title: "Responsive Design",
          body:
            "Website harus enak dipakai di HP, tablet, dan desktop. Media query @media (max-width: 768px) menerapkan gaya hanya saat layar ≤ 768px — ubah grid 3 kolom jadi 1 kolom. Selalu rancang mobile-first dan uji di berbagai ukuran.",
          code: `.galeri {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* layar >= 768px: 2 kolom */
@media (min-width: 768px) {
  .galeri { grid-template-columns: repeat(2, 1fr); }
}

/* layar >= 1024px: 3 kolom */
@media (min-width: 1024px) {
  .galeri { grid-template-columns: repeat(3, 1fr); }
}`,
        },
        {
          title: "Unit: px, %, rem, vh",
          body:
            "px tetap dan presisi. % relatif terhadap induk — fleksibel. rem relatif terhadap ukuran font root (16px default) — disarankan untuk font agar skala konsisten. vh/vw relatif terhadap tinggi/lebar layar (mis. min-height: 100vh untuk halaman penuh).",
          code: `.kartu {
  width: 90%;        /* 90% lebar induk */
  max-width: 600px;  /* tapi maksimal 600px */
}

.teks {
  font-size: 1rem;   /* = 16px default */
}

.hero {
  min-height: 100vh; /* setinggi layar */
}`,
        },
        {
          title: "Pseudo-class & Hover",
          body:
            ":hover mengubah gaya saat kursor di atas elemen; :focus saat elemen dipilih keyboard; :nth-child() memilih urutan tertentu. Transisi transition membuat perubahan halus. Interaksi ini membuat antarmuka terasa hidup dan responsif.",
          code: `.tombol {
  background-color: #2dd4bf;
  color: #0b1120;
  transition: background-color 0.2s;
}

.tombol:hover {
  background-color: #5eead4;
}

.tombol:focus {
  outline: 2px solid #f8fafc;
}

.list li:nth-child(odd) {
  background-color: #1e293b;
}`,
        },
      ],
      quiz: [
        {
          q: "Untuk menata barisan elemen dalam satu baris dengan jarak, gunakan...",
          options: ["grid 3 kolom", "display: flex", "position: absolute", "float"],
          answer: 1,
          explain: "Flexbox dirancang untuk layout satu dimensi (baris/kolom).",
        },
        {
          q: "Grid dengan 3 kolom sama lebar ditulis...",
          options: ["grid-template-columns: 1fr;", "grid-template-columns: repeat(3, 1fr);", "grid-columns: 3;", "flex: 3"],
          answer: 1,
          explain: "repeat(3, 1fr) membuat tiga kolom masing-masing satu bagian ruang.",
        },
        {
          q: "Gaya yang hanya berlaku saat layar kecil memakai...",
          options: ["@media (max-width: ...)", "if (layar kecil)", "flex-wrap", "mobile-css"],
          answer: 0,
          explain: "Media query @media (max-width: ...) menerapkan gaya sesuai lebar layar.",
        },
      ],
    },
    {
      id: "html-lanjut",
      title: "Form & Elemen Interaktif",
      minutes: 25,
      topics: [
        {
          title: "Form Dasar",
          body:
            "Form <form> mengumpulkan input pengguna. Elemen: <input> (teks, email, password, number), <textarea> (teks panjang), <select>+<option> (pilihan), <button type=\"submit\">. Setiap input butuh <label> dan atribut name — label menghubungkan dengan id.",
          code: `<form action="/daftar" method="post">
  <label for="nama">Nama</label>
  <input type="text" id="nama" name="nama" />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="pesan">Pesan</label>
  <textarea id="pesan" name="pesan" rows="3"></textarea>

  <button type="submit">Kirim</button>
</form>`,
        },
        {
          title: "Tipe Input",
          body:
            "type menentukan perilaku dan validasi browser: text, email (validasi format), password (tersembunyi), number (panah angka), date (kalender), checkbox (centang), radio (pilih satu), range (slider), file (upload), tel, url. Pilih tipe yang tepat — browser menyediakan keyboard dan validasi yang sesuai.",
          code: `<input type="email" placeholder="you@mail.com" />
<input type="password" placeholder="Rahasia" />
<input type="number" min="0" max="100" step="1" />
<input type="date" />
<input type="checkbox" id="setuju" />
<input type="radio" name="pilih" value="a" />
<input type="range" min="1" max="10" />
<input type="file" accept="image/*" />`,
        },
        {
          title: "Select, Checkbox & Radio",
          body:
            "<select> memberi menu dropdown; <select multiple> multi-pilih. Radio mengelompokkan pilihan dengan name yang sama — hanya satu yang terpilih. Checkbox independen. Beri nilai default dengan selected/checked. Semua memakai label agar mudah diklik dan aksesibel.",
          code: `<label for="kelas">Kelas</label>
<select id="kelas" name="kelas">
  <option value="7">Kelas 7</option>
  <option value="8" selected>Kelas 8</option>
  <option value="9">Kelas 9</option>
</select>

<label><input type="radio" name="gender" value="L" /> Laki-laki</label>
<label><input type="radio" name="gender" value="P" /> Perempuan</label>

<label><input type="checkbox" name="terima" /> Saya setuju</label>`,
        },
        {
          title: "Validasi Dasar",
          body:
            "Atribut required mewajibkan isi, minlength/maxlength membatasi panjang, pattern membatasi pola (regex), min/max membatasi angka. Validasi browser menampilkan pesan otomatis sebelum submit. Untuk pengalaman lebih baik, kombinasikan dengan JavaScript.",
          code: `<input type="text" name="username" required minlength="3" maxlength="20" />
<input type="email" name="email" required />
<input type="number" name="umur" min="7" max="17" />
<input type="text" name="kode" pattern="[A-Z0-9]{5}" title="5 huruf/angka besar" />`,
        },
        {
          title: "Proyek: Kartu Profil Responsive",
          body:
            "Gabungkan semua: buat kartu profil berisi gambar, nama, deskripsi, dan tautan — ditata dengan flexbox, diresponsifkan dengan media query, dan diberi hover. Ini tugas integrasi HTML+CSS pertama yang meniru komponen web sungguhan.",
          code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Profil</title>
  <style>
    .kartu {
      max-width: 320px;
      margin: 20px auto;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }
    .kartu img { border-radius: 50%; width: 96px; height: 96px; }
    .kartu:hover { box-shadow: 0 8px 24px rgba(0,0,0,.3); }
  </style>
</head>
<body>
  <div class="kartu">
    <img src="avatar.png" alt="Avatar" />
    <h2>Bimo</h2>
    <p>Pelajar Robika. Belajar HTML & CSS.</p>
    <a href="mailto:bimo@mail.com">Hubungi</a>
  </div>
</body>
</html>`,
        },
      ],
      quiz: [
        {
          q: "Input untuk email agar divalidasi browser otomatis adalah...",
          options: ["type=\"text\"", "type=\"email\"", "type=\"mail\"", "type=\"string\""],
          answer: 1,
          explain: "type=\"email\" membuat browser memvalidasi format email.",
        },
        {
          q: "Agar radio membentuk satu kelompok pilihan, mereka harus berbagi...",
          options: ["id yang sama", "name yang sama", "class yang sama", "value yang sama"],
          answer: 1,
          explain: "Radio dengan name sama hanya mengizinkan satu pilihan terpilih.",
        },
        {
          q: "Atribut yang mewajibkan input diisi adalah...",
          options: ["required", "must", "need", "valid"],
          answer: 0,
          explain: "required menolak submit jika input kosong.",
        },
      ],
    },
    {
      id: "html-proyek",
      title: "Proyek Mini: Halaman Beranda",
      minutes: 30,
      topics: [
        {
          title: "Rencana Halaman",
          body:
            "Bangun halaman beranda lengkap: header dengan logo & menu, hero section dengan judul dan tombol, section fitur dengan grid kartu, dan footer. Gunakan semantic HTML dan file CSS terpisah. Struktur yang baik memudahkan styling dan pemeliharaan.",
          code: `index.html
style.css
script.js (nanti)

<body>
  <header>      <!-- logo + nav -->
  <main>
    <section class="hero">
    <section class="fitur"> <!-- grid kartu -->
  </main>
  <footer>
</body>`,
        },
        {
          title: "Header & Navigasi",
          body:
            "Header berisi logo dan menu dengan flexbox: justify-content: space-between. Tambahkan class aktif untuk menu sedang dibuka. Buat tautan ke bagian halaman memakai href=\"#bagian\". Pastikan menu tap-friendly di mobile (ukuran teks & jarak cukup).",
          code: `<header>
  <a href="/" class="logo">Robika</a>
  <nav>
    <a href="#fitur">Fitur</a>
    <a href="#tentang">Tentang</a>
    <a href="#kontak">Kontak</a>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
  }
  nav { display: flex; gap: 16px; }
</style>`,
        },
        {
          title: "Hero Section",
          body:
            "Hero adalah bagian pembuka: judul besar, subjudul, dan tombol aksi. Gunakan min-height: 60vh, text-align: center, dan padding. Dua tombol: utama (solid) dan sekunder (outline). Hero adalah kesan pertama pengunjung — buat jelas dan mengundang.",
          code: `<section class="hero">
  <h1>Belajar Coding Gratis</h1>
  <p>Game 2D, CodeLab, dan AI Mentor untuk semua.</p>
  <div class="aksi">
    <a class="btn utama" href="/daftar">Mulai Belajar</a>
    <a class="btn sekunder" href="/belajar">Lihat Kurikulum</a>
  </div>
</section>

<style>
  .hero {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
  .aksi { display: flex; gap: 12px; margin-top: 16px; }
  .btn { padding: 12px 20px; border-radius: 8px; }
  .utama { background: #2dd4bf; color: #0b1120; }
  .sekunder { border: 1px solid #2dd4bf; }
</style>`,
        },
        {
          title: "Grid Fitur & Footer",
          body:
            "Section fitur memakai grid 3 kolom yang berubah 1 kolom di mobile. Footer berisi hak cipta dan tautan sosial. Beri jarak konsisten (padding/margin) dan maksimum lebar konten (max-width: 1100px; margin: auto) agar rapi di layar besar.",
          code: `<section class="fitur" id="fitur">
  <div class="kartu"><h3>Kode Quest</h3><p>Game logika 2D.</p></div>
  <div class="kartu"><h3>CodeLab</h3><p>Latihan langsung.</p></div>
  <div class="kartu"><h3>AI Mentor</h3><p>Belajar 1-on-1.</p></div>
</section>

<footer>
  <p>&copy; 2026 Robika. Dibuat untuk belajar.</p>
</footer>

<style>
  .fitur {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px;
  }
  .kartu { border: 1px solid #334155; border-radius: 12px; padding: 20px; }
  @media (min-width: 768px) { .fitur { grid-template-columns: repeat(3, 1fr); } }
</style>`,
        },
        {
          title: "Pengujian & Pengembangan",
          body:
            "Uji halaman di desktop dan ponsel (gunakan DevTools device mode), periksa tautan bekerja, dan pastikan kontras warna cukup. Pengembangan lanjut: menu hamburger untuk mobile dengan JavaScript, animasi scroll, dark mode, atau menghubungkan form ke backend. Selamat — kamu kini bisa membangun halaman web sungguhan!",
          code: `<!-- tips pengujian -->
<!-- 1. Buka DevTools (F12) -> ikon perangkat -->
<!-- 2. Uji lebar 375px (HP) dan 1280px (desktop) -->
<!-- 3. Periksa tidak ada elemen terpotong -->

<!-- hamburger menu (lanjutan) -->
<button id="menuBtn" aria-label="Buka menu">☰</button>
<script>
  document.getElementById("menuBtn")
    .addEventListener("click", () =>
      document.querySelector("nav").classList.toggle("terbuka"));
</script>`,
        },
      ],
      quiz: [
        {
          q: "Agar konten tidak melar di layar besar, gunakan...",
          options: ["width: 100%", "max-width + margin auto", "position: fixed", "font besar"],
          answer: 1,
          explain: "max-width membatasi lebar dan margin auto memusatkan.",
        },
        {
          q: "Untuk menata tombol berjejer dengan jarak, cara paling mudah adalah...",
          options: ["flexbox + gap", "padding", "border", "text-align"],
          answer: 0,
          explain: "display:flex dengan gap menata elemen sejajar berjarak.",
        },
        {
          q: "Cara mengubah grid jadi satu kolom di HP adalah...",
          options: ["grid-template-columns: 1fr di @media max-width", "menggunakan <br>", "table", "position: absolute"],
          answer: 0,
          explain: "Media query mengganti jumlah kolom sesuai lebar layar.",
        },
      ],
    },
  ],
};