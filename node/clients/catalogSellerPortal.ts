/* eslint-disable @typescript-eslint/no-explicit-any */
import { JanusClient } from '@vtex/api'
import type { IOContext, InstanceOptions } from '@vtex/api'

const baseURL = '/api/catalog-seller-portal'

const routes = {
  getProduct: (productId: string | number) =>
    `${baseURL}/products/${productId}`,
  createProduct: `${baseURL}/products`,
  updateProduct: (productId: string | number) =>
    `${baseURL}/products/${productId}`,
  updateDescription: (productId: string | number) =>
    `${baseURL}/products/${productId}/description`,
}

export class CatalogSellerPortalClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      // headers: {
      //  ...options?.headers,
      //  VtexIdclientAutCookie: ctx.authToken ?? ctx.adminUserAuthToken ?? '',
      // },
    })
  }

  public createProduct(
    product: ProductWithOrigin,
    appKey: string,
    appToken: string
  ) {
    return this.http.post<any>(routes.createProduct, product, {
      headers: {
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }

  public updateProduct(
    product: ProductWithOrigin,
    appKey: string,
    appToken: string
  ) {
    return this.http.put<any>(
      `${routes.updateProduct(product?.id ?? '')}`,
      product,
      {
        headers: {
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  public updateDescription(
    product: ProductWithDescription,
    appKey: string,
    appToken: string
  ) {
    return this.http.put<any>(
      `${routes.updateDescription(product?.productId ?? '')}`,
      product,
      {
        headers: {
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  public getProduct(productId: string, appKey: string, appToken: string) {
    return this.http.get(routes.getProduct(productId), {
      headers: {
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }
}
