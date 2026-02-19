//Логіка сторінки Home
import {
  getCategorys,
  getProductsByCategory,
  getProductsById,
} from './js/products-api';
import { refs } from './js/refs';
import { showProducts, showModalProduct } from './js/render-function';
import { openModal } from './js/modal';
import { updateNavCounts } from './js/helpers';
import {
  isInCart,
  isInWishlist,
  toggleCart,
  toggleWishlist,
} from './js/storage';

let currentPage = 1;
let currentCategory = 'All';
let currentProductId = null;

updateNavCounts(refs);

getCategorys()
  .then(data => {
    const categoryArray = ['All', ...data];

    const markup = categoryArray
      .map(
        category => `
        <li class="categories__item">
          <button class="categories__btn" type="button">${category}</button>
        </li>`
      )
      .join('');

    refs.categories.innerHTML = markup;

    const firstBtn = refs.categories.querySelector('.categories__btn');
    if (firstBtn) firstBtn.classList.add('categories__btn--active');
  })
  .catch(err => console.log(err));

refs.categories.addEventListener('click', event => {
  const button = event.target.closest('button.categories__btn');
  if (!button) return;

  const prevActive = refs.categories.querySelector('.categories__btn--active');
  if (prevActive) prevActive.classList.remove('categories__btn--active');

  button.classList.add('categories__btn--active');

  currentCategory = button.textContent.trim();
  loadProducts(true);
});

function loadProducts(reset = false) {
  if (reset) {
    currentPage = 1;
    refs.products.innerHTML = '';
  }

  getProductsByCategory(currentCategory, currentPage)
    .then(data => {
      const markup = showProducts(data.products);

      if (reset) {
        refs.products.innerHTML = markup;
      } else {
        refs.products.insertAdjacentHTML('beforeend', markup);
      }

      const loaded = refs.products.querySelectorAll('.products__item').length;

      if (loaded >= data.total) {
        refs.loadMoreBtn.classList.add('is-hidden');
      } else {
        refs.loadMoreBtn.classList.remove('is-hidden');

        if (refs.notFound) {
          if (!data.products || data.products.length === 0)
            refs.notFound.classList.add('not-found--visible');
          else refs.notFound.classList.remove('not-found--visible');
        }
      }
    })
    .catch(err => console.log(err));
}

loadProducts(true);

refs.loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  loadProducts(false);
});

refs.products.addEventListener('click', event => {
  const item = event.target.closest('.products__item');
  if (!item) return;

  const id = item.dataset.id;
  currentProductId = id;

  getProductsById(id)
    .then(product => {
      refs.modalProduct.innerHTML = showModalProduct(product);
      openModal();
    })
    .catch(error => console.log(error));
});

function syncModalButtons(id) {
  if (!refs.modalBtnWishlist || !refs.modalBtnCart) return;

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
});
