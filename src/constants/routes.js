export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TOURS: '/tours',
  TOUR_DETAIL: (slug) => `/tours/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_USER_CREATE: '/dashboard/users/create',
  DASHBOARD_USER_DETAIL: (id) => `/dashboard/users/${id}`,
  DASHBOARD_TOURS: '/dashboard/tours',
  DASHBOARD_TOUR_CREATE: '/dashboard/tours/create',
  DASHBOARD_TOUR_DETAIL: (id) => `/dashboard/tours/${id}`,
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
};
