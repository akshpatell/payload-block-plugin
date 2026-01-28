import type { Payload } from 'payload'

import { devUser } from './helpers/credentials.js'

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })
  }


  const { totalDocs: postsCount } = await payload.count({
    collection: 'posts',
  })

  if (!postsCount) {
    await payload.create({
      collection: 'posts',
      data: {
        layout: [
          {
            blockType: 'hero',
            headline: 'Welcome to the Hero Plugin',
            subheadline: 'This content was seeded automatically for testing.',
            buttons: [
              {
                label: 'Primary Action',
                type: 'primary',
                link: '#',
              },
              {
                label: 'Secondary Action',
                type: 'secondary',
                link: '#',
              },
            ],
          },
        ],
      },
    })
  }
}
