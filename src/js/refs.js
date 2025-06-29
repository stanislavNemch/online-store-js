//Обʼєкт з посиланнями на ДОМ елементи
export const refs = {
  // --- Общие элементы ---
  loader: document.querySelector('.loader'),
  scrollUpBtn: document.querySelector('.scroll-up'),
  themeSwitcher: document.querySelector('.theme-switcher'),

  // --- Хедер ---
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-form__input'),
  searchClearBtn: document.querySelector('.search-form__btn-clear'),
  wishlistCountBtn: document.querySelector('.nav__btn--wishlist'),
  cartCountBtn: document.querySelector('.nav__btn--cart'),

  // --- Основной контент (ul.products используется на всех страницах) ---
  productsList: document.querySelector('ul.products'),

  // --- Страница Home ---
  categoriesList: document.querySelector('ul.categories'),
  loadMoreBtn: document.querySelector('.load-more'),
  notFoundMessage: document.querySelector('.not-found'),

  // --- Модальное окно ---
  modal: document.querySelector('.modal'),
  modalProduct: document.querySelector('.modal-product'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  modalActions: document.querySelector('.modal-product__actions'),

  // --- Страница Cart ---
  cartTotalItems: document.querySelector('.cart-summary__items-value'),
  cartTotalPrice: document.querySelector('.cart-summary__total-value'),
  cartBuyBtn: document.querySelector('.cart-summary__buy-btn'),
};
