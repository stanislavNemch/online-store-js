//Допоміжні функції
import { refs } from './refs.js';

// --- Лоадер ---
export function showLoader() {
  if (refs.loader) {
    refs.loader.classList.remove('hidden');
  }
  if (refs.loadMoreBtn) {
    refs.loadMoreBtn.classList.add('hidden');
  }
  // Приховуємо основний контент під час завантаження
  if (refs.categoriesList) {
    refs.categoriesList.classList.add('hidden');
  }
  if (refs.productsList) {
    refs.productsList.classList.add('hidden');
  }
}

export function showLoaderForLoadMore() {
  if (refs.loader) {
    refs.loader.classList.remove('hidden');
  }
  if (refs.loadMoreBtn) {
    refs.loadMoreBtn.classList.add('hidden');
  }
}

export function hideLoader() {
  if (refs.loader) {
    refs.loader.classList.add('hidden');
  }
  // Показуємо основний контент після завантаження
  if (refs.categoriesList) {
    refs.categoriesList.classList.remove('hidden');
  }
  if (refs.productsList) {
    refs.productsList.classList.remove('hidden');
  }
}

// --- Кнопка "Вверх" ---
export function handleScroll() {
  if (refs.scrollUpBtn) {
    if (window.scrollY > 300) {
      refs.scrollUpBtn.classList.add('show');
    } else {
      refs.scrollUpBtn.classList.remove('show');
    }
  }
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
