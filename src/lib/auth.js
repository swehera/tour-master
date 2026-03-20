export const getAccessToken  = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken')  : null;
export const getRefreshToken = () => typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
export const getStoredUser   = () => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
};

export const setTokens = (accessToken, refreshToken, user) => {
  localStorage.setItem('accessToken',  accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  if (user) localStorage.setItem('user', JSON.stringify(user));
  // Also set cookie for middleware
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Clear cookie too
  document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax';
};

export const isAuthenticated = () => !!getAccessToken();
