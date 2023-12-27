/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserInputError } from '@vtex/api'

export async function validateBodyProductList(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { body } = ctx.state

    if (!body) {
      throw new UserInputError('Without body')
    }

    if (!body?.productList) {
      throw new UserInputError('Without productList')
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
