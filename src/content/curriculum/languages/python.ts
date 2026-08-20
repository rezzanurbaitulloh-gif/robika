import type { CurriculumStack } from "../curriculum";

export const PYTHON_TRACK: CurriculumStack = {
  id: "python",
  name: "Python",
  icon: "brain",
  description:
    "Bahasa paling populer untuk data science, AI, dan otomasi. Sintaks bersih dan mudah dibaca — jalur tercepat menuju pemrograman tingkat lanjut.",
  color: "emerald",
  difficulty: "Pemula",
  modules: [
    {
      id: "py-pengenalan",
      title: "Pengenalan Python",
      minutes: 10,
      topics: [
        {
          title: "Apa itu Python?",
          body:
            "Python adalah bahasa pemrograman interpretasi dengan sintaks yang menyerupai bahasa Inggris — mudah dibaca bahkan untuk orang awam. Digunakan untuk pengembangan web (Django, Flask), analisis data (pandas, NumPy), kecerdasan buatan (TensorFlow, PyTorch), otomasi, dan sains. Karena ekosistemnya raksasa, Python sering menjadi bahasa pertama yang dipelajari di universitas dan bootcamp.",
          code: `# Program pertama
print("Halo, dunia!")
print(2 + 3)   # 5`,
        },
        {
          title: "Instalasi & Menjalankan",
          body:
            "Instal Python dari python.org atau lewat package manager (apt, brew). Cek di terminal dengan `python3 --version`. Jalankan kode dengan `python3 nama_file.py` atau langsung interaktif lewat REPL (`python3` lalu ketik perintah). Di browser juga tersedia layanan seperti Replit untuk mencoba tanpa instalasi.",
          code: `# terminal
$ python3 --version
Python 3.12.3

$ python3 program.py
Halo, dunia!`,
        },
        {
          title: "Sintaks & Indentasi",
          body:
            "Python memakai indentasi (spasi) untuk menandai blok kode — bukan tanda kurung kurawal. Blok setelah if/for/def harus di-indent konsisten (biasanya 4 spasi). Salah indentasi = error IndentationError. Ini membuat kode Python selalu rapi dan seragam.",
          code: `nilai = 80
if nilai >= 60:
    print("Lulus")   # 4 spasi di depan
    print("Keren!")
else:
    print("Belum lulus")`,
        },
        {
          title: "Komentar & print()",
          body:
            "Komentar diawali # dan diabaikan program — untuk menjelaskan maksud kode. print() menampilkan nilai ke layar dan bisa menerima banyak argumen dengan pemisah. Kombinasikan dengan koma atau f-string untuk menampilkan data yang mudah dibaca.",
          code: `# ini komentar
nama = "Ayu"
umur = 13
print("Nama:", nama, "Umur:", umur)
print(f"Umur Ayu {umur} tahun")   # f-string`,
        },
        {
          title: "Membaca Error",
          body:
            "Pesan error Python berakhir dengan jenis error: NameError (nama tak dikenal), TypeError (tipe salah), SyntaxError (sintaks salah), ValueError (nilai tak valid). Traceback menunjukkan baris mana yang bermasalah dari bawah ke atas — baca baris terakhir dulu, lalu telusuri panggilan di atasnya.",
          code: `print(halo)
# NameError: name 'halo' is not defined

print("teks" + 5)
# TypeError: can only concatenate str (not "int") to str`,
        },
      ],
      quiz: [
        {
          q: "Apa penanda blok kode di Python?",
          options: ["Kurung kurawal {}", "Titik koma ;", "Indentasi (spasi)", "Tag <blok>"],
          answer: 2,
          explain: "Python memakai indentasi konsisten untuk menandai blok kode.",
        },
        {
          q: "Perintah untuk menampilkan output adalah...",
          options: ["console.log", "print()", "echo", "output()"],
          answer: 1,
          explain: "print() adalah fungsi bawaan Python untuk menampilkan teks.",
        },
        {
          q: "Error 'NameError: name x is not defined' berarti...",
          options: ["sintaks salah", "variabel x belum dibuat", "x terlalu besar", "indentasi salah"],
          answer: 1,
          explain: "NameError muncul saat memakai nama yang belum didefinisikan.",
        },
      ],
    },
    {
      id: "py-dasar",
      title: "Variabel & Tipe Data",
      minutes: 15,
      topics: [
        {
          title: "Variabel",
          body:
            "Variabel dibuat dengan menulis nama = nilai — tanpa kata kunci. Tipe ditentukan otomatis (duck typing). Nama boleh huruf, angka, underscore, tidak boleh diawali angka. Gunakan snake_case untuk variabel dan fungsi. Python peka huruf besar-kecil.",
          code: `nama = "Bimo"
umur = 12
tinggi = 1.55
aktif = True

print(nama, umur, tinggi, aktif)`,
        },
        {
          title: "Tipe Data Dasar",
          body:
            "int (bilangan bulat), float (desimal), str (teks dalam kutip), bool (True/False), dan NoneType (kosong). Fungsi type() menampilkan tipe sebuah nilai. Konversi tipe lewat int(), float(), str(), bool().",
          code: `x = 10          # int
y = 3.14        # float
kata = "halo"   # str
benar = True    # bool
kosong = None   # None

print(type(x))     # <class 'int'>
print(int("42"))   # 42
print(str(10) + "!")  # "10!"`,
        },
        {
          title: "Operasi Dasar",
          body:
            "Operator: + - * / (hasil float), // (pembagian bulat), % (sisa bagi), ** (pangkat). + pada string menggabungkan, * pada string mengulang. Bandingkan nilai dengan ==, !=, <, >, <=, >= yang menghasilkan bool.",
          code: `print(7 // 2)    # 3
print(7 % 2)     # 1
print(2 ** 3)    # 8
print("ha" * 3)  # hahaha
print(5 == "5")  # False — tipe berbeda`,
        },
        {
          title: "f-string",
          body:
            "f-string adalah cara modern menyisipkan variabel ke string: f\"teks {variabel}\". Juga bisa mengeksekusi ekspresi kecil dan memformat angka: {angka:.2f} untuk dua desimal. Lebih bersih daripada penggabungan tanda +.",
          code: `nama = "Sari"
skor = 87.5
print(f"{nama} mendapat {skor:.1f} poin")
# Sari mendapat 87.5 poin`,
        },
        {
          title: "Input dari Pengguna",
          body:
            "input() membaca teks dari pengguna (selalu string). Gabungkan dengan int() untuk angka. Ini dasar membuat program interaktif seperti kuis atau kalkulator.",
          code: `nama = input("Siapa namamu? ")
umur = int(input("Berapa umurmu? "))
print(f"Halo {nama}, tahun depan kamu {umur + 1} tahun!")`,
        },
      ],
      quiz: [
        {
          q: "Hasil dari 7 // 2 di Python adalah...",
          options: ["3.5", "3", "4", "1"],
          answer: 1,
          explain: "// adalah pembagian bulat: 7//2 = 3.",
        },
        {
          q: "Tipe data untuk bilangan desimal adalah...",
          options: ["int", "decimal", "float", "real"],
          answer: 2,
          explain: "Python memakai float untuk bilangan desimal.",
        },
        {
          q: "Fungsi untuk membaca input pengguna adalah...",
          options: ["scan()", "read()", "input()", "get()"],
          answer: 2,
          explain: "input() membaca teks dari pengguna, selalu bertipe str.",
        },
      ],
    },
    {
      id: "py-kontrol",
      title: "Kontrol Alur",
      minutes: 20,
      topics: [
        {
          title: "if / elif / else",
          body:
            "Python memakai elif (bukan else if). Kondisi tanpa tanda kurung (opsional). urutan kondisi dari spesifik ke umum. Nilai falsy: 0, None, \"\" (string kosong), [], {} — selain itu truthy.",
          code: `nilai = 88
if nilai >= 90:
    print("A")
elif nilai >= 75:
    print("B")
else:
    print("C")   # B`,
        },
        {
          title: "Operator Logika",
          body:
            "and (dan), or (atau), not (negasi) — kata-kata, bukan simbol && ||. Gunakan `in` untuk memeriksa keanggotaan string/list. Gabungkan dengan tanda kurung untuk kondisi kompleks yang jelas.",
          code: `umur = 16
punya_izin = True

if umur >= 15 and punya_izin:
    print("Boleh masuk")
if not punya_izin:
    print("Butuh izin")

if "a" in "banana":
    print("ada huruf a")`,
        },
        {
          title: "for Loop & range()",
          body:
            "for item in koleksi: mengiterasi elemen. range(n) menghasilkan 0..n-1; range(mulai, berhenti, langkah) lebih fleksibel. enumerate() memberi indeks sekaligus elemen.",
          code: `for i in range(5):
    print(i)        # 0 1 2 3 4

for i in range(0, 10, 2):
    print(i)        # 0 2 4 6 8

buah = ["apel", "mangga"]
for i, b in enumerate(buah):
    print(i, b)`,
        },
        {
          title: "while Loop",
          body:
            "while kondisi: mengulang selama kondisi benar — jumlah tak tentu. break menghentikan, continue melompat ke iterasi berikutnya. Hati-hati infinite loop: pastikan kondisi akhirnya salah.",
          code: `import random
dadu = 0
lemparan = 0
while dadu != 6:
    dadu = random.randint(1, 6)
    lemparan += 1
print(f"Dapat 6 setelah {lemparan} lemparan")

i = 0
while i < 10:
    i += 1
    if i % 2 == 0:
        continue
    print(i)      # 1 3 5 7 9`,
        },
        {
          title: "Latihan: Klasifikasi Nilai",
          body:
            "Gabungkan if-elif-else dengan input: minta nilai 0-100, klasifikasikan (A/B/C/D/E), dan beri pesan lulus/gagal. Tambahkan validasi bahwa nilai berada di rentang yang masuk akal.",
          code: `nilai = int(input("Masukkan nilai (0-100): "))
if nilai < 0 or nilai > 100:
    print("Nilai tidak valid")
elif nilai >= 90:
    print("A — Luar biasa!")
elif nilai >= 75:
    print("B — Bagus")
elif nilai >= 60:
    print("C — Cukup")
else:
    print("E — Perlu belajar lagi")`,
        },
      ],
      quiz: [
        {
          q: "Kata kunci percabangan lain selain if/else di Python adalah...",
          options: ["elseif", "elif", "elseif else", "when"],
          answer: 1,
          explain: "Python memakai elif.",
        },
        {
          q: "Apa hasil dari range(3)?",
          options: ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "[3,2,1]"],
          answer: 1,
          explain: "range(n) menghasilkan 0 sampai n-1.",
        },
        {
          q: "Nilai manakah yang dianggap falsy di Python?",
          options: ["\"0\"", "[0]", "0", "None... semua di atas"],
          answer: 3,
          explain: "0, None, string kosong, list kosong semuanya falsy.",
        },
      ],
    },
    {
      id: "py-struktur",
      title: "Fungsi, List & Dictionary",
      minutes: 25,
      topics: [
        {
          title: "Mendefinisikan Fungsi",
          body:
            "def nama(parameter): diikuti blok terindent. return mengembalikan nilai; tanpa return mengembalikan None. Parameter default ditulis nama=nilai. Fungsi menghindari pengulangan dan membuat program modular.",
          code: `def sapa(nama="Teman"):
    print(f"Halo, {nama}!")

sapa()          # Halo, Teman!
sapa("Budi")    # Halo, Budi!

def tambah(a, b):
    return a + b

print(tambah(3, 4))   # 7`,
        },
        {
          title: "List",
          body:
            "List adalah koleksi berurutan: [1, 2, 3], bisa campur tipe, bisa diubah. Indeks mulai 0, indeks negatif dari belakang. append/tambah, insert, pop/hapus, len/panjang, slicing [1:3]. Looping dengan for.",
          code: `nilai = [80, 90, 75]
nilai.append(88)
print(len(nilai))       # 4
print(nilai[0])         # 80
print(nilai[-1])        # 88
print(nilai[1:3])       # [90, 75]

for n in nilai:
    print(n * 2)`,
        },
        {
          title: "Dictionary",
          body:
            "Dictionary memetakan kunci ke nilai: {\"nama\": \"Bimo\", \"umur\": 12}. Akses dengan dict[\"kunci\"], cek dengan in, ambil aman dengan .get(\"kunci\", default). Tambah/ubah langsung dengan assignment. Loop dengan .items() untuk (kunci, nilai).",
          code: `karakter = {"nama": "Bimo", "hp": 100}
print(karakter["nama"])      # Bimo
karakter["hp"] = 80
karakter["skill"] = "Lompat"

for kunci, nilai in karakter.items():
    print(f"{kunci}: {nilai}")

print(karakter.get("mana", 0))   # 0 (default)`,
        },
        {
          title: "List & Dict Comprehension",
          body:
            "Comprehension membuat list/dict baru dalam satu baris: [ekspresi for item in koleksi if kondisi]. Lebih ringkas dan cepat. Pola umum untuk transformasi dan penyaringan data.",
          code: `angka = [1, 2, 3, 4, 5]
genap = [x for x in angka if x % 2 == 0]
kuadrat = [x ** 2 for x in angka]

print(genap)      # [2, 4]
print(kuadrat)    # [1, 4, 9, 16, 25]

nama = ["budi", "sari"]
besar = [n.capitalize() for n in nama]
print(besar)      # ['Budi', 'Sari']`,
        },
        {
          title: "Fungsi Bawaan Berguna",
          body:
            "Python kaya fungsi bawaan: sum(), max(), min(), sorted(), len(), enumerate(), zip(). Metode string: upper(), lower(), split(), join(), strip(). Kuasai ini untuk menulis kode ringkas.",
          code: `nilai = [80, 90, 75, 88]
print(sum(nilai))            # 333
print(max(nilai))            # 90
print(sorted(nilai))         # [75, 80, 88, 90]

kata = " robika belajar "
print(kata.strip().upper())  # ROBIKA BELAJAR
print("a,b,c".split(","))    # ['a', 'b', 'c']`,
        },
      ],
      quiz: [
        {
          q: "Cara membuat fungsi di Python adalah...",
          options: ["function nama()", "def nama():", "func nama()", "fn nama()"],
          answer: 1,
          explain: "Kata kunci def diikuti nama dan tanda kurung lalu titik dua.",
        },
        {
          q: "Struktur data yang memetakan kunci ke nilai adalah...",
          options: ["list", "tuple", "dictionary", "set"],
          answer: 2,
          explain: "Dictionary ({...}) memetakan kunci ke nilai.",
        },
        {
          q: "Apa hasil dari [x*2 for x in [1,2,3]]?",
          options: ["[2,4,6]", "[1,2,3]", "[3,4,5]", "[1,4,9]"],
          answer: 0,
          explain: "Setiap elemen dikalikan 2: [2, 4, 6].",
        },
      ],
    },
    {
      id: "py-lanjut",
      title: "Modul, File & Error",
      minutes: 25,
      topics: [
        {
          title: "Import Modul",
          body:
            "Modul adalah file Python berisi kode yang bisa dipakai ulang. import math lalu math.sqrt(9), atau from math import sqrt. Modul standar: math, random, datetime, os, json, collections. Import membuat kode terorganisir dan memanfaatkan ekosistem raksasa Python.",
          code: `import math
import random

print(math.sqrt(16))        # 4.0
print(random.randint(1, 6)) # dadu acak

from datetime import date
hari_ini = date.today()
print(hari_ini)`,
        },
        {
          title: "Membaca & Menulis File",
          body:
            "Buka file dengan open(nama, mode): mode \"r\" baca, \"w\" tulis (menimpa), \"a\" tambah, dan pakai with agar file otomatis ditutup. Baca semua dengan read() atau per baris dengan loop. Menulis data persisten adalah langkah dari program mainan ke aplikasi nyata.",
          code: `# menulis
with open("catatan.txt", "w") as f:
    f.write("Belajar Python\n")
    f.write("Baris kedua\n")

# membaca
with open("catatan.txt", "r") as f:
    for baris in f:
        print(baris.strip())`,
        },
        {
          title: "Bekerja dengan JSON",
          body:
            "JSON adalah format data standar untuk bertukar data antar aplikasi. json.dumps mengubah dict/list ke string JSON; json.loads sebaliknya. Simpan data pengguna/level/score ke file JSON — fondasi penyimpanan data aplikasi.",
          code: `import json

data = {"nama": "Bimo", "skor": [80, 90]}

teks = json.dumps(data)
print(teks)   # {"nama": "Bimo", "skor": [80, 90]}

kembali = json.loads(teks)
print(kembali["nama"])   # Bimo

with open("data.json", "w") as f:
    json.dump(data, f)`,
        },
        {
          title: "try / except (Error Handling)",
          body:
            "try/except menangkap error agar program tidak berhenti mendadak. except TypeError menangkap error spesifik; except Exception menangkap semua. else dijalankan jika sukses, finally selalu dijalankan. Ini kunci program yang kokoh menghadapi input tak terduga.",
          code: `try:
    angka = int(input("Angka: "))
    print(100 / angka)
except ValueError:
    print("Bukan angka yang valid")
except ZeroDivisionError:
    print("Tidak bisa dibagi nol")
finally:
    print("Selesai")`,
        },
        {
          title: "Kelas & Objek (Dasar)",
          body:
            "Kelas adalah cetak biru objek. class Karakter: dengan __init__ (konstruktor) menyimpan atribut; method adalah fungsi di dalam kelas. Objek dibuat dengan Karakter(\"Bimo\"). this pada Python adalah self — parameter pertama setiap method.",
          code: `class Karakter:
    def __init__(self, nama, hp=100):
        self.nama = nama
        self.hp = hp

    def serang(self, damage):
        self.hp -= damage
        print(f"{self.nama} HP {self.hp}")

    def pulih(self, jumlah):
        self.hp += jumlah

bimo = Karakter("Bimo")
bimo.serang(30)   # Bimo HP 70
bimo.pulih(20)
print(bimo.hp)    # 90`,
        },
      ],
      quiz: [
        {
          q: "Sintaks untuk memakai modul math adalah...",
          options: ["use math", "import math", "include math", "require math"],
          answer: 1,
          explain: "import math membuka akses ke modul math.",
        },
        {
          q: "Mode 'w' pada open() berarti...",
          options: ["membaca", "menulis (menimpa)", "menambah", "membuka biner"],
          answer: 1,
          explain: "\"w\" menulis dan menimpa isi file.",
        },
        {
          q: "Untuk menangkap error agar program tidak berhenti, gunakan...",
          options: ["if/else", "try/except", "for/while", "def/return"],
          answer: 1,
          explain: "try/except menangkap pengecualian dengan aman.",
        },
      ],
    },
    {
      id: "py-proyek",
      title: "Proyek Mini: Kuis Interaktif",
      minutes: 30,
      topics: [
        {
          title: "Rencana Proyek",
          body:
            "Bangun kuis interaktif: daftar pertanyaan dengan pilihan jawaban, skor, dan umpan balik. Melatih list, dict, fungsi, perulangan, dan input. Struktur data: satu pertanyaan = dict dengan kunci q, options, answer.",
          code: `pertanyaan = [
    {
        "q\": \"Apa hasil 2 ** 3?",
        "options": ["6", "8", "9", "5"],
        "answer": 1,
    },
    {
        "q\": \"Tipe data untuk teks di Python?",
        "options": ["int", "str", "float", "bool"],
        "answer": 1,
    },
]`,
        },
        {
          title: "Loop Kuis",
          body:
            "Iterasi tiap pertanyaan, tampilkan opsi bernomor, baca pilihan pengguna, bandingkan dengan answer, dan tambahkan skor jika benar. Cetak umpan balik singkat. Konversi input ke int dan tangani error.",
          code: `skor = 0
for no, p in enumerate(pertanyaan, start=1):
    print(f"\\nSoal {no}: {p['q']}")
    for i, opsi in enumerate(p["options"]):
        print(f"  {i + 1}. {opsi}")
    try:
        pilihan = int(input("Jawaban (nomor): ")) - 1
    except ValueError:
        print("Input tidak valid.")
        continue
    if pilihan == p["answer"]:
        print("Benar!")
        skor += 1
    else:
        print(f"Salah. Jawaban: {p['answer'] + 1}")`,
        },
        {
          title: "Hasil Akhir",
          body:
            "Setelah semua soal, tampilkan skor total dan persentase. Beri penilaian berdasarkan persentase (mis. 80%+ = Luar biasa). Data kuis bisa dipisah ke file JSON agar soal mudah ditambah tanpa mengubah logika.",
          code: `total = len(pertanyaan)
persen = skor / total * 100
print(f"\\nSkor: {skor}/{total} ({persen:.0f}%)")

if persen >= 80:
    print("Luar biasa!")
elif persen >= 60:
    print("Bagus, tingkatkan lagi.")
else:
    print("Jangan menyerah, coba lagi!")`,
        },
        {
          title: "Menambah Variasi Soal",
          body:
            "Perluas kuis dengan tipe soal benar/salah dan isian singkat. Untuk isian, bandingkan input.strip().lower() dengan jawaban. Strukturkan data agar mudah diperluas — misalnya kunci 'type': 'pilihan' | 'isian'.",
          code: `# soal isian singkat
q = {"type": "isian", "q": "Bahasa apa untuk AI paling populer?", "answer": "python"}

jawaban = input("Jawaban: ").strip().lower()
if jawaban == q["answer"]:
    print("Benar!")
else:
    print("Salah.")`,
        },
        {
          title: "Pengujian & Pengembangan",
          body:
            "Uji semua alur: jawaban benar, salah, input bukan angka, dan jalankan beberapa kali. Kembangkan lebih lanjut: acak urutan soal dengan random.shuffle, batasi waktu, simpan skor tertinggi ke file JSON, atau ubah ke aplikasi web dengan Flask. Kuis ini adalah fondasi sistem latihan sungguhan — selamat, kamu sudah menyelesaikan proyek Python pertamamu!",
          code: `import random
random.shuffle(pertanyaan)  # acak urutan soal

# simpan skor tertinggi ke JSON
try:
    with open("skor.json") as f:
        best = json.load(f)
except FileNotFoundError:
    best = 0
if skor > best:
    with open("skor.json", "w") as f:
        json.dump(skor, f)
    print("Skor tertinggi baru!")`,
        },
      ],
      quiz: [
        {
          q: "Perintah untuk mengacak list adalah...",
          options: ["list.acak()", "random.shuffle(list)", "list.shuffle()", "import shuffle"],
          answer: 1,
          explain: "random.shuffle(list) mengacak urutan elemen in-place.",
        },
        {
          q: "Untuk menyimpan data ke file JSON digunakan...",
          options: ["json.write()", "json.dump()", "json.save()", "file.json()"],
          answer: 1,
          explain: "json.dump menulis objek Python ke file JSON.",
        },
        {
          q: "Parameter pertama setiap method di kelas Python adalah...",
          options: ["this", "me", "self", "obj"],
          answer: 2,
          explain: "self merujuk instance objek itu sendiri.",
        },
      ],
    },
  ],
};