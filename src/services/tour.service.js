import api from '@/lib/api';

export const tourService = {
  getPublic:   (params) => api.get('/tours', { params }),
  getAll:      (params) => api.get('/tours/admin/all', { params }),
  getBySlug:   (slug)   => api.get(`/tours/slug/${slug}`),
  getById:     (id)     => api.get(`/tours/${id}`),
  getStats:    ()       => api.get('/tours/admin/stats'),
  getCategories: ()     => api.get('/tours/categories'),
  create: (data) => api.post('/tours', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/tours/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:         (id) => api.delete(`/tours/${id}`),
  toggleFeatured: (id) => api.patch(`/tours/${id}/featured`),
  toggleActive:   (id) => api.patch(`/tours/${id}/active`),
  getReviews: (id, params) => api.get(`/tours/${id}/reviews`, { params }),
  addReview:  (id, data)   => api.post(`/tours/${id}/reviews`, data),
};
