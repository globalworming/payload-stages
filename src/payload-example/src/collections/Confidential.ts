import type { CollectionConfig, FieldAccess } from 'payload'
import { admins, adminsAndCreators } from '@/collections/access'


export const Confidential: CollectionConfig = {
  slug: 'confidential',
  labels: {
    singular: 'Confidential',
    plural: 'Confidential',
  },
  access: {
    read: admins,
    delete: () => false
  },
  versions: {
    maxPerDoc: 0, // unlimited
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'relatesTo',
      type: 'relationship',
      relationTo: 'confidentialMedia',
      hasMany: true,
      label: 'Related items',
    },
    {
      name: 'lastEditedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Latest Edit By',
      access: {
        read: adminsAndCreators as FieldAccess,
        create: () => false,
        update: () => false
      }
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req && req.user) {
          data.lastEditedBy = req.user.id;
        }
        return data;
      }
    ]
  }
};
