/* --- Typed Hero Text --- */
const typedText = document.getElementById('typed-text');
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'WordPress', 'Shopify'];
let i = 0, j = 0;
function typeEffect() {
  if(i < skills.length){
    if(j < skills[i].length){
      typedText.innerHTML += skills[i][j];
      j++;
      setTimeout(typeEffect, 150);
    } else {
      setTimeout(() => { j = 0; typedText.innerHTML = ''; i = (i + 1) % skills.length; typeEffect(); }, 1000);
    }
  }
}
typeEffect();

/* --- Dark Mode Toggle --- */
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

/* --- Back to Top Button --- */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => { window.scrollTo({top:0, behavior:'smooth'}); });

/* --- Particle Background --- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
class Particle {
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.size = Math.random()*2+1;
    this.speedX = Math.random()*1-0.5;
    this.speedY = Math.random()*1-0.5;
  }
  update(){ this.x += this.speedX; this.y += this.speedY; if(this.x>canvas.width) this.x=0; if(this.x<0) this.x=canvas.width; if(this.y>canvas.height) this.y=0; if(this.y<0) this.y=canvas.height;}
  draw(){ ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill();}
}
function initParticles(){ particlesArray=[]; for(let i=0;i<100;i++){particlesArray.push(new Particle());}}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight; initParticles();});

/* --- Skills Bar Animation on Scroll --- */
const skillBars = document.querySelectorAll('.progress');
const skillSection = document.getElementById('about');
window.addEventListener('scroll', () => {
  const sectionPos = skillSection.getBoundingClientRect().top;
  const screenPos = window.innerHeight / 1.2;
  if(sectionPos < screenPos){
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute('style').split(':')[1];
    });
  }
});

/* --- Project Filters --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const filter = btn.getAttribute('data-filter');
    projects.forEach(p=>{
      if(filter==='all'||p.getAttribute('data-tech')===filter) p.style.display='block';
      else p.style.display='none';
    });
  });
});

/* --- Testimonials Slider Auto Scroll --- */
const testimonialSlider = document.querySelector('.testimonial-slider');
let scrollAmount = 0;
setInterval(()=>{
  scrollAmount += 320;
  if(scrollAmount >= testimonialSlider.scrollWidth) scrollAmount = 0;
  testimonialSlider.scrollTo({left:scrollAmount, behavior:'smooth'});
}, 4000);

/* --- Copy Email Button --- */
const copyBtn = document.getElementById('copyEmailBtn');
copyBtn.addEventListener('click',()=>{
  navigator.clipboard.writeText('sayedrahimsadat@gmail.com').then(()=>alert('Email copied to clipboard!'));
});