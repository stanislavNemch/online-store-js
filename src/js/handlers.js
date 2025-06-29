// Функції, які передаються колбеками в addEventListners
import {
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api.js';
import { renderProductModal, renderProducts } from './render-function.js';
import { openModal } from './modal.js';
import { refs } from './refs.js';
import { saveToStorage, loadFromStorage } from './storage.js';
import { STORAGE_KEYS } from './constants.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentPage = 1;
let currentCategory = 'All';
let currentSearchQuery = '';

// --- Управление состоянием ---
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

function updateModalButtons(productId) {
  const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
  const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];
  const addToCartBtn = refs.modalProduct.querySelector(
    '.modal-product__add-to-cart-btn'
  );
  const addToWishlistBtn = refs.modalProduct.querySelector(
    '.modal-product__add-to-wishlist-btn'
  );

  if (!addToCartBtn || !addToWishlistBtn) return;

  addToCartBtn.dataset.id = productId;
  addToWishlistBtn.dataset.id = productId;

  addToCartBtn.textContent = cart.includes(Number(productId))
    ? 'Remove from Cart'
    : 'Add to Cart';
  addToWishlistBtn.textContent = wishlist.includes(Number(productId))
    ? 'Remove from Wishlist'
    : 'Add to Wishlist';
}

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

  refs.productsList.innerHTML = '';
  currentPage = 1;
  currentCategory = category;
  currentSearchQuery = '';
  refs.loadMoreBtn.style.display = 'block';
  refs.notFoundMessage.classList.remove('not-found--visible');

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
        });
      }
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch products.',
    });
  }
}

export async function onProductClick(event) {
  const productCard = event.target.closest('.products__item');
  if (!productCard) {
    return;
  }

  const productId = productCard.dataset.id;
  try {
    const product = await getProductById(productId);
    renderProductModal(product);
    updateModalButtons(productId);
    openModal();
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch product details.',
    });
  }
}

export async function onLoadMoreClick() {
  currentPage += 1;
  try {
    const data = currentSearchQuery
      ? await searchProducts(currentSearchQuery, currentPage)
      : currentCategory === 'All'
      ? await getProducts(currentPage)
      : await getProductsByCategory(currentCategory, currentPage);

    renderProducts(data.products);

    if (data.total <= currentPage * 12) {
      refs.loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of the product list.",
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more products.',
    });
  }
}

export async function onSearchFormSubmit(event) {
  event.preventDefault();
  const query = refs.searchInput.value.trim();

  if (!query) {
    return;
  }

  refs.productsList.innerHTML = '';
  currentPage = 1;
  currentSearchQuery = query;
  currentCategory = 'All';
  refs.loadMoreBtn.style.display = 'block';
  refs.notFoundMessage.classList.remove('not-found--visible');

  try {
    const data = await searchProducts(query, currentPage);

    if (data.products.length === 0) {
      refs.notFoundMessage.classList.add('not-found--visible');
      refs.loadMoreBtn.style.display = 'none';
    } else {
      renderProducts(data.products);
      if (data.total <= currentPage * 12) {
        refs.loadMoreBtn.style.display = 'none';
      }
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to search for products.',
    });
  }
}

export function onSearchClearBtnClick() {
  refs.searchInput.value = '';
  refs.searchClearBtn.style.display = 'none';
  refs.productsList.innerHTML = '';
  currentPage = 1;
  currentSearchQuery = '';
  loadInitialProducts();
}

export function onModalButtonClick(event) {
  const button = event.target;
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

function toggleProductInStorage(storageKey, productId, button, storageName) {
  let items = loadFromStorage(storageKey) || [];
  if (items.includes(productId)) {
    items = items.filter(id => id !== productId);
    button.textContent = `Add to ${storageName}`;
    iziToast.info({
      title: 'Removed',
      message: `Product removed from ${storageName}`,
    });
  } else {
    items.push(productId);
    button.textContent = `Remove from ${storageName}`;
    iziToast.success({
      title: 'Added',
      message: `Product added to ${storageName}`,
    });
  }
  saveToStorage(storageKey, items);
  updateCounters();
}
