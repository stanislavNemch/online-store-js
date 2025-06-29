//Функцію для створення, рендеру або видалення розмітки
import { refs } from './refs.js';

/**
 * Очищує список продуктів у DOM.
 */
export function clearProducts() {
  if (refs.productsList) {
    refs.productsList.innerHTML = '';
  }
}

/**
 * Рендерить список категорій.
 * @param {string[]} categories Масив назв категорій
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
 * Рендерить список продуктів.
 * @param {object[]} products Масив об'єктів продуктів
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
 * Рендерить розмітку для одного продукту в модальному вікні.
 * @param {object} product Об'єкт продукту
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
      </div>
    `;
  // Заповнюємо контейнер .modal-product
  refs.modalProduct.innerHTML = markup;
}
