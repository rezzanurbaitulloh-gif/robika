import type { CurriculumStack } from "../curriculum";

export const PHP_TRACK: CurriculumStack = {
  id: "php",
  name: "PHP",
  icon: "globe",
  description:
    "Bahasa server paling populer untuk web dinamis — ditenagai WordPress, Laravel, dan jutaan situs. Dari form sederhana hingga aplikasi besar.",
  color: "indigo",
  difficulty: "Pemula",
  modules: [
    {
      id: "php-pengenalan",
      title: "Pengenalan PHP",
      minutes: 10,
      topics: [
        {
          title: "Apa itu PHP?",
          body:
            "PHP (Hypertext Preprocessor) adalah bahasa pemrograman yang berjalan DI SERVER untuk membuat halaman web dinamis. PHP memproses permintaan, membaca database, lalu mengirim HTML hasil ke browser. Ditenagai sekitar 75% web — termasuk WordPress. Bekerja sama dengan HTML: PHP di dalam tag <?php ?>.",
          code: `<?php
$nama = "Bimo";
echo "Halo, $nama!";
?>
<!-- Output ke browser: Halo, Bimo! -->`,
        },
        {
          title: "Setup & Menjalankan",
          body:
            "PHP butuh server (Apache/Nginx) atau server bawaan: php -S localhost:8000. File .php diakses lewat browser; kode PHP dieksekusi server, hasilnya dikirim sebagai HTML. Kesalahan umum: lupa membuka server atau menulis di file .html.",
          code: `// jalankan server bawaan
php -S localhost:8000

// buka di browser
// http://localhost:8000/index.php

<?php
// ini dikerjakan di server
$harga = 25000;
echo "Rp " . number_format($harga);
?>`,
        },
        {
          title: "Variabel & Tipe",
          body:
            "Variabel PHP diawali tanda $ dan tidak perlu deklarasi tipe: $nama, $umur, $harga. Tipe umum: string, int, float, bool, array, null. Konkatenasi dengan titik (.). Interpolasi langsung dalam string kutip ganda.",
          code: `<?php
$nama = "Bimo";          // string
$umur = 12;              // int
$tinggi = 1.55;          // float
$aktif = true;           // bool

echo "Nama: $nama";                  // Nama: Bimo
echo "Umur: " . $umur . " tahun";    // Umur: 12 tahun
echo "Tinggi: $tinggi m";            // Tinggi: 1.55 m

$nama .= " Setiawan";    // gabung
echo $nama;              // Bimo Setiawan
?>`,
        },
        {
          title: "Operator",
          body:
            "Operator aritmetika: + - * / % **. Perbandingan: == (sama nilai), === (sama nilai DAN tipe), !=, !==, >, <, >=, <=. Logika: && (and), || (or), ! (not). PHP fleksibel namun === mencegah bug perbandingan longgar (\"5\" == 5 bernilai true).",
          code: `<?php
$a = 10; $b = 3;
echo $a + $b;   // 13
echo $a % $b;   // 1
echo $a ** 2;   // 100

var_dump("5" == 5);    // bool(true)  nilai sama
var_dump("5" === 5);   // bool(false) tipe beda

$skor = 85;
$lulus = $skor >= 80 && $skor <= 100;
echo $lulus ? "Lulus" : "Tidak";
?>`,
        },
        {
          title: "Echo, Print & Debug",
          body:
            "echo menampilkan satu/lebih nilai; print serupa namun mengembalikan 1. var_dump menampilkan tipe dan nilai — alat debug utama. print_r untuk array/objek lebih ringkas. Kombinasikan dengan HTML untuk halaman dinamis.",
          code: `<?php
$nilai = [80, 90, 75];

echo "Halo", " ", "dunia";   // Halo dunia

var_dump($nilai);
// array(3) { [0]=> int(80) [1]=> int(90) [2]=> int(75) }

print_r($nilai);
// Array ( [0] => 80 [1] => 90 [2] => 75 )
?>`,
        },
      ],
      quiz: [
        {
          q: "Kode PHP dieksekusi di...",
          options: ["browser", "server", "database", "editor"],
          answer: 1,
          explain: "PHP berjalan di server dan mengirim HTML hasil ke browser.",
        },
        {
          q: "Variabel PHP diawali dengan...",
          options: ["var", "$", "@", "#"],
          answer: 1,
          explain: "Semua variabel PHP diawali tanda dollar ($).",
        },
        {
          q: "Operator yang membandingkan nilai DAN tipe adalah...",
          options: ["==", "=", "===", "!="],
          answer: 2,
          explain: "=== membandingkan nilai dan tipe sekaligus.",
        },
      ],
    },
    {
      id: "php-kontrol",
      title: "Kontrol Alur & Array",
      minutes: 15,
      topics: [
        {
          title: "if-else & Switch",
          body:
            "if-else mengarahkan alur; switch untuk banyak pilihan tetap; operator ternary (kondisi ? ya : tidak) dan null coalescing ?? untuk nilai default ringkas. Kombinasikan dengan HTML untuk konten bersyarat.",
          code: `<?php
$skor = 88;

if ($skor >= 90) {
  echo "Grade A";
} elseif ($skor >= 80) {
  echo "Grade B";
} else {
  echo "Grade C";
}

$hari = "Sabtu";
switch ($hari) {
  case "Sabtu":
  case "Minggu":
    echo "Libur";
    break;
  default:
    echo "Belajar";
}

$status = $skor >= 80 ? "Lulus" : "Ulangi";
echo $status;
?>`,
        },
        {
          title: "Array Indeks",
          body:
            "Array menyimpan daftar nilai: [80, 90, 75]. Akses dengan indeks 0,1,2... count() panjang, foreach untuk iterasi, array_push tambah, unset hapus, in_array cek ada. Array PHP fleksibel dan sangat sering dipakai.",
          code: `<?php
$nilai = [80, 90, 75];
echo $nilai[1];          // 90

$nilai[] = 95;           // tambah di akhir
echo count($nilai);      // 4

foreach ($nilai as $n) {
  echo "$n ";
}                        // 80 90 75 95

echo in_array(90, $nilai) ? "Ada" : "Tidak";   // Ada
?>`,
        },
        {
          title: "Array Asosiatif",
          body:
            "Array asosiatif memakai kunci string: [\"nama\" => \"Bimo\", \"skor\" => 90]. Ideal untuk memodelkan data (user, produk, settings). Iterasi dengan foreach ($arr as $kunci => $nilai). Dipakai juga sebagai hasil dari query database.",
          code: `<?php
$user = [
  "nama\" => \"Bimo",
  "kelas\" => \"8A",
  "skor" => 90,
];

echo $user["nama"];          // Bimo
$user["skor"] = 95;          // ubah

foreach ($user as $kunci => $nilai) {
  echo "$kunci: $nilai\\n";
}

// array multidimensi
$siswa = [
  ["nama" => "Bimo", "skor" => 90],
  ["nama" => "Sari", "skor" => 85],
];
echo $siswa[1]["nama"];      // Sari
?>`,
        },
        {
          title: "Fungsi",
          body:
            "function nama($param) { ... } — fungsi menerima parameter, mengembalikan nilai dengan return, dan bisa punya default parameter. Variabel di luar fungsi tidak otomatis terlihat di dalam (scope). Type hint memberi tipe parameter dan return.",
          code: `<?php
function tambah(int $a, int $b): int {
  return $a + $b;
}

function sapa(string $nama = "Teman"): string {
  return "Halo, $nama!";
}

function rata(array $nilai): float {
  if (count($nilai) === 0) return 0;
  return array_sum($nilai) / count($nilai);
}

echo tambah(3, 4);        // 7
echo sapa("Bimo");        // Halo, Bimo!
echo sapa();              // Halo, Teman!
echo rata([80, 90, 70]);  // 80
?>`,
        },
        {
          title: "Fungsi String & Array Bawaan",
          body:
            "PHP punya ratusan fungsi bawaan. String: strlen, strtoupper, strtolower, substr, str_replace, explode, implode, trim. Array: count, sort, array_sum, array_push, array_key_exists, array_map. Menghafal yang sering dipakai menghemat waktu drastis.",
          code: `<?php
$teks = "  Robika Hebat  ";
echo strlen(trim($teks));          // 12
echo strtoupper($teks);            // ROBIKA HEBAT
echo substr("Robika", 0, 3);       // Rob

$kata = explode(" ", "Robika Hebat");
echo implode("-", $kata);          // Robika-Hebat

$angka = [5, 3, 8, 1];
sort($angka);
print_r($angka);                   // [1, 3, 5, 8]

$dikali = array_map(fn($n) => $n * 2, $angka);
echo array_sum($dikali);           // 34
?>`,
        },
      ],
      quiz: [
        {
          q: "Iterasi semua elemen array paling mudah memakai...",
          options: ["for", "foreach", "while", "do"],
          answer: 1,
          explain: "foreach menelusuri seluruh elemen array tanpa menghitung indeks.",
        },
        {
          q: "Array dengan kunci \"nama\" => \"Bimo\" disebut...",
          options: ["array indeks", "array asosiatif", "array multidimensi", "objek"],
          answer: 1,
          explain: "Kunci string menandai array asosiatif.",
        },
        {
          q: "Fungsi untuk menjumlahkan semua elemen array adalah...",
          options: ["sum()", "array_sum()", "total()", "count()"],
          answer: 1,
          explain: "array_sum menjumlahkan nilai-nilai array.",
        },
      ],
    },
    {
      id: "php-form",
      title: "Form & Request",
      minutes: 20,
      topics: [
        {
          title: "GET & POST",
          body:
            "PHP menerima input lewat $_GET (URL) dan $_POST (body form). GET untuk pencarian/baca (terlihat di URL), POST untuk data sensitif/perubahan (login, simpan). Superglobals tersedia di semua script.",
          code: `<?php
// URL: /cari.php?q=python
$q = $_GET["q"] ?? "";
echo "Mencari: " . htmlspecialchars($q);

// dari form POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nama = $_POST["nama"] ?? "";
  echo "Halo, $nama";
}
?>`,
        },
        {
          title: "Form HTML + PHP",
          body:
            "Buat form di HTML dengan action menunjuk file PHP dan method post. Di server, proses $_POST, validasi, lalu kirim balasan. Satu file bisa memuat form DAN logikanya dengan memeriksa REQUEST_METHOD.",
          code: `<?php
$hasil = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nama = trim($_POST["nama"] ?? "");
  $umur = (int)($_POST["umur"] ?? 0);
  if ($nama === "") {
    $hasil = "Nama wajib diisi";
  } else {
    $hasil = "Selamat datang, $nama ($umur tahun)";
  }
}
?>
<form method="post">
  <label>Nama <input name="nama" required /></label>
  <label>Umur <input name="umur" type="number" /></label>
  <button>Kirim</button>
</form>
<p><?= htmlspecialchars($hasil) ?></p>`,
        },
        {
          title: "Validasi Input",
          body:
            "Selalu validasi dan bersihkan input: trim hapus spasi, strlen cek panjang, filter_var untuk email/URL, is_numeric untuk angka, (int) cast. Halaman yang menerima input tanpa validasi adalah sumber utama bug dan serangan.",
          code: `<?php
$email = trim($_POST["email"] ?? "");

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo "Email tidak valid";
}

$umur = (int)($_POST["umur"] ?? 0);
if ($umur < 7 || $umur > 17) {
  echo "Umur di luar rentang";
}

$username = trim($_POST["username"] ?? "");
if (strlen($username) < 3 || strlen($username) > 20) {
  echo "Username 3-20 karakter";
}
?>`,
        },
        {
          title: "Keamanan: XSS & Escaping",
          body:
            "XSS terjadi saat input user dirender sebagai HTML tanpa pembersihan — attacker bisa menyuntik script. Selalu escape output dengan htmlspecialchars($data, ENT_QUOTES) sebelum ditampilkan. Jangan pernah percaya input user. Ini aturan keamanan #1 web.",
          code: `<?php
// BAHAYA: tampilkan input mentah
// echo $_GET["q"];   // <script>alert(1)</script> tereksekusi

// AMAN: escape sebelum tampil
$q = $_GET["q"] ?? "";
echo htmlspecialchars($q, ENT_QUOTES, "UTF-8");
?>
<!--
  htmlspecialchars mengubah < > & " '
  menjadi entitas &lt; &gt; &amp; &quot; &#039;
  sehingga browser tidak mengeksekusinya
-->`,
        },
        {
          title: "Redirect & Session",
          body:
            "Setelah proses sukses (login, simpan), redirect dengan header(\"Location: ...\") + exit — mencegah resubmit form. Session (session_start, $_SESSION) menyimpan status login antar halaman. Session adalah cara PHP mengingat pengguna.",
          code: `<?php
session_start();

// simpan status login
$_SESSION["user_id"] = 42;
$_SESSION["nama"] = "Bimo";

// redirect setelah proses
header("Location: /dashboard.php");
exit;

// di halaman lain: cek login
if (isset($_SESSION["user_id"])) {
  echo "Masuk sebagai " . $_SESSION["nama"];
} else {
  header("Location: /login.php");
  exit;
}
?>`,
        },
      ],
      quiz: [
        {
          q: "Data dari form dengan method post diakses lewat...",
          options: ["$_GET", "$_POST", "$_FILE", "$_FORM"],
          answer: 1,
          explain: "$_POST memuat data body form method post.",
        },
        {
          q: "Mencegah XSS dilakukan dengan...",
          options: ["menghapus input", "htmlspecialchars saat menampilkan", "menyimpan di database", "menggunakan POST"],
          answer: 1,
          explain: "Escape output dengan htmlspecialchars agar script tidak tereksekusi.",
        },
        {
          q: "Menyimpan status login antar halaman memakai...",
          options: ["$_COOKIE saja", "$_SESSION", "$_ENV", "$_SERVER"],
          answer: 1,
          explain: "$_SESSION menyimpan data sesi antar halaman setelah session_start.",
        },
      ],
    },
    {
      id: "php-database",
      title: "PHP & MySQL (PDO)",
      minutes: 25,
      topics: [
        {
          title: "Koneksi PDO",
          body:
            "PDO adalah cara modern terhubung ke MySQL di PHP. Buat koneksi dengan DSN, user, password. Set error mode exception agar kesalahan tampak jelas. Satu koneksi PDO dipakai untuk semua operasi database.",
          code: `<?php
$dsn = "mysql:host=localhost;dbname=robika;charset=utf8mb4";
$user = "root";
$pass = "rahasia";

try {
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  ]);
  echo "Terhubung";
} catch (PDOException $e) {
  die("Gagal: " . $e->getMessage());
}
?>`,
        },
        {
          title: "Prepared Statement",
          body:
            "JANGAN PERNAH menggabungkan input user langsung ke query (SQL injection). Gunakan prepared statement: query dengan placeholder ? lalu bind nilai. PDO menyiapkan query dan database memisahkan data dari perintah — aman secara bawaan.",
          code: `<?php
// BAHAYA — SQL injection
// $sql = "SELECT * FROM siswa WHERE nama = '$nama'";

// AMAN — prepared statement
$sql = "SELECT * FROM siswa WHERE nama = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$nama]);
$siswa = $stmt->fetchAll();

// dengan nama placeholder
$sql = "SELECT * FROM siswa WHERE nama = :nama AND kelas = :kelas";
$stmt = $pdo->prepare($sql);
$stmt->execute([":nama" => $nama, ":kelas" => "8A"]);
?>`,
        },
        {
          title: "CRUD Lengkap",
          body:
            "CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Dengan PDO prepared statement, keempatnya aman. fetchAll mengambil semua baris; fetch satu baris; rowCount jumlah baris terpengaruh; lastInsertId id terakhir.",
          code: `<?php
// CREATE
$stmt = $pdo->prepare(
  "INSERT INTO siswa (nama, kelas, skor) VALUES (?, ?, ?)"
);
$stmt->execute([$nama, $kelas, $skor]);
$idBaru = $pdo->lastInsertId();

// READ
$stmt = $pdo->query("SELECT * FROM siswa ORDER BY skor DESC");
$semua = $stmt->fetchAll();

// UPDATE
$stmt = $pdo->prepare("UPDATE siswa SET skor = ? WHERE id = ?");
$stmt->execute([$skorBaru, $id]);

// DELETE
$stmt = $pdo->prepare("DELETE FROM siswa WHERE id = ?");
$stmt->execute([$id]);
?>`,
        },
        {
          title: "Menampilkan Data di Halaman",
          body:
            "Tampilkan hasil query dalam tabel HTML memakai foreach. Selalu escape output dengan htmlspecialchars. Tambahkan link aksi (edit/hapus) dengan id di URL — namun jangan pernah hapus/ubah hanya berdasarkan id URL tanpa otorisasi.",
          code: `<?php
$stmt = $pdo->query("SELECT * FROM siswa ORDER BY skor DESC");
$siswa = $stmt->fetchAll();
?>
<table>
  <tr><th>Nama</th><th>Kelas</th><th>Skor</th></tr>
  <?php foreach ($siswa as $s): ?>
  <tr>
    <td><?= htmlspecialchars($s["nama"]) ?></td>
    <td><?= htmlspecialchars($s["kelas"]) ?></td>
    <td><?= (int)$s["skor"] ?></td>
  </tr>
  <?php endforeach; ?>
</table>`,
        },
        {
          title: "Form ke Database",
          body:
            "Gabungkan semuanya: form tambah siswa -> validasi -> INSERT via prepared statement -> redirect -> daftar terbaru. Alur lengkap ini adalah pola inti aplikasi web dinamis — dari WordPress sampai Laravel.",
          code: `<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nama = trim($_POST["nama"] ?? "");
  $kelas = trim($_POST["kelas"] ?? "");
  $skor = (int)($_POST["skor"] ?? 0);

  if ($nama !== "" && $kelas !== "") {
    $stmt = $pdo->prepare(
      "INSERT INTO siswa (nama, kelas, skor) VALUES (?, ?, ?)"
    );
    $stmt->execute([$nama, $kelas, $skor]);
    header("Location: daftar.php");
    exit;
  }
}
?>
<form method="post">
  <input name="nama" placeholder="Nama" required />
  <input name="kelas" placeholder="Kelas" required />
  <input name="skor" type="number" min="0" max="100" required />
  <button>Simpan</button>
</form>`,
        },
      ],
      quiz: [
        {
          q: "Cara aman menjalankan query dengan input user adalah...",
          options: ["gabung string langsung", "prepared statement dengan placeholder", "menghapus tanda kutip", "encode URL"],
          answer: 1,
          explain: "Prepared statement memisahkan data dari query — mencegah SQL injection.",
        },
        {
          q: "Mengambil SEMUA baris hasil query memakai...",
          options: ["fetch()", "fetchAll()", "getAll()", "row()"],
          answer: 1,
          explain: "fetchAll mengembalikan seluruh baris sebagai array.",
        },
        {
          q: "SQL injection dicegah dengan...",
          options: ["input type=password", "prepared statement", "htmlspecialchars", "trim"],
          answer: 1,
          explain: "Prepared statement membuat input tidak pernah menjadi bagian perintah SQL.",
        },
      ],
    },
    {
      id: "php-proyek",
      title: "Proyek Mini: Buku Tamu",
      minutes: 30,
      topics: [
        {
          title: "Desain & Skema",
          body:
            "Buat aplikasi buku tamu: tabel tamu (id, nama, pesan, dibuat_at), halaman form untuk menambah, halaman daftar menampilkan semua. Buat dulu skema database dengan SQL dan siapkan file project terpisah untuk keterbacaan.",
          code: `CREATE TABLE tamu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  pesan TEXT NOT NULL,
  dibuat_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// struktur project
// index.php   -> form + daftar
// config.php  -> koneksi database
// tambah.php  -> proses simpan (redirect)`,
        },
        {
          title: "config.php",
          body:
            "Pisahkan koneksi database ke file sendiri dan include di semua halaman. Satu tempat untuk mengubah kredensial. require memastikan file dimuat sekali; require_once mencegah duplikasi.",
          code: `<?php
// config.php
$dsn = "mysql:host=localhost;dbname=robika;charset=utf8mb4";
$pdo = new PDO($dsn, "root", "rahasia", [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
?>`,
        },
        {
          title: "Form & Simpan",
          body:
            "Form kirim nama dan pesan via POST. Di server: trim, validasi minimal 2 karakter, INSERT dengan prepared statement, lalu redirect ke index agar form tidak terkirim ulang saat refresh. Tampilkan pesan sukses via query string atau flash session.",
          code: `<?php
require "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nama = trim($_POST["nama"] ?? "");
  $pesan = trim($_POST["pesan"] ?? "");

  if (strlen($nama) >= 2 && strlen($pesan) >= 2) {
    $stmt = $pdo->prepare(
      "INSERT INTO tamu (nama, pesan) VALUES (?, ?)"
    );
    $stmt->execute([$nama, $pesan]);
    header("Location: index.php?status=ok");
    exit;
  }
  $error = "Nama dan pesan minimal 2 karakter";
}
?>
<form method="post">
  <input name="nama" placeholder="Nama" required />
  <textarea name="pesan" rows="4" required></textarea>
  <button>Tulis</button>
</form>
<?php if (isset($error)): ?><p><?= htmlspecialchars($error) ?></p><?php endif; ?>`,
        },
        {
          title: "Daftar Tamu",
          body:
            "Tampilkan semua pesan terbaru dulu (ORDER BY dibuat_at DESC). Setiap entri: nama, tanggal, pesan — semua di-escape. Tambahkan penanda bila kosong. Tampilkan pesan sukses bila status=ok di URL.",
          code: `<?php
require "config.php";
$stmt = $pdo->query(
  "SELECT * FROM tamu ORDER BY dibuat_at DESC"
);
$daftar = $stmt->fetchAll();
?>
<?php if (isset($_GET["status"]) && $_GET["status"] === "ok"): ?>
  <p>Pesan berhasil ditambahkan!</p>
<?php endif; ?>

<?php if (count($daftar) === 0): ?>
  <p>Belum ada pesan. Jadilah yang pertama!</p>
<?php else: ?>
  <?php foreach ($daftar as $t): ?>
  <div class="entri">
    <strong><?= htmlspecialchars($t["nama"]) ?></strong>
    <small><?= htmlspecialchars($t["dibuat_at"]) ?></small>
    <p><?= nl2br(htmlspecialchars($t["pesan"])) ?></p>
  </div>
  <?php endforeach; ?>
<?php endif; ?>`,
        },
        {
          title: "Evaluasi & Pengembangan",
          body:
            "Evaluasi: cek XSS (kirim <script> sebagai pesan — harus tampil sebagai teks), cek SQL injection (nama berisi ' — harus aman), dan cek form resubmit. Kembangkan: pagination, hapus/edit dengan konfirmasi, rate limit, atau migrasi ke framework Laravel yang menangani semua ini secara bawaan.",
          code: `// pengujian keamanan
// 1. Kirim:  <script>alert(1)</script>
//    Hasil:  tampil sebagai teks (aman, karena escape)
// 2. Kirim:  x' OR '1'='1
//    Hasil:  tidak merusak query (prepared statement)
// 3. Refresh setelah submit
//    Hasil:  tidak menambah duplikat (redirect)

// lanjutan: Laravel (framework PHP terpopuler)
// Route::post('/tamu', ...);
// Model::create($validated);
// validation: required|min:2`,
        },
      ],
      quiz: [
        {
          q: "Mencegah form terkirim ulang saat refresh memakai...",
          options: ["session_start", "redirect setelah proses", "disable tombol", "POST saja"],
          answer: 1,
          explain: "Redirect setelah proses (PRG) mencegah resubmit pada refresh.",
        },
        {
          q: "Menampilkan pesan dengan baris baru memakai fungsi...",
          options: ["nl2br()", "htmlspecialchars()", "trim()", "substr()"],
          answer: 0,
          explain: "nl2br mengubah baris baru menjadi tag <br>.",
        },
        {
          q: "Mengurutkan data terbaru dulu memakai...",
          options: ["ORDER BY dibuat_at DESC", "LIMIT 1", "GROUP BY", "WHERE baru"],
          answer: 0,
          explain: "ORDER BY ... DESC menampilkan yang terbaru di atas.",
        },
      ],
    },
  ],
};