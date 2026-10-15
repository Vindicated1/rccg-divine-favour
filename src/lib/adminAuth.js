import jwt from 'jsonwebtoken';

export function isAdminRequest(request) {
  const token = request.cookies.get('admin_session')?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) return false;

  try {
    const payload = jwt.verify(token, secret);
    return typeof payload === 'object' && payload.role === 'admin';
  } catch {
    return false;
  }
}
