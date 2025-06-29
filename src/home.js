//Логіка сторінки Home

import { getProductCategories, getProducts } from './js/products-api.js';
import { renderCategories, renderProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalButtonClick,
  updateCounters,
  onCategoryClick,
  onSearchFormSubmit,
  onLoadMoreClick,
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

async function initializeHomePage() {
  applyTheme();
  updateCounters();
  showLoader();

  try {
    const [categories, productsData] = await Promise.all([
      getProductCategories(),
      getProducts(1),
    ]);

    renderCategories(['All', ...categories]);
    renderProducts(productsData.products);

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

document.addEventListener('DOMContentLoaded', initializeHomePage);

// --- Слушатели событий ---
if (refs.productsList)
  refs.productsList.addEventListener('click', onProductClick);
if (refs.categoriesList)
  refs.categoriesList.addEventListener('click', onCategoryClick);
if (refs.modalProduct)
  refs.modalProduct.addEventListener('click', onModalButtonClick);
if (refs.searchForm)
  refs.searchForm.addEventListener('submit', onSearchFormSubmit);
if (refs.loadMoreBtn)
  refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
if (refs.themeSwitcher)
  refs.themeSwitcher.addEventListener('click', toggleTheme);
if (refs.scrollUpBtn) {
  window.addEventListener('scroll', handleScroll);
  refs.scrollUpBtn.addEventListener('click', scrollToTop);
}
