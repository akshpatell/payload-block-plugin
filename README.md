# Payload Block Plugin

A Payload CMS plugin that provides a collection of pre-built blocks, including a Hero block, ready to be integrated into your Payload projects.

## Installation

Install the plugin using your preferred package manager:

```bash
yarn add @akshpatell/payload-block-plugin
# or
npm install @akshpatell/payload-block-plugin
```

## Basic Usage

### 1. Add to Payload Schema

In your `payload.config.ts`, import the plugin and add it to the `plugins` array. You can configure which collections should have the blocks added to them.

```ts
import { buildConfig } from 'payload/config'
import { payloadBlockPlugin } from '@akshpatell/payload-block-plugin'

export default buildConfig({
  // ...
  plugins: [
    payloadBlockPlugin({
      // Enable the plugin for specific collections
      collections: {
        pages: true, // Adds blocks to the 'pages' collection
        posts: true, // Adds blocks to the 'posts' collection
      },
      // Optional: Customize the field name for blocks (default is 'layout')
      // blocksFieldName: 'content',
    }),
  ],
})
```

This will automatically inject the `Hero` block (and others in the future) into the specified collections' blocks field.

### 2. Render Components in Your App

To render the blocks in your front-end application (e.g., Next.js), you need to import the component mapping from the plugin.

```tsx
// In your RenderBlocks or Page component
import { components as pluginComponents } from '@akshpatell/payload-block-plugin/client'

// Combine with your local components
const blockComponents = {
  // ...your local blocks
  ...pluginComponents,
}

// Example rendering logic (pseudo-code)
return (
  <div>
    {blocks.map((block, index) => {
      const BlockComponent = blockComponents[block.blockType]
      if (BlockComponent) {
        return <BlockComponent key={index} {...block} />
      }
      return null
    })}
  </div>
)
```

## Features

- **Hero Block**: A fully responsive Hero component.
- **Auto-Configuration**: Automatically adds block definitions to your Payload collections.
- **TypeScript Support**: Fully typed for seamless development.

## Development

If you are developing this plugin locally:

1.  Clone the repository.
2.  Run `yarn` to install dependencies.
3.  Run `yarn dev` to start the test project at `http://localhost:3000`.
4.  Run `yarn build` to build the plugin for distribution.
