/* eslint-disable @typescript-eslint/no-explicit-any */
import { JanusClient } from '@vtex/api'
import type { IOContext, InstanceOptions } from '@vtex/api'

const baseURL = '/api/catalog-seller-portal'

const routes = {
  createProduct: `${baseURL}/products`,
}

export class CatalogSellerPortalClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: ctx.authToken ?? ctx.adminUserAuthToken ?? '',
      },
    })
  }

  public createProduct(product: Product) {
    return this.http.post<any>(routes.createProduct, product)
  }
}
