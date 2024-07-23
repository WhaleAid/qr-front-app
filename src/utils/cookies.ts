import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  setCookie(null, 'accessToken', accessToken, {
    maxAge: 2592000,
    path: '/',
  });
  setCookie(null, 'refreshToken', refreshToken, {
    maxAge: 31536000,
    path: '/',
  });
};

export const getAuthCookies = () => {
  const cookies = parseCookies();
  return {
    accessToken: cookies.accessToken,
    refreshToken: cookies.refreshToken,
  };
};

export const clearAuthCookies = () => {
  destroyCookie(null, 'accessToken');
  destroyCookie(null, 'refreshToken');
};