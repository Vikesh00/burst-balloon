const handle = document.querySelector(".handle");
const bodyWrapper = document.querySelector(".body-wrapper");
const base = document.querySelector(".body"); // 🔵 blue base

/* ================= ASSETS ================= */
const BALLOON_IMAGES = [
  "Assets/balloon1.png",
  "Assets/ballon2.png",
  "Assets/ballon3.png",
  "Assets/ballon4.png"
];

const LETTER_IMAGES = [
  "Assets/letter_A.png",
  "Assets/letter_B.png",
  "Assets/letter_Z.png",
  "Assets/letter_D.png",
  "Assets/letter_E.png"
];

/* ================= STATE ================= */
const CLICKS_TO_SPAWN = 3;
let clickCount = 0;

/* ================= HELPERS ================= */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ================= FIRECRACKER EXPLOSION ================= */
function explodeBalloon(x, y) {
  const PARTICLES = 50;

  for (let i = 0; i < PARTICLES; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    p.style.backgroundColor =
      `hsl(${Math.random() * 360}, 100%, 55%)`;

    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 300 + 150;

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      p.style.transform =
        `translate(${dx}px, ${dy}px) scale(0.3)`;
      p.style.opacity = "0";
    });

    setTimeout(() => p.remove(), 1200);
  }
}

/* ================= CREATE BALLOON ================= */
function createBalloon() {
  const wrap = document.createElement("div");
  wrap.className = "balloon-wrapper";

  const balloon = document.createElement("img");
  balloon.className = "balloon";
  balloon.src = randomItem(BALLOON_IMAGES);

  const letter = document.createElement("img");
  letter.className = "letter";
  letter.src = randomItem(LETTER_IMAGES);

  const knot = document.createElement("img");
  knot.className = "knot";
  knot.src = "Assets/nod.png";

  wrap.append(balloon, letter, knot);
  bodyWrapper.appendChild(wrap);

  return wrap;
}

/* ================= BALLOON BEHAVIOR ================= */
function startBalloon(balloon) {
  let scale = 0.1;
  let x = 0, y = 0;

  let vx = rand(-2.5, 2.5);
  let vy = rand(-2.5, 2.5);
  if (Math.abs(vx) < 1) vx = 1.5;
  if (Math.abs(vy) < 1) vy = -1.5;

  const MAX_SCALE = 1.3;
  let floating = false;
  let burst = false;

  /* Auto inflate */
  const inflateTimer = setInterval(() => {
    if (scale < MAX_SCALE) {
      scale += 0.05;
      if (scale >= MAX_SCALE) {
        floating = true;
        clearInterval(inflateTimer);
      }
    }
  }, 60);

  /* Click → firecracker burst */
  balloon.addEventListener("click", () => {
    if (burst) return;
    burst = true;

    const r = balloon.getBoundingClientRect();
    explodeBalloon(
      r.left + r.width / 2,
      r.top + r.height / 2
    );

    balloon.remove();
  });

  function loop() {
    if (burst) return;

    if (floating) {
      x += vx;
      y += vy;

      const r = balloon.getBoundingClientRect();
      const W = window.innerWidth;
      const H = window.innerHeight;

      if (r.left <= 0) vx = Math.abs(vx);
      if (r.right >= W) vx = -Math.abs(vx);
      if (r.top <= 0) vy = Math.abs(vy);
      if (r.bottom >= H) vy = -Math.abs(vy);
    }

    balloon.style.transform =
      `scale(${scale}) translate(${x}px, ${y}px)`;

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ================= HANDLE INTERACTION ================= */
handle.addEventListener("mousedown", () => {
  // handle down
  handle.style.transform = "translateX(-50%) translateY(30px)";

  // handle vibration
  handle.classList.remove("shake");
  void handle.offsetWidth;
  handle.classList.add("shake");

  // 🔵 base vibration
  base.classList.remove("shake-base");
  void base.offsetWidth;
  base.classList.add("shake-base");

  // optional mobile vibration
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
});

handle.addEventListener("mouseup", () => {
  handle.style.transform = "translateX(-50%) translateY(0)";
  handle.classList.remove("shake");
  base.classList.remove("shake-base");

  clickCount++;

  // spawn balloon every 3 clicks
  if (clickCount === CLICKS_TO_SPAWN) {
    clickCount = 0;
    const balloon = createBalloon();
    startBalloon(balloon);
  }
});

handle.addEventListener("mouseleave", () => {
  handle.style.transform = "translateX(-50%) translateY(0)";
  handle.classList.remove("shake");
  base.classList.remove("shake-base");
});
