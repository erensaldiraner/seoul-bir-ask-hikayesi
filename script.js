/* ==========================================================
   SEOUL, BİR AŞK HİKÂYESİ — sahne motoru
   Kişiselleştirme için yalnızca CONFIG bölümünü düzenlemen yeterli.
   ========================================================== */
const CONFIG = {
  inviteDate: "Bu Cumartesi · 20:00",
  invitePlace: "Sürpriz 🤫 (Seni kapından alacağım)",

  // Fotoğraflar "photos" klasöründen okunur (01.jpg, 02.jpg ...).
  // Dosya yoksa şık bir yer tutucu gösterilir.
  scenes: [
    { type: "card", text: "SEOUL CINEMA sunar", sub: "서울 시네마 제공" },
    { type: "card", text: "Bir şehir.", sub: "도시 하나." },
    { type: "card", text: "Milyonlarca insan.", sub: "수백만 명의 사람들." },
    { type: "card", text: "Ve tek bir tesadüf.", sub: "그리고 단 한 번의 우연." },
    { type: "photo", src: "photos/01.jpg", stamp: "21:15", wide: true, pos: "50% 55%",
      tr: "O akşam, saat 21:15'te... sana âşık olacağımı henüz bilmiyordum.",
      sub: "그날 저녁 9시 15분, 내가 너를 사랑하게 될 줄은 아직 몰랐어." },
    { type: "photo", src: "photos/02.jpg", wide: true, pos: "50% 50%",
      tr: "Bazı hikâyeler tek bir bakışla başlar.",
      sub: "어떤 이야기는 한 번의 눈빛으로 시작된다." },
    { type: "photo", src: "photos/03.jpg", pos: "50% 45%",
      tr: "Şehrin bütün ışıkları sönse, yolumu yine gülüşünle bulurdum.",
      sub: "도시의 모든 불빛이 꺼져도, 너의 미소로 길을 찾을 거야." },
    { type: "card", text: "Bu kış...", sub: "이번 겨울" },
    { type: "photo", src: "photos/04.jpg", pos: "50% 45%",
      tr: "Yağmur yağsın, aldırmam. Şemsiyem sensin.",
      sub: "비가 와도 괜찮아. 네가 나의 우산이니까." },
    { type: "photo", src: "photos/05.jpg", wide: true, pos: "40% 55%",
      tr: "Seninle sıradan bir gün bile bir film sahnesine dönüşüyor.",
      sub: "너와 함께라면 평범한 하루도 영화의 한 장면이 돼." },
    { type: "photo", src: "photos/06.jpg", stamp: "∞", pos: "50% 55%",
      tr: "Sen yanımdayken zaman yavaşlıyor.",
      sub: "君がそばにいると、時間がゆっくり流れる。" },
    { type: "photo", src: "photos/07.jpg", pos: "50% 55%",
      tr: "Her karede sen varsın... çünkü kameram hep sana dönük.",
      sub: "모든 장면에 네가 있어. 내 카메라는 언제나 너를 향하니까." },
    { type: "photo", src: "photos/08.jpg", pos: "50% 50%",
      tr: "Bu film hiç bitmesin istiyorum.",
      sub: "이 영화가 영원히 끝나지 않았으면 좋겠어." },
    { type: "card", cls: "big", text: "ALEYNA", sub: "başrolde · 주연" },
    { type: "card", cls: "title", text: "SEOUL, BİR AŞK HİKÂYESİ", sub: "Yalnızca bir kalpte gösterimde.", dur: 4200 },
  ],

  credits: [
    ["YÖNETMEN", "Eren"],
    ["BAŞROL", "Aleyna"],
    ["SENARYO", "Kalbimiz"],
    ["GÖRÜNTÜ YÖNETMENİ", "Sana her bakışında yeniden büyülenen gözlerim"],
    ["MÜZİK", "Ghostly Kisses — Empty Note (Acoustic)<br><small style='opacity:.7'>ve senin gülüşün</small>"],
    ["IŞIK", "Gözlerin"],
    ["ÇEKİM YERİ", "Birlikte olduğumuz her yer"],
    ["KOSTÜM", "Üstüne ne giysen yakışıyor"],
    ["ÖZEL TEŞEKKÜR", "Bizi tanıştıran o güzel tesadüf"],
  ],
};

/* ---------- Yardımcılar ---------- */
const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function go(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
}
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3600);
}

/* ---------- Ses ---------- */
let actx;
function tick(freq = 1000, len = 0.07, vol = 0.15) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + len);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + len);
  } catch (e) {}
}
function tearSound() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const len = 0.35, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2) * (Math.random() > 0.6 ? 1 : 0.3);
    const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    f.type = "highpass"; f.frequency.value = 1800; g.gain.value = 0.35;
    src.buffer = buf; src.connect(f).connect(g).connect(actx.destination); src.start();
  } catch (e) {}
}

const music = $("#music"), soundBtn = $("#soundBtn");
let musicOk = false;
music.addEventListener("canplay", () => { musicOk = true; });
function startMusic() {
  try { music.volume = 0.2; } catch (e) {}
  music.play().then(() => {
    soundBtn.classList.remove("hidden");
    let v = 0.2;
    const f = setInterval(() => {
      v = Math.min(0.7, v + 0.03);
      try { music.volume = v; } catch (e) {}
      if (v >= 0.7) clearInterval(f);
    }, 150);
  }).catch(() => {});
}
soundBtn.addEventListener("click", () => {
  music.muted = !music.muted;
  soundBtn.classList.toggle("off", music.muted);
});

/* ---------- Atmosfer: bokeh + yağmur ---------- */
(function bokeh() {
  const colors = ["#19d3c5", "#e3264f", "#ffb347", "#ff4f8b", "#3fa7ff"];
  const box = $("#bokeh");
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    const size = 40 + Math.random() * 140;
    Object.assign(s.style, {
      width: size + "px", height: size + "px",
      left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
      background: colors[i % colors.length],
      animationDuration: 8 + Math.random() * 10 + "s",
      animationDelay: -Math.random() * 10 + "s",
    });
    box.appendChild(s);
  }
})();

(function rain() {
  const c = $("#rain"), ctx = c.getContext("2d");
  let w, h, drops;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    drops = Array.from({ length: Math.floor(w / 9) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      l: 10 + Math.random() * 18, v: 7 + Math.random() * 9, a: 0.08 + Math.random() * 0.22,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (const d of drops) {
      ctx.strokeStyle = `rgba(170,220,255,${d.a})`;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2, d.y + d.l); ctx.stroke();
      d.y += d.v; d.x -= 0.6;
      if (d.y > h) { d.y = -20; d.x = Math.random() * (w + 50); }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  addEventListener("resize", resize);
  resize(); draw();
})();

/* ---------- 0 · Giriş ---------- */
$("#startBtn").addEventListener("click", () => {
  tick(660, 0.12, 0.1);
  startMusic();
  go("ticketScreen");
});

/* ---------- 1 · Bilet ---------- */
(function barcode() {
  const b = $("#barcode");
  for (let i = 0; i < 26; i++) {
    const bar = document.createElement("i");
    bar.style.width = [1, 1, 2, 3][Math.floor(Math.random() * 4)] + "px";
    b.appendChild(bar);
  }
})();

$("#seat").addEventListener("click", (e) => {
  e.stopPropagation();
  toast("Koltuk 1A: Hayatımın en güzel yeri. Hep senin. 💺");
});
$("#barcode").addEventListener("pointerdown", (e) => e.stopPropagation());
$("#barcode").addEventListener("click", (e) => {
  e.stopPropagation();
  toast("Barkod çözüldü: <b>사랑해</b> = Seni seviyorum 💗");
});

(function tear() {
  const stub = $("#stub");
  let sx, sy, dragging = false, done = false;
  stub.addEventListener("pointerdown", (e) => {
    if (done) return;
    dragging = true; sx = e.clientX; sy = e.clientY;
    stub.classList.add("dragging");
    stub.setPointerCapture(e.pointerId);
  });
  stub.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    stub.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px) rotate(${dx * 0.08 + dy * 0.05}deg)`;
    if (Math.hypot(dx, dy) > 70) rip();
  });
  const end = (e) => {
    if (!dragging) return;
    const dist = Math.hypot(e.clientX - sx, e.clientY - sy);
    dragging = false;
    stub.classList.remove("dragging");
    if (dist < 8 || dist > 40) rip(); else stub.style.transform = "";
  };
  stub.addEventListener("pointerup", end);
  stub.addEventListener("pointercancel", end);

  async function rip() {
    if (done) return;
    done = true; dragging = false;
    stub.classList.remove("dragging");
    tearSound();
    if (navigator.vibrate) navigator.vibrate(40);
    stub.classList.add("torn");
    $("#tearHint").style.opacity = 0;
    await sleep(1300);
    $("#ticket").classList.add("leaving");
    await sleep(1000);
    startCountdown();
  }
})();

/* ---------- 2 · Geri sayım ---------- */
async function startCountdown() {
  go("countdown");
  await sleep(900);
  const num = $("#countNum"), sweep = $("#sweep");
  for (let n = 3; n >= 1; n--) {
    num.textContent = n;
    tick(1000, 0.08, 0.12);
    const t0 = performance.now();
    await new Promise((res) => {
      (function frame(t) {
        const p = Math.min(1, (t - t0) / 1000);
        sweep.style.setProperty("--p", p * 360 + "deg");
        p < 1 ? requestAnimationFrame(frame) : res();
      })(t0);
    });
  }
  num.textContent = "";
  startTrailer();
}

/* ---------- 3 · Fragman ---------- */
const stage = $("#stage"), subTr = $("#subTr"), subKo = $("#subKo"), prog = $("#progress");
let idx = -1, timer = null, lock = false, current = null, photoCount = 0, trailerOn = false;

function setSubs(tr, ko) {
  subTr.classList.remove("show"); subKo.classList.remove("show");
  setTimeout(() => {
    subTr.textContent = tr || ""; subKo.textContent = ko || "";
    if (tr) subTr.classList.add("show");
    if (ko) subKo.classList.add("show");
  }, tr ? 650 : 0);
}

function buildScene(s) {
  const el = document.createElement("div");
  el.className = "scene " + (s.type === "card" ? "card " + (s.cls || "") : "photo");
  if (s.type === "card") {
    el.innerHTML = `<div><p class="card-text"></p>${s.sub ? '<p class="card-sub"></p>' : ""}</div>`;
    el.querySelector(".card-text").textContent = s.text;
    if (s.sub) el.querySelector(".card-sub").textContent = s.sub;
  } else {
    const frame = document.createElement("div");
    frame.className = "frame kb" + (photoCount++ % 3) + (s.wide ? " wide-scene" : " portrait-scene");
    frame.style.animationDuration = (s.dur || 6200) + 1500 + "ms";
    const bg = new Image();
    bg.className = "bg-blur";
    bg.alt = "";
    bg.src = s.src;
    const img = new Image();
    img.className = "fg-img";
    img.alt = "";
    if (s.pos) img.style.objectPosition = s.pos;
    img.onerror = () => {
      frame.classList.add("missing");
      frame.innerHTML = `<span>📷 ${s.src}<br><small>fotoğraf buraya gelecek</small></span>`;
    };
    img.src = s.src;
    frame.appendChild(bg);
    frame.appendChild(img);
    el.appendChild(frame);
    if (s.stamp) {
      const st = document.createElement("span");
      st.className = "stamp"; st.textContent = s.stamp;
      el.appendChild(st);
    }
  }
  return el;
}

function nextScene() {
  if (!trailerOn) return;
  clearTimeout(timer);
  idx++;
  const scenes = CONFIG.scenes;
  if (idx >= scenes.length) return endTrailer();
  const s = scenes[idx];
  const el = buildScene(s);
  stage.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
  if (current) { const old = current; old.classList.remove("show"); setTimeout(() => old.remove(), 1200); }
  current = el;
  setSubs(s.type === "photo" ? s.tr : "", s.type === "photo" ? s.sub : "");
  prog.style.width = ((idx + 1) / scenes.length) * 100 + "%";
  timer = setTimeout(nextScene, s.dur || (s.type === "card" ? 3000 : 6200));
}

function startTrailer() {
  go("trailer");
  trailerOn = true;
  setTimeout(nextScene, 800);
}

$("#trailer").addEventListener("click", () => {
  if (lock || !trailerOn) return;
  lock = true; setTimeout(() => (lock = false), 900);
  if (navigator.vibrate) navigator.vibrate(10);
  nextScene();
});

// Mobil kaydırma (sola kaydır -> sonraki sahne)
let tsX = 0, tsY = 0;
$("#trailer").addEventListener("touchstart", (e) => {
  tsX = e.touches[0].clientX;
  tsY = e.touches[0].clientY;
}, { passive: true });
$("#trailer").addEventListener("touchend", (e) => {
  if (lock || !trailerOn) return;
  const dx = e.changedTouches[0].clientX - tsX;
  const dy = e.changedTouches[0].clientY - tsY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    lock = true; setTimeout(() => (lock = false), 900);
    if (navigator.vibrate) navigator.vibrate(10);
    nextScene();
  }
}, { passive: true });

async function endTrailer() {
  trailerOn = false;
  setSubs("", "");
  if (current) current.classList.remove("show");
  await sleep(1400);
  startCredits();
}

/* ---------- 4 · Jenerik ---------- */
function startCredits() {
  const roll = $("#roll");
  let html = `<h4>SEOUL, BİR AŞK HİKÂYESİ</h4><span class="ko">서울, 사랑 이야기</span>`;
  for (const [role, name] of CONFIG.credits) {
    html += `<p class="role">${role}</p><p class="name">${name}</p>`;
  }
  html += `
    <p class="role">ÖZEL KONUK OYUNCU · 특별 출연</p>
    <div class="bonus-polaroid">
      <img src="photos/bonus.jpg" alt="Özel konuk">
      <span>Rol çalan küçük dostumuz 🐾</span>
    </div>
  `;
  html += `<p class="note">Bu filmdeki tüm duygular gerçektir.<br>Gerçek kişilerle benzerlik tesadüf değildir.<br>Hiçbir kalp çekim sırasında zarar görmemiştir.<br>(Biri hariç, o da artık tamamen senin.)</p>`;
  roll.innerHTML = html;
  go("credits");
  setTimeout(() => roll.classList.add("go"), 400);
  roll.addEventListener("animationend", toSequel, { once: true });
}
let sequelShown = false;
function toSequel() {
  if (sequelShown) return;
  sequelShown = true;
  go("sequel");
}
$("#skipCredits").addEventListener("click", toSequel);

/* ---------- 5 · Devam filmi + davet ---------- */
$("#invDate").textContent = CONFIG.inviteDate;
$("#invPlace").textContent = CONFIG.invitePlace;

const noBtn = $("#noBtn");
const noLines = ["Emin misin? 🥺", "Bir daha düşün...", "Yanlış butona basıyorsun 😅", "Bu buton bozuk galiba", "Hadi ama 💔", "Tamam, evet 🙈"];
let noCount = 0;
function flee(e) {
  if (noCount >= noLines.length - 1) return;
  if (e) e.preventDefault();
  if (navigator.vibrate) navigator.vibrate(15);
  noBtn.classList.add("runaway");
  noBtn.textContent = noLines[noCount++];
  const pad = 24, bw = noBtn.offsetWidth || 140, bh = noBtn.offsetHeight || 50;
  const maxX = Math.max(pad, innerWidth - bw - pad * 2);
  const maxY = Math.max(pad, innerHeight - bh - pad * 2);
  noBtn.style.left = (pad + Math.random() * maxX) + "px";
  noBtn.style.top = (pad + Math.random() * maxY) + "px";
}
noBtn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") flee(); });
noBtn.addEventListener("touchstart", flee, { passive: false });
noBtn.addEventListener("click", (e) => {
  if (noCount >= noLines.length - 1) return sayYes();
  flee(e);
});
$("#yesBtn").addEventListener("click", sayYes);

let said = false;
function sayYes() {
  if (said) return;
  said = true;
  tick(880, 0.15, 0.1); setTimeout(() => tick(1320, 0.25, 0.1), 140);
  if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
  noBtn.style.display = "none";
  burst();
  $("#sequelBox").classList.add("gone");
  $("#invite").classList.add("show");
  setInterval(floatHeart, 650);
}

const heartChars = ["💗", "💖", "❤️", "💕", "✨", "🌸"];
function burst() {
  const box = $("#hearts");
  for (let i = 0; i < 46; i++) {
    const h = document.createElement("span");
    h.className = "burst";
    h.textContent = heartChars[i % heartChars.length];
    const ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * Math.min(innerWidth, innerHeight) * 0.5;
    Object.assign(h.style, {
      left: "50%", top: "50%", fontSize: 16 + Math.random() * 26 + "px",
      animationDelay: Math.random() * 0.2 + "s",
    });
    h.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    h.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    h.style.setProperty("--r", (Math.random() * 120 - 60) + "deg");
    box.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
}
function floatHeart() {
  const box = $("#hearts"), h = document.createElement("span");
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  Object.assign(h.style, {
    left: Math.random() * 100 + "%", fontSize: 14 + Math.random() * 20 + "px",
    animationDuration: 6 + Math.random() * 5 + "s", opacity: 0.85,
  });
  h.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
  h.style.setProperty("--r", (Math.random() * 90 - 45) + "deg");
  box.appendChild(h);
  setTimeout(() => h.remove(), 12000);
}
