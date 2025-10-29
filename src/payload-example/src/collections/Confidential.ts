import type { CollectionConfig } from 'payload'
import {admins} from "@/collections/access";


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
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
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
    }
  ],
};
