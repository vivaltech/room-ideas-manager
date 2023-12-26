/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import { resolvers } from './resolvers'
import { getBody } from './middlewares/common/getBody'
import { validateBodyProductList } from './middlewares/validateBodyProductList'
import { importSellerProducts } from './middlewares/importSellerProducts'
import { getSellerProduct } from './middlewares/getSellerProduct'
import { importImages } from './middlewares/importImages'

const TIMEOUT_MS = 25000

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new LRUCache<string, any>({ max: 8000 })

metrics.trackCache('status', memoryCache)

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
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
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    body: BodyProducts
  }

  interface BodyProducts {
    productList?: Product[]
    images?: Images[]
  }

  interface Product {
    externalId?: string | number
    status: string
    name: string
    brandId: string | number
    categoryIds: string | number | string[] | number[]
    specs: Array<{
      name: string
      values: string[]
    }>
    attributes: Array<{
      name: string
      value: string
    }>
    slug: string
    images: Array<{
      id: string | number
      url: string
      alt?: string
    }>
    skus: Array<{
      name: string
      externalId?: string | number
      ean?: string | number
      manufacturerCode?: string | number
      isActive: boolean
      weight: number
      dimensions: {
        width: number
        height: number
        length: number
      }
      specs: Array<{
        name: string
        value: string
      }>
      images: string[]
    }>
    origin: string
    transportModal?: string | number
    taxCode?: string | number
  }

  interface Images {
    fileName: string
    url: string
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    importSellerProducts: method({
      POST: [getBody, validateBodyProductList, importSellerProducts],
    }),
    getSellerProduct: method({
      POST: [getSellerProduct],
    }),
    importImages: method({
      POST: [getBody, importImages],
    }),
  },
  graphql: {
    resolvers,
  },
})
