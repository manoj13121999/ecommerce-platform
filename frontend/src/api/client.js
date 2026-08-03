const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const authApi = {
  register: (body) => request('/users/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/users/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/users/me'),
  updateProfile: (body) => request('/users/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) => request('/users/me/change-password', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  forgotPassword: (body) => request('/users/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/users/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  getWishlist: () => request('/users/me/wishlist'),
  isInWishlist: (productId) => request(`/users/me/wishlist/${productId}`),
  addToWishlist: (productId) => request('/users/me/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),
  removeFromWishlist: (productId) => request(`/users/me/wishlist/${productId}`, { method: 'DELETE' }),
};

export const catalogApi = {
  getCategories: () => request('/categories'),
  getProducts: ({
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    page = 0,
    size = 12,
    sort = 'name_asc',
  } = {}) => {
    const params = new URLSearchParams({ page: String(page), size: String(size), sort });
    if (categoryId) params.set('categoryId', String(categoryId));
    if (minPrice != null) params.set('minPrice', String(minPrice));
    if (maxPrice != null) params.set('maxPrice', String(maxPrice));
    if (inStock != null) params.set('inStock', String(inStock));
    return request(`/products?${params}`);
  },
  getDeals: ({ page = 0, size = 12, sort = 'price_asc' } = {}) => {
    const params = new URLSearchParams({ page: String(page), size: String(size), sort });
    return request(`/products/deals?${params}`);
  },
  searchProducts: (query, { page = 0, size = 12 } = {}) => {
    const params = new URLSearchParams({ q: query, page: String(page), size: String(size) });
    return request(`/products/search?${params}`);
  },
  getProductsByIds: (ids) => request(`/products/by-ids?ids=${ids.join(',')}`),
  getProduct: (id) => request(`/products/${id}`),
  getRelatedProducts: (id, limit = 4) => request(`/products/${id}/related?limit=${limit}`),
};

export const cartApi = {
  getCart: () => request('/cart'),
  addItem: (body) => request('/cart/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (productId, body) => request(`/cart/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  removeItem: (productId) => request(`/cart/items/${productId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),
};
