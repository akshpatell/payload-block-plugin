import type { Payload } from 'payload'

import { devUser } from './helpers/credentials.js'

export const seed = async (payload: Payload) => {
  const { docs: users } = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  const user = users[0]

  if (!user) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })
  } else {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: devUser.password,
      },
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
