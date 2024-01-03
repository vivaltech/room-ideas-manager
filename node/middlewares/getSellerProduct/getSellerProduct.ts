/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function getSellerProduct(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  try {
    const body = await json(ctx.req)

    const productId = body?.productId

    const { appKey, appToken } = ctx.state

    if (!body) {
      throw new UserInputError('Without body')
    }

    if (!productId) {
      throw new UserInputError('Without productId')
    }

    if (!appKey) {
      throw new UserInputError('Without appKey')
    }

    if (!appToken) {
      throw new UserInputError('Without appToken')
    }

    const response = await catalogSellerPortal.getProduct(
      productId,
      appKey,
      appToken
    )

    ctx.status = 200
    ctx.body = {
      ...response,
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
