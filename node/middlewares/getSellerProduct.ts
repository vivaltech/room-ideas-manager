/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from "co-body";

export async function getSellerProduct(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalogSellerPortal },
  } = ctx;
  try {
    const body = await json(ctx.req);
    const productId = body?.productId;
    console.log({ productId });

    const response = await catalogSellerPortal.getProduct(productId);
    console.log({ response });
    ctx.status = 200;
    ctx.body = {
      response,
    };

    await next();
  } catch (error) {
    console.log({ error });
    ctx.status = error?.status;
    ctx.body = {
      success: false,
      error: error?.message,
    };
  }
}
