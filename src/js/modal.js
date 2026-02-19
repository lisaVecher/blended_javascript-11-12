import { refs } from './refs';

function handleEsc(event) {
  if (event.key === 'Escape') closeModal();
}

export function openModal() {
  refs.modal.classList.add('modal--is-open');
  document.addEventListener('keydown', handleEsc);
}

export function closeModal() {
  refs.modal.classList.remove('modal--is-open');
  refs.modalProduct.innerHTML = '';
  document.removeEventListener('keydown', handleEsc);
}

refs.modalCloseBtn.addEventListener('click', closeModal);

refs.modal.addEventListener('click', event => {
  if (event.target === refs.modal) closeModal();
});
