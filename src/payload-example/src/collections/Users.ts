import type {CollectionConfig, FieldAccess} from 'payload'
import {admins, adminsAndCreators, checkHasAllRoles} from "@/collections/access";

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
