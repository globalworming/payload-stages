import type { CollectionConfig } from 'payload'


export const Confidential: CollectionConfig = {
  slug: 'confidential',
  labels: {
    singular: 'Confidential',
    plural: 'Confidential',
  },
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    // Only logged-in users can view this media
    read: ({ req }) => !!req.user,
  },
  upload: {
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
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
  ],
};
