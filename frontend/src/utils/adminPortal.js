export const ADMIN_PORTAL_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:8087/admin/login';

export function isAdminUser(user) {
  return user?.role === 'ADMIN';
}
