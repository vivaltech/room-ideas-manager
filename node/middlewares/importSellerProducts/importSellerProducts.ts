/* eslint-disable @typescript-eslint/no-explicit-any */

import { createProducts } from '../../services/createProducts'

export async function importSellerProducts(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { productWithImageImported } = ctx.state

    if (!productWithImageImported) {
      await next()

      return
    }

    const createProductsResponse = await createProducts(
      ctx,
      productWithImageImported
    )

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
