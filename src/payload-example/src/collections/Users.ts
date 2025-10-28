import type {CollectionConfig, FieldAccess} from 'payload'
import type { Access } from 'payload'
import type { User } from '../payload-types'

const checkHasAllRoles = (allOfThese: User['roles'] = [], user: User | null = null): boolean => {

  if (!user) {
    return false
  }

  if (user.id === 1) {
    return true
  }

  return !!allOfThese?.every((role) => {
    return user?.roles?.some((individualRole) => {
      return individualRole === role
    })
  });
}

export const admins: Access = ({ req: { user } }) => checkHasAllRoles(['admin'], user)
export const adminsAndCreators: Access = ({ req: { user }}) => checkHasAllRoles(['creator'], user) || checkHasAllRoles(['admin'], user)

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: adminsAndCreators,
    create: admins,
    update: admins,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => checkHasAllRoles(['admin'], user) || checkHasAllRoles(['creator'], user),
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Creator',
          value: 'creator',
        },
      ],
      hasMany: true,
      saveToJWT: true,
      access: {
        read: adminsAndCreators as FieldAccess,
        update: admins as FieldAccess,
        create: admins as FieldAccess,
      },
    },
  ],
}
