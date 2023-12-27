/* eslint-disable @typescript-eslint/no-explicit-any */

import { createProducts } from '../../services/createProducts'

export async function importSellerProducts(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { productWithOrigin } = ctx.state

    if (!productWithOrigin) {
      await next()

      return
    }

    const createProductsResponse = await createProducts(ctx, productWithOrigin)

    ctx.status = createProductsResponse?.status
    ctx.body = {
      ...createProductsResponse,
    }

    await next()
  } catch (error) {
    ctx.status = error?.status
    ctx.body = {
      success: false,
      error: error?.message,
    }
  }
}
