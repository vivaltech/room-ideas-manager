/* eslint-disable @typescript-eslint/no-explicit-any */

import { createProducts } from '../services/createProducts'

export async function importSellerProducts(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { productList } = ctx.state.body
    const createProductsResponse = await createProducts(ctx, productList)

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
