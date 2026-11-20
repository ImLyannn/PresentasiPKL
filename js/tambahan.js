// JavaScript hanya dipakai untuk dua hal kecil. Isi slide, perpindahan slide, dan animasi
// sudah sepenuhnya HTML + CSS (lihat index.html dan css/).
(function () {
  "use strict";

  /* 1. Tombol panah keyboard: kanan = berikutnya, kiri = sebelumnya, Home = menu (slide 2) */
  function slideAktif() {
    var t = document.querySelector(".slide:target");
    return t ? Number(t.id.replace("slide-", "")) : 1;
  }
  function pindah(n) {
    if (document.getElementById("slide-" + n)) location.hash = "slide-" + n;
  }
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "ArrowRight") { pindah(slideAktif() + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { pindah(slideAktif() - 1); e.preventDefault(); }
    else if (e.key === "Home") { pindah(2); e.preventDefault(); }
  });

  /* 2. Tombol layar penuh (teks label ada di atribut data-label-* pada tombolnya) */
  var btn = document.getElementById("fullscreen-btn");
  var root = document.documentElement;
  var masuk = root.requestFullscreen || root.webkitRequestFullscreen;
  var keluar = document.exitFullscreen || document.webkitExitFullscreen;
  function sedangPenuh() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function setLabel(teks) { btn.setAttribute("aria-label", teks); btn.title = teks; }

  if (btn && masuk && document.fullscreenEnabled !== false) {
    btn.addEventListener("click", function () {
      if (sedangPenuh()) keluar.call(document); else masuk.call(root);
    });
    var sinkron = function () {
      var aktif = !!sedangPenuh();
      btn.setAttribute("aria-pressed", String(aktif));
      setLabel(aktif ? btn.dataset.labelKeluar : btn.dataset.labelMasuk);
    };
    document.addEventListener("fullscreenchange", sinkron);
    document.addEventListener("webkitfullscreenchange", sinkron);
  } else if (btn) {
    btn.disabled = true;
    setLabel(btn.dataset.labelTidakDidukung);
  }
})();
