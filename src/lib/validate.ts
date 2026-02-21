export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain an uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain a lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number' };
  return { valid: true, message: '' };
}

export function validateUsername(username: string): { valid: boolean; message: string } {
  if (username.length < 3) return { valid: false, message: 'Username must be at least 3 characters' };
  if (username.length > 30) return { valid: false, message: 'Username must be at most 30 characters' };
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  return { valid: true, message: '' };
}
