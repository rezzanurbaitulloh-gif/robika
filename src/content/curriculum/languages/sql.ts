import type { CurriculumStack } from "../curriculum";

export const SQL_TRACK: CurriculumStack = {
  id: "sql",
  name: "SQL",
  icon: "database",
  description:
    "Bahasa untuk menyimpan, membaca, dan mengolah data dalam database. Keterampilan inti untuk aplikasi, analitik, dan data science.",
  color: "violet",
  difficulty: "Pemula",
  modules: [
    {
      id: "sql-pengenalan",
      title: "Pengenalan Database & SQL",
      minutes: 10,
      topics: [
        {
          title: "Apa itu Database & SQL?",
          body:
            "Database adalah tempat menyimpan data terstruktur — seperti spreadsheet raksasa namun lebih kuat dan aman. SQL (Structured Query Language) adalah bahasa untuk berkomunikasi dengan database: membuat, membaca, mengubah, dan menghapus data. Hampir semua aplikasi modern — bank, e-commerce, media sosial, game — memakai SQL.",
          code: `-- Database menyimpan data dalam tabel
-- Tabel = baris (records) + kolom (fields)

-- Contoh tabel: siswa
-- id | nama  | kelas | skor
-- 1  | Bimo  | 8A    | 90
-- 2  | Sari  | 8B    | 85`,
        },
        {
          title: "Tabel & Kolom",
          body:
            "CREATE TABLE mendefinisikan tabel baru beserta kolom dan tipe datanya. Tipe umum: INT (bilangan), VARCHAR(n) (teks pendek), TEXT (teks panjang), BOOLEAN, DATE, DECIMAL (desimal uang). PRIMARY KEY adalah kolom unik identitas tiap baris.",
          code: `CREATE TABLE siswa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(5),
  skor INT DEFAULT 0,
  tanggal_lahir DATE
);

CREATE TABLE skor_kuis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  siswa_id INT NOT NULL,
  kuis VARCHAR(50),
  nilai INT,
  FOREIGN KEY (siswa_id) REFERENCES siswa(id)
);`,
        },
        {
          title: "Menambah Data: INSERT",
          body:
            "INSERT INTO menambahkan baris baru. Sebutkan kolom lalu VALUES dengan urutan sama. Tambahkan beberapa baris sekaligus dalam satu statement. Data adalah bahan bakar aplikasi — tanpa data tidak ada yang bisa ditampilkan.",
          code: `INSERT INTO siswa (nama, kelas, skor)
VALUES ('Bimo', '8A', 90);

INSERT INTO siswa (nama, kelas, skor)
VALUES
  ('Sari', '8B', 85),
  ('Doni', '8A', 78),
  ('Rina', '8C', 92);`,
        },
        {
          title: "Membaca Data: SELECT",
          body:
            "SELECT memilih kolom dan baris. SELECT * mengambil semua kolom; SELECT kolom1, kolom2 hanya yang dipilih. WHERE memfilter baris. Semua perintah diambil dari operasi SELECT — dia adalah perintah yang paling sering dipakai.",
          code: `-- semua kolom, semua baris
SELECT * FROM siswa;

-- hanya kolom tertentu
SELECT nama, skor FROM siswa;

-- dengan filter
SELECT nama, skor FROM siswa
WHERE kelas = '8A';

-- urutkan berdasarkan skor tertinggi
SELECT nama, skor FROM siswa
ORDER BY skor DESC;`,
        },
        {
          title: "Mengubah & Menghapus",
          body:
            "UPDATE mengubah data pada baris yang cocok WHERE. DELETE menghapus baris. Tanpa WHERE, UPDATE/DELETE berlaku ke SEMUA baris — sangat berbahaya. Selalu uji dengan SELECT dulu untuk melihat baris yang akan terpengaruh.",
          code: `-- ubah skor Bimo
UPDATE siswa SET skor = 95
WHERE nama = 'Bimo';

-- hapus siswa dengan skor < 80
DELETE FROM siswa
WHERE skor < 80;

-- SELALU cek dulu sebelum update/delete
SELECT * FROM siswa WHERE skor < 80;`,
        },
      ],
      quiz: [
        {
          q: "SQL adalah bahasa untuk...",
          options: ["membuat game", "berkomunikasi dengan database", "styling web", "mengedit gambar"],
          answer: 1,
          explain: "SQL mengelola data dalam database (CRUD).",
        },
        {
          q: "Perintah membaca data adalah...",
          options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
          answer: 2,
          explain: "SELECT mengambil data dari tabel.",
        },
        {
          q: "Risiko UPDATE tanpa WHERE adalah...",
          options: ["menghapus tabel", "mengubah SEMUA baris", "menambah data duplikat", "tidak ada risiko"],
          answer: 1,
          explain: "Tanpa WHERE, UPDATE memengaruhi setiap baris di tabel.",
        },
      ],
    },
    {
      id: "sql-filter",
      title: "Filter & Sortir Data",
      minutes: 15,
      topics: [
        {
          title: "WHERE & Operator Perbandingan",
          body:
            "WHERE memfilter baris. Operator: =, != atau <>, >, <, >=, <=. Bandingkan teks dengan kutip '...' dan angka tanpa kutip. Kombinasikan kondisi untuk mencari data spesifik seperti skor di atas 80 dari kelas 8A.",
          code: `SELECT * FROM siswa WHERE skor >= 80;
SELECT * FROM siswa WHERE kelas != '8B';
SELECT * FROM siswa WHERE skor > 90;

-- gabungan
SELECT * FROM siswa
WHERE kelas = '8A' AND skor >= 80;

SELECT * FROM siswa
WHERE kelas = '8A' OR kelas = '8C';`,
        },
        {
          title: "AND, OR, NOT",
          body:
            "AND: semua kondisi harus benar. OR: salah satu benar. NOT membalik hasil. Urutan logika diatur tanda kurung — (A OR B) AND C beda dengan A OR (B AND C). Logika boolean ini sama dengan di pemrograman.",
          code: `-- siswa kelas 8A dengan skor tinggi
SELECT * FROM siswa
WHERE kelas = '8A' AND skor >= 85;

-- siswa kelas 8B ATAU skor >= 90
SELECT * FROM siswa
WHERE kelas = '8B' OR skor >= 90;

-- bukan dari kelas 8A
SELECT * FROM siswa
WHERE NOT kelas = '8A';

-- kurung mengubah makna
SELECT * FROM siswa
WHERE (kelas = '8A' OR kelas = '8B') AND skor >= 80;`,
        },
        {
          title: "IN, BETWEEN, LIKE",
          body:
            "IN memeriksa daftar nilai, BETWEEN rentang (inklusif), LIKE mencari pola teks: % berarti banyak karakter, _ satu karakter. LIKE digunakan untuk pencarian kata kunci seperti kotak pencarian aplikasi.",
          code: `-- IN: beberapa nilai
SELECT * FROM siswa WHERE kelas IN ('8A', '8C');

-- BETWEEN: rentang angka
SELECT * FROM siswa WHERE skor BETWEEN 80 AND 95;

-- LIKE: pencarian pola
SELECT * FROM siswa WHERE nama LIKE 'B%';    -- mulai B
SELECT * FROM siswa WHERE nama LIKE '%ri%';  -- mengandung 'ri'
SELECT * FROM siswa WHERE nama LIKE '_imo';  -- 1 char + 'imo'`,
        },
        {
          title: "ORDER BY & LIMIT",
          body:
            "ORDER BY mengurutkan hasil; ASC naik (default), DESC turun. LIMIT membatasi jumlah baris, OFFSET melewati sejumlah baris (untuk pagination). Gabungan keduanya penting untuk leaderboard dan halaman data.",
          code: `-- 5 siswa dengan skor tertinggi
SELECT nama, skor FROM siswa
ORDER BY skor DESC
LIMIT 5;

-- urut naik
SELECT nama, skor FROM siswa ORDER BY skor ASC;

-- dua kunci urutan
SELECT * FROM siswa
ORDER BY kelas ASC, skor DESC;

-- pagination: halaman 2 (lewati 5 pertama)
SELECT * FROM siswa ORDER BY id LIMIT 5 OFFSET 5;`,
        },
        {
          title: "NULL & COALESCE",
          body:
            "NULL berarti tidak ada nilai — beda dari 0 atau string kosong. Bandingkan dengan IS NULL / IS NOT NULL (bukan = NULL). COALESCE mengganti NULL dengan default saat membaca. Data nyata sering berisi NULL, dan menanganinya benar itu wajib.",
          code: `-- cari siswa yang belum punya tanggal lahir
SELECT * FROM siswa WHERE tanggal_lahir IS NULL;

-- yang sudah punya
SELECT * FROM siswa WHERE tanggal_lahir IS NOT NULL;

-- tampilkan '-' bila NULL
SELECT nama, COALESCE(kelas, 'belum diisi') AS kelas
FROM siswa;`,
        },
      ],
      quiz: [
        {
          q: "Mencari nilai dalam rentang memakai...",
          options: ["LIKE", "BETWEEN", "IN", "WHERE ="],
          answer: 1,
          explain: "BETWEEN ... AND ... memilih rentang inklusif.",
        },
        {
          q: "Operator untuk pola teks adalah...",
          options: ["LIKE", "CONTAINS", "MATCH", "IN"],
          answer: 0,
          explain: "LIKE memakai % dan _ untuk pola teks.",
        },
        {
          q: "Memeriksa kolom yang tidak bernilai memakai...",
          options: ["= NULL", "IS NULL", "NULL()", "EMPTY"],
          answer: 1,
          explain: "NULL dibandingkan dengan IS NULL, bukan tanda sama dengan.",
        },
      ],
    },
    {
      id: "sql-agregat",
      title: "Agregasi & Fungsi",
      minutes: 20,
      topics: [
        {
          title: "Fungsi Agregat",
          body:
            "Fungsi agregat meringkas banyak baris jadi satu nilai: COUNT (jumlah baris), SUM (jumlah total), AVG (rata-rata), MIN, MAX. Ini adalah dasar analisis data — berapa siswa, berapa total skor, siapa skor tertinggi.",
          code: `SELECT COUNT(*) AS jumlah_siswa FROM siswa;
SELECT COUNT(nama) AS yang_bernama FROM siswa;

SELECT AVG(skor) AS rata_skor FROM siswa;
SELECT SUM(skor) AS total_skor FROM siswa;
SELECT MIN(skor) AS terendah, MAX(skor) AS tertinggi FROM siswa;`,
        },
        {
          title: "GROUP BY",
          body:
            "GROUP BY mengelompokkan baris berdasarkan kolom lalu agregat dihitung per kelompok. Misal rata-rata skor per kelas. Kolom yang di-SELECT selain agregat harus ada di GROUP BY. Ini teknik analisis paling umum.",
          code: `-- rata-rata skor per kelas
SELECT kelas, AVG(skor) AS rata, COUNT(*) AS jumlah
FROM siswa
GROUP BY kelas;

-- jumlah siswa per kelas
SELECT kelas, COUNT(*) AS jumlah
FROM siswa
GROUP BY kelas;`,
        },
        {
          title: "HAVING",
          body:
            "HAVING memfilter hasil agregat — WHERE memfilter baris SEBELUM dikelompokkan, HAVING memfilter kelompok SETELAH agregasi. HAVING dipakai untuk syarat seperti 'kelas dengan rata-rata di atas 85'.",
          code: `-- kelas yang rata-ratanya di atas 85
SELECT kelas, AVG(skor) AS rata
FROM siswa
GROUP BY kelas
HAVING AVG(skor) > 85;

-- perbedaan WHERE vs HAVING
-- WHERE: filter baris sumber
-- HAVING: filter hasil agregat
SELECT kelas, COUNT(*) AS jumlah
FROM siswa
WHERE skor >= 80          -- baris dulu
GROUP BY kelas
HAVING COUNT(*) >= 2;     -- kelompok setelah`,
        },
        {
          title: "Alias (AS)",
          body:
            "Alias memberi nama lain untuk kolom atau tabel: SELECT skor AS nilai. Berguna untuk hasil agregat yang panjang dan memperjelas output. Di tabel join, alias tabel membuat query lebih pendek. AS opsional namun disarankan untuk keterbacaan.",
          code: `SELECT
  nama AS Nama_Siswa,
  skor AS Nilai_Ujian
FROM siswa;

SELECT kelas, COUNT(*) AS jumlah
FROM siswa
GROUP BY kelas
ORDER BY jumlah DESC;

-- alias tabel (dipakai di JOIN)
SELECT s.nama, s.skor
FROM siswa AS s
WHERE s.kelas = '8A';`,
        },
        {
          title: "Agregat dengan Filter",
          body:
            "Gabungkan agregat dengan kondisi dan fungsi tanggal: hitung siswa yang lulus per kelas, rata-rata hanya untuk yang ikut. Kombinasi CASE juga memungkinkan agregasi bersyarat tanpa subquery.",
          code: `-- jumlah lulus (>=80) per kelas
SELECT
  kelas,
  COUNT(CASE WHEN skor >= 80 THEN 1 END) AS lulus,
  COUNT(*) AS total
FROM siswa
GROUP BY kelas;

-- statistik umum
SELECT
  COUNT(*) AS total,
  AVG(skor) AS rata,
  MAX(skor) AS tertinggi
FROM siswa;`,
        },
      ],
      quiz: [
        {
          q: "Fungsi untuk menghitung jumlah baris adalah...",
          options: ["SUM", "COUNT", "TOTAL", "NUMBER"],
          answer: 1,
          explain: "COUNT menghitung banyaknya baris.",
        },
        {
          q: "Filter hasil AGREGAT memakai...",
          options: ["WHERE", "HAVING", "FILTER", "ON"],
          answer: 1,
          explain: "HAVING memfilter kelompok setelah agregasi; WHERE memfilter baris.",
        },
        {
          q: "Rata-rata skor per kelas mengharuskan...",
          options: ["ORDER BY", "GROUP BY kelas", "LIMIT", "JOIN"],
          answer: 1,
          explain: "GROUP BY kelas lalu AVG(skor) dihitung per kelompok.",
        },
      ],
    },
    {
      id: "sql-join",
      title: "Join: Hubungkan Tabel",
      minutes: 25,
      topics: [
        {
          title: "Mengapa Perlu JOIN?",
          body:
            "Data nyata tersebar di banyak tabel untuk menghindari duplikasi (normalisasi): siswa dan skor kuis adalah tabel terpisah, dihubungkan lewat siswa_id. JOIN menggabungkan baris dari dua tabel berdasarkan kolom penghubung. Ini jantung aplikasi relasional.",
          code: `-- tabel siswa:      id, nama, kelas
-- tabel skor_kuis:  id, siswa_id, kuis, nilai

-- gabungkan: nama siswa + nilai kuisnya
SELECT siswa.nama, skor_kuis.kuis, skor_kuis.nilai
FROM skor_kuis
JOIN siswa ON skor_kuis.siswa_id = siswa.id;`,
        },
        {
          title: "INNER JOIN",
          body:
            "INNER JOIN hanya menampilkan baris yang cocok di kedua tabel. Data tanpa pasangan tidak muncul. Ini join yang paling umum. Pakai alias tabel agar query singkat: skor_kuis s JOIN siswa sw ON s.siswa_id = sw.id.",
          code: `-- semua skor kuis beserta nama siswa
SELECT sw.nama, s.kuis, s.nilai
FROM skor_kuis AS s
INNER JOIN siswa AS sw ON s.siswa_id = sw.id;

-- hanya kuis tertentu
SELECT sw.nama, s.kuis, s.nilai
FROM skor_kuis AS s
JOIN siswa AS sw ON s.siswa_id = sw.id
WHERE s.kuis = 'HTML';

-- urut dari nilai tertinggi
SELECT sw.nama, s.nilai
FROM skor_kuis AS s
JOIN siswa AS sw ON s.siswa_id = sw.id
ORDER BY s.nilai DESC
LIMIT 3;`,
        },
        {
          title: "LEFT JOIN",
          body:
            "LEFT JOIN menampilkan SEMUA baris dari tabel kiri, dan data dari tabel kanan bila cocok (NULL bila tidak). Berguna untuk menampilkan daftar siswa lengkap beserta nilai — termasuk yang belum punya nilai sama sekali.",
          code: `-- semua siswa, dengan nilai kuis bila ada
SELECT sw.nama, s.kuis, s.nilai
FROM siswa AS sw
LEFT JOIN skor_kuis AS s ON s.siswa_id = sw.id;

-- siswa yang BELUM pernah ikut kuis
SELECT sw.nama
FROM siswa AS sw
LEFT JOIN skor_kuis AS s ON s.siswa_id = sw.id
WHERE s.id IS NULL;`,
        },
        {
          title: "Join + Agregat",
          body:
            "Kombinasi JOIN dengan GROUP BY dan agregat adalah pola analisis yang kuat: rata-rata nilai per siswa, jumlah kuis yang diikuti, ranking. Ini persis yang dipakai leaderboard dan laporan.",
          code: `-- rata-rata & jumlah kuis per siswa
SELECT
  sw.nama,
  COUNT(s.id) AS jumlah_kuis,
  AVG(s.nilai) AS rata_nilai
FROM siswa AS sw
LEFT JOIN skor_kuis AS s ON s.siswa_id = sw.id
GROUP BY sw.nama
ORDER BY rata_nilai DESC;`,
        },
        {
          title: "Join Banyak Tabel",
          body:
            "Join bisa dirantai: siswa -> skor_kuis -> kuis (master data kuis). Tambahkan join kedua dengan ON berikutnya. Urutan dan ON menentukan kebenaran hasil. Latih dengan 3 tabel untuk memahami alur data aplikasi sungguhan.",
          code: `-- tabel kuis: id, judul, materi
CREATE TABLE kuis (
  id INT PRIMARY KEY,
  judul VARCHAR(50),
  materi VARCHAR(20)
);

-- siswa -> skor -> kuis
SELECT
  sw.nama AS siswa,
  k.judul AS kuis,
  s.nilai
FROM skor_kuis AS s
JOIN siswa AS sw ON s.siswa_id = sw.id
JOIN kuis AS k ON s.kuis_id = k.id
ORDER BY s.nilai DESC;`,
        },
      ],
      quiz: [
        {
          q: "Join yang hanya menampilkan baris cocok di kedua tabel adalah...",
          options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL JOIN"],
          answer: 1,
          explain: "INNER JOIN menampilkan pasangan yang cocok di kedua sisi.",
        },
        {
          q: "Untuk menampilkan semua siswa termasuk yang belum punya nilai, gunakan...",
          options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "NO JOIN"],
          answer: 1,
          explain: "LEFT JOIN menjaga semua baris tabel kiri (siswa).",
        },
        {
          q: "Join dihubungkan dengan...",
          options: ["WHERE sama", "ON (kolom penghubung)", "GROUP BY", "ORDER BY"],
          answer: 1,
          explain: "ON menentukan kolom yang mencocokkan antar tabel.",
        },
      ],
    },
    {
      id: "sql-proyek",
      title: "Proyek Mini: Analisis Sekolah",
      minutes: 30,
      topics: [
        {
          title: "Skema Database",
          body:
            "Rancang skema untuk sekolah: tabel siswa, kuis, dan skor_kuis dengan FOREIGN KEY. FOREIGN KEY menjamin referensi valid — tidak bisa memasukkan skor untuk siswa yang tidak ada. Ini menjaga integritas data.",
          code: `CREATE TABLE siswa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(5) NOT NULL
);

CREATE TABLE kuis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(50) NOT NULL,
  materi VARCHAR(20) NOT NULL
);

CREATE TABLE skor_kuis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  siswa_id INT NOT NULL,
  kuis_id INT NOT NULL,
  nilai INT NOT NULL,
  FOREIGN KEY (siswa_id) REFERENCES siswa(id),
  FOREIGN KEY (kuis_id) REFERENCES kuis(id)
);`,
        },
        {
          title: "Isi Data",
          body:
            "INSERT data contoh: beberapa siswa, beberapa kuis, dan nilai. Pastikan skor_kuis merujuk siswa_id dan kuis_id yang ada. Data contoh yang realistis memudahkan memeriksa hasil query benar.",
          code: `INSERT INTO siswa (nama, kelas) VALUES
  ('Bimo', '8A'), ('Sari', '8B'), ('Doni', '8A'),
  ('Rina', '8C'), ('Aji', '8B');

INSERT INTO kuis (judul, materi) VALUES
  ('HTML Dasar', 'Web'), ('SQL Dasar', 'Database'), ('Logika', 'Algoritma');

INSERT INTO skor_kuis (siswa_id, kuis_id, nilai) VALUES
  (1, 1, 90), (1, 2, 88), (2, 1, 85), (2, 3, 92),
  (3, 1, 70), (4, 2, 95), (5, 3, 60);`,
        },
        {
          title: "Query Laporan",
          body:
            "Buat laporan: peringkat siswa berdasarkan rata-rata nilai, jumlah kuis yang diikuti per siswa, dan peringkat per kuis. Ini adalah query yang persis dipakai di dunia kerja untuk dashboard dan laporan sekolah.",
          code: `-- peringkat siswa
SELECT sw.nama, COUNT(s.id) AS ikut,
       AVG(s.nilai) AS rata
FROM siswa AS sw
LEFT JOIN skor_kuis AS s ON s.siswa_id = sw.id
GROUP BY sw.nama
ORDER BY rata DESC;

-- jumlah peserta per kuis
SELECT k.judul, COUNT(s.id) AS peserta,
       AVG(s.nilai) AS rata_nilai
FROM kuis AS k
LEFT JOIN skor_kuis AS s ON s.kuis_id = k.id
GROUP BY k.judul;`,
        },
        {
          title: "Filter Laporan",
          body:
            "Tambahkan HAVING dan kondisi: siswa dengan rata-rata >= 80 (lulus), siswa yang mengikuti minimal 2 kuis, dan daftar siswa kelas 8A beserta nilainya. Latihan ini menggabungkan hampir semua konsep SQL.",
          code: `-- siswa dengan rata-rata >= 80
SELECT sw.nama, AVG(s.nilai) AS rata
FROM siswa AS sw
JOIN skor_kuis AS s ON s.siswa_id = sw.id
GROUP BY sw.nama
HAVING AVG(s.nilai) >= 80;

-- ikut minimal 2 kuis
SELECT sw.nama, COUNT(s.id) AS ikut
FROM siswa AS sw
JOIN skor_kuis AS s ON s.siswa_id = sw.id
GROUP BY sw.nama
HAVING COUNT(s.id) >= 2;

-- nilai siswa kelas 8A
SELECT sw.nama, k.judul, s.nilai
FROM siswa AS sw
JOIN skor_kuis AS s ON s.siswa_id = sw.id
JOIN kuis AS k ON s.kuis_id = k.id
WHERE sw.kelas = '8A';`,
        },
        {
          title: "Evaluasi & Pengembangan",
          body:
            "Evaluasi: pelajari hasil tiap query dan pastikan logika benar. Pengembangan lanjutan: subquery, window functions (RANK), indeks untuk performa, dan keamanan (parameterized query untuk mencegah SQL injection). Kamu sekarang bisa bekerja dengan database — keterampilan yang sangat dicari di industri.",
          code: `-- LANJUTAN: window function (rank)
SELECT
  sw.nama,
  s.nilai,
  RANK() OVER (ORDER BY s.nilai DESC) AS peringkat
FROM skor_kuis AS s
JOIN siswa AS sw ON s.siswa_id = sw.id
WHERE s.kuis_id = 1;

-- Keamanan: jangan pernah gabungkan input user
-- langsung ke query. Gunakan parameter (prepared statements).
-- BAD:  WHERE nama = '\${inputUser}'
-- GOOD: WHERE nama = ?  lalu isi parameter`,
        },
      ],
      quiz: [
        {
          q: "FOREIGN KEY digunakan untuk...",
          options: ["mengurutkan data", "menjamin referensi antar tabel valid", "mempercepat SELECT", "mengganti PRIMARY KEY"],
          answer: 1,
          explain: "FOREIGN KEY menjaga integritas hubungan antar tabel.",
        },
        {
          q: "Rata-rata nilai per siswa memakai...",
          options: ["JOIN + GROUP BY + AVG", "ORDER BY", "LIMIT", "LIKE"],
          answer: 0,
          explain: "Join tabel, group per siswa, lalu rata-rata dengan AVG.",
        },
        {
          q: "Mencegah SQL injection dilakukan dengan...",
          options: ["mengetik ulang input", "parameterized query / prepared statement", "memblokir user", "menghapus spasi"],
          answer: 1,
          explain: "Parameterized query memisahkan data dari perintah SQL.",
        },
      ],
    },
  ],
};