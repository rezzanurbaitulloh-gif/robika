import type { CurriculumStack } from "../curriculum";

export const GO_TRACK: CurriculumStack = {
  id: "go",
  name: "Go",
  icon: "bolt",
  description:
    "Bahasa modern dari Google: sederhana, cepat, dan luar biasa untuk server, API, dan layanan cloud. Satu bahasa untuk build hingga deploy.",
  color: "cyan",
  difficulty: "Menengah",
  modules: [
    {
      id: "go-pengenalan",
      title: "Pengenalan Go",
      minutes: 10,
      topics: [
        {
          title: "Apa itu Go?",
          body:
            "Go (Golang) adalah bahasa yang dibuat Google untuk server yang cepat dan mudah dikelola. Dikenal karena: sintaks sederhana, kompilasi ke satu binary, goroutine (konkurensi mudah), dan tooling bawaan (fmt, test, vet). Dipakai oleh Docker, Kubernetes, dan banyak layanan cloud.",
          code: `package main

import "fmt"

func main() {
	fmt.Println("Halo, dunia!")
}

// jalankan:  go run main.go
// build:     go build main.go  -> satu binary`,
        },
        {
          title: "Setup: go mod",
          body:
            "Setiap project Go dimulai dengan go mod init nama-modul. Module mendeklarasikan path dan dependensi. Perintah inti: go run (jalankan), go build (kompilasi), go test (uji), go vet (periksa), gofmt (format). Semua bawaan — tidak perlu install eksternal.",
          code: `// inisialisasi module
go mod init robika

// struktur
// go.mod          -> module & dependensi
// main.go         -> entry point
// internal/       -> paket internal
// go.sum          -> kunci dependensi

// jalankan
go run main.go
go test ./...
go build -o robika .`,
        },
        {
          title: "Variabel & Tipe",
          body:
            "Go adalah strongly-typed. Deklarasi: var nama tipe = nilai; atau := (inferensi, hanya di dalam fungsi). Tipe dasar: int, int64, float64, string, bool, byte, rune. Perbedaan int vs int64 penting di aplikasi besar. Konstanta dengan const.",
          code: `package main

import "fmt"

func main() {
	var umur int = 12
	var tinggi float64 = 1.55
	var nama string = "Bimo"
	var aktif bool = true
	const VERSI = "1.0"

	// inferensi (hanya di dalam fungsi)
	skor := 90
	pesan := "Lulus"

	fmt.Println(umur, tinggi, nama, aktif, VERSI)
	fmt.Println(skor, pesan)
}`,
        },
        {
          title: "Operator & Konversi",
          body:
            "Operator aritmetika, perbandingan, dan logika sama seperti bahasa lain. Go TIDAK mengubah tipe secara otomatis — konversi eksplisit dengan Tipe(nilai): int(tinggi), float64(umur). string(int) mengubah kode karakter, bukan angka menjadi teks.",
          code: `a := 10
b := 3

fmt.Println(a / b)   // 3  (int)
fmt.Println(a % b)   // 1
fmt.Println(a == b)  // false

// konversi eksplisit
var x float64 = float64(a) / 3.0
fmt.Println(x)       // 3.333...

// string(65) = "A" (kode karakter), bukan "65"
fmt.Println(string(rune(65)))   // A
fmt.Println(65)                 // 65`,
        },
        {
          title: "fmt: Output",
          body:
            "fmt.Println menampilkan dengan baris baru; fmt.Printf memformat: %d int, %s string, %f float, %v nilai apa pun, %T tipe. fmt.Sprintf mengembalikan string terformat. fmt.Errorf membuat error terformat. Paket fmt adalah alat komunikasi utama Go.",
          code: `nama := "Bimo"
skor := 95.5

fmt.Printf("Nama: %s, Skor: %.1f\\n", nama, skor)
// Nama: Bimo, Skor: 95.5

fmt.Printf("Tipe skor: %T\\n", skor)   // float64

pesan := fmt.Sprintf("%s mendapat %d", nama, 95)
fmt.Println(pesan)

err := fmt.Errorf("skor tidak valid: %d", -1)
fmt.Println(err)`,
        },
      ],
      quiz: [
        {
          q: "Kata kunci mendeklarasikan variabel dengan inferensi tipe adalah...",
          options: ["var", ":=", "let", "auto"],
          answer: 1,
          explain: ":=\" mendeklarasikan dan menginfer tipe, hanya di dalam fungsi.",
        },
        {
          q: "Kompilasi program Go menghasilkan...",
          options: ["bytecode", "satu binary executable", "file .jar", "script"],
          answer: 1,
          explain: "go build menghasilkan satu binary yang berdiri sendiri.",
        },
        {
          q: "Format untuk menampilkan string di Printf adalah...",
          options: ["%d", "%s", "%v", "%f"],
          answer: 1,
          explain: "%s untuk string, %d int, %f float, %v nilai apa pun.",
        },
      ],
    },
    {
      id: "go-kontrol",
      title: "Kontrol Alur & Fungsi",
      minutes: 15,
      topics: [
        {
          title: "if-else & Switch",
          body:
            "if di Go bisa punya statement awal: if err := cek(); err != nil {}. Switch otomatis break tiap case; case bisa banyak nilai dan kondisi; switch tanpa ekspresi = if-else berantai yang rapi.",
          code: `skor := 85

if skor >= 90 {
	fmt.Println("A")
} else if skor >= 80 {
	fmt.Println("B")
} else {
	fmt.Println("C")
}

// switch
switch skor {
case 100, 95:
	fmt.Println("Sempurna")
case 90:
	fmt.Println("Sangat baik")
default:
	fmt.Println("Baik")
}

// switch ekspresi (if-else rapi)
switch {
case skor >= 90:
	fmt.Println("A")
case skor >= 80:
	fmt.Println("B")
default:
	fmt.Println("C")
}`,
        },
        {
          title: "for: Satu-satunya Loop",
          body:
            "Go hanya punya for — untuk semua pola. for kondisi (while), for inisialisasi; kondisi; langkah (klasik), for range (iterasi array/map/string), for { } (loop tak hingga dengan break). range memberi indeks DAN nilai — atau nilai saja dengan _.",
          code: `// klasik
for i := 1; i <= 5; i++ {
	fmt.Print(i, " ")
}
fmt.Println()   // 1 2 3 4 5

// seperti while
n := 5
for n > 0 {
	fmt.Print(n, " ")
	n--
}
fmt.Println()   // 5 4 3 2 1

// range
angka := []int{10, 20, 30}
for i, v := range angka {
	fmt.Println(i, v)
}

// nilai saja
for _, v := range angka {
	fmt.Println(v)
}`,
        },
        {
          title: "Fungsi Multi-Return",
          body:
            "Fungsi Go bisa mengembalikan BANYAK nilai — pola idiomatis: (hasil, error). Penamaan parameter di signature juga menjadi dokumentasi. Named return value memungkinkan return kosong dengan nilai terisi.",
          code: `func bagi(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("pembagian dengan nol")
	}
	return a / b, nil
}

func main() {
	hasil, err := bagi(10, 2)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("Hasil:", hasil)
}`,
        },
        {
          title: "Error Handling Idiomatis",
          body:
            "Go tidak punya exception — error adalah nilai (interface error). Pola standar: cek error segera setelah panggilan, return error ke atas bila gagal. jangan abaikan: _ = f() hampir selalu salah. Error wrapping dengan fmt.Errorf(\"...: %w\", err) untuk jejak penyebab.",
          code: `func bacaFile(nama string) (string, error) {
	data, err := os.ReadFile(nama)
	if err != nil {
		// wrap: tambah konteks, pertahankan penyebab
		return "", fmt.Errorf("baca %s: %w", nama, err)
	}
	return string(data), nil
}

func proses() error {
	isi, err := bacaFile("catatan.txt")
	if err != nil {
		return err
	}
	fmt.Println(isi)
	return nil
}

func main() {
	if err := proses(); err != nil {
		fmt.Println("Gagal:", err)
	}
}`,
        },
        {
          title: "Defer: Pembersihan",
          body:
            "defer menjadwalkan eksekusi saat fungsi SELESAI — idiom untuk menutup file/connection. Defer jalan LIFO (terakhir dulu). Sangat berguna: buka resource di awal, jadwalkan tutupnya di sampingnya — tidak lupa, selalu berjalan walau terjadi error/panic.",
          code: `func catat() error {
	f, err := os.Create("log.txt")
	if err != nil {
		return err
	}
	defer f.Close()   // pasti ditutup

	fmt.Fprintln(f, "mulai")
	// ... banyak kode, error di mana pun
	// f tetap tertutup otomatis

	return nil
}

// multiple defer: LIFO
func contoh() {
	defer fmt.Println("3. selesai")
	defer fmt.Println("2. tengah")
	fmt.Println("1. mulai")
}`,
        },
      ],
      quiz: [
        {
          q: "Pola fungsi Go yang paling idiomatis mengembalikan...",
          options: ["nilai tunggal", "nilai dan error", "objek exception", "kode status"],
          answer: 1,
          explain: "Go memakai (hasil, error) dan memeriksa error secara eksplisit.",
        },
        {
          q: "Menjadwalkan eksekusi saat fungsi selesai memakai...",
          options: ["finally", "defer", "dequeue", "go"],
          answer: 1,
          explain: "defer menjalankan pernyataan saat fungsi kembali — ideal untuk close.",
        },
        {
          q: "Go hanya memiliki satu jenis perulangan, yaitu...",
          options: ["while", "for", "loop", "each"],
          answer: 1,
          explain: "for menangani semua pola loop di Go.",
        },
      ],
    },
    {
      id: "go-struktur",
      title: "Struct, Slice & Map",
      minutes: 20,
      topics: [
        {
          title: "Struct",
          body:
            "Struct adalah tipe data bentukan: kumpulan field dengan tipe. Ini setara class sederhana — tanpa inheritance. Buat nilai struct dengan literal berurutan atau berlabel. Struct adalah cara utama memodelkan data domain.",
          code: `type Karakter struct {
	Nama  string
	HP    int
	Level int
}

func main() {
	bimo := Karakter{Nama: "Bimo", HP: 100, Level: 1}
	sari := Karakter{"Sari", 90, 2}   // urutan field

	fmt.Println(bimo.Nama)   // Bimo
	bimo.HP = 70
	fmt.Println(bimo)        // {Bimo 70 1}
}`,
        },
        {
          title: "Method pada Struct",
          body:
            "Method adalah fungsi dengan receiver: func (k Karakter) serang() — dipanggil k.serang(). Receiver nilai (k Karakter) tidak mengubah struct asli; receiver pointer (k *Karakter) mengubah. Konvensi: mutasi harus pakai pointer receiver.",
          code: `type Karakter struct {
	Nama string
	HP   int
}

// receiver nilai — tidak mengubah asli
func (k Karakter) info() string {
	return fmt.Sprintf("%s HP %d", k.Nama, k.HP)
}

// receiver pointer — mengubah asli
func (k *Karakter) serang(damage int) {
	k.HP -= damage
}

func main() {
	bimo := Karakter{"Bimo", 100}
	bimo.serang(30)
	fmt.Println(bimo.info())   // Bimo HP 70
}`,
        },
        {
          title: "Slice",
          body:
            "Slice adalah array dinamis: []int{...}. append menambah elemen, slice [start:end] mengambil potongan, len panjang, cap kapasitas. Slice selalu dilewatkan sebagai referensi ke fungsi. Ini koleksi paling sering dipakai di Go.",
          code: `nilai := []int{80, 90, 75}
fmt.Println(len(nilai))   // 3

nilai = append(nilai, 95)
fmt.Println(nilai)        // [80 90 75 95]

potongan := nilai[1:3]    // [90 75]
fmt.Println(potongan)

// buat slice kosong berkapasitas awal
skor := make([]int, 0, 10)

// iterasi
total := 0
for _, n := range nilai {
	total += n
}
fmt.Println(total)`,
        },
        {
          title: "Map",
          body:
            "Map adalah pasangan kunci-nilai: map[string]int{}. Akses m[kunci], cek keberadaan dengan dua nilai: v, ok := m[k]. Hapus dengan delete. Iterasi dengan range — URUTAN TIDAK DIJAMIN. Map nil perlu make sebelum diisi.",
          code: `skor := map[string]int{
	"bimo": 90,
	"sari": 85,
}

skor["doni"] = 78
fmt.Println(skor["bimo"])   // 90

nilai, ada := skor["rina"]
fmt.Println(nilai, ada)     // 0 false (tidak ada)

delete(skor, "doni")

for nama, n := range skor {
	fmt.Println(nama, n)
}

// inisialisasi map kosong
m := make(map[string]int)`,
        },
        {
          title: "Pointer",
          body:
            "Pointer menyimpan alamat memori: *Tipe. &variabel mengambil alamat; *pointer membaca nilai di alamat. Pointer memungkinkan fungsi mengubah data asli dan menghindari salinan besar. Go menangani mayoritas alokasi otomatis — pointer dipakai saat dibutuhkan saja.",
          code: `func ubah(nama *string) {
	*nama = "Robika Baru"
}

func main() {
	nama := "Robika"
	fmt.Println(nama)        // Robika

	ubah(&nama)              // kirim alamat
	fmt.Println(nama)        // Robika Baru

	// pointer ke int
	x := 10
	p := &x
	fmt.Println(*p)          // 10
	*p = 25
	fmt.Println(x)           // 25
}`,
        },
      ],
      quiz: [
        {
          q: "Struct Go adalah...",
          options: ["class dengan inheritance", "kumpulan field bertipe", "array dinamis", "pasangan kunci-nilai"],
          answer: 1,
          explain: "Struct mengelompokkan field; map adalah pasangan kunci-nilai.",
        },
        {
          q: "Method yang MENGUBAH data struct memakai receiver...",
          options: ["nilai", "pointer", "const", "static"],
          answer: 1,
          explain: "Receiver pointer (*Karakter) memungkinkan mutasi struct asli.",
        },
        {
          q: "Menambah elemen ke slice memakai fungsi...",
          options: ["add", "append", "push", "insert"],
          answer: 1,
          explain: "append(slice, elemen...) mengembalikan slice baru.",
        },
      ],
    },
    {
      id: "go-server",
      title: "Server HTTP",
      minutes: 25,
      topics: [
        {
          title: "Server Dasar net/http",
          body:
            "net/http adalah server HTTP bawaan Go. http.HandleFunc mendaftarkan handler; http.ListenAndServe menjalankan server. Handler menerima http.ResponseWriter (kirim balasan) dan *http.Request (data masuk). Server pertama dalam 5 baris.",
          code: `package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Halo, dunia!")
	})

	fmt.Println("Server di :8080")
	http.ListenAndServe(":8080", nil)
}`,
        },
        {
          title: "Route & Query",
          body:
            "Route membedakan path: /, /halo, /api/skor. Query string dibaca r.URL.Query().Get(\"q\"). Data method dibaca r.Method. HandleFunc yang rapi memisahkan tiap endpoint — pola dasar API.",
          code: `http.HandleFunc("/", beranda)
http.HandleFunc("/halo", halo)
http.HandleFunc("/api/skor", apiSkor)

func halo(w http.ResponseWriter, r *http.Request) {
	nama := r.URL.Query().Get("nama")
	if nama == "" {
		nama = "Teman"
	}
	fmt.Fprintf(w, "Halo, %s!", nama)
}

func apiSkor(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintf(w, \`{"skor": 90}\`)
}`,
        },
        {
          title: "JSON Response",
          body:
            "API mengembalikan JSON. encoding/json mengubah struct ke JSON: json.Marshal (atau json.NewEncoder(w).Encode). Struct field memakai tag json:\"nama\". Set Content-Type application/json. Pola ini dipakai semua API Go modern.",
          code: `type User struct {
	ID    int    \`json:"id"\`
	Nama  string \`json:"nama"\`
	Skor  int    \`json:"skor"\`
	Aktif bool   \`json:"aktif"\`
}

func userHandler(w http.ResponseWriter, r *http.Request) {
	user := User{ID: 1, Nama: "Bimo", Skor: 90, Aktif: true}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// output:
// {"id":1,"nama":"Bimo","skor":90,"aktif":true}`,
        },
        {
          title: "Membaca JSON Request",
          body:
            "Terima JSON dari klien: json.NewDecoder(r.Body).Decode(&target). Lalu validasi, proses, dan balas. Menutup r.Body dengan defer adalah kebiasaan baik. Error handling: decode gagal -> 400 Bad Request.",
          code: `type SkorBaru struct {
	Siswa string \`json:"siswa"\`
	Nilai int    \`json:"nilai"\`
}

func simpanSkor(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var data SkorBaru
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "JSON tidak valid", http.StatusBadRequest)
		return
	}

	if data.Siswa == "" || data.Nilai < 0 || data.Nilai > 100 {
		http.Error(w, "data tidak valid", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}`,
        },
        {
          title: "Middleware Dasar",
          body:
            "Middleware membungkus handler: logging, autentikasi, CORS. Pola: fungsi menerima http.Handler lalu mengembalikan handler baru. ini memungkinkan cross-cutting concern terpisah dari logika route — fondasi framework web seperti Gin dan Echo.",
          code: `func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		fmt.Printf("%s %s (%s)\\n",
			r.Method, r.URL.Path, time.Since(start))
	})
}

func auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if token == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/skor", apiSkor)

	server := http.Server{
		Addr:    ":8080",
		Handler: logMiddleware(auth(mux)),
	}
	server.ListenAndServe()
}`,
        },
      ],
      quiz: [
        {
          q: "Menjalankan server HTTP Go memakai fungsi...",
          options: ["ListenAndServe", "RunServer", "Start", "ServeHTTP"],
          answer: 0,
          explain: "http.ListenAndServe(address, handler) menjalankan server.",
        },
        {
          q: "Mengubah struct menjadi JSON memakai paket...",
          options: ["fmt", "encoding/json", "os", "strings"],
          answer: 1,
          explain: "encoding/json menangani marshal/unmarshal JSON.",
        },
        {
          q: "Membaca data POST dari body JSON memakai...",
          options: ["r.Form", "json.NewDecoder(r.Body).Decode", "r.URL.Query", "fmt.Scan"],
          answer: 1,
          explain: "Decode membaca body JSON ke struct target.",
        },
      ],
    },
    {
      id: "go-proyek",
      title: "Proyek Mini: API Skor",
      minutes: 30,
      topics: [
        {
          title: "Desain & Data",
          body:
            "Bangun API skor siswa: POST /api/skor (tambah), GET /api/skor (daftar), GET /api/skor/ranking (top 3). Simpan data di memori (slice) — di produksi diganti database. Struct Skor memodelkan data; API jelas memisahkan tanggung jawab.",
          code: `type Skor struct {
	Nama string \`json:"nama"\`
	Nilai int   \`json:"nilai"\`
}

var daftarSkor []Skor

func main() {
	http.HandleFunc("/api/skor", handleSkor)
	http.HandleFunc("/api/skor/ranking", handleRanking)
	http.ListenAndServe(":8080", nil)
}`,
        },
        {
          title: "Handler CRUD",
          body:
            "Satu route menangani banyak method dengan switch r.Method: POST menambah, GET membaca. Decode JSON, validasi, append ke slice. Kirim status 201 Created saat sukses menambah — semantik HTTP yang benar.",
          code: `func handleSkor(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var s Skor
		if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
			http.Error(w, "JSON tidak valid", http.StatusBadRequest)
			return
		}
		if s.Nama == "" || s.Nilai < 0 || s.Nilai > 100 {
			http.Error(w, "data tidak valid", http.StatusBadRequest)
			return
		}
		daftarSkor = append(daftarSkor, s)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(s)

	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(daftarSkor)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}`,
        },
        {
          title: "Ranking",
          body:
            "Sort slice dengan sort.Slice lalu ambil 3 teratas. Salin ke slice baru agar data asli tetap. Kirim sebagai JSON. sort.Slice memakai less function — pola sortir kustom yang sama dipakai di semua aplikasi Go.",
          code: `func handleRanking(w http.ResponseWriter, r *http.Request) {
	if len(daftarSkor) == 0 {
		json.NewEncoder(w).Encode([]Skor{})
		return
	}

	urut := append([]Skor(nil), daftarSkor...)
	sort.Slice(urut, func(i, j int) bool {
		return urut[i].Nilai > urut[j].Nilai
	})

	top := urut
	if len(top) > 3 {
		top = top[:3]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(top)
}`,
        },
        {
          title: "Testing HTTP",
          body:
            "Uji handler dengan httptest: buat request, jalankan handler, periksa status dan body. go test menjalankan semua test. Go test adalah warga kelas satu — struktur test: file _test.go, fungsi TestXxx(t *testing.T).",
          code: `func TestHandleSkor(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost,
		"/api/skor",
		strings.NewReader(\`{"nama":"Bimo","nilai":90}\`))
	w := httptest.NewRecorder()

	handleSkor(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("status = %d, ingin 201", w.Code)
	}
}

// jalankan
// go test ./...
// output: ok   robika   0.012s`,
        },
        {
          title: "Evaluasi & Pengembangan",
          body:
            "Evaluasi: uji POST valid, POST tanpa nama (400), GET kosong ([]), ranking 5 data (3 teratas). Kembangkan: simpan ke database (database/sql), tambah middleware logging & CORS, atau gunakan framework Gin untuk routing lebih cepat. Kamu sekarang bisa membangun backend Go yang siap produksi.",
          code: `// pengujian manual
// curl -X POST -d '{"nama":"Bimo","nilai":90}' \\
//   http://localhost:8080/api/skor
// curl http://localhost:8080/api/skor/ranking

// lanjutan: koneksi database
// import "database/sql"
// db, err := sql.Open("mysql", dsn)
// defer db.Close()

// lanjutan: framework Gin
// r := gin.Default()
// r.GET("/api/skor", handler)
// r.Run()`,
        },
      ],
      quiz: [
        {
          q: "Mengurutkan slice memakai fungsi...",
          options: ["sort.Slice", "sort.SortSlice", "slice.Sort", "order.Slice"],
          answer: 0,
          explain: "sort.Slice(s, less func) mengurutkan dengan fungsi pembanding.",
        },
        {
          q: "Test handler HTTP memakai paket...",
          options: ["testing", "httptest", "net/http", "mock"],
          answer: 1,
          explain: "httptest membuat request dan recorder untuk menguji handler.",
        },
        {
          q: "Status untuk berhasil membuat data adalah...",
          options: ["200", "201", "204", "404"],
          answer: 1,
          explain: "201 Created menandakan resource berhasil dibuat.",
        },
      ],
    },
  ],
};