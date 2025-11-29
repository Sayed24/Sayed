// Typed effect for Hero
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

// Dark/Light Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if(document.body.classList.contains('dark-mode')){
    localStorage.setItem('theme', 'dark');
  } else { localStorage.setItem('theme', 'light'); }
});
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

// Back to Top Button
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => { window.scrollTo({top:0, behavior:'smooth'}); });