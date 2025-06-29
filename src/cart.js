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
import { loadFromStorage, saveToStorage } from './js/storage.js';
import { STORAGE_KEYS } from './js/constants.js';
import { applyTheme, showLoader, hideLoader } from './js/helpers.js';

/**
 * Обновляет итоговую информацию в корзине (кол-во, сумма)
 * @param {number} items
 * @param {number} total
 */
function updateCartSummary(items, total) {
  if (refs.cartTotalItems) {
    refs.cartTotalItems.textContent = items;
  }
  if (refs.cartTotalPrice) {
    refs.cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }
}

/**
 * Загружает и отображает товары из корзины
 */
async function loadCartProducts() {
  showLoader();
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];

  clearProducts();

  if (cartIds.length === 0) {
    if (refs.productsList) {
      refs.productsList.innerHTML =
        '<li class="cart-empty-message">Your cart is empty. Go to the main page to add products.</li>';
    }
    updateCartSummary(0, 0);
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
    updateCartSummary(totalItems, totalPrice);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load cart products.',
    });
  } finally {
    hideLoader();
  }
}

/**
 * Обработчик кнопки "Купить"
 */
function onBuyBtnClick() {
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
  if (cartIds.length > 0) {
    iziToast.success({
      title: 'Success',
      message: 'Products purchased successfully!',
      position: 'topRight',
    });
    // Очищаем корзину после успешной "покупки"
    saveToStorage(STORAGE_KEYS.CART, []);
    loadCartProducts();
    updateCounters();
  } else {
    iziToast.info({
      title: 'Info',
      message: 'Your cart is empty.',
      position: 'topRight',
    });
  }
}

// --- Инициализация страницы ---
function initializeCartPage() {
  applyTheme();
  loadCartProducts();
  updateCounters();

  if (refs.productsList) {
    refs.productsList.addEventListener('click', onProductClick);
  }
  if (refs.modalProduct) {
    refs.modalProduct.addEventListener('click', onModalButtonClick);
  }
  if (refs.cartBuyBtn) {
    refs.cartBuyBtn.addEventListener('click', onBuyBtnClick);
  }
}

document.addEventListener('DOMContentLoaded', initializeCartPage);
