import type { CurriculumStack } from "../curriculum";

export const JAVASCRIPT_TRACK: CurriculumStack = {
  id: "javascript",
  name: "JavaScript",
  icon: "code",
  description:
    "Bahasa pemrograman web paling populer. Dari dasar hingga membangun aplikasi — jalan menuju frontend, backend (Node.js), dan game.",
  color: "amber",
  difficulty: "Pemula",
  modules: [
    {
      id: "js-pengenalan",
      title: "Pengenalan JavaScript",
      minutes: 10,
      topics: [
        {
          title: "Apa itu JavaScript?",
          body:
            "JavaScript adalah bahasa pemrograman yang membuat halaman web menjadi hidup — menghitung, merespons klik, memuat data, dan menggambar game. Bersama HTML (struktur) dan CSS (tampilan), JavaScript (perilaku) adalah satu dari tiga fondasi web. JavaScript juga berjalan di luar browser melalui Node.js, sehingga bisa membangun server, bot, dan aplikasi desktop. Bahasa ini bersifat interpreted: kode dijalankan baris per baris oleh mesin (engine) seperti V8 di Chrome, tanpa perlu dikompilasi terlebih dahulu.",
          code: `// Program pertama
console.log("Halo, dunia!");
console.log(2 + 3); // 5`,
        },
        {
          title: "Cara Menjalankan JavaScript",
          body:
            "Cara termudah: buka browser (Chrome/Firefox), tekan F12, pilih tab Console, lalu ketik kode dan tekan Enter. Di dalam file HTML, tulis kode di dalam tag <script>. Untuk proyek serius, gunakan Node.js di terminal dengan perintah `node nama_file.js`. Setiap cara menjalankan memberi hasil yang sama — hanya lingkungannya yang berbeda.",
          code: `<script>
  console.log("Dijalankan dari HTML");
</script>

// Terminal:
// node program.js`,
        },
        {
          title: "Sintaks Dasar",
          body:
            "Setiap instruksi disebut statement dan diakhiri titik koma (opsional tapi disarankan). JavaScript peka huruf besar-kecil: namaVariabel berbeda dengan NamaVariabel. Program dibaca dari atas ke bawah. Spasi dan baris baru tidak penting untuk hasil, tapi penting untuk keterbacaan. Gunakan komentar // untuk satu baris dan /* */ untuk banyak baris agar kode mudah dipahami.",
          code: `const nama = "Robika";  // deklarasi konstan
let umur = 12;           // variabel yang bisa diubah

console.log(nama);       // Robika
console.log(umur + 5);   // 17

/* Ini komentar
   banyak baris */`,
        },
        {
          title: "Membaca Kesalahan (Error)",
          body:
            "Saat kode salah, console menampilkan pesan error: ReferenceError (variabel belum didefinisikan), SyntaxError (sintaks salah, misal tanda kurung tidak ditutup), atau TypeError (memakai nilai dengan cara yang salah). Baris pertama pesan error menjelaskan masalahnya dan menunjukkan lokasi file:baris. Membaca error dengan tenang adalah keterampilan utama programmer — bukan tanda kegagalan.",
          code: `console.log(namaSalah);
// ReferenceError: namaSalah is not defined

console.log("tanda kurung belum ditutup";
// SyntaxError: missing ) after argument list`,
        },
        {
          title: "Latihan: Konsol",
          body:
            "Buka console browser atau Node, lalu jalankan: console.log(\"Nama saya ...\"); console.log(\"Umur saya ...\"); lalu hitung console.log(25 * 4); dan console.log(\"Robika \" + \"belajar JS\");. Perhatikan bagaimana + menggabungkan teks dan menghitung angka. Jika semua muncul tanpa error, kamu sudah siap melanjutkan ke variabel.",
          code: `console.log("Nama saya Bimo");
console.log("Umur saya 12");
console.log(25 * 4);              // 100
console.log("Robika " + "hebat"); // Robika hebat`,
        },
      ],
      quiz: [
        {
          q: "JavaScript terutama digunakan untuk apa di halaman web?",
          options: ["Membuat perilaku interaktif", "Menentukan warna teks", "Menyusun paragraf", "Menyimpan file di server"],
          answer: 0,
          explain: "HTML menyusun struktur, CSS mengatur tampilan, JavaScript mengatur perilaku/aksi.",
        },
        {
          q: "Apa hasil dari console.log(2 + 3 * 4);?",
          options: ["20", "14", "24", "9"],
          answer: 1,
          explain: "Perkalian dihitung lebih dulu: 3*4=12, lalu 2+12=14.",
        },
        {
          q: "Pesan 'ReferenceError: x is not defined' muncul karena...",
          options: ["x bernilai null", "variabel x belum didefinisikan", "x terlalu besar", "sintaks titik koma hilang"],
          answer: 1,
          explain: "ReferenceError berarti nama yang dipakai tidak ditemukan — variabel belum didefinisikan.",
        },
      ],
    },
    {
      id: "js-variabel",
      title: "Variabel & Tipe Data",
      minutes: 15,
      topics: [
        {
          title: "let, const, dan var",
          body:
            "Variabel adalah kotak penyimpanan bernama. `let` membuat variabel yang nilainya boleh diubah. `const` membuat nilai tetap (tidak bisa di-assign ulang). `var` adalah cara lama yang sebaiknya dihindari karena ruang lingkupnya membingungkan. Aturan penamaan: boleh huruf, angka, $, _; tidak boleh diawali angka; gunakan camelCase (namaPanjang). Pilih nama yang jelas — nama variabel adalah dokumentasi pertama kode kamu.",
          code: `let skor = 0;
skor = skor + 10;   // boleh diubah
console.log(skor);  // 10

const nama = "Robika";
// nama = "Lain";  // ERROR: const tidak bisa diubah

var lama = 1;       // hindari var`,
        },
        {
          title: "Tipe Data: String & Number",
          body:
            "String adalah teks dalam tanda kutip ('...' atau \"...\"). Number adalah angka, termasuk desimal. Operasi + pada dua angka menjumlahkan; + pada string menggabungkan. Jika angka bertemu string dengan +, angka diubah menjadi string (konkatenasi). Ini sering mengecoh pemula — perhatikan hasilnya.",
          code: `const teks = "Halo";
const angka = 42;
const desimal = 3.14;

console.log(teks + " dunia"); // Halo dunia
console.log(angka + 1);       // 43
console.log(angka + "1");     // "421" (bukan 43!)
console.log("5" * 2);         // 10 (perkalian mengubah ke angka)`,
        },
        {
          title: "Boolean, null, dan undefined",
          body:
            "Boolean hanya bernilai true atau false — hasil perbandingan. undefined berarti variabel dideklarasikan tapi belum diberi nilai. null adalah nilai kosong yang disengaja. Keduanya berbeda: undefined otomatis, null dipilih programmer. typeof memeriksa tipe sebuah nilai dan berguna saat debugging.",
          code: `const menang = true;
const kalah = false;
let belumDiisi;
console.log(belumDiisi);     // undefined
const kosong = null;         // sengaja kosong

console.log(typeof 42);      // number
console.log(typeof "teks");  // string
console.log(typeof true);    // boolean`,
        },
        {
          title: "Template Literal",
          body:
            "Template literal memakai backtick (`) dan memungkinkan menyisipkan ekspresi dengan ${...} serta menulis teks multi-baris. Ini cara modern dan paling mudah dibaca untuk menggabungkan variabel ke dalam kalimat — jauh lebih rapi daripada rentetan tanda +.",
          code: `const nama = "Ayu";
const umur = 13;

console.log(\`Halo, nama saya \${nama}, umur \${umur} tahun.\`);
// Halo, nama saya Ayu, umur 13 tahun.

console.log(\`Baris pertama
baris kedua\`);`,
        },
        {
          title: "Konversi Tipe",
          body:
            "Kadang perlu mengubah tipe secara sengaja: Number(\"12\") mengubah string menjadi angka, String(12) sebaliknya, Boolean(0) menghasilkan false (0, null, undefined, \"\", NaN adalah falsy; yang lain truthy). Konversi diperlukan saat membaca input dari form yang selalu berupa string.",
          code: `const input = "12";        // dari form, selalu string
const total = Number(input) + 8;
console.log(total);          // 20

console.log(String(12) + "!"); // "12!"
console.log(Boolean(0));       // false
console.log(Boolean("Robika"));// true`,
        },
      ],
      quiz: [
        {
          q: "Manakah yang TIDAK boleh diubah nilainya setelah dibuat?",
          options: ["let", "const", "var", "semua bisa diubah"],
          answer: 1,
          explain: "const membuat nilai tetap — assignment ulang akan error.",
        },
        {
          q: "Apa hasil dari console.log(10 + \"5\");?",
          options: ["15", "\"105\"", "105", "Error"],
          answer: 1,
          explain: "+ antara number dan string mengubah angka menjadi string lalu menggabungkan: \"105\".",
        },
        {
          q: "Nilai yang termasuk falsy adalah...",
          options: ["\"0\"", "[]", "0", "\"false\""],
          answer: 2,
          explain: "0 adalah falsy. \"0\", array kosong, dan \"false\" adalah truthy.",
        },
      ],
    },
    {
      id: "js-kontrol",
      title: "Operator & Kontrol Alur",
      minutes: 20,
      topics: [
        {
          title: "Operator Aritmetika & Perbandingan",
          body:
            "Operator aritmetika: + - * / % (sisa bagi) dan ** (pangkat). Operator perbandingan menghasilkan boolean: == (sama, dengan konversi tipe), === (sama persis — wajib dipakai), !=, !==, >, <, >=, <=. Aturan emas: selalu gunakan === dan !== agar perbandingan tidak mengecoh.",
          code: `console.log(7 % 3);    // 1 (sisa bagi)
console.log(2 ** 4);   // 16 (pangkat)
console.log(5 == "5"); // true  (konversi tipe)
console.log(5 === "5");// false (tipe berbeda!)
console.log(3 >= 3);   // true`,
        },
        {
          title: "Operator Logika",
          body:
            "&& (dan), || (atau), ! (negasi) menggabungkan kondisi. a && b benar jika keduanya benar; a || b benar jika salah satunya benar. Logika && lebih dulu dihitung daripada ||. Operator logika juga mengembalikan nilai (short-circuit): hasilnya nilai terakhir yang dievaluasi — bukan selalu boolean.",
          code: `const umur = 15;
const punyaKTP = true;

console.log(umur >= 17 && punyaKTP); // false
console.log(umur >= 15 || punyaKTP); // true
console.log(!punyaKTP);              // false

console.log(0 || "fallback");   // "fallback"
console.log("A" && "B");        // "B"`,
        },
        {
          title: "if / else if / else",
          body:
            "Percabangan menjalankan blok kode sesuai kondisi. Sintaks: if (kondisi) { ... } else if (kondisi2) { ... } else { ... }. Kondisi di dalam tanda kurung diubah menjadi boolean (truthy/falsy). Blok else if boleh sebanyak-banyaknya, else hanya sekali dan menangkap semua yang tersisa. Jaga urutan dari kondisi paling spesifik ke paling umum.",
          code: `const nilai = 85;

if (nilai >= 90) {
  console.log("Nilai A");
} else if (nilai >= 75) {
  console.log("Nilai B");
} else if (nilai >= 60) {
  console.log("Nilai C");
} else {
  console.log("Belum lulus");
}
// Output: Nilai B`,
        },
        {
          title: "switch dan Ternary",
          body:
            "switch membandingkan satu nilai dengan banyak kasus — lebih rapi daripada rantai if untuk pilihan tetap. Operator ternary kondisi ? nilaiJikaBenar : nilaiJikaSalah adalah if pendek satu baris untuk nilai. Gunakan ternary hanya untuk kasus sederhana agar tetap terbaca.",
          code: `const hari = "senin";

switch (hari) {
  case "senin":
  case "selasa":
    console.log("Belajar");
    break;
  case "minggu":
    console.log("Libur");
    break;
  default:
    console.log("Biasa saja");
}

const umur = 17;
const status = umur >= 17 ? "Dewasa" : "Anak";
console.log(status); // Dewasa`,
        },
        {
          title: "Latihan: Kuis Nilai",
          body:
            "Gabungkan semua konsep: buat variabel nilaiUjian, tulis if/else yang mencetak lulus (>=60) atau tidak, lalu gunakan operator % untuk mengecek apakah sebuah angka genap (angka % 2 === 0). Uji dengan beberapa nilai berbeda dan periksa hasilnya di console.",
          code: `const nilaiUjian = 78;
console.log(nilaiUjian >= 60 ? "Lulus" : "Tidak lulus");

const angka = 12;
if (angka % 2 === 0) {
  console.log("Genap");
} else {
  console.log("Ganjil");
}

if (nilaiUjian >= 80 && angka % 2 === 0) {
  console.log("Kamu hebat dan angkanya genap!");
}`,
        },
      ],
      quiz: [
        {
          q: "Manakah perbandingan yang benar-benar sama?",
          options: ["5 == \"5\"", "5 === \"5\"", "5 === 5", "\"5\" === 5"],
          answer: 2,
          explain: "=== memeriksa nilai DAN tipe. 5 dan \"5\" berbeda tipe, jadi hanya 5 === 5 yang benar.",
        },
        {
          q: "Apa hasil dari (false || true) && !false ?",
          options: ["false", "true", "undefined", "error"],
          answer: 1,
          explain: "false||true = true, !false = true, true && true = true.",
        },
        {
          q: "Untuk memilih satu nilai dari beberapa kasus tetap, struktur paling rapi adalah...",
          options: ["switch", "if tanpa else", "ternary", "loop"],
          answer: 0,
          explain: "switch dirancang untuk membandingkan satu nilai terhadap banyak kasus.",
        },
      ],
    },
    {
      id: "js-perulangan",
      title: "Perulangan & Array",
      minutes: 20,
      topics: [
        {
          title: "for Loop",
          body:
            "Perulangan mengulang blok kode. for (inisialisasi; kondisi; update) { ... } — misal for (let i = 0; i < 5; i++) mengulang 5 kali. i mulai 0, berhenti saat i mencapai 5. Hindari perulangan tanpa henti (kondisi tak pernah false) karena akan membekukan program. Pola ini adalah fondasi pemrosesan data.",
          code: `for (let i = 0; i < 5; i++) {
  console.log("Ulangi ke-" + i);
}
// ke-0, ke-1, ke-2, ke-3, ke-4

for (let n = 10; n >= 1; n -= 2) {
  console.log(n); // 10, 8, 6, 4, 2
}`,
        },
        {
          title: "while dan do-while",
          body:
            "while (kondisi) mengecek kondisi sebelum menjalankan blok — bisa tidak dijalankan sama sekali. do { ... } while (kondisi) menjalankan blok minimal sekali, baru mengecek. Gunakan while saat jumlah perulangan tidak diketahui sebelumnya (misal menunggu input valid), dan for saat jumlahnya sudah jelas.",
          code: `let dadu = 0;
let lempar = 0;
while (dadu !== 6) {
  dadu = Math.floor(Math.random() * 6) + 1;
  lempar++;
}
console.log("Dapat 6 setelah " + lempar + " lemparan");

let x = 5;
do {
  console.log("Selalu jalan sekali: " + x);
  x++;
} while (x < 3);`,
        },
        {
          title: "break dan continue",
          body:
            "break menghentikan perulangan sepenuhnya; continue melompat ke iterasi berikutnya. Keduanya berguna untuk menghemat kerja: berhenti lebih awal saat jawaban ditemukan, atau melewati nilai yang tidak relevan. Gunakan dengan bijak agar alur tetap mudah dibaca.",
          code: `for (let i = 1; i <= 10; i++) {
  if (i === 4) continue;  // lewati 4
  if (i === 8) break;     // berhenti di 8
  console.log(i);         // 1,2,3,5,6,7
}

// cari angka pertama yang habis dibagi 7
for (let i = 1; i <= 100; i++) {
  if (i % 7 === 0) {
    console.log("Ketemu: " + i);
    break;
  }
}`,
        },
        {
          title: "Array Dasar",
          body:
            "Array adalah daftar nilai berurutan: [nilai1, nilai2, ...]. Indeks dimulai dari 0. arr.length memberi jumlah elemen. push menambah di akhir, pop menghapus di akhir, shift/unshift di awal. for-of mengiterasi elemen dengan rapi. Array adalah struktur data paling penting di JavaScript.",
          code: `const buah = ["apel", "mangga", "jeruk"];
console.log(buah[0]);        // apel
console.log(buah.length);    // 3

buah.push("pisang");
console.log(buah);           // [apel, mangga, jeruk, pisang]
buah.pop();
console.log(buah.length);    // 3

for (const item of buah) {
  console.log("Buah: " + item);
}`,
        },
        {
          title: "Latihan: Menjumlahkan Array",
          body:
            "Buat array nilai [80, 90, 75, 88]. Jumlahkan semua elemen dengan for, hitung rata-rata, lalu cetak. Perluas: temukan nilai tertinggi dengan membandingkan setiap elemen. Ini pola yang muncul terus-menerus dalam analisis data dan game (skor, nyawa, inventaris).",
          code: `const nilai = [80, 90, 75, 88];
let total = 0;
for (let i = 0; i < nilai.length; i++) {
  total += nilai[i];
}
const rata = total / nilai.length;
console.log("Total: " + total);      // 333
console.log("Rata-rata: " + rata);   // 83.25

let tertinggi = nilai[0];
for (const n of nilai) {
  if (n > tertinggi) tertinggi = n;
}
console.log("Tertinggi: " + tertinggi); // 90`,
        },
      ],
      quiz: [
        {
          q: "Berapa kali blok for (let i = 0; i < 3; i++) dijalankan?",
          options: ["2", "3", "4", "tak hingga"],
          answer: 1,
          explain: "i = 0,1,2 — tiga kali. Saat i = 3 kondisi 3<3 salah, loop berhenti.",
        },
        {
          q: "Perintah yang menghentikan perulangan sepenuhnya adalah...",
          options: ["continue", "break", "return (di luar fungsi)", "skip"],
          answer: 1,
          explain: "break menghentikan loop; continue hanya melewati iterasi saat ini.",
        },
        {
          q: "Indeks elemen pertama sebuah array adalah...",
          options: ["1", "-1", "0", "length"],
          answer: 2,
          explain: "Array di JavaScript (dan hampir semua bahasa) diindeks mulai dari 0.",
        },
      ],
    },
    {
      id: "js-fungsi",
      title: "Fungsi, Objek & Scope",
      minutes: 25,
      topics: [
        {
          title: "Mendeklarasikan Fungsi",
          body:
            "Fungsi adalah blok kode bernama yang bisa dipanggil ulang: function nama(parameter) { ... } lalu nama(argumen). Fungsi menghindari pengulangan kode dan membuat program terstruktur. Parameter adalah kotak saat definisi; argumen adalah nilai saat dipanggil. Fungsi tanpa return mengembalikan undefined.",
          code: `function sapa(nama) {
  console.log("Halo, " + nama + "!");
}
sapa("Budi");   // Halo, Budi!
sapa("Sari");   // Halo, Sari!

function tambah(a, b) {
  return a + b;
}
const hasil = tambah(3, 4);
console.log(hasil); // 7`,
        },
        {
          title: "Arrow Function",
          body:
            "Arrow function adalah cara singkat: const nama = (a, b) => a + b;. Dengan satu parameter boleh tanpa kurung: x => x * 2. Tanpa blok {}, hasil ekspresi langsung dikembalikan. Arrow function menjadi standar modern JavaScript — terutama untuk callback dan array methods.",
          code: `const kali = (a, b) => a * b;
console.log(kali(4, 5));   // 20

const lipat = x => x * 2;
console.log(lipat(9));     // 18

const nilai = [1, 2, 3, 4];
const genap = nilai.filter(n => n % 2 === 0);
console.log(genap);        // [2, 4]`,
        },
        {
          title: "Parameter Default & Rest",
          body:
            "Parameter default memberi nilai awal bila argumen tidak diberikan: function sapa(nama = \"Teman\") { }. Rest parameter ...args menampung semua argumen sisa sebagai array — berguna untuk fungsi yang menerima banyak nilai. Default parameter menghindari error undefined yang sering terjadi.",
          code: `function sapa(nama = "Teman") {
  console.log("Halo, " + nama + "!");
}
sapa();        // Halo, Teman!
sapa("Rina");  // Halo, Rina!

function jumlahkan(...angka) {
  let total = 0;
  for (const n of angka) total += n;
  return total;
}
console.log(jumlahkan(1, 2, 3));    // 6
console.log(jumlahkan(10, 20, 30, 40)); // 100`,
        },
        {
          title: "Objek & Method",
          body:
            "Objek mengelompokkan data (properti) dan perilaku (method) dalam satu entitas: { nama: \"Bimo\", umur: 12, sapa() {...} }. Akses properti dengan titik obj.nama atau kurung obj[\"nama\"]. this merujuk objek pemilik method. Objek adalah cara utama menyimpan data terstruktur — satu karakter game, satu pengguna, satu pesanan.",
          code: `const karakter = {
  nama: "Bimo",
  hp: 100,
  serang(kerusakan) {
    this.hp -= kerusakan;
    console.log(this.nama + " kena serangan! HP " + this.hp);
  },
  heal(berapa) {
    this.hp += berapa;
    console.log(this.nama + " pulih ke HP " + this.hp);
  },
};

karakter.serang(30); // Bimo kena serangan! HP 70
karakter.heal(20);   // Bimo pulih ke HP 90`,
        },
        {
          title: "Scope & Closures Dasar",
          body:
            "Scope menentukan di mana variabel terlihat. Variabel let/const di dalam blok {} hanya terlihat di dalam blok itu (block scope); var melampaui blok (hindari). Fungsi dalam (closure) mengingat variabel fungsi luar bahkan setelah fungsi luar selesai — dasar dari banyak pola JavaScript tingkat lanjut.",
          code: `let global = "terlihat di mana saja";

function coba() {
  let lokal = "hanya di dalam fungsi";
  console.log(global); // OK
  // console.log(lokal); // di luar fungsi: ERROR
}

function pembuatPencacah() {
  let hitung = 0;
  return function () {
    hitung++;
    return hitung;
  };
}
const pencacah = pembuatPencacah();
console.log(pencacah()); // 1
console.log(pencacah()); // 2
console.log(pencacah()); // 3`,
        },
      ],
      quiz: [
        {
          q: "Apa nilai yang dikembalikan fungsi tanpa return?",
          options: ["null", "0", "undefined", "error"],
          answer: 2,
          explain: "Fungsi tanpa return mengembalikan undefined secara otomatis.",
        },
        {
          q: "const lipat = x => x * 2; — berapa lipat(5)?",
          options: ["10", "25", "5", "undefined"],
          answer: 0,
          explain: "Arrow function tanpa blok langsung mengembalikan hasil ekspresi: 5*2=10.",
        },
        {
          q: "Cara mengakses properti nama dari objek karakter adalah...",
          options: ["karakter->nama", "karakter[nama]", "karakter.nama", "nama.karakter"],
          answer: 2,
          explain: "Notasi titik: objek.properti. Notasi kurung juga bisa: karakter[\"nama\"].",
        },
      ],
    },
    {
      id: "js-proyek",
      title: "Proyek Mini: Pengelola Tugas (To-Do CLI)",
      minutes: 30,
      topics: [
        {
          title: "Rencana Proyek",
          body:
            "Kita membangun aplikasi pengelola tugas yang berjalan di console/Node. Fitur: menambah tugas, menandai selesai, menghapus, dan menampilkan daftar. Ini melatih semua materi: variabel, fungsi, array, objek, perulangan, dan percabangan — persis pola yang dipakai aplikasi sungguhan. Tulis fungsi kecil-kecil yang fokus satu tugas.",
          code: `// Struktur data: satu tugas = satu objek
// { id: 1, nama: "Belajar JS", selesai: false }

const tugasList = [];   // array menampung semua tugas
let idBerikutnya = 1;`,
        },
        {
          title: "Menambah & Menampilkan Tugas",
          body:
            "Buat fungsi tambahTugas(nama) yang mendorong objek baru ke array dan menambah id otomatis. Buat tampilkanTugas() yang mencetak daftar dengan nomor, nama, dan status [x] / [ ]. Gunakan for-of atau forEach untuk iterasi. Konsistensi format membuat output mudah dibaca.",
          code: `function tambahTugas(nama) {
  tugasList.push({ id: idBerikutnya, nama, selesai: false });
  idBerikutnya++;
}

function tampilkanTugas() {
  console.log("=== DAFTAR TUGAS ===");
  for (const t of tugasList) {
    const status = t.selesai ? "[x]" : "[ ]";
    console.log(\`\${status} \${t.id}. \${t.nama}\`);
  }
}

tambahTugas("Belajar variabel");
tambahTugas("Kerjakan kuis");
tampilkanTugas();`,
        },
        {
          title: "Menandai Selesai & Menghapus",
          body:
            "SelesaiTugas(id) mencari tugas berdasarkan id lalu mengubah properti selesai menjadi true. HapusTugas(id) menghapus elemen dari array menggunakan filter — membuat array baru tanpa elemen yang id-nya cocok. Kedua fungsi memakai parameter id, bukan indeks, agar aman saat daftar berubah.",
          code: `function selesaiTugas(id) {
  const tugas = tugasList.find(t => t.id === id);
  if (tugas) {
    tugas.selesai = true;
    console.log("Tugas selesai: " + tugas.nama);
  } else {
    console.log("Tugas tidak ditemukan.");
  }
}

function hapusTugas(id) {
  const index = tugasList.findIndex(t => t.id === id);
  if (index !== -1) {
    tugasList.splice(index, 1);
    console.log("Tugas dihapus.");
  }
}

selesaiTugas(1);
tampilkanTugas();
hapusTugas(2);`,
        },
        {
          title: "Ringkasan Tugas",
          body:
            "Tambahkan fungsi ringkasan() yang menghitung jumlah total dan jumlah yang sudah selesai. Ini contoh membaca data dengan perulangan dan menyajikan statistik — pola yang sama untuk skor game, nilai ujian, atau inventaris. Coba perluas: persentase selesai, atau urutkan tugas yang belum selesai di atas.",
          code: `function ringkasan() {
  let selesai = 0;
  for (const t of tugasList) {
    if (t.selesai) selesai++;
  }
  const total = tugasList.length;
  console.log(
    \`Ringkasan: \${selesai}/\${total} selesai (\${Math.round((selesai / total) * 100)}%)\`
  );
}

ringkasan();`,
        },
        {
          title: "Pengujian & Pengembangan Lanjut",
          body:
            "Uji semua fungsi dengan urutan: tambah beberapa tugas, tampilkan, tandai satu selesai, hapus satu, tampilkan lagi. Pastikan tidak ada error dan id tidak terduplikasi. Pengembangan lanjut yang bisa dicoba: menyimpan data ke file dengan fs (Node), menambah prioritas, atau membuat versi web dengan DOM. Selamat — kamu baru saja menyelesaikan aplikasi JavaScript pertamamu!",
          code: `tambahTugas("Belajar perulangan");
tambahTugas("Buat proyek mini");
selesaiTugas(1);
hapusTugas(2);
tampilkanTugas();
ringkasan();
// [x] 1. Belajar perulangan
// Ringkasan: 1/1 selesai (100%)`,
        },
      ],
      quiz: [
        {
          q: "Fungsi yang menambah elemen di akhir array adalah...",
          options: ["push", "pop", "shift", "slice"],
          answer: 0,
          explain: "push menambah di akhir; pop menghapus di akhir; shift menghapus di awal.",
        },
        {
          q: "Untuk menghapus tugas berdasarkan id, metode array yang paling tepat adalah...",
          options: ["filter", "push", "concat", "join"],
          answer: 0,
          explain: "filter membuat array baru tanpa elemen yang tidak diinginkan — aman dan deklaratif.",
        },
        {
          q: "Apa output dari \"Halo\" + 5 di JavaScript?",
          options: ["Halo5", "Halo 5", "Error", "5Halo"],
          answer: 0,
          explain: "Operator + dengan string mengubah angka menjadi string lalu menggabungkan: \"Halo5\".",
        },
      ],
    },
  ],
};