export const ROLES = {
  ADMIN: 'admin',
  USER:  'user',
  GUIDE: 'guide',
};

export const isAdmin = (role) => role === ROLES.ADMIN;
export const isGuide = (role) => role === ROLES.GUIDE || role === ROLES.ADMIN;
