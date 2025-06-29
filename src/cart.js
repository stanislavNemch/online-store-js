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

function updateCartSummary(items, total) {
  if (refs.cartTotalItems) refs.cartTotalItems.textContent = items;
  if (refs.cartTotalPrice)
    refs.cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

async function loadCartProducts() {
  showLoader();
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
  clearProducts();

  if (cartIds.length === 0) {
    if (refs.productsList) {
      refs.productsList.innerHTML =
        '<li class="cart-empty-message">Your cart is empty.</li>';
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

function onBuyBtnClick() {
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
  if (cartIds.length > 0) {
    iziToast.success({
      title: 'Success',
      message: 'Products purchased successfully!',
      position: 'topRight',
    });
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
