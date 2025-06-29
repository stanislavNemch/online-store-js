//Описана робота модалки - відкриття закриття і все що з модалкою повʼязано
import { refs } from './refs.js';

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onEscKeyPress);
}

export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', onEscKeyPress);
}

function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

refs.modal.addEventListener('click', event => {
  if (event.target === refs.modal) {
    closeModal();
  }
});

refs.modalCloseBtn.addEventListener('click', closeModal);
