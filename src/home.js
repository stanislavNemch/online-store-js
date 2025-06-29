//Логіка сторінки Home
import { getProductCategories, getProducts } from './js/products-api.js';
import { renderCategories, renderProducts } from './js/render-function.js';
import { refs } from './js/refs.js';
import {
  onCategoryClick,
  onProductClick,
  onLoadMoreClick,
  onSearchFormSubmit,
  onSearchClearBtnClick,
  onModalButtonClick,
  updateCartCount,
  updateWishlistCount,
} from './js/handlers.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

async function loadInitialData() {
  try {
    const categories = await getProductCategories();
    renderCategories(['All', ...categories]);

    const data = await getProducts();
    renderProducts(data.products);
    if (data.total <= 12) {
      refs.loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load initial data.',
    });
  }
}

loadInitialData();
updateCartCount();
updateWishlistCount();

refs.categoriesList.addEventListener('click', onCategoryClick);
refs.productsList.addEventListener('click', onProductClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.searchClearBtn.addEventListener('click', onSearchClearBtnClick);
refs.modalProduct.addEventListener('click', onModalButtonClick);

refs.searchInput.addEventListener('input', () => {
  if (refs.searchInput.value.trim() !== '') {
    refs.searchClearBtn.style.display = 'block';
  } else {
    refs.searchClearBtn.style.display = 'none';
  }
});
