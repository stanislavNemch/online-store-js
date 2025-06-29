// Функції, які передаються колбеками в addEventListners
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api.js';
import { refs } from './refs.js';
import {
  renderProductModal,
  renderProducts,
  clearProducts,
} from './render-function.js';
import { openModal } from './modal.js';
import { saveToStorage, loadFromStorage } from './storage.js';
import { STORAGE_KEYS } from './constants.js';
import { showLoader, hideLoader } from './helpers.js';

let currentPage = 1;
let currentCategory = 'All';
let currentSearchQuery = '';

/**
 * Обновляет счетчики товаров в корзине и списке желаний в хедере.
 */
export function updateCounters() {
  const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
  const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];

  if (refs.cartCount) {
    refs.cartCount.textContent = cart.length;
  }
  if (refs.wishlistCount) {
    refs.wishlistCount.textContent = wishlist.length;
  }
}

/**
 * Обновляет текст на кнопках в модальном окне ('Add to...' vs 'Remove from...').
 * @param {string | number} productId ID продукта
 */
function updateModalButtons(productId) {
  const numericProductId = Number(productId);
  const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
  const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];
  const addToCartBtn = refs.modalProduct.querySelector(
    '.modal-product__add-to-cart-btn'
  );
  const addToWishlistBtn = refs.modalProduct.querySelector(
    '.modal-product__add-to-wishlist-btn'
  );

  if (!addToCartBtn || !addToWishlistBtn) return;

  addToCartBtn.dataset.id = numericProductId;
  addToWishlistBtn.dataset.id = numericProductId;

  addToCartBtn.textContent = cart.includes(numericProductId)
    ? 'Remove from Cart'
    : 'Add to Cart';
  addToWishlistBtn.textContent = wishlist.includes(numericProductId)
    ? 'Remove from Wishlist'
    : 'Add to Wishlist';
}

/**
 * Обработчик клика по карточке продукта.
 * @param {MouseEvent} event
 */
export async function onProductClick(event) {
  const productCard = event.target.closest('.products__item');
  if (!productCard) {
    return;
  }

  const productId = productCard.dataset.id;
  showLoader();
  try {
    const product = await getProductById(productId);
    renderProductModal(product);
    updateModalButtons(productId);
    openModal();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch product details.',
    });
  } finally {
    hideLoader();
  }
}

/**
 * Обработчик клика по кнопкам в модальном окне (добавить/удалить).
 * @param {MouseEvent} event
 */
export function onModalButtonClick(event) {
  const button = event.target;
  if (!button.classList.contains('modal-product__btn')) return;

  const productId = Number(button.dataset.id);
  if (!productId) return;

  if (button.classList.contains('modal-product__add-to-cart-btn')) {
    toggleProductInStorage(STORAGE_KEYS.CART, productId, button, 'Cart');
  }

  if (button.classList.contains('modal-product__add-to-wishlist-btn')) {
    toggleProductInStorage(
      STORAGE_KEYS.WISHLIST,
      productId,
      button,
      'Wishlist'
    );
  }
}

/**
 * Добавляет или удаляет товар из указанного хранилища (localStorage).
 * @param {string} storageKey Ключ хранилища (из STORAGE_KEYS)
 * @param {number} productId ID продукта
 * @param {HTMLButtonElement} button Кнопка, по которой кликнули
 * @param {string} storageName Имя хранилища для сообщений ('Cart' или 'Wishlist')
 */
function toggleProductInStorage(storageKey, productId, button, storageName) {
  let items = loadFromStorage(storageKey) || [];
  if (items.includes(productId)) {
    items = items.filter(id => id !== productId);
    button.textContent = `Add to ${storageName}`;
    iziToast.info({
      title: 'Removed',
      message: `Product removed from ${storageName}.`,
      position: 'topRight',
    });
  } else {
    items.push(productId);
    button.textContent = `Remove from ${storageName}`;
    iziToast.success({
      title: 'Added',
      message: `Product added to ${storageName}.`,
      position: 'topRight',
    });
  }
  saveToStorage(storageKey, items);
  updateCounters();
}

/**
 * Обработчик клика по категории
 * @param {MouseEvent} event
 */
export async function onCategoryClick(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }

  const category = event.target.textContent;
  const activeBtn = document.querySelector('.categories__btn--active');
  if (activeBtn) {
    activeBtn.classList.remove('categories__btn--active');
  }
  event.target.classList.add('categories__btn--active');

  clearProducts();
  currentPage = 1;
  currentCategory = category;
  currentSearchQuery = '';
  refs.loadMoreBtn.style.display = 'block';
  refs.notFoundMessage.classList.remove('not-found--visible');
  showLoader();

  try {
    const data =
      category === 'All'
        ? await getProducts(currentPage)
        : await getProductsByCategory(category, currentPage);

    if (data.products.length === 0) {
      refs.notFoundMessage.classList.add('not-found--visible');
      refs.loadMoreBtn.style.display = 'none';
    } else {
      renderProducts(data.products);
      if (data.total <= currentPage * 12) {
        refs.loadMoreBtn.style.display = 'none';
        iziToast.info({
          title: 'Info',
          message: "You've reached the end of the product list.",
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch products.' });
  } finally {
    hideLoader();
  }
}
