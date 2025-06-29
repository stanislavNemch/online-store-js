//Логіка сторінки Cart
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getProductById } from './js/products-api.js';
import { renderProducts, clearProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onProductClick,
  onModalActionsClick,
  updateCounters,
} from './js/handlers.js';
import { loadFromStorage, saveToStorage } from './js/storage.js';
import { STORAGE_KEYS } from './js/constants.js';
import {
  applyTheme,
  toggleTheme,
  handleScroll,
  scrollToTop,
  showLoader,
  hideLoader,
} from './js/helpers.js';

/**
 * Оновлює блок "Order Summary" на сторінці кошика.
 */
function updateCartSummary(itemsCount, total) {
  // Ніяких змін тут не потрібно, оскільки refs.js тепер надає правильні посилання
  if (refs.cartTotalItems) {
    refs.cartTotalItems.textContent = itemsCount;
  }
  if (refs.cartTotalPrice) {
    refs.cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }
}

/**
 * Завантажує та відображає товари з кошика.
 */
async function loadCartProducts() {
  showLoader();
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
  clearProducts();

  if (cartIds.length === 0) {
    if (refs.productsList) {
      refs.productsList.innerHTML =
        '<li class="cart-empty-message">Your cart is empty.</li>';
    }
    updateCartSummary(0, 0); // Оновлюємо суму, якщо кошик порожній
    hideLoader();
    return;
  }

  try {
    const productPromises = cartIds.map(id => getProductById(id));
    const products = await Promise.all(productPromises);
    renderProducts(products);

    const totalItems = products.length;
    const totalPrice = products.reduce(
      (sum, product) => sum + product.price,
      0
    );
    updateCartSummary(totalItems, totalPrice); // Оновлюємо суму після завантаження товарів
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load cart products.',
    });
    updateCartSummary(0, 0); // У разі помилки скидаємо суму
  } finally {
    hideLoader();
  }
}

/**
 * Обробник для кнопки "Купити".
 */
function onBuyBtnClick() {
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
  if (cartIds.length > 0) {
    iziToast.success({
      title: 'Success',
      message: 'Products purchased successfully!',
      position: 'topRight',
    });
    saveToStorage(STORAGE_KEYS.CART, []);
    loadCartProducts(); // Перезавантажуємо кошик (він стане порожнім)
    updateCounters(); // Оновлюємо лічильник у хедері
  } else {
    iziToast.info({
      title: 'Info',
      message: 'Your cart is empty.',
      position: 'topRight',
    });
  }
}

/**
 * Ініціалізація сторінки кошика.
 */
function initializeCartPage() {
  applyTheme();
  updateCounters();
  loadCartProducts();

  if (refs.productsList)
    refs.productsList.addEventListener('click', onProductClick);
  if (refs.modalActions)
    refs.modalActions.addEventListener('click', onModalActionsClick);
  if (refs.cartBuyBtn) refs.cartBuyBtn.addEventListener('click', onBuyBtnClick);
  if (refs.themeSwitcher)
    refs.themeSwitcher.addEventListener('click', toggleTheme);
  if (refs.scrollUpBtn) {
    window.addEventListener('scroll', handleScroll);
    refs.scrollUpBtn.addEventListener('click', scrollToTop);
  }
}

document.addEventListener('DOMContentLoaded', initializeCartPage);
