/* eslint-disable @typescript-eslint/no-explicit-any */

import { addProductImages } from '../../services/addProductImages'

export async function importProductImages(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { productWithOrigin } = ctx.state

    if (!productWithOrigin || productWithOrigin.length === 0) {
      await next()

      return
    }

    const productImages = await addProductImages(ctx, productWithOrigin)

    ctx.state.productWithImageImported = productImages

    await next()
  } catch (error) {
    ctx.status = error?.status
    ctx.body = {
      success: false,
      error: error?.message,
    }
  }
}
