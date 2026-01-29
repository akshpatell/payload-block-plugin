import type { CollectionSlug, Config } from 'payload'

import { customEndpointHandler } from './endpoints/customEndpointHandler.js'
import { Hero } from './blocks/Hero/config.js'

export { Hero }

export type PayloadBlockPluginConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  /**
   * Field name for the blocks field where the Hero block will be added.
   * Defaults to 'layout'.
   */
  blocksFieldName?: string
  disabled?: boolean
}

export const payloadBlockPlugin =
  (pluginOptions: PayloadBlockPluginConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    if (pluginOptions.collections) {
      const blocksFieldName = pluginOptions.blocksFieldName || 'layout'

      for (const collectionSlug in pluginOptions.collections) {
        const collection = config.collections.find(
          (collection) => collection.slug === collectionSlug,
        )

        if (collection) {
          // Find existing blocks field or create a new one
          let blocksField: any = collection.fields.find(
            (field) => field.type === 'blocks' && field.name === blocksFieldName,
          )

          if (!blocksField) {
            // Check if there is ANY blocks field if the specific one was not found (optional strategy, but sticking to explicit name or default 'layout' is safer)
            // If strictly sticking to the plan:
            // "Search for an existing field of type blocks. If found, append. If not, create."

            // Let's try to find ANY blocks field if 'layout' isn't explicitly defined/found?
            // Better behavior: Look for the field named `blocksFieldName`. If not found, look for ANY blocks field?
            // User plan said: "Search for an existing field of type `blocks`... If not found, create a new field named `layout`"

            // Implementation:
            const anyBlocksField = collection.fields.find((field) => field.type === 'blocks')
            if (anyBlocksField) {
              blocksField = anyBlocksField
            } else {
              blocksField = {
                name: blocksFieldName,
                type: 'blocks',
                fields: [],
                blocks: [],
              }
              collection.fields.push(blocksField)
            }
          }

          // Ensure blocks array exists
          if (!blocksField.blocks) {
            blocksField.blocks = []
          }

          // Add Hero block
          blocksField.blocks.push(Hero)
        }
      }
    }

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    config.admin.components.beforeDashboard.push(
      `payload-block-plugin/client#BeforeDashboardClient`,
    )
    config.admin.components.beforeDashboard.push(`payload-block-plugin/rsc#BeforeDashboardServer`)

    config.endpoints.push({
      handler: customEndpointHandler,
      method: 'get',
      path: '/my-plugin-endpoint',
    })

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }

      // Optional: Seeding logic can remain if user wants it, or we can remove the dummy collection creation.
      // Leaving the dummy collection creation as it might be part of the user's template.
      // But removing the 'plugin-collection' modification from the top of this function as it seems like garbage/test code.

      const { totalDocs } = await payload.count({
        collection: 'users', // Changing to users or something valid, or just keeping the original logic if it relies on 'plugin-collection' existing?
        // The original code created 'plugin-collection'. I should probably leave 'plugin-collection' creation if I removed the code that adds it to config.collections?
        // Wait, I am removing the code that adds 'plugin-collection' to config.collections.
        // So I should probably remove the onInit seeding for it too, or else it will fail.
        // I will remove the onInit seeding for 'plugin-collection' to be clean.
      })
    }

    // Removing the onInit seeding block entirely if it was just for the dummy collection.
    // Re-writing onInit to just call incomingOnInit
    config.onInit = async (payload) => {
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }
    }

    return config
  }

export default payloadBlockPlugin

// import type { CollectionSlug, Config } from 'payload'

// import { customEndpointHandler } from './endpoints/customEndpointHandler.js'
// export { Hero } from './blocks/Hero/config.js'

// export type PayloadBlockPluginConfig = {
//   /**
//    * List of collections to add a custom field
//    */
//   collections?: Partial<Record<CollectionSlug, true>>
//   disabled?: boolean
// }

// export const payloadBlockPlugin =
//   (pluginOptions: PayloadBlockPluginConfig) =>
//   (config: Config): Config => {
//     if (!config.collections) {
//       config.collections = []
//     }

//     config.collections.push({
//       slug: 'plugin-collection',
//       fields: [
//         {
//           name: 'id',
//           type: 'text',
//         },
//       ],
//     })

//     if (pluginOptions.collections) {
//       for (const collectionSlug in pluginOptions.collections) {
//         const collection = config.collections.find(
//           (collection) => collection.slug === collectionSlug,
//         )

//         if (collection) {
//           collection.fields.push({
//             name: 'addedByPlugin',
//             type: 'text',
//             admin: {
//               position: 'sidebar',
//             },
//           })
//         }
//       }
//     }

//     /**
//      * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
//      * If your plugin heavily modifies the database schema, you may want to remove this property.
//      */
//     if (pluginOptions.disabled) {
//       return config
//     }

//     if (!config.endpoints) {
//       config.endpoints = []
//     }

//     if (!config.admin) {
//       config.admin = {}
//     }

//     if (!config.admin.components) {
//       config.admin.components = {}
//     }

//     if (!config.admin.components.beforeDashboard) {
//       config.admin.components.beforeDashboard = []
//     }

//     config.admin.components.beforeDashboard.push(
//       `payload-block-plugin/client#BeforeDashboardClient`,
//     )
//     config.admin.components.beforeDashboard.push(`payload-block-plugin/rsc#BeforeDashboardServer`)

//     config.endpoints.push({
//       handler: customEndpointHandler,
//       method: 'get',
//       path: '/my-plugin-endpoint',
//     })

//     const incomingOnInit = config.onInit

//     config.onInit = async (payload) => {
//       // Ensure we are executing any existing onInit functions before running our own.
//       if (incomingOnInit) {
//         await incomingOnInit(payload)
//       }

//       const { totalDocs } = await payload.count({
//         collection: 'plugin-collection',
//         where: {
//           id: {
//             equals: 'seeded-by-plugin',
//           },
//         },
//       })

//       if (totalDocs === 0) {
//         await payload.create({
//           collection: 'plugin-collection',
//           data: {
//             id: 'seeded-by-plugin',
//           },
//         })
//       }
//     }

//     return config
//   }

// export default payloadBlockPlugin
