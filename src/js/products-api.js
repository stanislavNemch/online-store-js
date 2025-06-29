// Функції для роботи з бекендом
import { BASE_URL } from './constants.js';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getProducts(page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`
  );
  return handleResponse(response);
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(response);
}

export async function searchProducts(query, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products/search?q=${query}&limit=${limit}&skip=${skip}`
  );
  return handleResponse(response);
}

export async function getProductCategories() {
  const response = await fetch(`${BASE_URL}/products/category-list`);
  return handleResponse(response);
}

export async function getProductsByCategory(category, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const response = await fetch(
    `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`
  );
  return handleResponse(response);
}
