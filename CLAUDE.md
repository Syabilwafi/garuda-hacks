# CLAUDE.md — PressPoint (Prototype PRD & Development Guide)

> Dokumen ini adalah instruksi utama bagi Claude Code saat membangun prototipe **PressPoint**. Baca seluruh dokumen sebelum menulis kode apa pun. Semua keputusan arsitektur, pola desain, dan alur demo di bawah ini **bersifat wajib**, bukan opsional, kecuali dinyatakan lain oleh pengguna.
PressPoint
---

## 1. Ringkasan Proyek

**Nama Produk:** PressPoint
**Kategori:** Platform pemetaan nyeri 3D interaktif (dual-language health translator) + evaluasi teknik terapi berbasis AI video assessment.
**Tujuan Kompetisi/Demo:** Menunjukkan kematangan rekayasa perangkat lunak (backend Express.js yang solid + algoritma graph theory + AI video analysis menggunakan OpenAI API / Claude API), bukan sekadar UI cantik.

### 1.1 Latar Belakang Masalah
- Di Indonesia, penanganan kesehatan berjalan paralel: masyarakat sering ke tukang urut/terapis tradisional sebelum ke fasilitas medis (Puskesmas/dokter).
- Ketika pasien akhirnya ke dokter, terjadi **blank spot informasi** — pasien hanya bisa menjelaskan secara awam ("diurut di sini, nyut-nyutan"), sehingga dokter kesulitan memisahkan cedera awal dari efek pijatan.
- **Gap komunikasi inti**: tidak ada jembatan bahasa antara terminologi tradisional (titik meridian/urat) dan terminologi medis (anatomi otot/saraf).
- **Masalah tambahan (kualitas layanan)**: tidak ada mekanisme objektif untuk menilai apakah teknik yang dilakukan terapis tradisional saat sesi terapi sudah benar secara anatomis/aman, sehingga risiko cedera akibat teknik yang salah sulit dipantau atau dievaluasi.

### 1.2 Solusi
PressPoint menerjemahkan keluhan nyeri visual pasien (via model 3D) ke dalam **dua bahasa**:
1. **Diagnosis medis terstruktur** → untuk dokter.
2. **Panduan titik pijat/akupresur** → untuk terapis tradisional, lengkap dengan pantangan.

Selain itu, PressPoint menyediakan **evaluasi objektif berbasis AI (OpenAI API / Claude API, BUKAN model yang di-training sendiri)** terhadap teknik yang dilakukan terapis saat sesi terapi berlangsung, menggunakan analisis video.

Alur inti (Pain Mapping):
1. Pasien "mewarnai" area sakit pada model 3D yang bisa diputar 360°.
2. Sistem menerjemahkan area tersebut menjadi anatomi medis (mis. *Myofascial pain* di *Trapezius*).
3. Sistem memetakan titik yang sama ke jalur saraf/meridian pijat menggunakan algoritma graph, lalu merekomendasikan titik pijat aman untuk peredaan nyeri sementara.

Alur tambahan (Training Evaluation):
4. Terapis merekam video saat melakukan sesi terapi ke pasien.
5. Sistem menganalisis video tersebut dengan AI (via OpenAI/Claude API) untuk menilai apakah teknik yang digunakan sudah sesuai standar aman.
6. Sistem menghasilkan laporan evaluasi teknik terapi.

---

## 2. Prinsip Pengembangan (WAJIB DIPATUHI)

1. **Backend adalah bintang utama demo ini.** Jangan biarkan waktu pengembangan habis di polish UI sementara arsitektur Express.js (Generic Repository, Singleton, Graph Traversal, Video Evaluation Service) tidak berjalan atau tidak teruji.
2. **Jangan menyimpang dari scope.** Jika ada penambahan fitur di luar dokumen ini, konfirmasi ke pengguna dulu sebelum implementasi.
3. **Semua output kode harus lengkap dan langsung bisa dijalankan** — tidak ada TODO kosong, tidak ada stub tanpa implementasi, kecuali eksplisit diminta sebagai placeholder.
4. **Konvensi bahasa:**
   - Kode (nama kelas, method, variabel, komentar teknis): **Bahasa Inggris**.
   - Konten yang tampil ke pengguna (UI copy, label medis/tradisional, pesan error yang user-facing): **Bahasa Indonesia**.
   - Dokumentasi (README, PRD, komentar arsitektur): **Bahasa Indonesia**.
5. **Utamakan production-minded prototyping**: kode boleh scope-nya kecil (prototipe demo), tapi kualitasnya harus mencerminkan best practice (testable, terstruktur, tidak ada magic number/hardcoded path sembarangan).
6. **Untuk fitur video (Bagian 5), prioritaskan arsitektur yang siap diintegrasikan dengan model AI eksternal (OpenAI/Claude API), bukan implementasi CV dari nol.** Prototipe cukup menunjukkan pipeline end-to-end yang benar (upload → proses → hasil evaluasi terstruktur).

---

## 3. Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| Frontend | React + React Three Fiber (`@react-three/fiber`, `@react-three/drei`) | Render model 3D manusia interaktif, rotasi 360°, dan fitur "coloring" area nyeri |
| Deployment Frontend | Vercel | Harus responsif dan siap diakses saat demo tanpa setup tambahan |
| Backend Core | Express.js (Node.js) | Logika diagnosis, repository, graph algorithm, orkestrasi evaluasi video |
| Testing Backend | Jest | Target coverage **>80%** khusus pada algoritma translasi koordinat → diagnosis, dan pada logic parsing hasil evaluasi video |
| AI Integration (Pain Mapping) | API Client ke OpenAI API atau Claude API (bukan model sendiri) | Generate assessment/rekomendasi bahasa natural |
| AI Integration (Video Evaluation) | API Client ke OpenAI API (mis. GPT-4V) atau Claude API (mis. Claude 3.5 Sonnet) (bukan model sendiri) | Menilai kebenaran teknik terapi dari rekaman video |
| Penyimpanan Video | Object storage (mis. Vercel Blob / S3-compatible) untuk prototipe | Video tidak disimpan sebagai BLOB di database utama |
| Komunikasi Frontend↔Backend | REST API (JSON, multipart untuk upload video) | Endpoint jelas, lihat Bagian 7 |

> Catatan: Jika backend Express.js tidak feasible untuk di-deploy bersamaan dengan frontend Vercel dalam waktu demo, siapkan mode "mock API" di frontend yang tetap memanggil struktur response yang sama — tapi backend Express.js tetap harus ada dan teruji sebagai bukti engineering, walau dijalankan lokal saat demo.

---

## 4. Aset Model 3D

Referensi aset 3D yang digunakan: model humanoid low-poly (T-pose), dengan tiga tampilan referensi — **depan, belakang, dan samping** — seperti pada gambar acuan yang diberikan (wireframe mesh humanoid standar, cocok untuk rigging dan UV mapping sederhana).

**Ketentuan wajib untuk implementasi model 3D di frontend:**
- Model di-load dalam format **GLTF/GLB** (hasil export dari mesh referensi tersebut, atau model low-poly humanoid sejenis yang license-nya bebas dipakai untuk prototipe).
- **Rotasi 360°**: pengguna dapat memutar model secara bebas menggunakan drag/orbit control (`OrbitControls` dari `@react-three/drei`) untuk melihat dari depan, belakang, dan samping — merepresentasikan tiga sudut pandang pada gambar referensi.
- **Fungsi "coloring" area nyeri**: pengguna dapat menandai/mewarnai bagian tubuh yang terasa sakit langsung di atas permukaan mesh (bukan sekadar memilih dari daftar dropdown). Implementasi disarankan:
  - Gunakan **raycasting** (`THREE.Raycaster`) untuk mendeteksi titik/segmen mesh yang diklik/di-drag oleh pengguna.
  - Setiap segmen mesh yang ditandai disimpan sebagai `coordinate3D` beserta `intensity`/`painType` yang dipilih pengguna (mis. "Nyeri Tumpul").
  - Area yang sudah ditandai diberi warna overlay (mis. gradasi merah/oranye sesuai intensitas) langsung di atas mesh, agar terlihat jelas oleh pasien maupun saat direview dokter.
- Model yang sama (dengan mesh/topologi identik) dipakai ulang di **Tab Tradisional** untuk menampilkan node titik pijat yang menyala (Bagian 8.2), sehingga pasien melihat kontinuitas visual antara area yang ditandai dan titik pijat yang direkomendasikan.

---

## 5. Fitur 4 — Evaluasi Hasil Training (AI Video Assessment)

### 5.1 Tujuan Fitur
Memberikan mekanisme objektif untuk menilai apakah teknik yang dilakukan terapis tradisional saat sesi terapi ke pasien sudah benar dan aman, menggunakan analisis video berbasis AI (OpenAI/Claude API) — sehingga kualitas layanan terapis dapat dipantau dan ditingkatkan secara terukur, bukan hanya berdasarkan penilaian subjektif.

### 5.2 Alur Fungsional
1. **Perekaman**: Terapis merekam video saat melakukan sesi terapi ke pasien (upload video dari perangkat, atau rekam langsung via browser jika didukung).
2. **Deteksi AI**: Video yang diunggah diproses oleh AI (via API eksternal) untuk mendeteksi dan menilai teknik yang digunakan terapis (mis. posisi tangan, tekanan, area yang disentuh) dibandingkan dengan standar teknik yang benar.
3. **Evaluasi**: Sistem menghasilkan skor/status evaluasi (mis. "Teknik Sesuai", "Perlu Perbaikan", "Berisiko") beserta catatan spesifik per segmen video (timestamp-based feedback).

### 5.3 Arsitektur Backend untuk Fitur Ini

**Model data baru** (mengikuti pola `TreatmentRecord` yang sudah ada agar kompatibel dengan Generic Repository di Bagian 6.1):
```typescript
export interface TrainingEvaluationRecord extends TreatmentRecord {
    therapistId: string;
    patientId: string;
    videoUrl: string;
    status: EvaluationStatus;       // SESUAI, PERLU_PERBAIKAN, BERISIKO
    feedbackTimeline: TechniqueFeedback[];
    evaluatedAt: Date;
}

export interface TechniqueFeedback {
    timestampSeconds: number;
    bodyAreaTargeted: string;
    note: string;                    // catatan evaluasi, mis. "Tekanan terlalu kuat di area leher"
    severity: FeedbackSeverity;      // INFO, WARNING, CRITICAL
}
```

**Service layer:**
```typescript
export interface VideoEvaluationService {
    evaluate(videoUrl: string, therapistId: string, patientId: string): Promise<TrainingEvaluationRecord>;
}

export class AiVideoEvaluationService implements VideoEvaluationService {
    private aiApiClient: AiApiClient; // reuse Singleton AiApiClient atau instance terpisah

    constructor() {
        this.aiApiClient = AiApiClient.getInstance();
    }
    // Alur: kirim referensi video ke OpenAI/Claude API -> parse response terstruktur -> map ke TrainingEvaluationRecord
}
```

- `TrainingEvaluationRecord` disimpan melalui `TreatmentRepository<TrainingEvaluationRecord>` — **repository generic yang sama** dari Bagian 6.1, tanpa perlu membuat kelas repository baru. Ini menjadi bukti tambahan bahwa desain Generic Repository benar-benar reusable, bukan hanya untuk dua tipe record awal.
- Setiap evaluasi juga dicatat oleh `DiagnosisLogger` (Singleton, Bagian 6.2) agar seluruh aktivitas sistem — baik pain mapping maupun training evaluation — tercatat di satu tempat yang konsisten.
- **Unit test wajib** untuk `AiVideoEvaluationService`: mock `AiApiClient`/`AiVideoApiClient` agar test tidak bergantung pada koneksi eksternal, verifikasi parsing response AI ke `TrainingEvaluationRecord` benar untuk skenario sukses maupun response tidak lengkap/error.

### 5.4 Kontrak API

```
POST /api/training/evaluate
Content-Type: multipart/form-data
```

**Request (multipart fields):**
```
therapistId: string
patientId: string
video: file (mp4/mov)
```

**Response Body:**
```json
{
  "evaluationId": "string",
  "status": "PERLU_PERBAIKAN",
  "summary": "Teknik dasar sudah sesuai, namun tekanan pada area leher perlu dikurangi.",
  "feedbackTimeline": [
    {
      "timestampSeconds": 12.5,
      "bodyAreaTargeted": "Trapezius Dextra",
      "note": "Tekanan terlalu kuat di area dekat tulang belakang leher",
      "severity": "WARNING"
    },
    {
      "timestampSeconds": 34.0,
      "bodyAreaTargeted": "Pundak Belakang",
      "note": "Posisi tangan dan arah pijatan sudah tepat",
      "severity": "INFO"
    }
  ]
}
```

### 5.5 Ketentuan Frontend untuk Fitur Ini
- Tambahkan halaman/tab baru **"Evaluasi Training"** (terpisah dari alur Pain Mapping) yang berisi:
  - Form upload video (atau tombol rekam langsung via `MediaRecorder` API jika waktu memungkinkan; jika tidak, upload file saja sudah cukup untuk prototipe).
  - Setelah submit, tampilkan status loading yang jelas (proses AI video butuh waktu lebih lama dari pain mapping — beri indikasi progres, bukan spinner generik saja).
  - Tampilkan hasil evaluasi sebagai **timeline** (video player + daftar feedback per timestamp, idealnya feedback bisa diklik untuk lompat ke timestamp terkait di video).
  - Gunakan badge warna untuk `status` (mis. hijau = Sesuai, kuning = Perlu Perbaikan, merah = Berisiko) agar mudah dibaca sekilas oleh juri saat demo.

### 5.6 Catatan Demo untuk Fitur Ini
- Fitur ini **opsional untuk demo utama** (Bagian 9) jika waktu terbatas, tetapi backend-nya tetap harus terimplementasi dan teruji sebagai bukti kelengkapan arsitektur.
- Untuk demo, siapkan **video contoh yang sudah diverifikasi hasilnya** (bukan real-time AI call yang berisiko lambat/gagal saat live), dengan opsi fallback response tersimpan jika koneksi API AI video bermasalah.

---

## 6. Arsitektur Backend (Express.js) — Detail Wajib (Pain Mapping)

### 6.1 Generic Repository Pattern
Buat `TreatmentRepository<T>` generic agar `MedicalRecord`, `TraditionalTherapyRecord`, dan `TrainingEvaluationRecord` (Bagian 5.3) bisa disimpan/diproses tanpa duplikasi kode.

```typescript
export interface TreatmentRepository<T extends TreatmentRecord> {
    save(record: T): void;
    findById(id: string): T | undefined;
    findAll(): T[];
    findByPatientId(patientId: string): T[];
}

export class InMemoryTreatmentRepository<T extends TreatmentRecord> implements TreatmentRepository<T> {
    private storage: Map<string, T> = new Map();
    // implementasi standar CRUD in-memory untuk kebutuhan prototipe
    // ...
}
```

`MedicalRecord`, `TraditionalTherapyRecord`, dan `TrainingEvaluationRecord` sama-sama extend/implement `TreatmentRecord` (abstract base atau interface) agar kompatibel dengan repository generic ini.

### 6.2 Singleton Pattern
Wajib diterapkan pada kelas berikut:

1. **`DiagnosisLogger`** — mencatat setiap aksi diagnosis maupun evaluasi training (timestamp, input, output) ke log file/console. Singleton thread-safe (bisa dicapai di Node.js lewat class dengan private constructor & static instance atau caching dari module system).
2. **`AiApiClient`** — koneksi ke API model AI eksternal (OpenAI/Claude API) untuk narasi teks (pain mapping). Satu instance koneksi yang di-reuse di seluruh aplikasi.
3. **`AiVideoApiClient`** (baru) — koneksi ke API model AI eksternal khusus analisis video (Bagian 5). Jika model AI teks dan video berasal dari provider yang sama, boleh digabung menjadi satu client dengan method berbeda; jika berbeda, buat singleton terpisah dengan pola yang sama.

```typescript
export class DiagnosisLogger {
    private static instance: DiagnosisLogger;
    
    private constructor() {}
    
    public static getInstance(): DiagnosisLogger {
        if (!DiagnosisLogger.instance) {
            DiagnosisLogger.instance = new DiagnosisLogger();
        }
        return DiagnosisLogger.instance;
    }

    public log(event: DiagnosisEvent): void { /* ... */ }
}
```

### 6.3 Algoritma Pemetaan — Graph Theory (Killer Feature)

Representasikan tubuh manusia sebagai **Directed Graph**:
- **Node** = titik anatomi (area otot/saraf) ATAU titik pijat refleksi.
- **Edge** = jalur saraf/meridian yang menghubungkan titik nyeri ke titik pijat refleksi terkait, dengan bobot (weight) yang merepresentasikan kedekatan/relevansi jalur.

**Struktur data yang wajib diimplementasikan:**
```typescript
export interface BodyPointNode {
    id: string;
    anatomicalName: string;   // mis. "Trapezius Dextra"
    meridianLabel: string;    // mis. "Titik Pundak Belakang"
    type: PointType;          // PAIN_SOURCE, REFLEX_POINT, TRANSIT
}

export interface MeridianEdge {
    from: BodyPointNode;
    to: BodyPointNode;
    weight: number;
    pathwayName: string; // nama jalur saraf/meridian
}
```

**Algoritma yang dipakai:**
- Dari node sumber (titik nyeri hasil klik/coloring user pada model 3D, Bagian 4), lakukan **BFS/DFS** untuk mencari **connected component** yang relevan.
- Gunakan pencarian **simple path** (mis. Dijkstra untuk shortest weighted path, atau DFS berbatas untuk simple path tanpa siklus) menuju node titik pijat refleksi yang sesuai.
- Contoh: nyeri di punggung bawah (lumbar) → traversal graph → titik pijat refleksi di telapak kaki.
- Simpan definisi graph (node + edge) sebagai data seed terstruktur (JSON/CSV) yang di-load saat startup — **jangan hardcode logika pemetaan langsung di dalam method**, agar mudah di-maintain dan diuji.

### 6.4 Alur Pemrosesan End-to-End (Backend, Pain Mapping)
1. Terima koordinat 3D (hasil raycasting dari fungsi coloring, Bagian 4) + tipe nyeri (mis. "Dull Ache").
2. `CoordinateToAnatomyMapper` menerjemahkan koordinat → node anatomi medis.
3. `MeridianGraphService` melakukan traversal graph dari node tersebut → node titik pijat refleksi terkait.
4. `AiApiClient` (singleton) memanggil AI (OpenAI/Claude) untuk menyusun narasi assessment dalam bahasa medis dan bahasa tradisional berdasarkan hasil mapping di atas.
5. `DiagnosisLogger` (singleton) mencatat seluruh aksi ini.
6. Response dikembalikan dalam format dual-dashboard (lihat Bagian 7.2).

---

## 7. Kontrak API (Frontend ↔ Backend) — Pain Mapping

### 7.1 Endpoint Utama
```
POST /api/assessment/generate
```

**Request Body:**
```json
{
  "patientId": "string",
  "painMarks": [
    { "coordinate3D": { "x": 0.0, "y": 0.0, "z": 0.0 }, "painType": "DULL_ACHE" }
  ]
}
```

### 7.2 Response Body (Dual Dashboard)
```json
{
  "medical": {
    "complaint": "Nyeri tumpul di area Cervical & Trapezius dekstra",
    "indication": "Ketegangan otot servikal",
    "affectedAreas": ["Cervical", "Trapezius Dextra"]
  },
  "traditional": {
    "highlightedNodes": [
      { "id": "shoulder-back-01", "label": "Titik Pundak Belakang", "coordinate3D": { "x": 0.0, "y": 0.0, "z": 0.0 } },
      { "id": "thumb-base-01", "label": "Pangkal Ibu Jari", "coordinate3D": { "x": 0.0, "y": 0.0, "z": 0.0 } }
    ],
    "instructions": "Pijat ringan pada area pundak belakang dan pangkal ibu jari untuk meredakan ketegangan sementara.",
    "contraindications": ["Jangan pijat langsung di area tulang belakang bagian leher."]
  }
}
```

> Frontend wajib merender kedua tab (`Tab Medis` dan `Tab Tradisional`) dari satu response ini, termasuk highlight node menyala di model 3D sesuai `highlightedNodes`. Untuk endpoint evaluasi video, lihat Bagian 5.4.

---

## 8. Frontend — Ketentuan Teknis

- Gunakan `@react-three/fiber` untuk render model 3D manusia sesuai spesifikasi Bagian 4 (rotasi 360° via `OrbitControls`, fungsi coloring via raycasting).
- Tools interaksi pasien minimal: pemilihan tipe nyeri (mis. "Nyeri Tumpul") lalu klik/drag area pada model 3D untuk mewarnai titik yang sakit.
- Tombol utama: **"Generate Assessment"** → memanggil `POST /api/assessment/generate`.
- Output ditampilkan sebagai **dual dashboard** (dua tab): Medis & Tradisional, sesuai kontrak di Bagian 7.2.
- Highlight titik pijat pada tab Tradisional harus divisualisasikan sebagai node menyala pada model 3D yang sama (bukan gambar statis terpisah), agar demo terasa "hidup".
- Tambahkan halaman terpisah **"Evaluasi Training"** sesuai Bagian 5.5.
- Desain UI: bersih, medical-grade trust (warna netral/biru-hijau), bukan playful/kartun — karena ini menyangkut kesehatan.

---

## 9. Demo Flow (Skenario Eksekusi)

Urutan ini **wajib berjalan mulus tanpa error** saat demo:

### 9.1 Alur Utama — Pain Mapping
1. Buka aplikasi via URL Vercel.
2. Tampilkan model 3D manusia (bisa diputar 360°, sesuai Bagian 4).
3. Pilih tools "Nyeri Tumpul" (Dull Ache), klik/warnai area bahu kanan dan leher pada model 3D.
4. Klik **"Generate Assessment"**.
5. Di balik layar: koordinat 3D → `CoordinateToAnatomyMapper` → `MeridianGraphService` (graph traversal) → `AiApiClient` (OpenAI/Claude API).
6. Tampilkan **Tab Medis**: laporan terstruktur (contoh: "Keluhan: Nyeri tumpul di area Cervical & Trapezius dekstra. Indikasi: Ketegangan otot servikal.").
7. Tampilkan **Tab Tradisional**: node menyala di model 3D pada titik pundak belakang & pangkal ibu jari, disertai instruksi dan pantangan (contoh: "Jangan pijat langsung di area tulang belakang bagian leher.").

### 9.2 Alur Tambahan — Evaluasi Training (jika waktu demo memungkinkan)
8. Pindah ke halaman "Evaluasi Training".
9. Upload video contoh sesi terapi yang sudah disiapkan sebelumnya.
10. Klik **"Evaluasi Video"**.
11. Tampilkan hasil evaluasi: status (mis. "Perlu Perbaikan") + timeline feedback per timestamp.

**Catatan implementasi untuk memastikan demo mulus:**
- Siapkan skenario/input yang sudah divalidasi sebelumnya (happy path) sebagai default demo, sambil tetap membuktikan sistem general-purpose.
- Tambahkan loading state yang jelas selama proses backend berjalan (jangan biarkan layar kosong/freeze), terutama untuk evaluasi video yang prosesnya lebih lama.
- Siapkan fallback response (cached/mock) jika koneksi ke AI API bermasalah saat demo live, agar demo tidak gagal total — berlaku untuk kedua fitur (pain mapping dan video evaluation).

---

## 10. Struktur Folder yang Disarankan

```
PressPoint/
├── backend/
│   ├── src/
│   │   ├── models/           # TreatmentRecord, TraditionalTherapyRecord, TrainingEvaluationRecord,
│   │   │                     # BodyPointNode, MeridianEdge, TechniqueFeedback
│   │   ├── repositories/     # TreatmentRepository<T>, InMemoryTreatmentRepository<T>
│   │   ├── services/         # CoordinateToAnatomyMapper, MeridianGraphService, AiVideoEvaluationService
│   │   ├── clients/          # AiApiClient, AiVideoApiClient (Singleton, connect to OpenAI/Claude)
│   │   ├── logging/          # DiagnosisLogger (Singleton)
│   │   ├── controllers/      # AssessmentController, TrainingEvaluationController
│   │   └── config/           # graph seed data loader
│   ├── tests/                # Jest test files, mirror struktur di atas
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Model3D (rotasi 360° + coloring), PainMarker,
│   │   │                     # DashboardMedical, DashboardTraditional,
│   │   │                     # VideoUploadForm, EvaluationTimeline
│   │   ├── hooks/
│   │   └── api/              # client fetch ke backend
│   └── public/               # aset model 3D (GLB/GLTF)
└── CLAUDE.md
```

---

## 11. Quality Assurance

- **Framework:** Jest.
- **Cakupan wajib:** unit test untuk:
  - `CoordinateToAnatomyMapper` (translasi koordinat → diagnosis medis).
  - `MeridianGraphService` (traversal graph, termasuk edge case: node tanpa path, graph disconnected).
  - `TreatmentRepository` generic (CRUD dasar untuk ketiga tipe record).
  - `DiagnosisLogger`, `AiApiClient`, `AiVideoApiClient` (verifikasi singleton instance identik di seluruh pemanggilan).
  - `AiVideoEvaluationService` (parsing response AI ke `TrainingEvaluationRecord`, termasuk skenario response tidak lengkap/error).
- **Target code coverage: >80%**, khususnya pada modul algoritma translasi koordinat ke diagnosis dan modul parsing evaluasi video.
- Gunakan fitur coverage bawaan Jest (`jest --coverage`) untuk menghasilkan laporan coverage yang bisa ditunjukkan ke juri sebagai bukti.
- Semua test harus dapat dijalankan dengan satu perintah (`npm test` atau `yarn test`), tanpa dependency eksternal yang butuh koneksi internet saat testing (mock `AiApiClient`/`AiVideoApiClient` di unit test).

---

## 12. Batasan & Disclaimer (Wajib Ditampilkan di UI)

Karena ini menyangkut kesehatan, aplikasi **wajib** menampilkan disclaimer yang jelas di UI (bukan hanya di dokumen ini):
- PressPoint adalah alat bantu komunikasi dan evaluasi, **bukan pengganti diagnosis medis profesional**.
- PressPointsi titik pijat bersifat peredaan nyeri sementara, bukan pengobatan definitif.
- Evaluasi teknik terapi berbasis AI bersifat **pendukung penilaian**, bukan sertifikasi resmi kompetensi terapis.
- Pengguna disarankan tetap berkonsultasi ke tenaga medis untuk kondisi yang tidak membaik atau memburuk.

---

## 13. Checklist Sebelum Demo

- [ ] Generic Repository berjalan untuk ketiga tipe record tanpa duplikasi kode.
- [ ] Singleton `DiagnosisLogger`, `AiApiClient`, dan `AiVideoApiClient` terverifikasi via unit test (instance identik).
- [ ] Graph traversal (BFS/DFS/Dijkstra) menghasilkan path yang benar dari minimal 3 skenario nyeri berbeda.
- [ ] Model 3D dapat diputar 360° dan fungsi coloring area nyeri berjalan (raycasting terdeteksi dengan benar).
- [ ] Unit test Jest lulus semua, coverage >80% pada modul mapping/algoritma dan modul evaluasi video.
- [ ] Endpoint `POST /api/assessment/generate` mengembalikan response sesuai kontrak Bagian 7.2.
- [ ] Endpoint `POST /api/training/evaluate` mengembalikan response sesuai kontrak Bagian 5.4.
- [ ] Frontend ter-deploy di Vercel dan bisa diakses tanpa setup tambahan.
- [ ] Dual dashboard (Medis & Tradisional) tampil benar dengan highlight node 3D yang sinkron.
- [ ] Halaman "Evaluasi Training" menampilkan timeline feedback dengan benar.
- [ ] Disclaimer kesehatan tampil di UI.
- [ ] Fallback/mock response siap jika API AI (teks maupun video) bermasalah saat demo live.
