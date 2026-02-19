import { LS_KEYS } from './constants';

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function toggleId(key, id) {
  const strId = String(id);
  const list = readArray(key);
  const idx = list.indexOf(strId);

  if (idx === -1) list.push(strId);
  else list.splice(idx, 1);

  writeArray(key, list);
  return list;
}
export function getWishlist() {
  return readArray(LS_KEYS.WISHLIST);
}
export function setWishlist(ids) {
  writeArray(LS_KEYS.WISHLIST, ids.map(String));
}
export function toggleWishlist(id) {
  return toggleId(LS_KEYS.WISHLIST, id);
}
export function getCart() {
  return readArray(LS_KEYS.CART);
}
export function setCart(ids) {
  writeArray(LS_KEYS.CART, ids.map(String));
}
export function toggleCart(id) {
  return toggleId(LS_KEYS.CART, id);
}
export function isInWishlist(id) {
  return getWishlist().includes(String(id));
}
export function isInCart(id) {
  return getCart().includes(String(id));
}

export function clearCart() {
  writeArray(LS_KEYS.CART, []);
}
export function clearWishlist() {
  writeArray(LS_KEYS.WISHLIST, []);
}
