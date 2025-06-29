//Логіка сторінки Home
import { getProductCategories, getProducts } from './js/products-api.js';
import { renderCategories, renderProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalButtonClick,
  updateCounters,
  onCategoryClick,
} from './js/handlers.js';
import {
  applyTheme,
  toggleTheme,
  handleScroll,
  scrollToTop,
  showLoader,
  hideLoader,
} from './js/helpers.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

/**
 * Инициализация главной страницы
 */
async function initializeHomePage() {
  applyTheme();
  updateCounters();
  showLoader();

  try {
    // Параллельная загрузка категорий и продуктов
    const [categories, productsData] = await Promise.all([
      getProductCategories(),
      getProducts(1),
    ]);

    renderCategories(['All', ...categories]);
    renderProducts(productsData.products);

    // Проверка, нужно ли показывать кнопку "Load More"
    if (productsData.total <= 12) {
      refs.loadMoreBtn.style.display = 'none';
    } else {
      refs.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to load initial data.' });
  } finally {
    hideLoader();
  }
}

// --- Слушатели событий ---
document.addEventListener('DOMContentLoaded', initializeHomePage);

// Делегирование событий для списков
if (refs.productsList) {
  refs.productsList.addEventListener('click', onProductClick);
}
if (refs.categoriesList) {
  refs.categoriesList.addEventListener('click', onCategoryClick);
}

// Слушатели для модального окна и UI элементов
if (refs.modalProduct) {
  refs.modalProduct.addEventListener('click', onModalButtonClick);
}
if (refs.themeSwitcher) {
  refs.themeSwitcher.addEventListener('click', toggleTheme);
}
if (refs.scrollUpBtn) {
  window.addEventListener('scroll', handleScroll);
  refs.scrollUpBtn.addEventListener('click', scrollToTop);
}

refs.searchInput.addEventListener('input', () => {
  if (refs.searchInput.value.trim() !== '') {
    refs.searchClearBtn.style.display = 'block';
  } else {
    refs.searchClearBtn.style.display = 'none';
  }
});
