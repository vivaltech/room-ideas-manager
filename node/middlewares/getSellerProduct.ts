/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

import { appKey, appToken } from '../utils/constants'

export async function getSellerProduct(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  try {
    const body = await json(ctx.req)
    const productId = body?.productId

    console.info({ productId })

    const response = await catalogSellerPortal.getProduct(
      productId,
      appKey,
      appToken
    )

    console.info({ response })
    ctx.status = 200
    ctx.body = {
      response,
    }

    await next()
  } catch (error) {
    console.error({ error })
    ctx.status = error?.status
    ctx.body = {
      success: false,
      error: error?.message,
    }
  }
}
