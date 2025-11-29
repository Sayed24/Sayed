/* Typed Hero Text */
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

/* Dark Mode Toggle */
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

/* Back to Top Button */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => { window.scrollTo({top:0, behavior:'smooth'}); });

/* Particle Background */
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
    this