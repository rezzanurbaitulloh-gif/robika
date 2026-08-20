import type { CurriculumStack } from "../curriculum";

export const JAVA_TRACK: CurriculumStack = {
  id: "java",
  name: "Java",
  icon: "server",
  description:
    "Bahasa OOP klasik untuk Android, aplikasi enterprise, dan server. Menekankan struktur, keamanan tipe, dan portabilitas antar platform.",
  color: "orange",
  difficulty: "Menengah",
  modules: [
    {
      id: "java-pengenalan",
      title: "Pengenalan Java",
      minutes: 10,
      topics: [
        {
          title: "Apa itu Java?",
          body:
            "Java adalah bahasa pemrograman berorientasi objek (OOP) yang berjalan di Java Virtual Machine (JVM) — satu kode bisa jalan di Windows, Linux, dan macOS. Dipakai untuk Android, aplikasi bank, sistem enterprise, dan big data. Kekuatan utamanya: tipe kuat, ekosistem besar, dan keamanan.",
          code: `public class Halo {
  public static void main(String[] args) {
    System.out.println("Halo, dunia!");
  }
}

// kompilasi:  javac Halo.java   -> Halo.class
// jalankan:   java Halo         -> Halo, dunia!`,
        },
        {
          title: "Struktur Program",
          body:
            "Kode Java ditulis dalam class. Method main adalah titik masuk program: public static void main(String[] args). Setiap statement diakhiri titik koma ;. Blok kode dibungkus { }. Nama file harus sama dengan nama class publik.",
          code: `public class Biodata {
  public static void main(String[] args) {
    String nama = "Bimo";
    int umur = 12;
    System.out.println("Nama: " + nama);
    System.out.println("Umur: " + umur + " tahun");
  }
}

// output:
// Nama: Bimo
// Umur: 12 tahun`,
        },
        {
          title: "Variabel & Tipe Data",
          body:
            "Java adalah strongly-typed: setiap variabel wajib punya tipe. Tipe primitif: int (bilangan bulat), double (desimal), boolean (true/false), char (satu huruf). Tipe objek: String (teks). Deklarasi: tipe nama = nilai;",
          code: `int jumlah = 10;
double harga = 25000.5;
boolean aktif = true;
char huruf = 'A';
String nama = "Robika";

// perhitungan
int x = 7, y = 3;
System.out.println(x + y);  // 10
System.out.println(x / y);  // 2  (pembagian int)
System.out.println(x % y);  // 1  (sisa bagi)`,
        },
        {
          title: "Konvensi Penamaan",
          body:
            "Java punya konvensi kuat: class PascalCase (KelasMobil), variabel & method camelCase (hitungSkor), konstanta UPPER_SNAKE (MAX_SKOR). Nama yang jelas dan konsisten membuat kode mudah dibaca oleh tim mana pun di dunia.",
          code: `public class KalkulatorSkor {
  private static final int MAX_SKOR = 100;

  public static void main(String[] args) {
    int skorAwal = 80;
    int bonus = 15;
    int totalSkor = skorAwal + bonus;
    System.out.println("Total: " + totalSkor);
  }
}`,
        },
        {
          title: "Komentar & Output",
          body:
            "Komentar // satu baris, /* ... */ multi baris, /** ... */ Javadoc untuk dokumentasi otomatis. System.out.println menampilkan lalu baris baru; print tanpa baris baru; printf format. Komentar Javadoc bisa diubah jadi dokumentasi HTML resmi.",
          code: `/**
 * Kelas untuk menampilkan skor.
 * @author Bimo
 */
public class Skor {
  public static void main(String[] args) {
    System.out.print("Skor: ");
    System.out.println(90);
    System.out.printf("Nilai %.1f%n", 88.5);
  }
}`,
        },
      ],
      quiz: [
        {
          q: "Java dijalankan di atas...",
          options: ["browser", "JVM (Java Virtual Machine)", "terminal", "Node.js"],
          answer: 1,
          explain: "Java dikompilasi ke bytecode yang dijalankan JVM lintas platform.",
        },
        {
          q: "Titik masuk program Java adalah...",
          options: ["method main", "konstruktor", "method init", "class pertama"],
          answer: 0,
          explain: "public static void main(String[] args) memulai program.",
        },
        {
          q: "Tipe data untuk bilangan bulat adalah...",
          options: ["int", "double", "String", "boolean"],
          answer: 0,
          explain: "int untuk bilangan bulat; double untuk desimal.",
        },
      ],
    },
    {
      id: "java-kontrol",
      title: "Kontrol Alur",
      minutes: 15,
      topics: [
        {
          title: "Kondisi if-else",
          body:
            "if-else memilih alur berdasarkan kondisi boolean. Operator perbandingan: ==, !=, >, <, >=, <=. Operator logika: && (dan), || (atau), ! (tidak). Struktur yang rapi dan kurung benar mencegah logika salah.",
          code: `int skor = 85;

if (skor >= 90) {
  System.out.println("Grade A");
} else if (skor >= 80) {
  System.out.println("Grade B");
} else {
  System.out.println("Grade C");
}

boolean punyaKunci = true;
boolean bukaPintu = false;
if (punyaKunci && !bukaPintu) {
  System.out.println("Pintu dibuka");
}`,
        },
        {
          title: "Switch",
          body:
            "switch membandingkan satu nilai dengan banyak kasus — lebih rapi daripada rantai if-else. Tiap case diakhiri break (bila tidak, jatuh ke case berikutnya). default menangani nilai tak dikenal. Java modern mendukung switch expression.",
          code: `String hari = "Senin";
String hasil;

switch (hari) {
  case "Sabtu":
  case "Minggu":
    hasil = "Libur";
    break;
  case "Senin":
    hasil = "Mulai belajar";
    break;
  default:
    hasil = "Belajar";
}

System.out.println(hasil);   // Mulai belajar

// switch expression (Java 14+)
String kategori = switch (skor) {
  case 100 -> "Sempurna";
  case 90, 95 -> "Sangat baik";
  default -> "Baik";
};`,
        },
        {
          title: "Perulangan for",
          body:
            "for mengulang dengan hitungan pasti: for (inisialisasi; kondisi; langkah). Biasa untuk iterasi indeks 0..n-1. Break menghentikan, continue melompat ke iterasi berikutnya. Perulangan adalah dasar pengolahan kumpulan data.",
          code: `for (int i = 1; i <= 5; i++) {
  System.out.println("Iterasi ke-" + i);
}

// jumlah 1..10
int total = 0;
for (int i = 1; i <= 10; i++) {
  total += i;
}
System.out.println(total);   // 55

// break & continue
for (int i = 1; i <= 10; i++) {
  if (i == 3) continue;   // lewati 3
  if (i == 8) break;      // berhenti di 8
  System.out.print(i + " ");
}`,
        },
        {
          title: "While & Do-While",
          body:
            "while mengulang SELAMA kondisi benar — dipakai saat jumlah iterasi tak pasti (baca input sampai valid). do-while menjalankan minimal sekali dulu baru cek kondisi. Hati-hati infinite loop: pastikan kondisi berubah di dalam loop.",
          code: `// while: cek dulu, jalankan setelah
int n = 5;
while (n > 0) {
  System.out.println("n = " + n);
  n--;
}

// do-while: jalankan dulu, cek setelah
int tebakan = 0;
do {
  tebakan++;
} while (tebakan < 100);

System.out.println("Tebakan: " + tebakan);   // 100`,
        },
        {
          title: "Nested Loop & Pattern",
          body:
            "Loop bersarang (loop di dalam loop) untuk data 2 dimensi: matriks, tabel, pola bintang. Loop luar mengatur baris, loop dalam mengatur kolom. Ini juga dasar untuk game board dan permutasi.",
          code: `// pola segitiga
for (int i = 1; i <= 5; i++) {
  for (int j = 1; j <= i; j++) {
    System.out.print("*");
  }
  System.out.println();
}

// output:
// *
// **
// ***

// tabel perkalian 3x3
for (int i = 1; i <= 3; i++) {
  for (int j = 1; j <= 3; j++) {
    System.out.print((i * j) + "\\t");
  }
  System.out.println();
}`,
        },
      ],
      quiz: [
        {
          q: "Operator logika DAN adalah...",
          options: ["||", "&&", "!=", "&"],
          answer: 1,
          explain: "&& berarti DAN; || berarti ATAU.",
        },
        {
          q: "Untuk menghentikan perulangan segera, gunakan...",
          options: ["continue", "break", "stop", "exit"],
          answer: 1,
          explain: "break keluar dari perulangan; continue hanya melewati satu iterasi.",
        },
        {
          q: "Perulangan yang menjamin minimal satu kali eksekusi adalah...",
          options: ["for", "while", "do-while", "repeat"],
          answer: 2,
          explain: "do-while menjalankan badan dulu, baru memeriksa kondisi.",
        },
      ],
    },
    {
      id: "java-method",
      title: "Method & Array",
      minutes: 20,
      topics: [
        {
          title: "Membuat Method",
          body:
            "Method adalah blok kode yang bisa dipanggil ulang. Tanda tangan: akses, tipe kembali, nama, parameter. void berarti tidak mengembalikan nilai. Method memecah masalah besar menjadi fungsi kecil yang jelas.",
          code: `public class Matematika {
  public static int tambah(int a, int b) {
    return a + b;
  }

  public static void sapa(String nama) {
    System.out.println("Halo, " + nama);
  }

  public static void main(String[] args) {
    int hasil = tambah(3, 4);
    System.out.println(hasil);   // 7
    sapa("Bimo");
  }
}`,
        },
        {
          title: "Parameter & Return",
          body:
            "Parameter menerima input, return mengirim hasil ke pemanggil. Overloading: method dengan nama sama tapi parameter berbeda diperbolehkan. Return menghentikan eksekusi method — kode setelah return (tanpa kondisi) tak akan jalan.",
          code: `public static int max(int a, int b) {
  return a > b ? a : b;
}

// overloading
public static double tambah(double a, double b) {
  return a + b;
}
public static int tambah(int a, int b) {
  return a + b;
}

// multiple return di awal (guard clause)
public static int cekPositif(int n) {
  if (n < 0) return 0;
  return n;
}`,
        },
        {
          title: "Array Satu Dimensi",
          body:
            "Array menyimpan banyak nilai bertipe sama: int[] nilai = new int[5] atau int[] nilai = {1,2,3}. Indeks dimulai dari 0. length memberi panjang array. Iterasi dengan for biasa atau for-each.",
          code: `int[] nilai = { 80, 90, 75, 88 };

// akses & ubah
System.out.println(nilai[0]);   // 80
nilai[2] = 95;

// iterasi
for (int i = 0; i < nilai.length; i++) {
  System.out.print(nilai[i] + " ");
}
System.out.println();

// for-each
int total = 0;
for (int n : nilai) total += n;
System.out.println("Total: " + total);   // 353`,
        },
        {
          title: "Array Dua Dimensi",
          body:
            "Array 2D adalah array berisi array — model papan game, matriks, peta. Deklarasi: int[][] papan = new int[3][3]. Akses dengan [baris][kolom]. Loop bersarang mengisi dan membaca matriks.",
          code: `int[][] papan = new int[3][3];
papan[0][1] = 5;
papan[2][2] = 9;

// tampilkan matriks
for (int i = 0; i < papan.length; i++) {
  for (int j = 0; j < papan[i].length; j++) {
    System.out.print(papan[i][j] + " ");
  }
  System.out.println();
}

// diagonal
int sum = 0;
for (int i = 0; i < 3; i++) sum += papan[i][i];
System.out.println("Diagonal: " + sum);`,
        },
        {
          title: "String & Method-methodnya",
          body:
            "String adalah objek: length(), toUpperCase(), toLowerCase(), substring(), contains(), indexOf(), split(), replace(). compareTo untuk membandingkan. String immutable — method mengembalikan String baru.",
          code: `String s = "Robika Hebat";
System.out.println(s.length());       // 12
System.out.println(s.toUpperCase());  // ROBIKA HEBAT
System.out.println(s.substring(0, 6)); // Robika
System.out.println(s.contains("Hebat")); // true

String[] kata = s.split(" ");
System.out.println(kata[0]);   // Robika

// penting: bandingkan dengan equals, bukan ==
String a = "halo";
String b = "halo";
System.out.println(a.equals(b));   // true`,
        },
      ],
      quiz: [
        {
          q: "Method yang tidak mengembalikan nilai bertipe...",
          options: ["int", "void", "null", "empty"],
          answer: 1,
          explain: "void menandakan method tanpa nilai kembali.",
        },
        {
          q: "Indeks pertama array di Java adalah...",
          options: ["1", "0", "-1", "length"],
          answer: 1,
          explain: "Array di Java (dan kebanyakan bahasa) dimulai dari indeks 0.",
        },
        {
          q: "Membandingkan isi String memakai...",
          options: ["==", "equals()", "compare", "="],
          answer: 1,
          explain: "== membandingkan referensi; equals membandingkan isi.",
        },
      ],
    },
    {
      id: "java-oop",
      title: "OOP: Kelas & Objek",
      minutes: 25,
      topics: [
        {
          title: "Kelas & Objek",
          body:
            "Kelas adalah cetak biru; objek adalah hasil cetakannya. Kelas berisi field (data) dan method (perilaku). Buat objek dengan kata kunci new. Setiap objek punya data sendiri-sendiri dari blueprint yang sama.",
          code: `class Karakter {
  String nama;
  int hp;

  void serang(int damage) {
    hp -= damage;
    System.out.println(nama + " HP: " + hp);
  }
}

public class Main {
  public static void main(String[] args) {
    Karakter bimo = new Karakter();
    bimo.nama = "Bimo";
    bimo.hp = 100;
    bimo.serang(30);   // Bimo HP: 70
  }
}`,
        },
        {
          title: "Constructor & Encapsulation",
          body:
            "Constructor menyiapkan objek saat dibuat. Encapsulation: field private, akses lewat getter/setter — data hanya diubah lewat aturan yang aman. ini merujuk objek sekarang. Ini prinsip OOP inti untuk data aman.",
          code: `class Rekening {
  private int saldo;

  public Rekening(int saldoAwal) {
    this.saldo = saldoAwal;
  }

  public int getSaldo() { return saldo; }

  public void tarik(int jumlah) {
    if (jumlah <= saldo) {
      saldo -= jumlah;
    } else {
      System.out.println("Saldo tidak cukup");
    }
  }
}

Rekening r = new Rekening(50000);
r.tarik(20000);
System.out.println(r.getSaldo());   // 30000
// r.saldo = 0;  // error: private`,
        },
        {
          title: "Inheritance",
          body:
            "extends mewarisi field & method dari superclass. Override method dengan @Override untuk perilaku khusus. super() memanggil constructor induk. Polimorfisme: objek subclass bisa diperlakukan sebagai superclass.",
          code: `class Hewan {
  protected String nama;
  public Hewan(String nama) { this.nama = nama; }
  public void suara() {
    System.out.println("...");
  }
}

class Kucing extends Hewan {
  public Kucing(String nama) { super(nama); }
  @Override
  public void suara() {
    System.out.println(nama + ": meong");
  }
}

Hewan h = new Kucing("Momo");
h.suara();   // Momo: meong  (polimorfisme)`,
        },
        {
          title: "Abstract Class & Interface",
          body:
            "Abstract class: cetak biru parsial — method abstract wajib diimplementasi subclass. Interface: kontrak method yang harus dipenuhi, class bisa implements banyak interface. Java modern juga punya default method di interface.",
          code: `abstract class Bentuk {
  abstract double luas();

  void info() {
    System.out.println("Luas: " + luas());
  }
}

interface DapatGambar {
  void gambar();
}

class Lingkaran extends Bentuk implements DapatGambar {
  private double r;
  Lingkaran(double r) { this.r = r; }

  @Override
  double luas() { return Math.PI * r * r; }

  @Override
  public void gambar() {
    System.out.println("Menggambar lingkaran");
  }
}`,
        },
        {
          title: "ArrayList & Koleksi",
          body:
            "ArrayList adalah array dinamis — ukurannya bertambah otomatis. Method: add, get, set, remove, size, contains. import java.util.ArrayList. Dipakai hampir di semua program Java untuk daftar data yang berubah.",
          code: `import java.util.ArrayList;

ArrayList<String> daftar = new ArrayList<>();
daftar.add("Bimo");
daftar.add("Sari");
daftar.add("Doni");

System.out.println(daftar.size());        // 3
System.out.println(daftar.get(0));        // Bimo
daftar.set(1, "Rina");
daftar.remove("Doni");

for (String nama : daftar) {
  System.out.println(nama);
}`,
        },
      ],
      quiz: [
        {
          q: "Membuat objek dari kelas memakai kata kunci...",
          options: ["make", "new", "create", "init"],
          answer: 1,
          explain: "new NamaKelas() menginstansiasi objek.",
        },
        {
          q: "Menyembunyikan data internal dengan field private disebut...",
          options: ["inheritance", "encapsulation", "polymorphism", "overload"],
          answer: 1,
          explain: "Encapsulation membungkus data dan hanya memaparkan lewat method aman.",
        },
        {
          q: "Kontrak method yang wajib diimplementasi kelas pemakai adalah...",
          options: ["abstract class", "interface", "final class", "static method"],
          answer: 1,
          explain: "Interface mendefinisikan kontrak yang harus dipenuhi implementasinya.",
        },
      ],
    },
    {
      id: "java-proyek",
      title: "Proyek Mini: Bank Mini",
      minutes: 30,
      topics: [
        {
          title: "Desain Kelas",
          body:
            "Bangun sistem bank sederhana: kelas Rekening (saldo, nomor), Nasabah (nama, rekening), dan Bank (daftar nasabah). Desain dulu struktur class dan tanggung jawabnya sebelum menulis kode — fondasi OOP yang benar.",
          code: `class Rekening {
  private int saldo;

  public Rekening(int saldoAwal) {
    this.saldo = saldoAwal;
  }
  public int getSaldo() { return saldo; }
  public void setor(int jumlah) { saldo += jumlah; }
  public boolean tarik(int jumlah) {
    if (jumlah <= saldo) { saldo -= jumlah; return true; }
    return false;
  }
}

class Nasabah {
  private String nama;
  private Rekening rekening;

  public Nasabah(String nama, Rekening rekening) {
    this.nama = nama;
    this.rekening = rekening;
  }
  public String getNama() { return nama; }
  public Rekening getRekening() { return rekening; }
}`,
        },
        {
          title: "Operasi Bank",
          body:
            "Tambahkan method transaksi: setor, tarik (validasi saldo), transfer antar nasabah, dan cek saldo. Transfer memakai method tarik dari pengirim lalu setor ke penerima — dan gagal bila saldo tidak cukup. Validasi di semua titik mencegah saldo negatif.",
          code: `class Bank {
  private ArrayList<Nasabah> nasabahs = new ArrayList<>();

  public void daftar(Nasabah n) {
    nasabahs.add(n);
  }

  public boolean transfer(Nasabah dari, Nasabah ke, int jumlah) {
    if (dari.getRekening().tarik(jumlah)) {
      ke.getRekening().setor(jumlah);
      return true;
    }
    return false;
  }

  public void info(Nasabah n) {
    System.out.println(n.getNama() + ": Rp " + n.getRekening().getSaldo());
  }
}`,
        },
        {
          title: "Menu Interaktif",
          body:
            "Gunakan Scanner untuk input pengguna dan perulangan do-while untuk menu: 1) setor, 2) tarik, 3) cek saldo, 4) keluar. switch mengarahkan pilihan. Validasi input salah agar program tidak crash.",
          code: `import java.util.Scanner;

Scanner in = new Scanner(System.in);
int pilihan;

do {
  System.out.println("1. Setor");
  System.out.println("2. Tarik");
  System.out.println("3. Cek saldo");
  System.out.println("4. Keluar");
  pilihan = in.nextInt();

  switch (pilihan) {
    case 1:
      System.out.print("Jumlah: ");
      int setor = in.nextInt();
      rekening.setor(setor);
      break;
    case 2:
      System.out.print("Jumlah: ");
      int tarik = in.nextInt();
      if (!rekening.tarik(tarik)) {
        System.out.println("Saldo tidak cukup");
      }
      break;
    case 3:
      System.out.println("Saldo: Rp " + rekening.getSaldo());
      break;
  }
} while (pilihan != 4);
in.close();`,
        },
        {
          title: "Validasi & Keamanan",
          body:
            "Perkuat sistem: tolak setor/tarik negatif atau nol, sediakan history transaksi (ArrayList<String>), dan beri pesan jelas. Validasi sederhana ini mencerminkan aturan bisnis yang wajib dijaga di aplikasi keuangan sungguhan.",
          code: `class Rekening {
  private int saldo;
  private ArrayList<String> riwayat = new ArrayList<>();

  public void setor(int jumlah) {
    if (jumlah <= 0) {
      System.out.println("Jumlah harus positif");
      return;
    }
    saldo += jumlah;
    riwayat.add("Setor +Rp" + jumlah);
  }

  public boolean tarik(int jumlah) {
    if (jumlah <= 0 || jumlah > saldo) {
      System.out.println("Penarikan gagal");
      return false;
    }
    saldo -= jumlah;
    riwayat.add("Tarik -Rp" + jumlah);
    return true;
  }

  public void tampilRiwayat() {
    for (String t : riwayat) System.out.println(t);
  }
}`,
        },
        {
          title: "Evaluasi & Pengembangan",
          body:
            "Evaluasi: uji alur setor, tarik berhasil, tarik gagal, dan transfer. Kembangkan: kelas abstrak BankProduk untuk tabungan dan deposito, interface Bunga dengan hitungBunga(), atau simpan data ke file. Kamu kini memahami OOP Java yang menjadi dasar Android dan aplikasi enterprise.",
          code: `// lanjutan: interface bunga
interface Bunga {
  double hitungBunga(int saldo);
}

class Tabungan extends Rekening implements Bunga {
  public Tabungan(int awal) { super(awal); }
  @Override
  public double hitungBunga(int saldo) {
    return saldo * 0.03;   // 3%
  }
}

// pola yang sama dipakai di framework
// Spring Boot (backend) dan Android (mobile)`,
        },
      ],
      quiz: [
        {
          q: "Validasi tarik harus memastikan...",
          options: ["jumlah besar", "jumlah <= saldo", "jumlah ganjil", "saldo negatif"],
          answer: 1,
          explain: "Tarik hanya diizinkan bila jumlah tidak melebihi saldo.",
        },
        {
          q: "Input pengguna dibaca dengan...",
          options: ["System.out", "Scanner", "BufferedReader saja", "JOptionPane saja"],
          answer: 1,
          explain: "Scanner adalah cara umum membaca input di Java.",
        },
        {
          q: "Pilihan menu dengan banyak kasus paling rapi memakai...",
          options: ["if bertingkat", "switch", "for", "recursion"],
          answer: 1,
          explain: "switch lebih rapi untuk banyak pilihan tetap.",
        },
      ],
    },
  ],
};