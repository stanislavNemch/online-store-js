//Функцію для створення, рендеру або видалення розмітки
import { refs } from './refs.js';

export function renderCategories(categories) {
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
}

export function renderProducts(products) {
  const markup = products
    .map(
      ({ id, title, brand, category, price, thumbnail }) => `
    <li class="products__item" data-id="${id}">
      <img class="products__image" src="${thumbnail}" alt="${title}"/>
      <p class="products__title">${title}</p>
      <p class="products__brand"><span class="products__brand--bold">Brand:</span> ${brand}</p>
      <p class="products__category">Category: ${category}</p>
      <p class="products__price">Price: $${price}</p>
    </li>
  `
    )
    .join('');
  refs.productsList.insertAdjacentHTML('beforeend', markup);
}

export function renderProductModal(product) {
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
        <p class="modal-product__title">${title}</p>
        <p class="modal-product__description">${description}</p>
        <p class="modal-product__shipping-information">Shipping: ${shippingInformation}</p>
        <p class="modal-product__return-policy">Return Policy: ${returnPolicy}</p>
        <p class="modal-product__price">Price: $${price}</p>
        <div class="modal-product__btns">
            <button class="modal-product__btn modal-product__add-to-wishlist-btn" type="button">Add to Wishlist</button>
            <button class="modal-product__btn modal-product__add-to-cart-btn" type="button">Add to Cart</button>
        </div>
    </div>
    `;
  refs.modalProduct.innerHTML = markup;
}
