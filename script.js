const slides = [...document.querySelectorAll('.slide')];
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const counter = document.getElementById('slideCounter');
const bar = document.getElementById('progressBar');
const dotsWrap = document.getElementById('dots');
let index = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
  dot.addEventListener('click', () => show(i));
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.children];

function show(i){
  index = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, n) => s.classList.toggle('active', n === index));
  dots.forEach((d, n) => d.classList.toggle('active', n === index));
  counter.textContent = `${index + 1} / ${slides.length}`;
  bar.style.width = `${((index + 1) / slides.length) * 100}%`;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === slides.length - 1 ? 'Inicio' : 'Siguiente';
  slides[index].scrollTop = 0;
}

nextBtn.addEventListener('click', () => show(index === slides.length - 1 ? 0 : index + 1));
prevBtn.addEventListener('click', () => show(index - 1));

document.addEventListener('keydown', e => {
  if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); show(index === slides.length - 1 ? 0 : index + 1); }
  if(['ArrowLeft','PageUp'].includes(e.key)){ e.preventDefault(); show(index - 1); }
  if(e.key === 'Home') show(0);
  if(e.key === 'End') show(slides.length - 1);
});

let touchX = null;
document.addEventListener('touchstart', e => touchX = e.changedTouches[0].screenX, {passive:true});
document.addEventListener('touchend', e => {
  if(touchX === null) return;
  const dx = e.changedTouches[0].screenX - touchX;
  if(Math.abs(dx) > 60) show(dx < 0 ? index + 1 : index - 1);
  touchX = null;
}, {passive:true});

show(0);


// Visor de graficas a pantalla completa
const modal = document.createElement('div');
modal.className = 'image-modal';
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
modal.setAttribute('aria-label', 'Vista completa de la grafica');
modal.innerHTML = `
  <button class="image-modal-close" type="button" aria-label="Cerrar imagen">×</button>
  <div class="image-modal-content">
    <img src="" alt="" />
  </div>
  <div class="image-modal-label"></div>
`;
document.body.appendChild(modal);

const modalImg = modal.querySelector('img');
const modalLabel = modal.querySelector('.image-modal-label');
const modalClose = modal.querySelector('.image-modal-close');

function openImageViewer(img){
  modalImg.src = img.src;
  modalImg.alt = img.alt || 'Grafica ampliada';
  modalLabel.textContent = img.alt || 'Grafica ampliada';
  modal.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeImageViewer(){
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  modalImg.src = '';
}

document.querySelectorAll('.image-card img').forEach(img => {
  const card = img.closest('.image-card');
  if(!card) return;

  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Abrir grafica completa: ${img.alt || 'grafica'}`);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'image-open-btn';
  btn.textContent = 'Ver completa';
  btn.setAttribute('aria-label', `Ver imagen completa: ${img.alt || 'grafica'}`);
  btn.addEventListener('click', e => {
    e.stopPropagation();
    openImageViewer(img);
  });
  card.appendChild(btn);

  card.addEventListener('click', e => {
    if(e.target.closest('.image-open-btn')) return;
    openImageViewer(img);
  });

  card.addEventListener('keydown', e => {
    if(e.key === 'Enter') openImageViewer(img);
  });
});

modalClose.addEventListener('click', closeImageViewer);
modal.addEventListener('click', e => {
  if(e.target === modal) closeImageViewer();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && modal.classList.contains('open')){
    e.preventDefault();
    closeImageViewer();
  }
});
