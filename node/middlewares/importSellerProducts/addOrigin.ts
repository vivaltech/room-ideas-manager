/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserInputError } from '@vtex/api'

import { addOriginOfProducts } from '../../services/addOriginOfProducts'

export async function addOrigin(ctx: Context, next: () => Promise<any>) {
  try {
    const { productList } = ctx.state.body

    if (productList && Array.isArray(productList)) {
      ctx.state.productWithOrigin = addOriginOfProducts(ctx, productList)
    } else {
      throw new UserInputError('Invalid productList')
    }

    await next()
  } catch (error) {
    ctx.status = error?.status || 500
    ctx.body = {
      success: false,
      error: error?.message || 'Internal Server Error',
    }
  }
}
