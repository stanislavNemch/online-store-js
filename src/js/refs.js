//Обʼєкт з посиланнями на ДОМ елементи
export const refs = {
  // --- Загальні елементи ---
  loader: document.querySelector('.loader'),
  scrollUpBtn: document.querySelector('.scroll-up'),

  // --- Хедер ---
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-form__input'),
  searchClearBtn: document.querySelector('.search-form__btn-clear'),
  wishlistCount: document.querySelector('[data-wishlist-count]'),
  cartCount: document.querySelector('[data-cart-count]'),

  // --- Основний контент (ul.products використовується на всіх сторінках) ---
  productsList: document.querySelector('ul.products'),

  // --- Сторінка Home ---
  categoriesList: document.querySelector('ul.categories'),
  loadMoreBtn: document.querySelector('.load-more'),
  notFoundMessage: document.querySelector('.not-found'),

  // --- Модальне окно ---
  modal: document.querySelector('.modal'),
  modalProduct: document.querySelector('.modal-product'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  modalActions: document.querySelector('.modal-product__actions'),

  // --- Сторінка Cart ---
  cartTotalItems: document.querySelector('[data-count]'),
  cartTotalPrice: document.querySelector('[data-price]'),
  cartBuyBtn: document.querySelector('.cart-summary__btn'),
};
