/* ===== Typed Hero Text ===== */
const typedText = document.getElementById('typed-text');
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'WordPress', 'Shopify'];
let i = 0, j = 0;

function typeEffect() {
  if (i < skills.length) {
    if (j < skills[i].length) {
      typedText.innerHTML += skills[i][j];
      j++;
      setTimeout(typeEffect, 150);
    } else {
      setTimeout(() => {
        j = 0;
        typedText.innerHTML = '';
        i = (i + 1) % skills.length;
        typeEffect();
      }, 1000);
    }
  }
}
typeEffect();

/* ===== Dark Mode Toggle ===== */
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

/* ===== Back to Top Button ===== */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Skill Bar Animation ===== */
window.addEventListener('scroll', () => {
  const skillBars = document.querySelectorAll('.progress');
  skillBars.forEach(bar => {
    const barTop = bar.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (barTop < windowHeight - 50) {
      bar.style.width = bar.getAttribute('data-width');
    }
  });
});

/* ===== Particle Background ===== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

/* ===== Copy Email Button ===== */
document.getElementById('copyEmailBtn').addEventListener('click', () => {
  navigator.clipboard.writeText('sayedrahimsadat@gmail.com');
  alert('Email copied to clipboard!');
});

/* ===== Project Filter ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-tech') === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});