import type { CollectionConfig } from 'payload'


export const MoreImages: CollectionConfig = {
  slug: 'moreimages',
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
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    crop: true,
    focalPoint: true
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
    },
  ],
};
