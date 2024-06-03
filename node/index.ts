/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClientsConfig, ServiceContext } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
// import { resolvers } from './resolvers'
import { getRoomIdeas } from './middlewares/getRoomIdeas/getRoomIdeas'
import { getRoomScenes } from './middlewares/getRoomScenes/getRoomScenes'

const TIMEOUT_MS = 80000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new LRUCache<string, any>({ max: 80000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 4,
      timeout: TIMEOUT_MS,
    },
    // This key will be merged with the default options and add this cache to our Status client.
    status: {
      memoryCache,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // importSellerProducts: method({
    //   POST: [
    //     getBody,
    //     getAppSettings,
    //     validateBodyProductList,
    //     addOrigin,
    //     importProductImages,
    //     importSellerProducts,
    //   ],
    // }),
    // getSellerProduct: method({
    //   POST: [getAppSettings, getSellerProduct],
    // }),
    // importImages: method({
    //   POST: [getBody, getAppSettings, importImages],
    // }),
    getRoomIdeas: method({
      GET: [getRoomIdeas]
    }),
    getRoomScenes: method({
      GET: [getRoomScenes]
    }),
  },
  // graphql: {
  //   resolvers,
  // },
})
