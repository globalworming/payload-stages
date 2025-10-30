import type { CollectionConfig, FieldAccess } from 'payload'
import { admins, adminsAndCreators } from '@/collections/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      label: 'Tags',
      access: {
        create: admins as FieldAccess,
        read: adminsAndCreators as FieldAccess,
        update: admins as FieldAccess,
      },
    }
  ],
  upload: true,
}
