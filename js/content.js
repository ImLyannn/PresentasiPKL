// SEMUA teks dan gambar yang bisa diedit ada di file ini.
// Teks dalam [kurung siku] adalah placeholder dari gambar referensi desain: ganti dengan isi sebenarnya.
// Gambar: isi path (mis. "assets/images/slide-5.png"); null = tampil kotak placeholder.
// tone (warna kartu): lav | yel | peri | sage | peach | blue | white
// icon: book list image columns route chart notebook flag bulb eye sparkle chat grid
const presentationContent = {
  ui: {
    next: "Selanjutnya",
    previous: "Sebelumnya",
    backToMenu: "Kembali ke menu",
    backToCover: "Kembali ke pembuka",
    finish: "Selesai · ke menu",
    fullscreenEnter: "Masuk layar penuh",
    fullscreenExit: "Keluar layar penuh",
    fullscreenUnavailable: "Layar penuh tidak didukung browser ini",
    slideLabel: "Slide {n} dari {total}"
  },

  // Elemen yang tampil di header/footer semua slide
  shell: {
    logoImage: null,              // mis. "assets/images/logo.png"
    logoText: "[Logo]",
    school: "[Nama Sekolah]",
    room: "RUANG PRESENTASI / [Kelas]",
    title: "[Judul Presentasi]",
    authorLine: "Disusun oleh [Nama Siswa]",
    totalMateri: 8
  },

  slides: {
    1: {
      layout: "cover", status: "Pembuka",
      kicker: "PRESENTASI SISWA",
      title: "[Judul Presentasi]",
      subtitle: "[Subjudul atau deskripsi singkat presentasi]",
      card: {
        label: "IDENTITAS PENYAJI", logoText: "[Logo Sekolah]", school: "[Nama Sekolah]",
        rows: [
          { label: "NAMA SISWA", value: "[Nama Siswa]" },
          { label: "KELAS", value: "[Kelas]" },
          { label: "NIS", value: "[NIS]" }
        ]
      }
    },

    2: {
      layout: "menu", status: "Jelajahi materi",
      kicker: "PETA PRESENTASI",
      title: "Mau mulai dari mana?",
      hint: "Pilih satu kartu untuk menjelajahi materi.\nSetiap topik punya ruangnya sendiri.",
      menuItems: [
        { tag: "Materi 01", label: "Pengantar",       icon: "book",     tone: "lav",   target: 3 },
        { tag: "Materi 02", label: "Poin utama",      icon: "list",     tone: "yel",   target: 4 },
        { tag: "Materi 03", label: "Gambar & caption", icon: "image",   tone: "peri",  target: 5 },
        { tag: "Materi 04", label: "Perbandingan",    icon: "columns",  tone: "sage",  target: 6 },
        { tag: "Materi 05", label: "Tahapan",         icon: "route",    tone: "sage",  target: 7 },
        { tag: "Materi 06", label: "Data ringkas",    icon: "chart",    tone: "peach", target: 8 },
        { tag: "Materi 07", label: "Rangkuman",       icon: "notebook", tone: "lav",   target: 9 },
        { tag: "Materi 08", label: "Penutup",         icon: "flag",     tone: "blue",  target: 10 }
      ]
    },

    3: {
      layout: "hero", materi: 1, number: "01", prevLabel: "Menu",
      kicker: "MATERI 01 / PENGANTAR", title: "[Judul Materi]",
      lead: "[Kalimat pembuka untuk memperkenalkan topik kepada audiens]",
      hero: {
        label: "GAGASAN PEMBUKA",
        idea: "[Satu gagasan besar yang menjadi inti presentasi]",
        note: "[Konteks singkat yang membantu audiens memahami mengapa topik ini dibahas]"
      },
      side: {
        title: "Sebelum kita mulai", tone: "sage",
        items: [
          { label: "Latar belakang", text: "[Situasi atau konteks awal topik]" },
          { label: "Tujuan pembahasan", text: "[Hal yang ingin dipahami audiens]" },
          { label: "Pertanyaan pemantik", text: "[Pertanyaan untuk membuka diskusi]" }
        ]
      }
    },

    4: {
      layout: "trio", materi: 2, number: "02",
      kicker: "MATERI 02 / POIN UTAMA", title: "[Judul Materi]",
      lead: "[Pengantar singkat tentang tiga gagasan utama yang akan dijelaskan]",
      cards: [
        { letter: "A", icon: "bulb",    tone: "lav", title: "[Poin utama pertama]", text: "[Penjelasan inti poin ini dalam dua atau tiga kalimat singkat]", note: "[Contoh atau bukti pendukung]" },
        { letter: "B", icon: "eye",     tone: "yel", title: "[Poin utama kedua]",   text: "[Penjelasan inti poin ini dalam dua atau tiga kalimat singkat]", note: "[Contoh atau bukti pendukung]" },
        { letter: "C", icon: "sparkle", tone: "sage", title: "[Poin utama ketiga]", text: "[Penjelasan inti poin ini dalam dua atau tiga kalimat singkat]", note: "[Contoh atau bukti pendukung]" }
      ],
      thread: { label: "BENANG MERAH", text: "[Hubungan singkat antara ketiga poin utama]" }
    },

    5: {
      layout: "figure", materi: 3, number: "03",
      kicker: "MATERI 03 / GAMBAR & CAPTION", title: "[Judul Materi]",
      lead: "[Kalimat pengantar yang menghubungkan gambar dengan topik presentasi]",
      image: null, imageAlt: "[Deskripsi gambar]",
      imageTitle: "[Gambar Materi]", imageHint: "Ganti dengan foto, ilustrasi, atau diagram",
      caption: { label: "GAMBAR 01", text: "[Caption yang menjelaskan isi gambar]", source: "Sumber: [Sumber gambar / dokumentasi]" },
      side: {
        title: "Apa yang kita lihat?", text: "[Jelaskan objek, situasi, atau informasi penting yang terlihat pada gambar]",
        callout: { label: "PERHATIKAN", text: "[Sorot satu detail yang paling relevan dengan pembahasan]" }
      }
    },

    6: {
      layout: "compare", materi: 4, number: "04",
      kicker: "MATERI 04 / PERBANDINGAN", title: "[Judul Materi]",
      lead: "[Jelaskan dua hal yang dibandingkan serta alasan perbandingannya]",
      columns: [
        { letter: "A", title: "[Objek / Konsep A]", tone: "lav" },
        { letter: "B", title: "[Objek / Konsep B]", tone: "sage" }
      ],
      rows: [
        { aspect: "[Aspek pertama]", a: "[Penjelasan aspek pertama pada A]", b: "[Penjelasan aspek pertama pada B]" },
        { aspect: "[Aspek kedua]",   a: "[Penjelasan aspek kedua pada A]",   b: "[Penjelasan aspek kedua pada B]" },
        { aspect: "[Aspek ketiga]",  a: "[Penjelasan aspek ketiga pada A]",  b: "[Penjelasan aspek ketiga pada B]" }
      ],
      conclusion: { label: "KESIMPULAN", text: "[Perbedaan atau persamaan terpenting dari kedua hal di atas]" }
    },

    7: {
      layout: "steps", materi: 5, number: "05",
      kicker: "MATERI 05 / TAHAPAN", title: "[Judul Materi]",
      lead: "[Pengantar alur, proses, atau urutan kegiatan yang akan dipaparkan]",
      from: "MULAI DARI SINI", to: "HASIL AKHIR",
      steps: [
        { n: "01", tone: "lav",  title: "[Nama tahapan]", text: "[Jelaskan apa yang dilakukan dan tujuan tahapan ini]", output: "Luaran: [Hasil tahapan]" },
        { n: "02", tone: "peri", title: "[Nama tahapan]", text: "[Jelaskan apa yang dilakukan dan tujuan tahapan ini]", output: "Luaran: [Hasil tahapan]" },
        { n: "03", tone: "sage", title: "[Nama tahapan]", text: "[Jelaskan apa yang dilakukan dan tujuan tahapan ini]", output: "Luaran: [Hasil tahapan]" },
        { n: "04", tone: "yel",  title: "[Nama tahapan]", text: "[Jelaskan apa yang dilakukan dan tujuan tahapan ini]", output: "Luaran: [Hasil tahapan]" }
      ],
      note: { label: "CATATAN ALUR", text: "[Ketergantungan atau hal penting yang perlu diperhatikan dalam proses]" }
    },

    8: {
      layout: "data", materi: 6, number: "06",
      kicker: "MATERI 06 / DATA RINGKAS", title: "[Judul Materi]",
      lead: "[Kalimat pengantar tentang data, indikator, atau hasil pengamatan]",
      chart: {
        title: "[Judul grafik]", unit: "Satuan: [Satuan]",
        // percent = panjang batang (0–100), sesuaikan dengan data Anda
        bars: [
          { label: "[Kategori A]", value: "[Nilai]", percent: 91, tone: "blue" },
          { label: "[Kategori B]", value: "[Nilai]", percent: 69, tone: "lav" },
          { label: "[Kategori C]", value: "[Nilai]", percent: 49, tone: "sage" }
        ],
        source: "Sumber: [Sumber data] · Periode: [Periode]",
        hint: "Bentuk grafik adalah placeholder; sesuaikan panjang batang dengan data Anda."
      },
      highlight: {
        label: "ANGKA SOROTAN", value: "[Nilai]", name: "[Nama indikator utama]",
        meaningLabel: "MAKNA DATA", meaning: "[Jelaskan pola atau temuan terpenting, tanpa mengulang semua angka]"
      }
    },

    9: {
      layout: "summary", materi: 7, number: "07",
      kicker: "MATERI 07 / RANGKUMAN", title: "[Judul Materi]",
      lead: "[Kalimat penghubung dari seluruh pembahasan menuju kesimpulan]",
      items: [
        { n: "01", title: "[Inti pembahasan]", text: "[Satu kalimat yang merangkum hal paling penting]" },
        { n: "02", title: "[Inti pembahasan]", text: "[Satu kalimat yang merangkum hal paling penting]" },
        { n: "03", title: "[Inti pembahasan]", text: "[Satu kalimat yang merangkum hal paling penting]" }
      ],
      card: { label: "SATU HAL UNTUK DIINGAT", title: "[Kesimpulan utama dari presentasi ini]", note: "[Implikasi atau tindak lanjut yang dapat dipertimbangkan]" }
    },

    10: {
      layout: "closing", materi: 8,
      kicker: "MATERI 08 / PENUTUP", topRight: "[Judul Materi]",
      title: "Terima kasih.", subtitle: "Mari berdiskusi.",
      text: "[Pertanyaan penutup atau ajakan berdiskusi dengan audiens]",
      author: "[Nama Siswa] · [Kelas] · [NIS]",
      reference: { label: "REFERENSI", text: "[Sumber utama / tautan referensi presentasi]" }
    }
  }
};
