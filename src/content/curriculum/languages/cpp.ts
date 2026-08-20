import type { CurriculumStack } from "../curriculum";

export const CPP_TRACK: CurriculumStack = {
  id: "cpp",
  name: "C++",
  icon: "settings",
  description:
    "Bahasa berkinerja tinggi untuk game, sistem operasi, dan aplikasi real-time. Kendali penuh atas memori dengan kecepatan maksimal.",
  color: "rose",
  difficulty: "Menengah",
  modules: [
    {
      id: "cpp-pengenalan",
      title: "Pengenalan C++",
      minutes: 10,
      topics: [
        {
          title: "Apa itu C++?",
          body:
            "C++ adalah bahasa berkinerja tinggi yang memberi kendali dekat dengan perangkat keras. Dipakai untuk game (Unreal Engine), sistem operasi, browser, dan aplikasi real-time. Kompilasi langsung ke kode mesin — sangat cepat. C++ adalah evolusi C dengan tambahan OOP dan pustaka standar.",
          code: `#include <iostream>

int main() {
  std::cout << "Halo, dunia!" << std::endl;
  return 0;
}

// kompilasi:  g++ program.cpp -o program
// jalankan:   ./program`,
        },
        {
          title: "Struktur & Kompilasi",
          body:
            "#include memuat pustaka, using namespace std menghindari awalan std::, main adalah titik masuk, return 0 menandakan sukses. Kompilasi dengan g++ atau clang++. Bagi program besar, gunakan Makefile/CMake. Error kompilasi (bukan runtime) yang paling sering ditemui pemula.",
          code: `#include <iostream>
using namespace std;

int main() {
  cout << "Nama: Bimo" << endl;
  cout << "Umur: " << 12 << " tahun" << endl;
  return 0;
}

// g++ program.cpp -o program && ./program`,
        },
        {
          title: "Variabel & Tipe",
          body:
            "Tipe C++: int (bilangan bulat), double (desimal), float, char (satu huruf), bool, string (perlu <string>). Ukuran tipe bisa dicek dengan sizeof. C++ adalah strongly-typed: tipe ditentukan di deklarasi.",
          code: `int jumlah = 10;
double harga = 25000.5;
float berat = 55.5f;
char huruf = 'A';
bool aktif = true;
string nama = "Robika";

cout << sizeof(int) << endl;     // 4 byte (biasanya)
cout << sizeof(double) << endl;  // 8 byte

// perhatian: pembagian int
int a = 7, b = 2;
cout << a / b << endl;   // 3, bukan 3.5
cout << a / 2.0 << endl; // 3.5`,
        },
        {
          title: "Konstanta & Literal",
          body:
            "const membuat nilai tetap yang tidak bisa diubah — kompilator memastikan ini. constexpr untuk konstanta waktu kompilasi. Literal: angka, karakter 'A', string \"teks\". Gunakan const untuk semua nilai yang seharusnya tidak berubah.",
          code: `const int MAX_SKOR = 100;
const double PI = 3.14159;
const string APLIKASI = "Robika";

// MAX_SKOR = 200;  // ERROR: konstanta

int skor = 85;
cout << (skor > MAX_SKOR ? "melebihi" : "aman") << endl;`,
        },
        {
          title: "I/O: cin & cout",
          body:
            "cout << menampilkan; cin >> membaca input (berhenti di spasi); getline(cin, s) membaca satu baris penuh. endl baris baru (atau \\n). Program interaktif memakai kombinasi ini. Selalu beri pesan yang jelas sebelum meminta input.",
          code: `string nama;
int umur;

cout << "Masukkan nama: ";
getline(cin, nama);

cout << "Masukkan umur: ";
cin >> umur;

cout << "Halo, " << nama << " (" << umur << " tahun)"
     << endl;`,
        },
      ],
      quiz: [
        {
          q: "C++ dikompilasi langsung menjadi...",
          options: ["bytecode", "kode mesin (binary)", "JavaScript", "assembly saja"],
          answer: 1,
          explain: "Kompilator menghasilkan binary kode mesin — penyebab kecepatannya.",
        },
        {
          q: "Header untuk input-output di C++ adalah...",
          options: ["<stdio.h>", "<iostream>", "<input>", "<console>"],
          answer: 1,
          explain: "<iostream> menyediakan cin dan cout.",
        },
        {
          q: "Tipe data untuk satu karakter adalah...",
          options: ["string", "char", "text", "single"],
          answer: 1,
          explain: "char menyimpan satu karakter; string untuk teks.",
        },
      ],
    },
    {
      id: "cpp-kontrol",
      title: "Kontrol Alur",
      minutes: 15,
      topics: [
        {
          title: "if-else & Switch",
          body:
            "if-else dan switch bekerja seperti bahasa lain. C++ memberi penekanan pada kurung dan semicolon — lupa ; adalah error paling umum. Operator perbandingan dan logika standar: ==, !=, &&, ||, !.",
          code: `int skor = 85;

if (skor >= 90) {
  cout << "A";
} else if (skor >= 80) {
  cout << "B";
} else {
  cout << "C";
}

switch (skor) {
  case 100:
    cout << "Sempurna";
    break;
  case 90:
    cout << "Sangat baik";
    break;
  default:
    cout << "Baik";
}`,
        },
        {
          title: "for, while, do-while",
          body:
            "Tiga perulangan lengkap tersedia: for (hitungan pasti), while (kondisi dulu), do-while (eksekusi dulu). break menghentikan, continue melewati iterasi. Perulangan dengan indeks 0..n-1 adalah pola paling umum.",
          code: `for (int i = 1; i <= 5; i++) {
  cout << i << " ";
}
cout << endl;   // 1 2 3 4 5

int n = 3;
while (n > 0) {
  cout << n << " ";
  n--;
}
cout << endl;   // 3 2 1

int pilihan;
do {
  cout << "Menu (1-3): ";
  cin >> pilihan;
} while (pilihan < 1 || pilihan > 3);

// continue / break
for (int i = 1; i <= 10; i++) {
  if (i % 2 == 0) continue;
  if (i > 7) break;
  cout << i << " ";
}   // 1 3 5 7`,
        },
        {
          title: "Fungsi",
          body:
            "Fungsi: tipeKembali nama(parameter). return mengirim hasil; void tanpa hasil. Deklarasikan prototipe di atas main bila definisi di bawah. Default parameter dan overloading diperbolehkan.",
          code: `int tambah(int a, int b) {
  return a + b;
}

void sapa(string nama) {
  cout << "Halo, " << nama << "!" << endl;
}

int max(int a, int b) {
  return a > b ? a : b;
}

// default parameter
int kali(int a, int b = 2) {
  return a * b;
}

int main() {
  cout << tambah(3, 4) << endl;  // 7
  sapa("Bimo");
  cout << max(5, 9) << endl;     // 9
  cout << kali(6) << endl;       // 12
  return 0;
}`,
        },
        {
          title: "Referensi & Nilai",
          body:
            "Parameter diteruskan by value (salinan) atau by reference (&) — referensi memungkinkan fungsi mengubah variabel asli tanpa pointer. const & untuk membaca data besar tanpa menyalin. Paham perbedaan ini mencegah bug tersembunyi.",
          code: `void ubahNilai(int x) {
  x = 100;   // hanya salinan
}

void ubahRef(int &x) {
  x = 100;   // variabel asli berubah
}

int main() {
  int a = 5;
  ubahNilai(a);
  cout << a << endl;   // 5 (tidak berubah)

  ubahRef(a);
  cout << a << endl;   // 100 (berubah)

  // const ref: baca tanpa salin, tanpa ubah
  string teks = "Robika";
  auto panjang = [&teks]() { return teks.size(); };
  cout << panjang() << endl;   // 6
}`,
        },
        {
          title: "Scope & Overloading",
          body:
            "Variabel hidup dalam blok { } tempatnya dideklarasikan. Nama sama di blok dalam menutupi blok luar. Overloading: fungsi dengan nama sama tapi parameter berbeda. Pilih nama deskriptif agar scope mudah dilacak.",
          code: `int hasil = 10;   // global

void hitung() {
  int hasil = 5;   // lokal: menutupi global
  cout << hasil << endl;   // 5
}

int tambah(int a, int b) { return a + b; }
double tambah(double a, double b) { return a + b; }

int main() {
  cout << hasil << endl;       // 10
  hitung();                    // 5
  cout << tambah(1, 2) << endl;        // 3
  cout << tambah(1.5, 2.5) << endl;    // 4
  return 0;
}`,
        },
      ],
      quiz: [
        {
          q: "Parameter yang memungkinkan fungsi mengubah variabel asli adalah...",
          options: ["by value", "by reference (&)", "by copy", "static"],
          answer: 1,
          explain: "Referensi (&) memodifikasi variabel asli pemanggil.",
        },
        {
          q: "Perulangan yang menjamin minimal satu eksekusi adalah...",
          options: ["for", "while", "do-while", "foreach"],
          answer: 2,
          explain: "do-while mengeksekusi badan dulu, baru cek kondisi.",
        },
        {
          q: "Fungsi dengan nama sama tapi parameter berbeda disebut...",
          options: ["overriding", "overloading", "overwriting", "template"],
          answer: 1,
          explain: "Overloading mengizinkan banyak versi fungsi dengan tanda tangan berbeda.",
        },
      ],
    },
    {
      id: "cpp-struktur",
      title: "Array, String & Struct",
      minutes: 20,
      topics: [
        {
          title: "Array",
          body:
            "Array ukuran tetap: int nilai[5] atau int nilai[] = {1,2,3}. Indeks 0..n-1. Array C++ tidak tahu panjangnya — simpan panjang di variabel atau gunakan std::array/std::vector. Loop memproses elemen array.",
          code: `int nilai[4] = {80, 90, 75, 88};
cout << nilai[0] << endl;   // 80
nilai[2] = 95;

// iterate dengan panjang manual
for (int i = 0; i < 4; i++) {
  cout << nilai[i] << " ";
}
cout << endl;

// std::array: tahu panjangnya sendiri
#include <array>
array<int, 4> skor = {1, 2, 3, 4};
for (int n : skor) {
  cout << n << " ";
}`,
        },
        {
          title: "Vector (Array Dinamis)",
          body:
            "std::vector adalah array yang tumbuh otomatis — koleksi C++ yang paling sering dipakai. Method: push_back (tambah), size, at (akses aman), erase, clear. Range-based for mengiterasi. Perlu #include <vector>.",
          code: `#include <vector>

vector<int> nilai;
nilai.push_back(80);
nilai.push_back(90);
nilai.push_back(75);

cout << nilai.size() << endl;   // 3
cout << nilai.at(1) << endl;    // 90

// iterasi
int total = 0;
for (int n : nilai) total += n;
cout << total << endl;          // 245

// hapus elemen kedua
nilai.erase(nilai.begin() + 1);`,
        },
        {
          title: "String",
          body:
            "std::string menggantikan char[]: length/size, + gabung, substr, find, replace, to_string, stoi/stod (konversi). String C++ bisa diubah (mutable). Bandingkan dengan == langsung.",
          code: `#include <string>

string s = "Robika";
cout << s.length() << endl;      // 6

s += " Hebat";
cout << s << endl;               // Robika Hebat

string sub = s.substr(0, 6);
cout << sub << endl;             // Robika

size_t pos = s.find("Hebat");
cout << pos << endl;             // 7

// konversi
string angka = "42";
int n = stoi(angka);
cout << n + 1 << endl;           // 43

string teks = to_string(3.14);
cout << teks << endl;            // 3.140000`,
        },
        {
          title: "Struct",
          body:
            "Struct mengelompokkan data terkait: struct Karakter { string nama; int hp; }. Akses field dengan titik. Struct bisa berisi vector, string, bahkan struct lain. Ini dasar pemodelan data sebelum masuk ke class.",
          code: `struct Karakter {
  string nama;
  int hp;
  int level;
};

int main() {
  Karakter bimo;
  bimo.nama = "Bimo";
  bimo.hp = 100;
  bimo.level = 1;

  Karakter sari = {"Sari", 90, 2};  // inisialisasi

  cout << bimo.nama << " HP " << bimo.hp << endl;
  cout << sari.nama << " HP " << sari.hp << endl;

  // vector of struct
  vector<Karakter> daftar = {bimo, sari};
  for (auto &k : daftar) {
    cout << k.nama << endl;
  }
  return 0;
}`,
        },
        {
          title: "Enum & const",
          body:
            "enum memberi nama pada himpunan nilai: enum Status { AKTIF, NONAKTIF }. enum class lebih aman (scoped). const melindungi nilai; const reference membaca data tanpa menyalin. Kombinasi ini membuat kode ekspresif dan aman.",
          code: `enum Status { AKTIF, NONAKTIF };

enum class Level { PEMULA, MENENGAH, LANJUT };

int main() {
  Status st = AKTIF;
  if (st == AKTIF) {
    cout << "Akun aktif" << endl;
  }

  Level lv = Level::LANJUT;   // harus dengan scope

  // const ref untuk baca tanpa salin
  void tampil(const string &teks);   // deklarasi
  return 0;
}`,
        },
      ],
      quiz: [
        {
          q: "Koleksi yang tumbuh otomatis di C++ adalah...",
          options: ["array", "vector", "list static", "tuple"],
          answer: 1,
          explain: "std::vector menyesuaikan ukurannya saat di-push_back.",
        },
        {
          q: "Menambah elemen di akhir vector memakai...",
          options: ["add", "push_back", "append", "insert"],
          answer: 1,
          explain: "push_back menambahkan elemen di akhir vector.",
        },
        {
          q: "Struct berguna untuk...",
          options: ["menyimpan satu angka", "mengelompokkan data terkait", "membuat loop", "menampilkan output"],
          answer: 1,
          explain: "Struct menggabungkan beberapa field menjadi satu tipe.",
        },
      ],
    },
    {
      id: "cpp-oop",
      title: "OOP & Memori",
      minutes: 25,
      topics: [
        {
          title: "Class & Encapsulation",
          body:
            "Class mirip struct + method + access modifier: private (default), public, protected. Constructor menginisialisasi; destructor ~Nama membersihkan. Getter/setter melindungi data. Access specifier membedakan public interface dari detail internal.",
          code: `class Rekening {
private:
  int saldo;

public:
  Rekening(int awal) : saldo(awal) {}

  int getSaldo() const { return saldo; }

  bool tarik(int jumlah) {
    if (jumlah <= saldo) {
      saldo -= jumlah;
      return true;
    }
    return false;
  }

  void setor(int jumlah) { saldo += jumlah; }
};

int main() {
  Rekening r(50000);
  r.tarik(20000);
  cout << r.getSaldo() << endl;   // 30000
  // r.saldo = 0;   // ERROR: private
  return 0;
}`,
        },
        {
          title: "Constructor & Destructor",
          body:
            "Constructor menyiapkan objek; destructor otomatis dipanggil saat objek musnah (akhir scope) — tempat ideal melepas resource. Member initializer list : saldo(awal) lebih efisien daripada assignment. RAII: resource diikat ke umur objek.",
          code: `class File {
private:
  FILE *f;

public:
  File(const string &nama) {
    f = fopen(nama.c_str(), "r");
    cout << "Buka " << nama << endl;
  }

  ~File() {
    if (f) fclose(f);   // selalu dibersihkan
    cout << "Tutup file" << endl;
  }
};

int main() {
  {
    File file("data.txt");  // dibuka di sini
  }   // ditutup otomatis di sini (destructor)
  cout << "Selesai" << endl;
  return 0;
}`,
        },
        {
          title: "Inheritance",
          body:
            "class Turunan : public Induk mewarisi member. Override method dengan tanda sama. protected memberi akses ke turunan tapi tidak ke luar. Polimorfisme: pointer/base reference ke objek turunan — memungkinkan kode generik.",
          code: `class Hewan {
protected:
  string nama;

public:
  Hewan(const string &n) : nama(n) {}
  virtual void suara() const {
    cout << "..." << endl;
  }
};

class Kucing : public Hewan {
public:
  Kucing(const string &n) : Hewan(n) {}
  void suara() const override {
    cout << nama << ": meong" << endl;
  }
};

int main() {
  Kucing momo("Momo");
  momo.suara();          // Momo: meong

  Hewan &h = momo;       // polimorfisme
  h.suara();             // Momo: meong (virtual)
  return 0;
}`,
        },
        {
          title: "Pointer & new/delete",
          body:
            "Pointer menyimpan alamat: *p membaca nilai, &x alamat x. new mengalokasi di heap (bertahan di luar scope), delete mengosongkannya. Lupa delete = memory leak; delete dua kali = crash. Modern C++: prefer smart pointer (unique_ptr).",
          code: `int x = 10;
int *p = &x;
cout << *p << endl;   // 10
*p = 20;
cout << x << endl;    // 20

// heap
int *arr = new int[5];
arr[0] = 1;
delete[] arr;         // wajib

// modern: smart pointer
#include <memory>
auto ptr = make_unique<int>(42);
cout << *ptr << endl;   // 42
// dihapus otomatis saat keluar scope`,
        },
        {
          title: "Smart Pointer",
          body:
            "unique_ptr: kepemilikan tunggal, dihapus otomatis. shared_ptr: kepemilikan bersama dengan hitungan referensi. weak_ptr: pengamat tanpa kepemilikan. Smart pointer menghilangkan mayoritas memory leak dan dangling pointer — selalu pakai daripada new/delete mentah.",
          code: `#include <memory>

void contoh() {
  auto u = make_unique<int>(7);      // unik
  cout << *u << endl;                // 7

  auto s1 = make_shared<string>("Robika");
  auto s2 = s1;                      // berbagi
  cout << *s2 << endl;               // Robika
  cout << s1.use_count() << endl;    // 2
}

int main() {
  contoh();
  cout << "memori dibersihkan otomatis" << endl;
  return 0;
}`,
        },
      ],
      quiz: [
        {
          q: "Encapsulation di C++ dicapai dengan...",
          options: ["access modifier private", "namespace", "overload", "inline"],
          answer: 0,
          explain: "private membatasi akses; public membuka interface.",
        },
        {
          q: "Fungsi yang dipanggil otomatis saat objek dihapus adalah...",
          options: ["constructor", "destructor", "finalizer", "cleaner"],
          answer: 1,
          explain: "Destructor (~Nama) dipanggil saat objek keluar scope.",
        },
        {
          q: "Cara modern menghindari memory leak adalah...",
          options: ["new/delete manual", "smart pointer", "menghindari heap", "malloc"],
          answer: 1,
          explain: "unique_ptr/shared_ptr menghapus memori secara otomatis.",
        },
      ],
    },
    {
      id: "cpp-proyek",
      title: "Proyek Mini: Sistem Nilai",
      minutes: 30,
      topics: [
        {
          title: "Desain Class",
          body:
            "Bangun sistem pengelolaan nilai siswa: class Siswa (nama, vector nilai), method tambahNilai, rataNilai, grade. Class PengelolaSiswa menampung daftar siswa. Desain tanggung jawab bersih dulu sebelum implementasi.",
          code: `class Siswa {
private:
  string nama;
  vector<int> nilai;

public:
  Siswa(const string &n) : nama(n) {}

  void tambahNilai(int n) {
    if (n >= 0 && n <= 100) nilai.push_back(n);
  }

  double rataNilai() const {
    if (nilai.empty()) return 0;
    double total = 0;
    for (int v : nilai) total += v;
    return total / nilai.size();
  }

  string grade() const {
    double r = rataNilai();
    if (r >= 90) return "A";
    if (r >= 80) return "B";
    return "C";
  }

  string getNama() const { return nama; }
};`,
        },
        {
          title: "Pengelola Koleksi",
          body:
            "Class PengelolaSiswa memakai vector<Siswa>: tambahSiswa, cariSiswa, tampilkanSemua dengan ranking. Gunakan const reference di parameter agar tidak menyalin data besar. Method tampil mencetak tabel ringkas.",
          code: `class Pengelola {
private:
  vector<Siswa> siswa;

public:
  void tambah(const Siswa &s) {
    siswa.push_back(s);
  }

  void tampilkanSemua() const {
    for (const auto &s : siswa) {
      cout << s.getNama() << " | rata "
           << s.rataNilai() << " | grade "
           << s.grade() << endl;
    }
  }

  // ranking dengan sort
  void ranking() const {
    vector<Siswa> urut = siswa;
    sort(urut.begin(), urut.end(),
      [](const Siswa &a, const Siswa &b) {
        return a.rataNilai() > b.rataNilai();
      });
    for (const auto &s : urut) {
      cout << s.getNama() << " " << s.rataNilai() << endl;
    }
  }
};`,
        },
        {
          title: "Menu Interaktif",
          body:
            "do-while + switch memberi menu: 1) tambah siswa, 2) tambah nilai, 3) tampil semua, 4) ranking, 5) keluar. Validasi input angka (cin.fail) agar program tidak crash. Ini pola aplikasi konsol yang lengkap.",
          code: `int pilihan;
do {
  cout << "1. Tambah siswa\\n2. Tambah nilai\\n"
       << "3. Tampil semua\\n4. Ranking\\n5. Keluar\\n"
       << "Pilih: ";
  cin >> pilihan;

  switch (pilihan) {
    case 1: {
      string nama;
      cout << "Nama: ";
      cin >> nama;
      pengelola.tambah(Siswa(nama));
      break;
    }
    case 2: {
      // pilih siswa lalu tambah nilai
      break;
    }
    case 3:
      pengelola.tampilkanSemua();
      break;
    case 4:
      pengelola.ranking();
      break;
  }
} while (pilihan != 5);`,
        },
        {
          title: "Validasi Input",
          body:
            "cin >> ke int gagal bila input bukan angka — flag gagal menetap. Bersihkan dengan cin.clear() dan cin.ignore(numeric_limits<streamsize>::max(), '\\n'). Validasi menjaga program tetap stabil di tangan pengguna mana pun.",
          code: `#include <limits>

int ambilAngka() {
  int n;
  while (true) {
    cout << "Masukkan angka: ";
    cin >> n;
    if (cin.fail()) {
      cin.clear();   // reset flag error
      cin.ignore(numeric_limits<streamsize>::max(), '\\n');
      cout << "Input harus angka.\\n";
    } else {
      cin.ignore(numeric_limits<streamsize>::max(), '\\n');
      return n;
    }
  }
}`,
        },
        {
          title: "Evaluasi & Pengembangan",
          body:
            "Evaluasi: uji tambah siswa, tambah nilai valid/tidak valid, ranking kosong (harus aman), dan input huruf (tidak crash). Kembangkan: simpan data ke file (fstream), tambah inheritance SiswaRapor dengan bobot per mapel, atau beralih ke Qt untuk GUI. C++ kini menjadi dasar yang kuat untuk game dan sistem berkinerja tinggi.",
          code: `// simpan ke file
#include <fstream>
ofstream file("data.txt");
for (const auto &s : siswa) {
  file << s.getNama() << " " << s.rataNilai() << endl;
}
file.close();

// lanjutan: game engine (Unreal Engine)
// FString, UPROPERTY, AActor — C++ di dunia game

// lanjutan: STL yang lebih dalam
// map, set, algorithm, iterator`,
        },
      ],
      quiz: [
        {
          q: "Koleksi siswa paling cocok memakai...",
          options: ["array statis", "vector<Siswa>", "char[]", "struct tunggal"],
          answer: 1,
          explain: "vector tumbuh dinamis — ideal untuk daftar yang berubah.",
        },
        {
          q: "Ranking dengan pengurutan custom memakai...",
          options: ["sort dengan lambda", "reverse", "swap", "find"],
          answer: 0,
          explain: "sort(begin, end, lambda) mengurutkan dengan kriteria khusus.",
        },
        {
          q: "Membersihkan flag error cin memakai...",
          options: ["cin.reset", "cin.clear", "cin.clean", "cin.refresh"],
          answer: 1,
          explain: "cin.clear() menghapus status gagal setelah input salah.",
        },
      ],
    },
  ],
};