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
    if (pluginOptions.disabled) {
      return config
    }

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
            // Fallback: look for ANY blocks field if specific one not found?
            // tailored strategy: if specific named blocks field not found, checks for any blocks field.
            // If still not found, creates one.
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
          // Check if already added to avoid duplicates if possible, though config merging usually handles this.
          const heroExists = blocksField.blocks.find((b: any) => b.slug === Hero.slug)
          if (!heroExists) {
            blocksField.blocks.push(Hero)
          }
        }
      }
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
    // config.admin.components.beforeDashboard.push(`payload-block-plugin/rsc#BeforeDashboardServer`)

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
    }

    return config
  }

export default payloadBlockPlugin
