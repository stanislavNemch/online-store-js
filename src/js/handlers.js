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

export function updateCounters() {
  const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
  const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];
  if (refs.cartCount) {
    refs.cartCount.textContent = cart.length;
    refs.cartCount.dataset.cartCount = cart.length;
  }
  if (refs.wishlistCount) {
    refs.wishlistCount.textContent = wishlist.length;
    refs.wishlistCount.dataset.wishlistCount = wishlist.length;
  }
}

function updateModalButtons(productId) {
  const numericProductId = Number(productId);
  const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
  const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];

  // Знаходимо кнопки не в динамічному контенті, а в самому модальному вікні
  const addToCartBtn = refs.modal.querySelector('.modal-product__btn--cart');
  const addToWishlistBtn = refs.modal.querySelector(
    '.modal-product__btn--wishlist'
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

  // Створюємо та відправляємо кастомну подію на сторынках cart і wishlist
  const event = new CustomEvent('storageUpdated', {
    detail: { key: storageKey },
  });
  document.dispatchEvent(event);
}

export async function onProductClick(event) {
  const productCard = event.target.closest('.products__item');
  if (!productCard) return;

  const productId = productCard.dataset.id;
  showLoader();
  try {
    const product = await getProductById(productId);
    renderProductModal(product); // Рендеримо тільки дані продукту
    updateModalButtons(productId); // Оновлюємо існуючі кнопки
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

export function onModalActionsClick(event) {
  const button = event.target.closest('.modal-product__btn');
  if (!button) return;

  const productId = Number(button.dataset.id);
  if (!productId) return;

  if (button.classList.contains('modal-product__btn--cart')) {
    toggleProductInStorage(STORAGE_KEYS.CART, productId, button, 'Cart');
  } else if (button.classList.contains('modal-product__btn--wishlist')) {
    toggleProductInStorage(
      STORAGE_KEYS.WISHLIST,
      productId,
      button,
      'Wishlist'
    );
  }
}

export async function onCategoryClick(event) {
  const button = event.target.closest('.categories__btn');
  if (!button) return;

  const category = button.textContent;
  const activeBtn = document.querySelector('.categories__btn--active');
  if (activeBtn) activeBtn.classList.remove('categories__btn--active');
  button.classList.add('categories__btn--active');

  clearProducts();
  currentPage = 1;
  currentCategory = category;
  currentSearchQuery = '';
  if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
  if (refs.notFoundMessage)
    refs.notFoundMessage.classList.remove('not-found--visible');
  showLoader();

  try {
    const data =
      category === 'All'
        ? await getProducts(currentPage)
        : await getProductsByCategory(category, currentPage);
    if (data.products.length === 0) {
      if (refs.notFoundMessage)
        refs.notFoundMessage.classList.add('not-found--visible');
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
    } else {
      renderProducts(data.products);
      const totalRendered = (currentPage - 1) * 12 + data.products.length;
      if (totalRendered < data.total) {
        if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
      } else {
        if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('hidden');
      }
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch products.' });
  } finally {
    hideLoader();
  }
}

export async function onSearchFormSubmit(event) {
  event.preventDefault();
  const query = refs.searchInput.value.trim();
  if (!query) return;

  clearProducts();
  currentPage = 1;
  currentSearchQuery = query;
  currentCategory = '';
  if (refs.loadMoreBtn) {
    refs.loadMoreBtn.classList.remove('hidden');
  }
  if (refs.notFoundMessage)
    refs.notFoundMessage.classList.remove('not-found--visible');
  showLoader();

  try {
    const data = await searchProducts(query, currentPage);
    if (data.products.length === 0) {
      if (refs.notFoundMessage)
        refs.notFoundMessage.classList.add('not-found--visible');
      if (refs.loadMoreBtn) {
        refs.loadMoreBtn.classList.remove('hidden');
      }
    } else {
      renderProducts(data.products);
      const totalRendered = (currentPage - 1) * 12 + data.products.length;
      if (totalRendered < data.total) {
        if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
      } else {
        if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('hidden');
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to search for products.',
    });
  } finally {
    hideLoader();
  }
}

export async function onLoadMoreClick() {
  currentPage += 1;
  showLoader();
  try {
    const data = currentSearchQuery
      ? await searchProducts(currentSearchQuery, currentPage)
      : currentCategory === 'All' || !currentCategory
      ? await getProducts(currentPage)
      : await getProductsByCategory(currentCategory, currentPage);

    renderProducts(data.products);

    const totalRendered = (currentPage - 1) * 12 + data.products.length;
    if (totalRendered >= data.total) {
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of the product list.",
        position: 'topRight',
      });
    } else {
      if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more products.',
    });
  } finally {
    hideLoader();
  }
}
