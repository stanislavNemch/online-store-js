//Допоміжні функції
import { refs } from './refs.js';
import { saveToStorage, loadFromStorage } from './storage.js';
import { STORAGE_KEYS } from './constants.js'; // <-- ИЗМЕНЕНИЕ: Импортируем объект STORAGE_KEYS

// --- Лоадер ---
export function showLoader() {
  if (refs.loader) {
    refs.loader.classList.remove('hidden');
  }
}

export function hideLoader() {
  if (refs.loader) {
    refs.loader.classList.add('hidden');
  }
}

// --- Кнопка "Вверх" ---
export function handleScroll() {
  if (window.scrollY > 300) {
    refs.scrollUpBtn.classList.add('show');
  } else {
    refs.scrollUpBtn.classList.remove('show');
  }
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// --- Переключение темы ---
export function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  saveToStorage(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light'); // <-- ИЗМЕНЕНИЕ
}

export function applyTheme() {
  const savedTheme = loadFromStorage(STORAGE_KEYS.THEME); // <-- ИЗМЕНЕНИЕ
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}
