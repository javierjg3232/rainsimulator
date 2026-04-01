const canvas = document.getElementById("rainCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Controls
const intensitySlider = document.getElementById("intensity");
const windSlider = document.getElementById("wind");
const volumeSlider = document.getElementById("volume");

const rainSound = document.getElementById("rain-sound");

// Start sound on click
document.addEventListener("click", () => {
  rainSound.play();
}, { once: true });

// =========================
// 🌧️ Raindrop
// =========================
class Raindrop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.length = Math.random() * 20 + 10;
    this.speed = Math.random() * 4 + 4;
    this.opacity = Math.random();
  }

  update(wind) {
    this.x += wind;
    this.y += this.speed;

    if (this.y > canvas.height) {
      createSplash(this.x, canvas.height);
      this.reset();
    }
  }

  draw(wind) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(173,216,230,${this.opacity})`;
    ctx.lineWidth = 1;

    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + wind * 2, this.y + this.length);

    ctx.stroke();
  }
}

// =========================
// 💧 Splash Particles
// =========================
class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * -3;
    this.life = 30;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "lightblue";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const drops = [];
const splashes = [];

function createSplash(x, y) {
  for (let i = 0; i < 5; i++) {
    splashes.push(new Splash(x, y));
  }
}

// =========================
// 🌫️ Fog Layer
// =========================
function drawFog() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(20,20,20,0.1)");
  gradient.addColorStop(1, "rgba(0,0,0,0.6)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// =========================
// ⚡ Lightning (ambient)
// =========================
function lightning() {
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// =========================
// 🎬 Animation Loop
// =========================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const wind = parseFloat(windSlider.value);
  const intensity = parseInt(intensitySlider.value);

  // Adjust drop count dynamically
  while (drops.length < intensity) {
    drops.push(new Raindrop());
  }
  drops.length = intensity;

  // Draw rain
  for (let drop of drops) {
    drop.update(wind);
    drop.draw(wind);
  }

  // Draw splashes
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.update();
    s.draw();

    if (s.life <= 0) splashes.splice(i, 1);
  }

  drawFog();

  // Random lightning
  if (Math.random() < 0.002) lightning();

  requestAnimationFrame(animate);
}

animate();

// =========================
// 🔊 Volume Control
// =========================
volumeSlider.addEventListener("input", () => {
  rainSound.volume = volumeSlider.value;
});

// =========================
// 📱 Resize Support
// =========================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});