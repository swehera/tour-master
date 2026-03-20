import api from '@/lib/api';

export const userService = {
  getAll:    (params) => api.get('/users', { params }),
  getById:   (id)     => api.get(`/users/${id}`),
  getStats:  ()       => api.get('/users/stats'),
  getProfile:()       => api.get('/users/profile'),
  update:    (id, data) => api.put(`/users/${id}`, data),
  updateProfile: (data) => api.put('/users/profile', data),
  delete:    (id)     => api.delete(`/users/${id}`),
  uploadAvatar: (form) => api.post('/users/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
