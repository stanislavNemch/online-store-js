//Описана робота модалки - відкриття закриття і все що з модалкою повʼязано
import { refs } from './refs.js';

function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    closeModal();
  }
}

export function openModal() {
  if (!refs.modal) return;
  refs.modal.classList.add('modal--is-open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onEscKeyPress);
  refs.modal.addEventListener('click', onBackdropClick);
}

export function closeModal() {
  if (!refs.modal) return;
  refs.modal.classList.remove('modal--is-open');
  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', onEscKeyPress);
  refs.modal.removeEventListener('click', onBackdropClick);
}

// Глобальний слухач для кнопки закриття
if (refs.modalCloseBtn) {
  refs.modalCloseBtn.addEventListener('click', closeModal);
}
