//Логіка сторінки Wishlist
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getProductById } from './js/products-api.js';
import { renderProducts, clearProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalButtonClick,
  updateCounters,
} from './js/handlers.js';
import { loadFromStorage } from './js/storage.js';
import { STORAGE_KEYS } from './js/constants.js';
import { applyTheme, showLoader, hideLoader } from './js/helpers.js';

/**
 * Загружает и отображает товары из списка желаний
 */
async function loadWishlistProducts() {
  showLoader();
  const wishlistIds = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];

  clearProducts();

  if (wishlistIds.length === 0) {
    if (refs.productsList) {
      refs.productsList.innerHTML =
        '<li class="wishlist-empty-message">Your wishlist is empty.</li>';
    }
    hideLoader();
    return;
  }

  try {
    const productPromises = wishlistIds.map(id => getProductById(id));
    const products = await Promise.all(productPromises);
    renderProducts(products);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load wishlist products.',
    });
  } finally {
    hideLoader();
  }
}

// --- Инициализация страницы ---
function initializeWishlistPage() {
  applyTheme();
  loadWishlistProducts();
  updateCounters();

  if (refs.productsList) {
    refs.productsList.addEventListener('click', onProductClick);
  }
  if (refs.modalProduct) {
    refs.modalProduct.addEventListener('click', onModalButtonClick);
  }
}

document.addEventListener('DOMContentLoaded', initializeWishlistPage);
