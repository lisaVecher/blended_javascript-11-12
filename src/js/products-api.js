import axios from 'axios';
import { PAGE_SIZE } from './constants';

axios.defaults.baseURL = 'https://dummyjson.com';
export function getCategorys() {
  return axios
    .get('/products/category-list')
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getProductsByCategory(category, page) {
  let skip = (page - 1) * PAGE_SIZE;

  if (category === 'All') {
    return axios
      .get(`/products?limit=${PAGE_SIZE}&skip=${skip}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  } else {
    return axios
      .get(`/products/category/${category}?limit=${PAGE_SIZE}&skip=${skip}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
}

export function getProductsById(id) {
  return axios
    .get(`/products/${id}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
