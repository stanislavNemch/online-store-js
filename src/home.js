//Логіка сторінки Home

import { getProductCategories, getProducts } from './js/products-api.js';
import { renderCategories, renderProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalActionsClick,
  updateCounters,
  onCategoryClick,
  onSearchFormSubmit,
  onLoadMoreClick,
} from './js/handlers.js';
import {
  handleScroll,
  scrollToTop,
  showLoader,
  hideLoader,
} from './js/helpers.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

async function initializeHomePage() {
  updateCounters();
  showLoader();

  try {
    const [categories, productsData] = await Promise.all([
      getProductCategories(),
      getProducts(1),
    ]);

    renderCategories(['All', ...categories]);
    renderProducts(productsData.products);

    const totalRendered = productsData.products.length;
    if (totalRendered < productsData.total) {
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
    } else {
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    //console.error('Помилка після завантаження даних:', error);
    iziToast.error({ title: 'Error', message: 'Failed to load initial data.' });
  } finally {
    hideLoader();
  }
}

document.addEventListener('DOMContentLoaded', initializeHomePage);

// --- Слушатели событий ---
if (refs.productsList)
  refs.productsList.addEventListener('click', onProductClick);
if (refs.categoriesList)
  refs.categoriesList.addEventListener('click', onCategoryClick);
if (refs.modalActions)
  refs.modalActions.addEventListener('click', onModalActionsClick);
if (refs.searchForm)
  refs.searchForm.addEventListener('submit', onSearchFormSubmit);
if (refs.loadMoreBtn)
  refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
if (refs.scrollUpBtn) {
  window.addEventListener('scroll', handleScroll);
  refs.scrollUpBtn.addEventListener('click', scrollToTop);
}
