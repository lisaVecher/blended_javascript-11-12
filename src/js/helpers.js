import { getCart, getWishlist } from './storage';

export function updateNavCounts(refs) {
  const cartCountEl = document.querySelector('[data-cart-count]');
  const wishlistCountEl = document.querySelector('[data-wishlist-count]');

  const cart = getCart();
  const wishlist = getWishlist();

  if (cartCountEl) cartCountEl.textContent = cart.length;
  if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
}
