/* =========================================================
   Alessandro & Valentina — Interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Config ---- */
  const WEDDING_DATE = new Date("2026-09-12T16:00:00+02:00");
  const GALLERY = [
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80", wide: true },
    { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=700&q=80" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&q=80" },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&q=80" },
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80", wide: true },
    { src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=700&q=80" },
    { src: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=700&q=80" },
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* =====================================================
     ENVELOPE OPEN
     ===================================================== */
  const cover = $("#cover");
  const envelope = $("#envelope");
  const waxSeal = $("#waxSeal");
  const invite = $("#invite");
  const audioToggle = $("#audioToggle");
  let opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;
    envelope.classList.add("is-opening");
    invite.classList.add("is-revealed");
    invite.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      cover.classList.add("is-open");
      document.body.classList.remove("is-locked");
      audioToggle.classList.add("is-visible");
      initReveal();
      tryPlayAudio();
    }, 1400);
  }
  waxSeal.addEventListener("click", openInvitation);
  envelope.addEventListener("click", openInvitation);

  /* =====================================================
     AMBIENT AUDIO
     ===================================================== */
  const audio = $("#ambient");
  let audioReady = false;

  function tryPlayAudio() {
    audio.volume = 0;
    const p = audio.play();
    if (p && p.then) {
      p.then(() => {
        audioReady = true;
        fadeAudio(0.35, 1600);
        audioToggle.classList.add("is-playing");
      }).catch(() => {
        /* autoplay blocked — wait for user toggle */
      });
    }
  }
  function fadeAudio(target, ms) {
    const start = audio.volume, t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / ms);
      audio.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  audioToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        audioReady = true;
        fadeAudio(0.35, 800);
        audioToggle.classList.add("is-playing");
      }).catch(() => {});
    } else {
      audioToggle.classList.remove("is-playing");
      fadeAudio(0, 500);
      setTimeout(() => audio.pause(), 500);
    }
  });

  /* =====================================================
     COUNTDOWN
     ===================================================== */
  const units = {
    days: $('[data-unit="days"]'),
    hours: $('[data-unit="hours"]'),
    mins: $('[data-unit="mins"]'),
    secs: $('[data-unit="secs"]'),
  };
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    const diff = WEDDING_DATE - new Date();
    if (diff <= 0) {
      Object.values(units).forEach((u) => (u.textContent = "00"));
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    units.days.textContent = pad(d);
    units.hours.textContent = pad(h);
    units.mins.textContent = pad(m);
    units.secs.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* =====================================================
     GALLERY + LIGHTBOX
     ===================================================== */
  const grid = $("#galleryGrid");
  GALLERY.forEach((item, i) => {
    const fig = document.createElement("div");
    fig.className = "gallery__item" + (item.wide ? " gallery__item--wide" : "");
    fig.innerHTML = `<img loading="lazy" src="${item.src}" alt="A cherished moment" data-index="${i}" />`;
    grid.appendChild(fig);
  });

  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = GALLERY[i].src.replace(/w=\d+/, "w=1400");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  function step(dir) {
    lbIndex = (lbIndex + dir + GALLERY.length) % GALLERY.length;
    lbImg.src = GALLERY[lbIndex].src.replace(/w=\d+/, "w=1400");
  }
  grid.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (img) openLightbox(+img.dataset.index);
  });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => step(-1));
  $("#lbNext").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* =====================================================
     RSVP FORM
     ===================================================== */
  const rsvpForm = $("#rsvpForm");
  const thanks = $("#rsvpThanks");
  let attend = "yes";

  $$(".seg__opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".seg__opt").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      attend = btn.dataset.value;
    });
  });

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#guestName").value.trim();
    const email = $("#guestEmail").value.trim();
    if (!name || !email) return;

    const rsvp = {
      name, email, attend,
      guests: $("#guests").value,
      message: $("#message").value.trim(),
      at: new Date().toISOString(),
    };
    // Persist locally; wire to a backend/Google Form as needed.
    try {
      const all = JSON.parse(localStorage.getItem("rsvps") || "[]");
      all.push(rsvp);
      localStorage.setItem("rsvps", JSON.stringify(all));
    } catch (_) {}

    rsvpForm.querySelector('button[type="submit"]').style.display = "none";
    thanks.hidden = false;
    thanks.textContent = attend === "yes"
      ? "Thank you — we cannot wait to celebrate with you. ✦"
      : "Thank you for letting us know — you will be dearly missed. ✦";
    burst();
  });

  /* =====================================================
     GUEST WISHES (with localStorage persistence)
     ===================================================== */
  const wishForm = $("#wishForm");
  const wishWall = $("#wishWall");
  const SEED = [
    { name: "Isabella", text: "May your love be as endless as the horizon over Lake Como." },
    { name: "Marco & Family", text: "Two beautiful souls, one perfect union. Congratulations!" },
    { name: "Sophia", text: "Here's to a lifetime of laughter, adventure, and Sunday mornings." },
  ];
  function loadWishes() {
    try { return JSON.parse(localStorage.getItem("wishes") || "null") || SEED; }
    catch (_) { return SEED; }
  }
  function saveWishes(list) {
    try { localStorage.setItem("wishes", JSON.stringify(list)); } catch (_) {}
  }
  function renderWish(w, prepend) {
    const el = document.createElement("div");
    el.className = "wish";
    el.innerHTML = `<p class="wish__text">${escapeHTML(w.text)}</p><span class="wish__name">${escapeHTML(w.name)}</span>`;
    if (prepend) wishWall.prepend(el); else wishWall.appendChild(el);
  }
  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  let wishes = loadWishes();
  wishes.forEach((w) => renderWish(w));

  wishForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#wishName").value.trim();
    const text = $("#wishText").value.trim();
    if (!name || !text) return;
    const w = { name, text };
    wishes.push(w);
    saveWishes(wishes);
    renderWish(w, true);
    wishForm.reset();
    burst();
  });

  /* =====================================================
     ADD TO CALENDAR (.ics download)
     ===================================================== */
  $("#calBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const dt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = new Date(WEDDING_DATE.getTime() + 8 * 3600000);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AV Wedding//EN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@avwedding",
      "DTSTAMP:" + dt(new Date()),
      "DTSTART:" + dt(WEDDING_DATE),
      "DTEND:" + dt(end),
      "SUMMARY:Wedding of Alessandro & Valentina",
      "LOCATION:Villa del Balbianello, Lake Como, Italy",
      "DESCRIPTION:With joy, we invite you to celebrate our wedding.",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "AV-Wedding.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view", "is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    $$("section, .reveal").forEach((el) => io.observe(el));
  }

  /* =====================================================
     FALLING GOLD PETALS (canvas)
     ===================================================== */
  const canvas = $("#petals");
  const ctx = canvas.getContext("2d");
  let W, H, petals = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function makePetal() {
    return {
      x: Math.random() * W,
      y: Math.random() * -H,
      size: 6 + Math.random() * 10,
      speed: 0.4 + Math.random() * 1.1,
      sway: Math.random() * 2 * Math.PI,
      swaySpeed: 0.01 + Math.random() * 0.02,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.5,
    };
  }
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.opacity;
    const g = ctx.createLinearGradient(0, -p.size, 0, p.size);
    g.addColorStop(0, "#f0d78a");
    g.addColorStop(1, "#c9a24b");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.7, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.7, 0, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }
  function animate() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach((p) => {
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.6;
      p.y += p.speed;
      p.rot += p.rotSpeed;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
      drawPetal(p);
    });
    requestAnimationFrame(animate);
  }
  if (!reduce) {
    resize();
    petals = Array.from({ length: Math.min(34, Math.floor(W / 40)) }, makePetal);
    animate();
    window.addEventListener("resize", resize);
  }

  /* =====================================================
     CELEBRATION BURST (confetti of petals)
     ===================================================== */
  function burst() {
    if (reduce) return;
    for (let i = 0; i < 26; i++) {
      const p = makePetal();
      p.x = W / 2 + (Math.random() - 0.5) * 200;
      p.y = H * 0.5;
      p.speed = 1 + Math.random() * 2;
      petals.push(p);
    }
    setTimeout(() => { petals = petals.slice(0, 40); }, 4000);
  }

})();
