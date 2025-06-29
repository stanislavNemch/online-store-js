//Логіка сторінки Wishlist

import { getProductById } from './js/products-api.js';
import { renderProducts } from './js/render-functions.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalButtonClick,
  updateCounters,
} from './js/handlers.js';
import { loadFromStorage } from './js/storage.js';
import { STORAGE_KEYS } from './js/constants.js'; // <-- ИЗМЕНЕНИЕ: Импортируем объект STORAGE_KEYS
import { showLoader, hideLoader, applyTheme } from './js/helpers.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

async function loadWishlistProducts() {
  showLoader();
  const wishlistIds = loadFromStorage(STORAGE_KEYS.WISHLIST) || []; // <-- ИЗМЕНЕНИЕ: Используем STORAGE_KEYS.WISHLIST

  if (refs.wishlistProductsList) {
    refs.wishlistProductsList.innerHTML = '';
  }

  if (wishlistIds.length === 0) {
    if (refs.wishlistProductsList) {
      refs.wishlistProductsList.innerHTML =
        '<li class="wishlist-empty-message">Your wishlist is empty.</li>';
    }
    hideLoader();
    return;
  }

  try {
    const productPromises = wishlistIds.map(id => getProductById(id));
    const products = await Promise.all(productPromises);
    if (refs.wishlistProductsList) {
      renderProducts(products); // Эта функция рендерит в .products, нужна адаптация
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load wishlist products.',
    });
  } finally {
    hideLoader();
  }
}

// Инициализация
applyTheme();
loadWishlistProducts();
updateCounters();

// Слушатели событий
if (refs.wishlistProductsList) {
  refs.wishlistProductsList.addEventListener('click', onProductClick);
}
if (refs.modalProduct) {
  refs.modalProduct.addEventListener('click', onModalButtonClick);
}
