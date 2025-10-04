/**
 * MVP hardcoded user credential (single user for initial release)
 *
 * Default credentials:
 * - Username: teacher
 * - Password: password123
 *
 * Note: This will be replaced with database-backed user management in future iterations.
 * The hashed password was generated using bcrypt.hash('password123', 10).
 */
export const MVP_USER = {
  id: 'mvp-user-1',
  username: 'teacher',
  // Password: 'password123' (bcrypt hash with 10 salt rounds)
  hashedPassword: '$2b$10$SIvzWjnVOrOHUP4a1J2CoedR.MKg7WYR832tyOxXPjrhIrfUjGCtK',
};
