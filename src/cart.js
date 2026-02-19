//Логіка сторінки Cart
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { refs } from './js/refs';
import { getProductsById } from './js/products-api';
import { showProducts, showModalProduct } from './js/render-function';
import { openModal } from './js/modal';
import { updateNavCounts } from './js/helpers';
import {
  clearCart,
  getCart,
  isInCart,
  isInWishlist,
  toggleCart,
  toggleWishlist,
} from './js/storage';

let currentProductId = null;

updateNavCounts(refs);
initCart();

function initCart() {
  const ids = getCart();

  if (!ids.length) {
    refs.products.innerHTML = '';
    if (refs.notFound) refs.notFound.classList.add('not-found--visible');
    updateSummary([]);
    return;
  }

  if (refs.notFound) refs.notFound.classList.remove('not-found--visible');

  Promise.all(ids.map(id => getProductsById(id)))
    .then(products => {
      refs.products.innerHTML = showProducts(products);
      updateSummary(products);
    })
    .catch(() => {
      iziToast.error({ message: 'Please try again later.' });
    });
}

function updateSummary(products) {
  const items = products.length;
  const total = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  if (refs.cartItemsValue) refs.cartItemsValue.textContent = items;
  if (refs.cartTotalValue) refs.cartTotalValue.textContent = `$${total}`;
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
});

refs.modalBtnCart.addEventListener('click', () => {
  if (!currentProductId) return;

  toggleCart(currentProductId);
  syncModalButtons(currentProductId);
  updateNavCounts(refs);

  initCart();
});

if (refs.buyBtn) {
  refs.buyBtn.addEventListener('click', () => {
    clearCart();
    updateNavCounts(refs);
    initCart();
    iziToast.success({ message: 'Purchase successful!' });
  });
}
