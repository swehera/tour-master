import api from '@/lib/api';

export const authService = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  logout:   ()      => api.post('/auth/logout'),
  getMe:    ()      => api.get('/auth/me'),
  refresh:  (token) => api.post('/auth/refresh', { refreshToken: token }),
  changePassword: (data) => api.put('/auth/change-password', data),
};
