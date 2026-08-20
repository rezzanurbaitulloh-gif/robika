import type { CurriculumStack } from "../curriculum";

export const TYPESCRIPT_TRACK: CurriculumStack = {
  id: "typescript",
  name: "TypeScript",
  icon: "shield",
  description:
    "JavaScript dengan tipe statis — menangkap bug sebelum dijalankan. Standar industri untuk aplikasi web skala besar dan Next.js.",
  color: "blue",
  difficulty: "Menengah",
  modules: [
    {
      id: "ts-pengenalan",
      title: "Pengenalan TypeScript",
      minutes: 10,
      topics: [
        {
          title: "Apa itu TypeScript?",
          body:
            "TypeScript adalah superset JavaScript yang menambahkan tipe statis. Kode ditulis dalam .ts lalu dikompilasi menjadi JavaScript biasa. Tipe memungkinkan editor dan kompiler menangkap kesalahan sebelum program berjalan — misal memakai string saat fungsi membutuhkan number. Ini mengurangi bug dan membuat basis kode besar mudah dikelola.",
          code: `// TypeScript: kesalahan terdeteksi saat kompilasi
function sapa(nama: string) {
  return "Halo, " + nama;
}

sapa("Bimo");      // ok
sapa(42);          // error: 42 bukan string`,
        },
        {
          title: "Setup & tsc",
          body:
            "Instal compiler dengan npm install -g typescript, lalu kompilasi dengan tsc file.ts. tsconfig.json mengatur perilaku kompilasi: target, strict, outDir. strict: true menyalakan semua pemeriksaan ketat — selalu aktifkan. Framework seperti Next.js & Vite menangani kompilasi otomatis.",
          code: `// install
npm install -g typescript

// kompilasi
tsc program.ts        // menghasilkan program.js
tsc --init            // buat tsconfig.json

// tsconfig.json
{
  "compilerOptions": {
    "target\": \"ES2022",
    "strict": true,
    "outDir": "dist"
  }
}`,
        },
        {
          title: "Anotasi Tipe Dasar",
          body:
            "Anotasi ditulis nama: tipe. Tipe dasar: string, number, boolean, null, undefined. Parameter fungsi dan nilai kembali diberi anotasi. Tipe membantu dokumentasi — siapa pun bisa tahu bentuk data dari tanda tangannya.",
          code: `const nama: string = "Robika";
const umur: number = 12;
const aktif: boolean = true;

function tambah(a: number, b: number): number {
  return a + b;
}

function sapa(nama: string): string {
  return \`Halo \${nama}\`;
}`,
        },
        {
          title: "Inference",
          body:
            "TypeScript sering menebak tipe secara otomatis (inference) — tidak semua harus dianotasi. const x = 5 diinfer sebagai number. Anotasi ditulis saat nilainya tidak jelas (parameter, fungsi, objek). Kombinasi keduanya menghasilkan kode ekspresif sekaligus aman.",
          code: `const x = 5;            // otomatis: number
const teks = "halo";    // otomatis: string
const campuran = [1, "a", true];  // (string | number | boolean)[]

// anotasi dibutuhkan di sini
function hitung(a: number, b: number): number {
  return a * b;
}`,
        },
        {
          title: "Latihan: Tebak Tipe",
          body:
            "Latih inference: tebak tipe yang disimpulkan untuk const pi = 3.14; let nama = \"Robika\"; const daftar = [1, \"a\"]; const pasangan: [string, number] = [\"skor\", 90]. Verifikasi di editor dengan hover — TypeScript menampilkan tipe yang disimpulkan. Ini kebiasaan yang akan menajamkan intuisi tipemu.",
          code: `const pi = 3.14;                 // number
let nama = "Robika";            // string
const daftar = [1, "a"];        // (string | number)[]
const pasangan: [string, number] = ["skor", 90];

// hover variabel di editor:
// TypeScript menampilkan tipe yang disimpulkan
console.log(pi.toFixed(2));     // ok: number
console.log(nama.toUpperCase()); // ok: string`,
        },
      ],
      quiz: [
        {
          q: "TypeScript adalah...",
          options: ["bahasa terpisah dari JS", "superset JavaScript dengan tipe statis", "framework CSS", "database"],
          answer: 1,
          explain: "TypeScript menambah tipe statis di atas JavaScript dan dikompilasi ke JS.",
        },
        {
          q: "Perintah untuk mengompilasi file TS adalah...",
          options: ["tsc program.ts", "node program.ts", "compile program.ts", "ts program.ts"],
          answer: 0,
          explain: "tsc adalah compiler TypeScript.",
        },
        {
          q: "Anotasi tipe untuk teks adalah...",
          options: ["text", "string", "char", "str"],
          answer: 1,
          explain: "TypeScript memakai string untuk teks.",
        },
      ],
    },
    {
      id: "ts-tipe",
      title: "Tipe Lanjutan",
      minutes: 15,
      topics: [
        {
          title: "Union & Literal Type",
          body:
            "Union type (string | number) mengizinkan beberapa tipe — berguna untuk nilai yang fleksibel. Literal type mengunci nilai spesifik: \"pemula\" | \"menengah\". Persempit tipe dengan pemeriksaan typeof atau if agar TypeScript tahu jenis yang dipakai.",
          code: `type Level = "pemula" | "menengah" | "lanjut";

function setLevel(level: Level) {
  console.log("Level:", level);
}
setLevel("pemula");   // ok
setLevel("doktor");   // error: bukan literal yang diizinkan

function tampil(nilai: string | number) {
  if (typeof nilai === "string") {
    console.log(nilai.toUpperCase());
  } else {
    console.log(nilai.toFixed(2));
  }
}`,
        },
        {
          title: "Interface & Type Alias",
          body:
            "Interface mendeskripsikan bentuk objek: properti dan tipe. Type alias (type Nama = ...) juga bisa untuk union. Interface bisa di-extend. Keduanya membuat data terstruktur dan terdokumentasi — memodelkan user, level game, atau respon API.",
          code: `interface Karakter {
  nama: string;
  hp: number;
  skill?: string;         // opsional
}

interface Bos extends Karakter {
  reward: number;
}

const bimo: Karakter = { nama: "Bimo", hp: 100 };
const raja: Bos = { nama: "Raja", hp: 500, reward: 250 };

type ID = string | number;
function cari(id: ID): Karakter | undefined {
  return undefined;
}`,
        },
        {
          title: "Array & Tuple",
          body:
            "Tipe array: number[] atau Array<number>. Tuple adalah array dengan panjang & tipe tetap per posisi: [string, number]. Tuple berguna untuk pasangan data seperti [nama, skor]. Array boleh kosong; tuple tidak — struktur lebih kaku dan aman.",
          code: `const nilai: number[] = [80, 90, 75];
const nama: string[] = ["Bimo", "Sari"];

const pasangan: [string, number] = ["Bimo", 90];
console.log(pasangan[0]);   // "Bimo"

// error: tipe di posisi 1 salah
// const salah: [string, number] = [90, "Bimo"];`,
        },
        {
          title: "Enum & Konstanta Objek",
          body:
            "enum memberi nama untuk himpunan nilai terkait; const objek dengan as const memberi literal tipe ketat. Enum dan as const menghindari string ajaib (magic string) yang rawan salah ketik. Pilih salah satu — keduanya membuat kode lebih ekspresif.",
          code: `enum Warna {
  Merah = "merah",
  Hijau = "hijau",
  Biru = "biru",
}

const pilih = Warna.Hijau;

const STATUS = {
  Aktif: "aktif",
  Nonaktif: "nonaktif",
} as const;
type Status = (typeof STATUS)[keyof typeof STATUS];
// Status = "aktif" | "nonaktif"`,
        },
        {
          title: "Generics Dasar",
          body:
            "Generics membuat fungsi/komponen bekerja dengan banyak tipe tanpa kehilangan keamanan: function pertama<T>(arr: T[]): T. Tipe <T> ditentukan oleh pemanggil. Generics dipakai di array, promise, dan komponen React — inti library modern.",
          code: `function pertama<T>(arr: T[]): T | undefined {
  return arr[0];
}

const angka = pertama([1, 2, 3]);    // number | undefined
const teks = pertama(["a", "b"]);    // string | undefined

interface Kotak<T> {
  isi: T;
}
const kotakAngka: Kotak<number> = { isi: 42 };`,
        },
      ],
      quiz: [
        {
          q: "Tipe yang hanya menerima \"pemula\" | \"menengah\" | \"lanjut\" adalah...",
          options: ["union number", "literal type", "array", "generics"],
          answer: 1,
          explain: "Literal type mengunci nilai ke pilihan spesifik.",
        },
        {
          q: "Untuk mendeskripsikan bentuk objek, gunakan...",
          options: ["interface", "enum", "tuple", "typeof"],
          answer: 0,
          explain: "interface mendefinisikan struktur objek.",
        },
        {
          q: "Tipe array berisi bilangan bulat ditulis...",
          options: ["int[]", "number[]", "array<integer>", "num[]"],
          answer: 1,
          explain: "TypeScript memakai number[] untuk array angka.",
        },
      ],
    },
    {
      id: "ts-oop",
      title: "OOP & Module",
      minutes: 20,
      topics: [
        {
          title: "Kelas & Access Modifier",
          body:
            "Kelas TS mirip JS dengan tipe: class Karakter { nama: string; }. Access modifier: public (default), private (hanya dalam kelas), protected (kelas turunan). constructor menyimpan properti. Tipe parameter constructor membuat kode ringkas.",
          code: `class Karakter {
  private hp: number;
  constructor(private nama: string, hp = 100) {
    this.hp = hp;
  }
  serang(damage: number): void {
    this.hp -= damage;
    console.log(\`\${this.nama} HP \${this.hp}\`);
  }
  getHp(): number { return this.hp; }
}

const bimo = new Karakter("Bimo");
bimo.serang(30);
// console.log(bimo.hp)  // error: private`,
        },
        {
          title: "Inheritance & Abstract",
          body:
            "extends mewarisi kelas induk; override method dengan tanda sama. Kelas abstract tidak bisa di-instantiate langsung — hanya sebagai cetak biru dengan method abstract yang wajib diimplementasi turunannya. Ini memaksa struktur yang konsisten antar tipe.",
          code: `abstract class Hewan {
  constructor(public nama: string) {}
  abstract suara(): string;   // wajib di subclass
  info(): string { return \`\${this.nama} bersuara \${this.suara()}\`; }
}

class Kucing extends Hewan {
  suara(): string { return "meong"; }
}

class Anjing extends Hewan {
  suara(): string { return "guk"; }
}

const k = new Kucing("Momo");
console.log(k.info());   // Momo bersuara meong`,
        },
        {
          title: "Module: import / export",
          body:
            "Pisahkan kode ke file module: export interface/function/class, lalu import di tempat lain. Module menjaga batasan tanggung jawab dan mencegah konflik nama. Tipe bisa diexport juga. Gunakan named export atau default export secara konsisten.",
          code: `// karakter.ts
export interface Karakter { nama: string; hp: number; }
export function buatKarakter(nama: string): Karakter {
  return { nama, hp: 100 };
}

// main.ts
import { buatKarakter, type Karakter } from "./karakter";
const bimo: Karakter = buatKarakter("Bimo");
console.log(bimo.nama);   // Bimo`,
        },
        {
          title: "Type untuk API Response",
          body:
            "Tipe paling berguna untuk data dari API: definisikan interface respon lalu decode dengan aman. ini mencegah error properti tidak dikenal di seluruh aplikasi. Di Robika, tipe level, user, dan reward dimodelkan persis seperti ini.",
          code: `interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error?: string;
}

interface User {
  id: string;
  username: string;
  xp: number;
}

async function ambilUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/user/\${id}\`);
  return res.json() as Promise<ApiResponse<User>>;
}

// penggunaan — editor tahu bentuk data
const { data } = await ambilUser("abc");
if (data) console.log(data.username);`,
        },
        {
          title: "Utility Types",
          body:
            "Utility types memanipulasi tipe: Partial<T> semua opsional, Required<T> semua wajib, Pick<T, K> pilih properti, Omit<T, K> buang properti, Readonly<T> tidak bisa diubah, Record<K, V> peta kunci-nilai. Utility types mengurangi boilerplate drastis.",
          code: `interface User {
  id: string;
  nama: string;
  email: string;
}

type FormUser = Partial<Omit<User, "id">>;
// { nama?: string; email?: string; }

type Ringkas = Pick<User, "id" | "nama">;
type MapSkor = Record<string, number>;
const skor: MapSkor = { bimo: 90, sari: 85 };

const config = { debug: true } as const;
// config.debug = false  // error: readonly`,
        },
      ],
      quiz: [
        {
          q: "Modifier yang membatasi akses hanya dalam kelas adalah...",
          options: ["public", "private", "protected", "static"],
          answer: 1,
          explain: "private hanya bisa diakses dari dalam kelas itu.",
        },
        {
          q: "Kelas yang tidak bisa dibuat instance-nya langsung adalah...",
          options: ["final class", "abstract class", "static class", "sealed class"],
          answer: 1,
          explain: "Kelas abstract hanya menjadi cetak biru; harus diturunkan.",
        },
        {
          q: "Partial<User> berarti...",
          options: ["semua properti wajib", "semua properti opsional", "tipe kosong", "user read-only"],
          answer: 1,
          explain: "Partial membuat semua properti menjadi opsional.",
        },
      ],
    },
    {
      id: "ts-fp",
      title: "Functional Pattern",
      minutes: 20,
      topics: [
        {
          title: "Array Methods Ber-typed",
          body:
            "map, filter, reduce bekerja dengan tipe yang dikenali: .filter((n) => n % 2 === 0) menyimpulkan number[]. reduce menampung akumulator. TypeScript memastikan transformasi tidak merusak bentuk data — sumber bug utama di JS vanilla jadi hilang.",
          code: `const nilai: number[] = [80, 90, 75, 88];

const lulus = nilai.filter((n) => n >= 80);
// number[] — TS tahu ini angka

const naik = nilai.map((n) => n + 5);

const total = nilai.reduce((acc, n) => acc + n, 0);

const namaPanjang = ["Bimo", "Sari"].map((n) => n.toUpperCase());`,
        },
        {
          title: "Nullable & Optional Chaining",
          body:
            "Data bisa null/undefined. Optional chaining (?.) menghentikan akses bila nilai null; nullish coalescing (??) memberi default hanya untuk null/undefined (beda dari || yang juga menimpa 0/\"\"). strict mode memaksa menangani kemungkinan null — menghilangkan crash \"cannot read of undefined\".",
          code: `interface User { profil?: { nama?: string } }

const u: User = {};
console.log(u.profil?.nama?.toUpperCase());   // undefined (aman)

const nilai = null;
console.log(nilai ?? 0);       // 0
console.log(nilai || 0);       // 0

let x: number | undefined;
const aman = x ?? 10;          // 10
console.log(aman);`,
        },
        {
          title: "Type Guard & Narrowing",
          body:
            "Persempit tipe union dengan guard: typeof, in, instanceof, atau fungsi predikat x is Tipe. Guard memberitahu TypeScript jenis nilai pada cabang tertentu — memungkinkan kode aman tanpa cast paksa.",
          code: `function proses(v: string | number) {
  if (typeof v === "string") {
    return v.length;          // TS tahu v string
  }
  return v.toFixed(1);        // TS tahu v number
}

interface Kucing { meong(): void }
interface Anjing { guk(): void }

function suara(p: Kucing | Anjing) {
  if ("meong" in p) p.meong();
  else p.guk();
}`,
        },
        {
          title: "async/await dengan Tipe",
          body:
            "async function selalu mengembalikan Promise<T>. await menunggu Promise dan melepas nilai ber-tipe. TypeError async memastikan data yang diterima sesuai kontrak — fondasi aplikasi yang berkomunikasi dengan server.",
          code: `interface Skor { total: number; }

async function muatSkor(): Promise<Skor> {
  const res = await fetch("/api/skor");
  if (!res.ok) throw new Error("gagal");
  return (await res.json()) as Skor;
}

async function jalankan() {
  try {
    const skor = await muatSkor();
    console.log(skor.total.toFixed(0));
  } catch (err) {
    console.error((err as Error).message);
  }
}`,
        },
        {
          title: "Latihan: Utilitas dengan Tipe",
          body:
            "Gabungkan: buat fungsi generik, filter array dengan tipe, dan tangani nullable. Tulis util ambilLulus(nilai: number[], batas = 60): number[]; lalu fungsi rata(nilai: number[]): number | null untuk array kosong. Uji dengan berbagai input di playground.",
          code: `function ambilLulus(nilai: number[], batas = 60): number[] {
  return nilai.filter((n) => n >= batas);
}

function rata(nilai: number[]): number | null {
  if (nilai.length === 0) return null;
  return nilai.reduce((a, b) => a + b, 0) / nilai.length;
}

console.log(ambilLulus([80, 40, 90]));   // [80, 90]
console.log(rata([]));                   // null
console.log(rata([10, 20]) ?? 0);        // 15`,
        },
      ],
      quiz: [
        {
          q: "Operator yang memberikan default hanya saat nilai null/undefined adalah...",
          options: ["||", "&&", "??", "?."],
          answer: 2,
          explain: "?? (nullish coalescing) tidak menimpa 0 atau string kosong, hanya null/undefined.",
        },
        {
          q: "Akses properti bersarang yang aman dari null memakai...",
          options: ["optional chaining ?.", "try/catch", "??", "typeof"],
          answer: 0,
          explain: "?. menghentikan akses bila nilai sebelumnya null/undefined.",
        },
        {
          q: "reduce pada array number dengan nilai awal 0 menghasilkan...",
          options: ["array", "objek", "angka (akumulasi)", "promise"],
          answer: 2,
          explain: "reduce menjumlahkan/mengakumulasi elemen menjadi satu nilai.",
        },
      ],
    },
    {
      id: "ts-proyek",
      title: "Proyek Mini: Katalog Ber-tipe",
      minutes: 30,
      topics: [
        {
          title: "Desain Data",
          body:
            "Bangun katalog produk sederhana dengan tipe kuat. Definisikan interface Produk { id, nama, harga, stok, kategori }. Buat type Kategori sebagai literal. Data lengkap dan konsisten adalah nilai utama TypeScript — bug tipe terdeteksi sebelum runtime.",
          code: `type Kategori = "elektronik" | "buku" | "mainan";

interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: Kategori;
}

const katalog: Produk[] = [
  { id: 1, nama: "Smartphone", harga: 2500000, stok: 5, kategori: "elektronik" },
  { id: 2, nama: "Novel", harga: 85000, stok: 20, kategori: "buku" },
];`,
        },
        {
          title: "Fungsi Pencarian",
          body:
            "Buat fungsi cariByKategori(katalog, kategori): Produk[] dan cariByNama dengan toLowerCase. Optional filter harga. Return Produk[] yang pasti — callers tahu bentuk hasil. Tambahkan pencarian dengan kata kunci parsial.",
          code: `function cariByKategori(katalog: Produk[], kategori: Kategori): Produk[] {
  return katalog.filter((p) => p.kategori === kategori);
}

function cariByNama(katalog: Produk[], kata: string): Produk[] {
  const k = kata.toLowerCase();
  return katalog.filter((p) => p.nama.toLowerCase().includes(k));
}

function cariMurah(katalog: Produk[], maks: number): Produk[] {
  return katalog.filter((p) => p.harga <= maks);
}`,
        },
        {
          title: "Transaksi & Stok",
          body:
            "Beli produk: fungsi beli(katalog, id, jumlah): { ok: boolean; pesan: string } yang memeriksa stok, menguranginya, dan menghitung total. Gunakan Readonly untuk parameter katalog agar tidak termutasi tak sengaja. Struktur hasil dengan union untuk sukses/gagal.",
          code: `function beli(
  katalog: Produk[],
  id: number,
  jumlah: number,
): { ok: boolean; pesan: string } {
  const produk = katalog.find((p) => p.id === id);
  if (!produk) return { ok: false, pesan: "Produk tidak ditemukan" };
  if (produk.stok < jumlah) return { ok: false, pesan: "Stok tidak cukup" };
  produk.stok -= jumlah;
  return { ok: true, pesan: \`Total Rp \${produk.harga * jumlah}\` };
}

console.log(beli(katalog, 1, 2));   // Total Rp 5000000
console.log(beli(katalog, 1, 99));  // Stok tidak cukup`,
        },
        {
          title: "Rangkuman Stok",
          body:
            "Hitung total nilai inventori, daftar produk dengan stok rendah (<=3), dan jumlah per kategori. Gunakan reduce & Record<Kategori, number>. Data katalog bisa diganti data level, soal kuis, atau user — pola identik.",
          code: `function rangkuman(katalog: Produk[]) {
  const totalNilai = katalog.reduce((acc, p) => acc + p.harga * p.stok, 0);
  const stokMenipis = katalog.filter((p) => p.stok <= 3);
  const perKategori = katalog.reduce((acc, p) => {
    acc[p.kategori] = (acc[p.kategori] ?? 0) + 1;
    return acc;
  }, {} as Record<Kategori, number>);

  return { totalNilai, stokMenipis, perKategori };
}

console.log(rangkuman(katalog));`,
        },
        {
          title: "Pengujian & Pengembangan",
          body:
            "Uji fungsi dengan kasus: kategori kosong, nama tidak ditemukan, pembelian melebihi stok, dan array kosong — semuanya harus berperilaku aman tanpa error. Kembangkan: tampilkan harga format Rupiah, urutkan produk, atau hubungkan ke fetch API dengan tipe. Kamu kini terbiasa dengan pola pengembangan ber-tipe yang dipakai tim profesional di seluruh dunia.",
          code: `// test manual
console.log(cariByKategori(katalog, "buku"));    // [Novel]
console.log(cariByNama(katalog, "smart"));       // [Smartphone]
console.log(cariMurah(katalog, 100000));         // [Novel]

// pastikan fungsi aman untuk array kosong
console.log(cariByNama([], "x"));                // []`,
        },
      ],
      quiz: [
        {
          q: "Interface untuk objek produk paling tepat didefinisikan dengan...",
          options: ["interface Produk {...}", "const Produk = {...}", "type array", "enum Produk"],
          answer: 0,
          explain: "interface mendeskripsikan bentuk objek dengan properti ber-tipe.",
        },
        {
          q: "Hasil beli yang gagal karena stok kurang sebaiknya...",
          options: ["throw error", "return { ok: false, pesan }", "mengembalikan null", "diam"],
          answer: 1,
          explain: "Return object hasil (union) lebih aman daripada throw untuk alur bisnis normal.",
        },
        {
          q: "Menjumlahkan total harga * stok memakai metode array...",
          options: ["map", "filter", "reduce", "forEach"],
          answer: 2,
          explain: "reduce mengakumulasi semua elemen menjadi satu nilai.",
        },
      ],
    },
  ],
};