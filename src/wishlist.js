//Логіка сторінки Wishlist
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { refs } from './js/refs';
import { getProductsById } from './js/products-api';
import { showProducts, showModalProduct } from './js/render-function';
import { openModal } from './js/modal';
import { updateNavCounts } from './js/helpers';
import {
  getWishlist,
  isInCart,
  isInWishlist,
  toggleCart,
  toggleWishlist,
} from './js/storage';

let currentProductId = null;

updateNavCounts(refs);

initWishlist();

function initWishlist() {
  const ids = getWishlist();

  if (!ids.length) {
    refs.products.innerHTML = '';
    if (refs.notFound) refs.notFound.classList.add('not-found--visible');
    return;
  }

  if (refs.notFound) refs.notFound.classList.remove('not-found--visible');

  Promise.all(ids.map(id => getProductsById(id)))
    .then(products => {
      refs.products.innerHTML = showProducts(products);
    })
    .catch(() => {
      iziToast.error({ message: 'Please try again later.' });
    });
}

refs.products.addEventListener('click', event => {
  const item = event.target.closest('.products__item');
  if (!item) return;

  const id = item.dataset.id;
  currentProductId = id;

  getProductsById(id)
    .then(product => {
      refs.modalProduct.innerHTML = showModalProduct(product);
      syncModalButtons(id);
      openModal();
    })
    .catch(() => {
      iziToast.error({ message: 'Please try again later.' });
    });
});

function syncModalButtons(id) {
  refs.modalBtnWishlist.textContent = isInWishlist(id)
    ? 'Remove from Wishlist'
    : 'Add to Wishlist';

  refs.modalBtnCart.textContent = isInCart(id)
    ? 'Remove from Cart'
    : 'Add to Cart';
}

refs.modalBtnWishlist.addEventListener('click', () => {
  if (!currentProductId) return;

  toggleWishlist(currentProductId);
  syncModalButtons(currentProductId);
  updateNavCounts(refs);
  initWishlist();
});

refs.modalBtnCart.addEventListener('click', () => {
  if (!currentProductId) return;

  toggleCart(currentProductId);
  syncModalButtons(currentProductId);
  updateNavCounts(refs);
});
