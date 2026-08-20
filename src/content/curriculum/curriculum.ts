export interface CurriculumTopic {
  title: string;
  body: string;
  code?: string;
}

export interface CurriculumQuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  minutes: number;
  topics: CurriculumTopic[];
  quiz: CurriculumQuizQuestion[];
}

export interface CurriculumStack {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  modules: CurriculumModule[];
}

export const CURRICULUM_STACKS: CurriculumStack[] = [
  {
    id: "web-frontend",
    name: "Web Frontend",
    icon: "🎨",
    description:
      "HTML, CSS, JavaScript, TypeScript, React, Next.js & Tailwind — dari struktur halaman sampai aplikasi modern.",
    color: "sky",
    modules: [
      {
        id: "html-dasar",
        title: "HTML Dasar: Struktur Halaman",
        minutes: 20,
        topics: [
          {
            title: "Apa itu HTML?",
            body: "HTML (HyperText Markup Language) adalah bahasa penanda yang membentuk kerangka setiap halaman web. Elemen HTML memberi tahu browser apa yang harus ditampilkan: judul, paragraf, gambar, tautan, dan lain-lain.",
          },
          {
            title: "Anatomi Elemen",
            body: "Sebuah elemen terdiri dari tag pembuka, isi, dan tag penutup. Atribut menambahkan informasi tambahan seperti href pada tautan atau src pada gambar.",
            code: `<a href="https://robika.app">Kunjungi Robika</a>\n<img src="bot.png" alt="Robot BOT-1" />`,
          },
          {
            title: "Semantik",
            body: "Gunakan elemen semantik (header, nav, main, section, footer) agar halaman mudah dibaca oleh browser, mesin pencari, dan pengguna dengan teknologi bantuan.",
          },
          {
            title: "Praktik",
            body: "Mulai dari struktur minimal lalu kembangkan: buat halaman profil dengan satu judul, satu paragraf, dan satu tautan. Validasi di browser untuk melihat hasilnya.",
          },
        ],
        quiz: [
          {
            q: "Apa fungsi utama HTML?",
            options: ["Menata gaya visual", "Membentuk struktur konten halaman", "Menangani logika server", "Menyimpan data pengguna"],
            answer: 1,
            explain: "HTML = kerangka/struktur; CSS = gaya; JavaScript = perilaku.",
          },
          {
            q: "Manakah elemen yang benar?",
            options: ["<a>Klik</a>", "<a href='x'>Klik</a>", "<link>Klik</link>", "<img>Klik</img>"],
            answer: 1,
            explain: "Atribut href menentukan tujuan tautan; teks ada di antara tag pembuka dan penutup.",
          },
          {
            q: "Elemen semantik berguna untuk...",
            options: ["Hanya hiasan", "Aksesibilitas & SEO", "Membuat kode lebih panjang", "Menghapus CSS"],
            answer: 1,
            explain: "Semantik membantu screen reader dan mesin pencari memahami struktur.",
          },
        ],
      },
      {
        id: "css-dasar",
        title: "CSS Dasar: Gaya & Layout",
        minutes: 25,
        topics: [
          {
            title: "Apa itu CSS?",
            body: "CSS (Cascading Style Sheets) mengatur tampilan: warna, ukuran, jarak, dan posisi. CSS memisahkan konten (HTML) dari presentasi (gaya).",
          },
          {
            title: "Selektor & Properti",
            body: "Selektor memilih elemen yang akan diubah; properti menentukan aspek gaya. Contoh: h1 { color: blue; } mewarnai semua judul tingkat satu.",
            code: `h1 {\n  color: #2563eb;\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}`,
          },
          {
            title: "Box Model",
            body: "Setiap elemen adalah kotak: konten, padding (jarak dalam), border, dan margin (jarak luar). Memahami box model adalah kunci layout yang rapi.",
          },
          {
            title: "Flexbox",
            body: "Flexbox menyusun elemen dalam satu arah (baris/kolom) dengan mudah: justify-content mengatur posisi horizontal, align-items posisi vertikal.",
            code: `.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
          },
        ],
        quiz: [
          {
            q: "CSS digunakan untuk...",
            options: ["Membuat struktur halaman", "Mengatur tampilan visual", "Menghubungkan ke server", "Menyimpan password"],
            answer: 1,
            explain: "CSS menangani gaya; HTML struktur; JavaScript perilaku.",
          },
          {
            q: "Urutan box model dari dalam ke luar?",
            options: ["Margin-border-padding-konten", "Konten-padding-border-margin", "Padding-konten-border-margin", "Border-margin-padding-konten"],
            answer: 1,
            explain: "Konten → padding → border → margin.",
          },
          {
            q: "Apa fungsi display: flex?",
            options: ["Menyembunyikan elemen", "Menyusun elemen dalam satu arah", "Mengubah ukuran font", "Menambah animasi"],
            answer: 1,
            explain: "Flexbox menyusun anak elemen secara baris/kolom.",
          },
        ],
      },
      {
        id: "javascript-dasar",
        title: "JavaScript Dasar: Logika & Interaksi",
        minutes: 30,
        topics: [
          {
            title: "Variabel & Tipe Data",
            body: "JavaScript menyimpan data dalam variabel: let untuk nilai yang berubah, const untuk tetap. Tipe utama: string, number, boolean, array, object.",
            code: `let skor = 0;\nconst nama = "BOT-1";\nskor += 10;`,
          },
          {
            title: "Fungsi",
            body: "Fungsi mengelompokkan kode agar bisa dipakai ulang. Parameter menerima masukan; return mengirim hasil.",
            code: `function tambah(a, b) {\n  return a + b;\n}\ntambah(2, 3); // 5`,
          },
          {
            title: "Kondisi & Perulangan",
            body: "if/else mengambil keputusan; for dan while mengulang pekerjaan. Keduanya adalah fondasi logika program.",
            code: `for (let i = 0; i < 3; i++) {\n  console.log("halo", i);\n}`,
          },
          {
            title: "DOM & Event",
            body: "DOM adalah representasi halaman di memori. document.querySelector memilih elemen; addEventListener merespons klik, ketikan, dan event lain.",
            code: `document.querySelector("#btn")\n  .addEventListener("click", () => alert("Halo!"));`,
          },
        ],
        quiz: [
          {
            q: "Manakah cara mendeklarasikan variabel tetap?",
            options: ["let", "const", "var", "define"],
            answer: 1,
            explain: "const untuk nilai yang tidak akan diubah.",
          },
          {
            q: "Apa hasil tambah(2, 3)?",
            options: ["23", "5", "undefined", "error"],
            answer: 1,
            explain: "Fungsi tambah menjumlahkan dua parameter.",
          },
          {
            q: "DOM singkatan dari...",
            options: ["Document Object Model", "Data Output Machine", "Dynamic Online Module", "Direct Object Mapping"],
            answer: 0,
            explain: "DOM = representasi halaman yang bisa dimanipulasi JavaScript.",
          },
        ],
      },
    ],
  },
  {
    id: "web-backend",
    name: "Web Backend",
    icon: "⚙️",
    description:
      "Node.js, Express, Python (FastAPI/Flask), Go, PHP/Laravel, Java/Spring — logika server, API, dan database.",
    color: "emerald",
    modules: [
      {
        id: "http-api",
        title: "HTTP & Konsep API",
        minutes: 25,
        topics: [
          {
            title: "Cara Web Bekerja",
            body: "Browser mengirim permintaan (request) ke server; server membalas dengan respons (response). Protokol yang dipakai disebut HTTP.",
          },
          {
            title: "Metode HTTP",
            body: "GET mengambil data, POST membuat data baru, PUT/PATCH memperbarui, DELETE menghapus. Metode yang tepat membuat API mudah dipahami.",
          },
          {
            title: "Status Code",
            body: "Respons membawa kode status: 200 OK, 201 dibuat, 400 permintaan salah, 401 belum login, 404 tidak ditemukan, 500 error server.",
          },
          {
            title: "REST API",
            body: "REST adalah gaya desain API yang memetakan operasi ke sumber daya (resource) lewat URL dan metode HTTP.",
            code: `GET  /api/users    → daftar pengguna\nPOST /api/users    → buat pengguna\nGET  /api/users/1  → detail pengguna`,
          },
        ],
        quiz: [
          {
            q: "Metode HTTP untuk mengambil data?",
            options: ["POST", "GET", "DELETE", "PATCH"],
            answer: 1,
            explain: "GET mengambil data; POST membuat data baru.",
          },
          {
            q: "Kode status untuk 'tidak ditemukan'?",
            options: ["200", "404", "500", "201"],
            answer: 1,
            explain: "404 = resource tidak ditemukan.",
          },
          {
            q: "REST API memetakan operasi ke...",
            options: ["Fungsi acak", "Sumber daya (resource)", "Warna halaman", "File lokal"],
            answer: 1,
            explain: "REST bekerja di atas resource dengan metode HTTP.",
          },
        ],
      },
      {
        id: "node-express",
        title: "Node.js & Express",
        minutes: 30,
        topics: [
          {
            title: "Node.js",
            body: "Node.js menjalankan JavaScript di server. Event-driven dan non-blocking membuatnya cepat untuk aplikasi I/O berat seperti API dan chat.",
          },
          {
            title: "Server Minimal",
            body: "Express adalah framework web paling populer untuk Node. Beberapa baris sudah cukup untuk server dengan rute.",
            code: `const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Halo Robika!");\n});\n\napp.listen(3000);`,
          },
          {
            title: "Rute & Parameter",
            body: "Rute mencocokkan URL dengan handler. Parameter dinamis ditulis dengan titik dua (:) dan dibaca dari req.params.",
            code: `app.get("/users/:id", (req, res) => {\n  res.json({ id: req.params.id });\n});`,
          },
          {
            title: "Middleware",
            body: "Middleware adalah fungsi yang berjalan di antara request dan handler akhir — dipakai untuk log, autentikasi, parsing JSON, dan CORS.",
            code: `app.use(express.json());\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();\n});`,
          },
        ],
        quiz: [
          {
            q: "Node.js menjalankan JavaScript di...",
            options: ["Browser", "Server", "Database", "Excel"],
            answer: 1,
            explain: "Node.js = runtime JavaScript di sisi server.",
          },
          {
            q: "Parameter dinamis pada Express ditulis dengan...",
            options: ["#id", ":id", "$id", "@id"],
            answer: 1,
            explain: "Titik dua menandai parameter URL dinamis.",
          },
          {
            q: "Apa fungsi middleware?",
            options: ["Mengganti database", "Memproses request sebelum handler", "Menghapus server", "Mengubah HTML"],
            answer: 1,
            explain: "Middleware berjalan di tengah pipeline request.",
          },
        ],
      },
      {
        id: "database-sql",
        title: "Database & SQL",
        minutes: 30,
        topics: [
          {
            title: "Database Relasional",
            body: "Database menyimpan data terstruktur dalam tabel berisi baris dan kolom. PostgreSQL dan MySQL adalah contoh populer.",
          },
          {
            title: "CRUD dengan SQL",
            body: "Empat operasi inti: INSERT (buat), SELECT (baca), UPDATE (ubah), DELETE (hapus).",
            code: `INSERT INTO users (name, email) VALUES ('BOT-1', 'bot@robika.app');\nSELECT * FROM users WHERE id = 1;\nUPDATE users SET name = 'BOT-2' WHERE id = 1;\nDELETE FROM users WHERE id = 1;`,
          },
          {
            title: "Relasi & JOIN",
            body: "Tabel saling terhubung lewat foreign key. JOIN menggabungkan data dari beberapa tabel — misalnya pengguna dan pesan mereka.",
          },
          {
            title: "Indeks & Performa",
            body: "Indeks mempercepat pencarian pada kolom yang sering difilter. Gunakan di kolom WHERE/ORDER BY yang besar; jangan berlebihan.",
          },
        ],
        quiz: [
          {
            q: "SQL untuk membaca data?",
            options: ["INSERT", "SELECT", "UPDATE", "DROP"],
            answer: 1,
            explain: "SELECT membaca; INSERT membuat; UPDATE mengubah; DELETE menghapus.",
          },
          {
            q: "Foreign key digunakan untuk...",
            options: ["Menghapus tabel", "Menghubungkan antar tabel", "Mewarnai data", "Mengganti nama kolom"],
            answer: 1,
            explain: "Foreign key membangun relasi antar tabel.",
          },
          {
            q: "Manfaat indeks database?",
            options: ["Memperlambat query", "Mempercepat pencarian", "Menyembunyikan data", "Menambah kolom"],
            answer: 1,
            explain: "Indeks mempercepat filter/urut pada kolom besar.",
          },
        ],
      },
    ],
  },
  {
    id: "data-ai",
    name: "Data & AI",
    icon: "🤖",
    description:
      "Python, Pandas, visualisasi, dasar machine learning, dan integrasi API AI untuk membangun produk cerdas.",
    color: "violet",
    modules: [
      {
        id: "python-dasar",
        title: "Python Dasar",
        minutes: 25,
        topics: [
          {
            title: "Kenapa Python?",
            body: "Python mudah dibaca dan sangat populer untuk data, otomasi, dan AI. Sintaksnya ekspresif — dekat dengan bahasa manusia.",
          },
          {
            title: "Variabel & Tipe",
            body: "Python tidak memerlukan deklarasi tipe. String, integer, float, list, tuple, dan dict adalah tipe yang paling sering dipakai.",
            code: `nama = "BOT-1"\nskor = 100\nnilai = [90, 85, 92]\nprofil = {"nama": nama, "skor": skor}`,
          },
          {
            title: "Kondisi & Loop",
            body: "if/elif/else dan for/while bekerja seperti bahasa lain — dengan penekanan pada indentasi sebagai blok kode.",
            code: `for nilai_item in nilai:\n    if nilai_item >= 90:\n        print("Bagus!", nilai_item)`,
          },
          {
            title: "Fungsi",
            body: "def mendefinisikan fungsi; parameter opsional dan return mengirim hasil. Docstring menjelaskan perilaku fungsi.",
            code: `def tambah(a, b=0):\n    """Menjumlahkan dua angka."""\n    return a + b`,
          },
        ],
        quiz: [
          {
            q: "Bagaimana blok kode ditandai di Python?",
            options: ["Kurung kurawal", "Indentasi", "Titik koma", "Tag <python>"],
            answer: 1,
            explain: "Python menggunakan indentasi sebagai blok.",
          },
          {
            q: "Tipe data untuk daftar nilai?",
            options: ["dict", "list", "tuple", "set"],
            answer: 1,
            explain: "List [1, 2, 3] menyimpan urutan nilai.",
          },
          {
            q: "Fungsi didefinisikan dengan kata kunci...",
            options: ["function", "def", "fun", "lambda"],
            answer: 1,
            explain: "def adalah kata kunci definisi fungsi Python.",
          },
        ],
      },
      {
        id: "pandas-data",
        title: "Pandas & Analisis Data",
        minutes: 35,
        topics: [
          {
            title: "DataFrame",
            body: "Pandas menyediakan DataFrame — tabel dua dimensi seperti spreadsheet di memori. DataFrame dibangun dari dict, list, atau file CSV.",
            code: `import pandas as pd\ndf = pd.read_csv("nilai.csv")\nprint(df.head())`,
          },
          {
            title: "Filter & Pilih",
            body: "Pilih kolom dengan df[['a','b']], filter baris dengan kondisi boolean, dan urutkan dengan sort_values.",
            code: `lulus = df[df["nilai"] >= 75]\nterbaik = df.sort_values("nilai", ascending=False)`,
          },
          {
            title: "Agregasi",
            body: "groupby mengelompokkan data lalu menerapkan agregasi seperti mean, sum, count — misal rata-rata nilai per kelas.",
            code: `rata = df.groupby("kelas")["nilai"].mean()`,
          },
          {
            title: "Visualisasi",
            body: "Gabungkan dengan matplotlib/seaborn untuk melihat pola: histogram distribusi, scatter hubungan dua variabel, line tren waktu.",
            code: `df["nilai"].hist(bins=10)\nimport matplotlib.pyplot as plt\nplt.show()`,
          },
        ],
        quiz: [
          {
            q: "Struktur tabel di Pandas disebut...",
            options: ["Array", "DataFrame", "Document", "Tuple"],
            answer: 1,
            explain: "DataFrame = tabel 2 dimensi ala spreadsheet.",
          },
          {
            q: "Cara memfilter baris?",
            options: ["df.drop()", "df[df['kolom'] >= x]", "df.append()", "df.concat()"],
            answer: 1,
            explain: "Kondisi boolean dalam indeks memfilter baris.",
          },
          {
            q: "groupby digunakan untuk...",
            options: ["Menghapus baris", "Mengelompokkan & agregasi", "Mengganti nama", "Menambah kolom"],
            answer: 1,
            explain: "groupby + agregasi (mean/sum/count).",
          },
        ],
      },
      {
        id: "ml-dasar",
        title: "Dasar Machine Learning",
        minutes: 40,
        topics: [
          {
            title: "Apa itu ML?",
            body: "Machine learning membuat program belajar pola dari data, bukan dari aturan manual. Contoh: klasifikasi spam, prediksi harga, rekomendasi.",
          },
          {
            title: "Supervised vs Unsupervised",
            body: "Supervised belajar dari data berlabel (input → output). Unsupervised menemukan struktur tanpa label — misal pengelompokan pelanggan.",
          },
          {
            title: "Pipeline Dasar",
            body: "Pipeline standar: bersihkan data → pisah train/test → latih model → evaluasi → prediksi. Data yang bersih lebih penting daripada model yang rumit.",
            code: `from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = RandomForestClassifier().fit(X_train, y_train)\nprint(model.score(X_test, y_test))`,
          },
          {
            title: "Evaluasi",
            body: "Accuracy saja menyesatkan saat data tidak seimbang. Gunakan precision, recall, dan confusion matrix untuk gambaran lengkap.",
          },
        ],
        quiz: [
          {
            q: "Supervised learning memakai data...",
            options: ["Tanpa label", "Berlabel", "Acak", "Kosong"],
            answer: 1,
            explain: "Supervised belajar dari pasangan input–label.",
          },
          {
            q: "Kenapa data dipisah train/test?",
            options: ["Agar lebih cepat", "Menguji model pada data yang belum dilihat", "Menghemat memori", "Karena wajib"],
            answer: 1,
            explain: "Test set mengukur generalisasi model.",
          },
          {
            q: "Saat data tidak seimbang, lebih baik lihat...",
            options: ["Accuracy saja", "Precision/recall", "Jumlah baris", "Nama kolom"],
            answer: 1,
            explain: "Precision & recall lebih jujur pada kelas langka.",
          },
        ],
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile (React Native)",
    icon: "📱",
    description:
      "React Native & Expo — bangun aplikasi Android dan iOS dari satu basis kode JavaScript/TypeScript.",
    color: "cyan",
    modules: [
      {
        id: "react-native-dasar",
        title: "React Native Dasar",
        minutes: 30,
        topics: [
          {
            title: "Satu Kode, Dua Platform",
            body: "React Native menerjemahkan komponen JavaScript menjadi UI native Android/iOS. Expo menyederhanakan setup, build, dan preview lewat perangkat.",
          },
          {
            title: "Komponen Inti",
            body: "View (kotak), Text (teks), TextInput (input), Pressable (tombol), dan FlatList (daftar) adalah blok penyusun utama.",
            code: `import { View, Text, Pressable } from "react-native";\n\n<View>\n  <Text>Halo Robika!</Text>\n  <Pressable onPress={() => console.log("klik")}>\n    <Text>Mulai</Text>\n  </Pressable>\n</View>`,
          },
          {
            title: "State",
            body: "useState menyimpan data yang mengubah tampilan. Saat state berubah, komponen render ulang secara otomatis.",
            code: `const [skor, setSkor] = useState(0);\nsetSkor(skor + 1);`,
          },
          {
            title: "Navigasi",
            body: "React Navigation mengelola layar: stack (maju/mundur), tabs (beralih bagian), drawer. Parameter antar layar dikirim lewat route.",
          },
        ],
        quiz: [
          {
            q: "Komponen untuk menampilkan teks?",
            options: ["View", "Text", "Input", "Image"],
            answer: 1,
            explain: "Text menampilkan teks di React Native.",
          },
          {
            q: "useState berguna untuk...",
            options: ["Navigasi", "Menyimpan state yang mengubah UI", "Styling", "Networking"],
            answer: 1,
            explain: "State → render ulang saat berubah.",
          },
          {
            q: "Expo berguna untuk...",
            options: ["Menghapus kode", "Memudahkan setup & build aplikasi", "Mengganti React", "Database"],
            answer: 1,
            explain: "Expo menyederhanakan toolchain React Native.",
          },
        ],
      },
      {
        id: "mobile-ui",
        title: "Styling & Layout Mobile",
        minutes: 25,
        topics: [
          {
            title: "StyleSheet",
            body: "Gaya ditulis dalam objek StyleSheet.create dengan properti camelCase — fontSize, backgroundColor, marginTop.",
            code: `const styles = StyleSheet.create({\n  judul: { fontSize: 24, fontWeight: "bold" },\n});`,
          },
          {
            title: "Flexbox di Mobile",
            body: "Layout memakai flexbox: flex:1 mengisi ruang, flexDirection baris/kolom, alignItems/justifyContent untuk posisi.",
          },
          {
            title: "Responsif",
            body: "Gunakan flex, percentage, dan useWindowDimensions agar UI menyesuaikan ukuran layar berbeda (ponsel, tablet, landscape).",
          },
          {
            title: "Status Bar & Safe Area",
            body: "Perhatikan notch dan gesture: SafeAreaView/useSafeAreaInsets menjaga konten tidak tertutup area sistem.",
          },
        ],
        quiz: [
          {
            q: "Properti gaya di React Native memakai...",
            options: ["kebab-case", "camelCase", "snake_case", "UPPER_CASE"],
            answer: 1,
            explain: "StyleSheet memakai camelCase (fontSize).",
          },
          {
            q: "flex: 1 pada komponen berarti...",
            options: ["Sembunyikan", "Isi ruang yang tersedia", "Posisi absolut", "Putar 1 derajat"],
            answer: 1,
            explain: "flex:1 membuat komponen mengisi ruang induk.",
          },
          {
            q: "Menjaga konten dari notch memakai...",
            options: ["SafeAreaView", "ScrollView", "KeyboardAvoiding", "StatusBar"],
            answer: 0,
            explain: "Safe area menghindari area sistem (notch).",
          },
        ],
      },
    ],
  },
  {
    id: "game-dev",
    name: "Game Dev (Web)",
    icon: "🎮",
    description:
      "Fondasi logika game, kanvas 2D, dan Phaser — dari konsep loop sampai game sederhana yang bisa dimainkan.",
    color: "orange",
    modules: [
      {
        id: "game-loop",
        title: "Konsep Game Loop & State",
        minutes: 25,
        topics: [
          {
            title: "Game Loop",
            body: "Game berjalan dalam loop: update (perbarui logika) → render (gambar). Setiap putaran disebut frame; target umumnya 60 FPS.",
          },
          {
            title: "Delta Time",
            body: "Jarak waktu antar frame (delta time) membuat pergerakan konsisten di semua kecepatan perangkat.",
            code: `let last = performance.now();\nfunction loop(now) {\n  const dt = (now - last) / 1000;\n  last = now;\n  player.x += speed * dt;\n  requestAnimationFrame(loop);\n}`,
          },
          {
            title: "State Game",
            body: "Pisahkan state (posisi, skor, kesehatan) dari rendering. Render hanya membaca state — ini mencegah bug sulit ditemukan.",
          },
          {
            title: "Input & Collision",
            body: "Keyboard/touch mengubah state di frame berikutnya. Deteksi tabrakan bisa sesederhana membandingkan kotak (AABB) dua objek.",
          },
        ],
        quiz: [
          {
            q: "Urutan inti game loop?",
            options: ["Render → update", "Update → render", "Input → render", "Render → input"],
            answer: 1,
            explain: "Update logika lalu gambar hasilnya.",
          },
          {
            q: "Delta time digunakan agar...",
            options: ["Game lebih berat", "Pergerakan konsisten di semua perangkat", "Frame lebih sedikit", "Suara lebih keras"],
            answer: 1,
            explain: "dt menormalkan pergerakan terhadap waktu.",
          },
          {
            q: "Mengapa state dipisah dari rendering?",
            options: ["Lebih sulit", "Mengurangi bug & mudah debug", "Wajib Phaser", "Agar lebih lambat"],
            answer: 1,
            explain: "State terpusat = perilaku deterministik.",
          },
        ],
      },
      {
        id: "canvas-2d",
        title: "Canvas 2D & Phaser",
        minutes: 35,
        topics: [
          {
            title: "Canvas API",
            body: "Canvas 2D menggambar langsung di browser: lingkaran, kotak, teks, gambar. Cocok untuk efek dan game sederhana.",
            code: `const ctx = canvas.getContext("2d");\nctx.fillStyle = "#2563eb";\nctx.fillRect(10, 10, 40, 40);`,
          },
          {
            title: "Phaser",
            body: "Phaser adalah framework game 2D populer: scene, sprite, physics, dan input siap pakai. Robika sendiri memakai pendekatan game 2D grid.",
          },
          {
            title: "Scene & Sprite",
            body: "Scene adalah layar game (menu, level). Sprite adalah gambar dengan posisi, rotasi, dan skala. Physics engine menangani gravitasi & tabrakan.",
          },
          {
            title: "Asset & Tilemap",
            body: "Game grid (seperti Kode Quest) memakai tilemap: peta dari tile. Pemain dan rintangan adalah tile dengan aturan sendiri.",
          },
        ],
        quiz: [
          {
            q: "Canvas 2D menggambar lewat...",
            options: ["HTML tag", "Context 2D", "CSS", "Server"],
            answer: 1,
            explain: "ctx (context 2d) menyediakan perintah gambar.",
          },
          {
            q: "Scene di Phaser adalah...",
            options: ["Sebuah file musik", "Layar/bagian game", "Tombol", "Database"],
            answer: 1,
            explain: "Scene = menu, level, atau layar lain.",
          },
          {
            q: "Tilemap cocok untuk...",
            options: ["Game 3D AAA", "Game grid 2D", "Aplikasi kantor", "Chat"],
            answer: 1,
            explain: "Tilemap menyusun peta dari tile kecil.",
          },
        ],
      },
    ],
  },
  {
    id: "database-stack",
    name: "Database (Lanjutan)",
    icon: "🗄️",
    description:
      "PostgreSQL, indeks, transaksi, normalisasi, dan optimasi query untuk aplikasi berskala nyata.",
    color: "amber",
    modules: [
      {
        id: "transactions",
        title: "Transaksi & Konsistensi",
        minutes: 25,
        topics: [
          {
            title: "Apa itu Transaksi?",
            body: "Transaksi membungkus beberapa operasi menjadi satu unit: semua berhasil atau semuanya batal. Ini menjaga konsistensi data.",
          },
          {
            title: "ACID",
            body: "Atomicity (atomik), Consistency (konsisten), Isolation (terisolasi), Durability (tahan lama) — empat jaminan transaksi.",
            code: `BEGIN;\nUPDATE wallets SET stars = stars - 10 WHERE id = 1;\nUPDATE wallets SET stars = stars + 10 WHERE id = 2;\nCOMMIT;`,
          },
          {
            title: "Rollback",
            body: "Bila ada kesalahan, ROLLBACK membatalkan semua perubahan dalam transaksi — data kembali ke kondisi awal.",
          },
          {
            title: "Isolation & Race",
            body: "Tanpa isolasi yang tepat, dua transaksi bisa saling menimpa (race condition). SELECT ... FOR UPDATE mengunci baris saat dipakai bersama.",
          },
        ],
        quiz: [
          {
            q: "Transaksi yang gagal dibatalkan dengan...",
            options: ["COMMIT", "ROLLBACK", "DELETE", "DROP"],
            answer: 1,
            explain: "ROLLBACK membatalkan transaksi.",
          },
          {
            q: "ACID singkatan dari...",
            options: ["Atomic, Consistency, Isolation, Durability", "Array, Cache, Index, Data", "Active, Core, Idle, Done", "Auto, Copy, Insert, Delete"],
            answer: 0,
            explain: "Empat jaminan transaksi database.",
          },
          {
            q: "Race condition dicegah dengan...",
            options: ["Indeks", "Kunci baris (row lock)", "Trigger", "View"],
            answer: 1,
            explain: "Penguncian mencegah dua transaksi saling menimpa.",
          },
        ],
      },
      {
        id: "optimasi-query",
        title: "Optimasi Query & Indeks",
        minutes: 30,
        topics: [
          {
            title: "Explain",
            body: "EXPLAIN menunjukkan rencana eksekusi query — mulai dari sini saat query lambat: apakah memakai indeks, apakah ada full scan.",
            code: `EXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 42;`,
          },
          {
            title: "Jenis Indeks",
            body: "B-tree untuk pencarian umum; GIN untuk array/JSON; partial index hanya sebagian baris; composite index untuk kombinasi kolom.",
          },
          {
            title: "N+1 Query",
            body: "Memuat 100 pengguna lalu 100 query lagi untuk pesannya = 101 query. Gunakan JOIN atau pengambilan batch untuk menghindarinya.",
          },
          {
            title: "Pagination",
            body: "LIMIT/OFFSET sederhana tapi lambat di halaman dalam; keyset pagination (berdasarkan kolom unik) jauh lebih efisien.",
          },
        ],
        quiz: [
          {
            q: "Cara melihat rencana eksekusi query?",
            options: ["EXPLAIN", "SHOW", "DESCRIBE", "TRACE"],
            answer: 0,
            explain: "EXPLAIN/EXPLAIN ANALYZE menampilkan rencana eksekusi.",
          },
          {
            q: "Masalah N+1 terjadi saat...",
            options: ["Query berulang per baris", "Indeks terlalu banyak", "Tabel kosong", "Database offline"],
            answer: 0,
            explain: "N+1 = query tambahan untuk setiap baris hasil.",
          },
          {
            q: "Pagination yang efisien di halaman dalam?",
            options: ["OFFSET besar", "Keyset (kolom unik)", "LIMIT tanpa OFFSET", "SELECT *"],
            answer: 1,
            explain: "Keyset pagination melewati offset yang mahal.",
          },
        ],
      },
    ],
  },
  {
    id: "fullstack",
    name: "Fullstack",
    icon: "🧩",
    description:
      "Proyek end-to-end: frontend + backend + database + deploy — dari ide sampai aplikasi berjalan di internet.",
    color: "rose",
    modules: [
      {
        id: "arsitektur-app",
        title: "Arsitektur Aplikasi Web",
        minutes: 30,
        topics: [
          {
            title: "Lapisan Aplikasi",
            body: "Aplikasi modern terdiri dari frontend (UI), backend (logika/API), dan database (penyimpanan). Setiap lapisan bisa di-host terpisah.",
          },
          {
            title: "Monolith vs Microservice",
            body: "Monolith: satu kode untuk semua — sederhana, cocok untuk tim kecil. Microservice: layanan kecil terpisah — skalabel, tapi lebih kompleks.",
          },
          {
            title: "Full-stack Framework",
            body: "Next.js, Laravel, dan Django menggabungkan frontend + backend dalam satu proyek — mengurangi biaya operasional awal.",
          },
          {
            title: "Environment & Config",
            body: "Pisahkan konfigurasi per lingkungan (dev/staging/prod) lewat environment variables. Jangan pernah commit secret ke git!",
          },
        ],
        quiz: [
          {
            q: "Urutan aliran data aplikasi web?",
            options: ["DB → UI → API", "UI → API → DB", "API → DB → UI", "DB → API → UI"],
            answer: 1,
            explain: "UI meminta API, API mengakses database, hasil kembali ke UI.",
          },
          {
            q: "Monolith cocok untuk...",
            options: ["Tim kecil, aplikasi awal", "Semua kasus", "Hanya aplikasi raksasa", "Tidak pernah"],
            answer: 0,
            explain: "Monolith sederhana; microservice untuk skala besar.",
          },
          {
            q: "Secret (kunci API) sebaiknya...",
            options: ["Di-commit ke git", "Lewat environment variables", "Di-hardcode", "Dikirim ke chat"],
            answer: 1,
            explain: "Env vars + secret manager; jangan di git.",
          },
        ],
      },
      {
        id: "deploy-cicd",
        title: "Deploy & CI/CD",
        minutes: 35,
        topics: [
          {
            title: "Dari Lokal ke Produksi",
            body: "Deploy = mengirim kode ke server/cloud yang selalu aktif. Platform seperti Vercel, Netlify, Railway, dan Render mempermudah proses ini.",
          },
          {
            title: "CI/CD",
            body: "Continuous Integration menjalankan test otomatis tiap push; Continuous Deployment menerbitkan ke produksi setelah lolos.",
            code: `# .github/workflows/ci.yml (ringkas)\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci\n      - run: npm test`,
          },
          {
            title: "Migrations di Produksi",
            body: "Perubahan skema database harus lewat migration versioned yang bisa dijalankan berulang, bukan edit manual di database.",
          },
          {
            title: "Monitoring & Rollback",
            body: "Pasang health check dan log error sejak hari pertama. Siapkan strategi rollback (deploy ulang versi lama) untuk keadaan darurat.",
          },
        ],
        quiz: [
          {
            q: "CI menjalankan...",
            options: ["Test otomatis tiap push", "Hanya deploy manual", "Desain UI", "Backup manual"],
            answer: 0,
            explain: "CI = integrasi & pengujian otomatis.",
          },
          {
            q: "Migrations digunakan untuk...",
            options: ["Menghapus database", "Perubahan skema yang ter-versioning", "Menambah follower", "Optimasi CSS"],
            answer: 1,
            explain: "Migration = perubahan skema yang bisa diulang & di-track.",
          },
          {
            q: "Health check berguna untuk...",
            options: ["Mempercepat server", "Mendeteksi layanan tidak sehat", "Menambah fitur", "Mengganti database"],
            answer: 1,
            explain: "Health check memonitor ketersediaan layanan.",
          },
        ],
      },
    ],
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    icon: "✏️",
    description:
      "Prinsip desain, wireframe, design system, dan aksesibilitas — membuat produk yang indah dan mudah dipakai.",
    color: "fuchsia",
    modules: [
      {
        id: "prinsip-desain",
        title: "Prinsip Desain & Hierarki",
        minutes: 20,
        topics: [
          {
            title: "Kontras & Hierarki",
            body: "Buat mata pengguna fokus: judul lebih besar/tebal daripada isi, aksi utama lebih menonjol daripada aksi sekunder.",
          },
          {
            title: "Jarak & Grup",
            body: "Jarak yang konsisten mengelompokkan informasi terkait (proximity). Elemen yang dekat dianggap satu kelompok.",
          },
          {
            title: "Warna & Tipografi",
            body: "Gunakan palet terbatas (primer, sekunder, aksen, netral) dan maksimal 2-3 jenis font. Warna merah untuk error, hijau untuk sukses.",
          },
          {
            title: "Pola & Konsistensi",
            body: "Tombol, input, dan komponen yang konsisten membuat produk terasa profesional dan mudah dipelajari.",
          },
        ],
        quiz: [
          {
            q: "Hierarki visual membantu...",
            options: ["Menyembunyikan fitur", "Mengarahkan perhatian pengguna", "Menambah server", "Mengurangi warna"],
            answer: 1,
            explain: "Hierarki memandu mata ke elemen penting dulu.",
          },
          {
            q: "Elemen yang berdekatan dianggap...",
            options: ["Tidak terkait", "Satu kelompok", "Error", "Tombol"],
            answer: 1,
            explain: "Proximity menyatukan informasi terkait.",
          },
          {
            q: "Palet warna yang baik...",
            options: ["Banyak warna cerah", "Terbatas & konsisten", "Hanya hitam", "Acak"],
            answer: 1,
            explain: "Palet terbatas menjaga konsistensi dan fokus.",
          },
        ],
      },
      {
        id: "desain-sistem",
        title: "Design System & Aksesibilitas",
        minutes: 30,
        topics: [
          {
            title: "Design Token",
            body: "Token adalah nilai desain bernama (warna, spasi, radius) yang dipakai komponen — ubah satu token, semua komponen ikut berubah.",
            code: `--color-primary: #2563eb;\n--space-md: 16px;\n--radius-md: 8px;`,
          },
          {
            title: "Komponen & Variasi",
            body: "Bangun komponen dasar (tombol, input, card) lalu variasinya: ukuran, state hover/disabled, dan loading.",
          },
          {
            title: "Aksesibilitas (a11y)",
            body: "Kontras teks ≥ 4.5:1, target sentuh ≥ 44px, label untuk semua input, dan navigasi keyboard tanpa mouse.",
          },
          {
            title: "Screen Reader",
            body: "Gunakan elemen semantik + aria-label untuk elemen ikon-only. Uji dengan pembaca layar agar semua orang bisa memakai produkmu.",
          },
        ],
        quiz: [
          {
            q: "Design token adalah...",
            options: ["Kata sandi", "Nilai desain bernama & terpusat", "Font acak", "Warna server"],
            answer: 1,
            explain: "Token memusatkan keputusan desain.",
          },
          {
            q: "Rasio kontras teks minimum yang dianjurkan?",
            options: ["2:1", "4.5:1", "10:1", "1:1"],
            answer: 1,
            explain: "4.5:1 untuk teks normal (WCAG AA).",
          },
          {
            q: "Target sentuh yang nyaman minimal?",
            options: ["20px", "44px", "10px", "5px"],
            answer: 1,
            explain: "44×44px adalah panduan aksesibilitas umum.",
          },
        ],
      },
    ],
  },
];

export function getCurriculumStack(stackId: string): CurriculumStack | undefined {
  return CURRICULUM_STACKS.find((s) => s.id === stackId);
}

export function getCurriculumModule(
  stackId: string,
  moduleId: string,
): { stack: CurriculumStack; module: CurriculumModule } | undefined {
  const stack = getCurriculumStack(stackId);
  if (!stack) return undefined;
  const mod = stack.modules.find((m) => m.id === moduleId);
  if (!mod) return undefined;
  return { stack, module: mod };
}