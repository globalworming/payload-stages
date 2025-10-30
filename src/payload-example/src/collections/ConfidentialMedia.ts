import type { CollectionConfig } from 'payload'
import {admins} from "@/collections/access";


export const ConfidentialMedia: CollectionConfig = {
  slug: 'confidentialMedia',
  labels: {
    singular: 'Confidential Media',
    plural: 'Confidential Media',
  },
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: admins,
    delete: () => false,

  },
  upload: {
    staticDir: 'uploads/confidentialMedia',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [

  ],
};
