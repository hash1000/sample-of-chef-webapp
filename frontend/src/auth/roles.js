export const ROLES = /** @type {const} */ ({
  user: 'user',
  chef: 'chef',
  admin: 'admin',
})

export const ALL_ROLES = Object.values(ROLES)

export function roleHomePath(role) {
  switch (role) {
    case ROLES.user:
      return '/home'
    case ROLES.chef:
      return '/chef-dashboard'
    case ROLES.admin:
      return '/admin-dashboard'
    default:
      return '/home'
  }
}

