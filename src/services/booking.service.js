import api from '@/lib/api';

export const bookingService = {
  getAll:      (params) => api.get('/bookings', { params }),
  getMy:       (params) => api.get('/bookings/my', { params }),
  getById:     (id)     => api.get(`/bookings/${id}`),
  getStats:    ()       => api.get('/bookings/stats'),
  getDashboard:()       => api.get('/bookings/dashboard'),
  create:      (data)   => api.post('/bookings', data),
  update:      (id, data) => api.put(`/bookings/${id}`, data),
  cancel:      (id, reason) => api.delete(`/bookings/${id}/cancel`, { data: { reason } }),
};
