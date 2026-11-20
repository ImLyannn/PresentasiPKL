// Satu-satunya tempat aturan navigasi. Ubah di sini untuk mengubah alur.
// Slide 2: previous/next ditambahkan agar tombol panah kiri/kanan tetap berfungsi (ke Slide 1 / Slide 3).
const navigationConfig = {
  1: { next: 2 },
  2: { previous: 1, next: 3, menu: [3, 4, 5, 6, 7, 8, 9, 10] },
  3: { previous: 2, next: 4, home: 2 },
  4: { previous: 3, next: 5, home: 2 },
  5: { previous: 4, next: 6, home: 2 },
  6: { previous: 5, next: 7, home: 2 },
  7: { previous: 6, next: 8, home: 2 },
  8: { previous: 7, next: 9, home: 2 },
  9: { previous: 8, next: 10, home: 2 },
  10: { previous: 9, home: 2 }
};

const Navigation = {
  isValid(n) {
    return Number.isInteger(n) && n >= 1 && n <= presentationConfig.totalSlides;
  },
  // action: 'previous' | 'next' | 'home'. Mengembalikan nomor slide atau null.
  target(slide, action) {
    const entry = navigationConfig[slide];
    const t = entry ? entry[action] : undefined;
    return this.isValid(t) ? t : null;
  },
  canGoTo(from, to) {
    const entry = navigationConfig[from];
    return !!entry && Array.isArray(entry.menu) && entry.menu.includes(to) && this.isValid(to);
  },
  hasControls(slide) {
    return !!(navigationConfig[slide] && navigationConfig[slide].home);
  }
};
