/* eslint-disable @typescript-eslint/no-explicit-any */

import { saveImages } from '../services/saveImages'

export async function importImages(ctx: Context, next: () => Promise<any>) {
  try {
    const { images } = ctx.state.body

    if (!images) {
      await next()

      return
    }

    const createProductsResponse = await saveImages(ctx, images)

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
