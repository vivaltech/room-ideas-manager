export function addOriginOfProducts(
  ctx: Context,
  productList: Product[]
): ProductWithOrigin[] {
  return productList.map((p) => ({
    ...p,
    origin: ctx.vtex.account,
  }))
}
