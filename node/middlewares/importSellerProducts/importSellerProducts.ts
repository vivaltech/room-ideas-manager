/* eslint-disable @typescript-eslint/no-explicit-any */

import { addProductDescription } from '../../services/addProductDescription'
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

    const productWithDescription = createProductsResponse?.results
      ?.filter((r) => r.success)
      ?.filter((r) => r?.productId && r?.description)
      ?.map((r) => {
        const product: ProductWithDescription = {
          productId: r?.productId,
          description: r?.description ?? '',
        }

        return product
      })

    if (productWithDescription.length > 0) {
      const addProductDescriptionResponse = await addProductDescription(
        ctx,
        productWithDescription
      )

      const { results: addProductDescriptionResults } =
        addProductDescriptionResponse

      const newResults = createProductsResponse.results.map((r) => {
        const newResult = {
          ...r,
          descriptionUpdated: !r.description
            ? null
            : addProductDescriptionResults.some(
                (rd) => rd.productId === r.productId && rd.success
              ),
        }

        return newResult
      })

      createProductsResponse.results = newResults
    }

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
