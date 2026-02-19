export function showProducts(products) {
  return products
    .map(({ id, title, category, price, thumbnail }) => {
      return `<li class="products__item" data-id="${id}">
    <img class="products__image" src="${thumbnail}" alt="${title}"/>
    <p class="products__title">${title}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand:</span></p>
    <p class="products__category">Category: ${category}</p>
    <p class="products__price">Price: $${price}</p>
 </li>
`;
    })
    .join('');
}

export function showModalProduct({
  title,
  price,
  tags,
  description,
  thumbnail,
  brand,
  category,
}) {
  const tagsMarkup = Array.isArray(tags)
    ? tags.map(tag => `<li class="modal-product__tag">${tag}</li>`).join('')
    : '';
  const fallbackTags = !tagsMarkup
    ? `<li class="modal-product__tag">${brand ?? ''}</li><li class="modal-product__tag">${category ?? ''}</li>`
    : '';

  return `<img class="modal-product__img" src="${thumbnail}" alt="${title}" />
    <div class="modal-product__content">
      <p class="modal-product__title">${title}</p>
      <ul class="modal-product__tags">${tagsMarkup || fallbackTags}</ul>
      <p class="modal-product__description">${description}</p>
      <p class="modal-product__shipping-information">Shipping:</p>
      <p class="modal-product__return-policy">Return Policy:</p>
      <p class="modal-product__price">Price: $${price}</p>
      <button class="modal-product__buy-btn" type="button">Buy</button>
    </div>`;
}
