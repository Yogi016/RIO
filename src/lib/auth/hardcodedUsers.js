// @ts-nocheck
export const HARD_CODED_USERS = [
  {
    role: 'super_admin',
    roleLabel: 'Super Admin',
    name: 'Super Admin Kemendagri',
    username: 'superadmin',
    password: 'superadmin123',
    scope: 'Akses penuh nasional',
  },
  {
    role: 'admin',
    roleLabel: 'Admin',
    name: 'Admin Wilayah',
    username: 'admin',
    password: 'admin123',
    scope: 'Pengelolaan data wilayah',
  },
  {
    role: 'user',
    roleLabel: 'User',
    name: 'User Pemantau',
    username: 'user',
    password: 'user123',
    scope: 'Pemantauan dashboard',
  },
];

export function authenticateHardcodedUser(username, password, role) {
  return (
    HARD_CODED_USERS.find(
      (user) => user.username === username && user.password === password && user.role === role
    ) ?? null
  );
}
