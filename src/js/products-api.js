// Функції для роботи з бекендом
import { BASE_URL } from './constants.js';

export async function getProducts(page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product by ID');
  }
  return response.json();
}

export async function searchProducts(query, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products/search?q=${query}&limit=${limit}&skip=${skip}`
  );
  if (!response.ok) {
    throw new Error('Failed to search for products');
  }
  return response.json();
}

export async function getProductCategories() {
  const response = await fetch(`${BASE_URL}/products/category-list`);
  if (!response.ok) {
    throw new Error('Failed to fetch product categories');
  }
  return response.json();
}

export async function getProductsByCategory(category, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }
  return response.json();
}
