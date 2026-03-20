import api from '@/lib/api';

export const contactService = {
  submit:    (data)   => api.post('/contacts', data),
  getAll:    (params) => api.get('/contacts', { params }),
  markRead:  (id)     => api.patch(`/contacts/${id}/read`),
  delete:    (id)     => api.delete(`/contacts/${id}`),
  unreadCount: ()     => api.get('/contacts/unread'),
};
