//Обʼєкт з посиланнями на ДОМ елементи

export const refs = {
  // Home page
  categoriesList: document.querySelector('.categories'),
  productsList: document.querySelector('.products'),
  loadMoreBtn: document.querySelector('.load-more'),
  notFoundMessage: document.querySelector('.not-found'),
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-form__input'),
  searchClearBtn: document.querySelector('.search-form__btn-clear'),

  // Modal
  modal: document.querySelector('.modal'),
  modalProduct: document.querySelector('.modal-product'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),

  // Wishlist & Cart
  wishlistCount: document.querySelector('.nav__count--wishlist'),
  cartCount: document.querySelector('.nav__count--cart'),

  // Wishlist page
  wishlistProductsList: document.querySelector('.wishlist-products'),

  // Cart page
  cartProductsList: document.querySelector('.cart-products'),
  cartTotalItems: document.querySelector('.cart-summary__items'),
  cartTotalPrice: document.querySelector('.cart-summary__total'),
  cartBuyBtn: document.querySelector('.cart-summary__buy-btn'),

  // Theme switcher
  themeSwitcher: document.querySelector('.theme-switcher'),

  // Scroll up button
  scrollUpBtn: document.querySelector('.scroll-up'),
};
