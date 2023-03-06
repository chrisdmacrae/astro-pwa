import type { AstroIntegration } from 'astro'
import { routerStore } from './routing/client'

export { createStore, getDehydratedStoreData as getStoreData } from './store'
export type { Store } from './store'

export const router = routerStore

export type SpaIntegrationOptions = {
  pages: string
}

export const spaIntegration = (options: SpaIntegrationOptions): AstroIntegration => {
  return {
    name: "spa",
    hooks: {
      'astro:config:setup': async ({ config, addRenderer }) => {
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

export default spaIntegration