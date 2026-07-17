import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CLINICAL_SYSTEM_PROMPT = `Anda adalah seorang dokter profesional dan scribe medis berpengalaman dalam praktik terapi tradisional dan modern.
Tugas Anda: Menerjemahkan assessment pasien layman (layman's self-assessment) ke dalam format SOAP note profesional yang terstruktur dalam Bahasa Indonesia.

INPUT yang akan Anda terima:
- patient_name: nama pasien
- pain_points: array lokasi nyeri dengan tipe nyeri (mis. DULL_ACHE, SHARP, BURNING, PRESSURE, THROBBING)
- pain_intensity: skala 1-10
- patient_description: deskripsi keluhan pasien dalam bahasa sehari-hari (Indonesian)
- screening_questions: object berisi jawaban skrining keselamatan (ya/tidak)
- triage_status: HIJAU / KUNING / MERAH_MENDESAK / MERAH_DARURAT
- triage_answers: detail jawaban skrining yang menghasilkan triage status

OUTPUT: Anda HARUS menghasilkan SOAP note dalam format Markdown dengan struktur EXACT berikut:

## SUBJECTIVE
- **Keluhan Utama:** [terjemahkan keluhan pasien ke terminologi medis singkat, mis. "Nyeri leher kronis akibat ketegangan otot servikal"]
- **Riwayat Penyakit Sekarang:** [riwayat onset, durasi, faktor pemicu/penyebab]
- **Gejala Penyerta:** [gejala tambahan dari patient_description]
- **Riwayat Skrining Keselamatan:** [ringkas jawaban skrining penting, khususnya yang berkaitan triage status]

## OBJECTIVE
- **Lokasi Nyeri:** [area anatomis medis, berdasarkan pain_points, mis. "Trapezius bilateral, cervical C4-C6"]
- **Skala Nyeri:** {pain_intensity}/10
- **Tipe Nyeri:** [terjemahkan pain_type ke deskripsi medis, mis. DULL_ACHE → "nyeri tumpul tanpa radiasi"]
- **Temuan Penting:** [ekstrak dari screening yang relevan klinis, mis. "riwayat trauma, terapi sebelumnya, kontraindikasi"]

## ASSESSMENT
- **Diagnosis Klinis:** [1-2 baris diagnosis medis yang akurat berdasarkan gejala, tanpa spekulasi berlebih]
- **Tingkat Triase:** {triage_status} [terjemahkan: HIJAU = aman, KUNING = perlu review terapis, MERAH_MENDESAK = urgent review, MERAH_DARURAT = emergency referral]
- **Indikasi Terapi:** [apakah pasien cocok untuk terapi tradisional/massage, atau perlu rujukan medis]
- **Red Flags / Kontraindikasi:** [daftar kondisi yang melarang/membatasi teknik tertentu, jika ada]

## PLAN
- **Rekomendasi Terapi:** [singkat, konkret, sesuai triage level]
- **Batasan/Restriksi:** [area yang harus dihindari, tekanan maksimal, durasi maksimal sesi, jika ada]
- **Follow-up:** [kapan harus konsultasi ke dokter, kondisi monitoring]
- **Disclaimer:** Catatan bahwa assessment ini adalah pendukung, bukan pengganti diagnosis medis profesional.

PENTING:
- Gunakan EXACT struktur markdown di atas (heading level ## dan bullet points seperti ditunjukkan).
- Jangan menambah section lain di luar yang diminta.
- Jika data screening menunjukkan red flag (MERAH_DARURAT), tekankan dalam ASSESSMENT bahwa pasien HARUS rujuk ke dokter sebelum terapi.
- Jika KUNING, ingatkan bahwa perlu review terapis bersertifikat sebelum sesi dimulai.
- Semua teks dalam Bahasa Indonesia medis, jelas, dan dapat dipahami oleh terapis profesional dan dokter.
- Hindari jargon yang terlalu teknis kecuali diperlukan; prioritaskan clarity.
- Temperatur output: 0.3 (konsisten, clinical-grade, tidak spekulatif).`;

export class ClinicalTranslationService {
  static async generateSoapNote({
    patientName,
    painPoints,
    painIntensity,
    patientDescription,
    screeningQuestions,
    triageStatus,
    triageAnswers
  }) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

      const userPrompt = `Generate a clinical SOAP note untuk pasien berikut:

**Data Pasien:**
- Nama: ${patientName}
- Nyeri Utama: ${painPoints.map(p => `${p.location} (${p.painType})`).join(', ')}
- Intensitas Nyeri: ${painIntensity}/10
- Keluhan Pasien: "${patientDescription}"
- Status Triase: ${triageStatus}

**Jawaban Skrining Keselamatan:**
${Object.entries(screeningQuestions || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

**Detail Jawaban yang Memicu Triase ${triageStatus}:**
${Object.entries(triageAnswers || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Hasilkan SOAP note lengkap mengikuti format yang telah ditentukan dalam system prompt.`;

      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
          topP: 0.8,
          topK: 40
        }
      });

      const soapNote = response.response.text();

      if (!soapNote || soapNote.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return {
        soapNote,
        generatedAt: new Date().toISOString(),
        model: 'gemini-1.0-pro',
        tokenUsage: response.response.usageMetadata || {}
      };
    } catch (error) {
      console.warn('Clinical translation error, using fallback response:', error.message);
      // Fallback mode for demo purposes - generate a sample SOAP note
      return this.generateFallbackSoapNote(patientName, painPoints, painIntensity, triageStatus, patientDescription);
    }
  }

  static generateFallbackSoapNote(patientName, painPoints, painIntensity, triageStatus, patientDescription) {
    const painLocations = painPoints.map(p => p.location).join(', ');
    const painTypes = painPoints.map(p => p.painType.replace(/_/g, ' ')).join(', ');

    const soapNote = `## SUBJECTIVE
- **Keluhan Utama:** Nyeri di area ${painLocations}
- **Riwayat Penyakit Sekarang:** Pasien melaporkan nyeri dengan intensitas ${painIntensity}/10. ${patientDescription}
- **Gejala Penyerta:** Sesuai dengan laporan pasien atas sensasi nyeri yang dirasakan.
- **Riwayat Skrining Keselamatan:** Hasil skrining menunjukkan status triase ${triageStatus}.

## OBJECTIVE
- **Lokasi Nyeri:** ${painLocations}
- **Skala Nyeri:** ${painIntensity}/10
- **Tipe Nyeri:** ${painTypes}
- **Temuan Penting:** Berdasarkan penilaian skrining keselamatan pasien, status triase ditetapkan sebagai ${triageStatus}.

## ASSESSMENT
- **Diagnosis Klinis:** Nyeri muskuloskeletal di area ${painLocations} dengan intensitas ${painIntensity}/10.
- **Tingkat Triase:** ${triageStatus}
- **Indikasi Terapi:** Pasien adalah kandidat untuk evaluasi dan terapi pendukung sesuai dengan status triase yang ditetapkan.
- **Red Flags / Kontraindikasi:** Lihat hasil skrining keselamatan untuk detail kondisi khusus yang mungkin mempengaruhi pilihan terapi.

## PLAN
- **Rekomendasi Terapi:** Lakukan penilaian lebih lanjut oleh profesional terapi berlisensi sesuai dengan status triase dan kondisi pasien.
- **Batasan/Restriksi:** Hindari teknik atau area yang dapat memperburuk kondisi pasien. Ikuti protokol keselamatan berdasarkan hasil skrining.
- **Follow-up:** Lakukan monitoring berkala terhadap perkembangan kondisi pasien dan hasil terapi.
- **Disclaimer:** Catatan bahwa assessment ini adalah pendukung komunikasi saja, bukan pengganti diagnosis medis profesional. Pasien harus berkonsultasi dengan dokter untuk kondisi yang serius atau tidak kunjung membaik.`;

    return {
      soapNote,
      generatedAt: new Date().toISOString(),
      model: 'fallback-template',
      tokenUsage: { fallback: true }
    };
  }

  static async validateSoapNoteStructure(soapNote) {
    const requiredSections = ['SUBJECTIVE', 'OBJECTIVE', 'ASSESSMENT', 'PLAN'];
    const missingSection = requiredSections.find(
      section => !soapNote.includes(`## ${section}`)
    );

    return {
      isValid: !missingSection,
      missingSection,
      hasSubjective: soapNote.includes('## SUBJECTIVE'),
      hasObjective: soapNote.includes('## OBJECTIVE'),
      hasAssessment: soapNote.includes('## ASSESSMENT'),
      hasPlan: soapNote.includes('## PLAN')
    };
  }
}
