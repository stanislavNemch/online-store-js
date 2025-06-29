//Функцію для створення, рендеру або видалення розмітки

import { refs } from './refs.js';

/**
 * Очищает список продуктов в DOM.
 */
export function clearProducts() {
  if (refs.productsList) {
    refs.productsList.innerHTML = '';
  }
}

/**
 * Рендерит список категорий.
 * @param {string[]} categories Массив названий категорий
 */
export function renderCategories(categories) {
  if (!refs.categoriesList) return;
  const markup = categories
    .map(
      category => `
    <li class="categories__item">
      <button class="categories__btn" type="button">${category}</button>
    </li>
  `
    )
    .join('');
  refs.categoriesList.innerHTML = markup;
  const allCategoryBtn = refs.categoriesList.querySelector('button');
  if (allCategoryBtn) {
    allCategoryBtn.classList.add('categories__btn--active');
  }
}

/**
 * Рендерит список продуктов.
 * @param {object[]} products Массив объектов продуктов
 */
export function renderProducts(products) {
  if (!refs.productsList) return;
  const markup = products
    .map(
      ({ id, title, brand, category, price, thumbnail }) => `
    <li class="products__item" data-id="${id}">
        <img class="products__image" src="${thumbnail}" alt="${title}"/>
        <div class="products__info">
            <h3 class="products__title">${title}</h3>
            <p class="products__brand"><span class="products__brand--bold">Brand:</span> ${brand}</p>
            <p class="products__category">Category: ${category}</p>
            <p class="products__price">Price: $${price}</p>
        </div>
    </li>
  `
    )
    .join('');
  refs.productsList.insertAdjacentHTML('beforeend', markup);
}

/**
 * Рендерит разметку для одного продукта в модальном окне.
 * @param {object} product Объект продукта
 */
export function renderProductModal(product) {
  if (!refs.modalProduct) return;
  const {
    title,
    description,
    price,
    thumbnail,
    shippingInformation,
    returnPolicy,
  } = product;
  const markup = `
    <img class="modal-product__img" src="${thumbnail}" alt="${title}" />
      <div class="modal-product__content">
        <h2 class="modal-product__title">${title}</h2>
        <div class="modal-product__details">
            <p class="modal-product__price">Price: $${price}</p>
            <p class="modal-product__description">${description}</p>
            <p class="modal-product__shipping-information"><b>Shipping:</b> ${shippingInformation}</p>
            <p class="modal-product__return-policy"><b>Return Policy:</b> ${returnPolicy}</p>
        </div>
        <div class="modal-product__buttons">
            <button class="modal-product__btn modal-product__add-to-wishlist-btn" type="button">Add to Wishlist</button>
            <button class="modal-product__btn modal-product__add-to-cart-btn" type="button">Add to Cart</button>
        </div>
      </div>
    `;
  refs.modalProduct.innerHTML = markup;
}
