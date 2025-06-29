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

function updateCartSummary(items, total) {
  if (refs.cartTotalItems) {
    refs.cartTotalItems.textContent = items;
  }
  if (refs.cartTotalPrice) {
    refs.cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }
}

async function loadCartProducts() {
  showLoader();
  const cartIds = loadFromStorage(STORAGE_KEYS.CART) || []; // <-- ИЗМЕНЕНИЕ: Используем STORAGE_KEYS.CART

  if (refs.cartProductsList) {
    refs.cartProductsList.innerHTML = '';
  }

  if (cartIds.length === 0) {
    if (refs.cartProductsList) {
      refs.cartProductsList.innerHTML =
        '<li class="cart-empty-message">Your cart is empty.</li>';
    }
    updateCartSummary(0, 0);
    hideLoader();
    return;
  }

  try {
    const productPromises = cartIds.map(id => getProductById(id));
    const products = await Promise.all(productPromises);

    if (refs.cartProductsList) {
      renderProducts(products); // Эта функция рендерит в .products, нужна адаптация для .cart-products
    }

    const totalItems = products.length;
    const totalPrice = products.reduce(
      (sum, product) => sum + product.price,
      0
    );
    updateCartSummary(totalItems, totalPrice);
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load cart products.',
    });
  } finally {
    hideLoader();
  }
}

// Инициализация
applyTheme();
loadCartProducts();
updateCounters();

// Слушатели событий
if (refs.cartProductsList) {
  refs.cartProductsList.addEventListener('click', onProductClick);
}
if (refs.modalProduct) {
  refs.modalProduct.addEventListener('click', onModalButtonClick);
}
if (refs.cartBuyBtn) {
  refs.cartBuyBtn.addEventListener('click', () => {
    const cartIds = loadFromStorage(STORAGE_KEYS.CART) || [];
    if (cartIds.length > 0) {
      iziToast.success({
        title: 'Success',
        message: 'Products purchased successfully!',
      });
      // Опционально: очистить корзину после покупки
      // saveToStorage(STORAGE_KEYS.CART, []);
      // loadCartProducts();
      // updateCounters();
    } else {
      iziToast.info({
        title: 'Info',
        message: 'Your cart is empty.',
      });
    }
  });
}
