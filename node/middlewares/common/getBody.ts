/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from 'co-body'

export async function getBody(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)

  ctx.state.body = {
    productList: body?.productList,
  }

  await next()
}
