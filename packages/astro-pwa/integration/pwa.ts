import type { AstroIntegration } from 'astro'

export type PwaIntegrationOptions = {
  pages: string
}

export const pwaIntegration = (options: PwaIntegrationOptions): AstroIntegration => {
  return {
    name: "spa",
    hooks: {
      'astro:config:setup': async ({ config, addRenderer, injectScript }) => {
        // inject routes and scripts
        // console.log({ config })
      },
      'astro:build:setup': async ({ pages }) => {
        // only available in prod build
        // console.log({ pages })
      },
      'astro:build:done': async ({ routes }) => {
        // only available in prod build
        // console.log({ routes })
        // generate router types?
      }
    }
  }
}

export default pwaIntegration