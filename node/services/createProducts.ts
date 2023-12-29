/* eslint-disable @typescript-eslint/no-explicit-any */

import { appKey, appToken } from '../utils/constants'

interface CreateProductsResponse {
  status: number
  success: boolean
  results: Array<{
    productId: string | number
    productName: string
    description?: string
    success: boolean
    details?: string
  }>
  error?: string
}

export async function createProducts(
  ctx: Context,
  productList: ProductWithImageImported[]
): Promise<CreateProductsResponse> {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  const createProductDetails = async () => {
    return Promise.all(
      (productList || []).map(async (product) => {
        const hasImageError = product.images.some(
          (i) =>
            i?.error &&
            i?.url &&
            !i?.url.startsWith(`https://${ctx.vtex.account}`)
        )

        try {
          if (hasImageError) {
            const errorImages = product.images.filter(
              (i) =>
                i.error &&
                i.url &&
                !i.url.startsWith(`https://${ctx.vtex.account}`)
            )

            return {
              productId: product?.id ?? '',
              productName: product?.name,
              success: false,
              details: JSON.stringify(
                { errors: errorImages.map((i) => i.error) },
                null,
                4
              ),
            }
          }

          let result

          if (product?.id) {
            result = await catalogSellerPortal.updateProduct(
              product,
              appKey,
              appToken
            )
          } else {
            result = await catalogSellerPortal.createProduct(
              product,
              appKey,
              appToken
            )
          }

          return {
            productId: product?.id ? product?.id : result?.id ?? '',
            productName: product?.name,
            description: product?.description,
            success: true,
            details: JSON.stringify(result, null, 4),
          }
        } catch (error) {
          return {
            productId: product?.id ?? '',
            productName: product?.name,
            success: false,
            details: JSON.stringify(error.response.data, null, 4),
          }
        }
      })
    )
  }

  try {
    const createProductsResponse = await createProductDetails()

    return {
      status: 200,
      success: true,
      results: createProductsResponse,
    }
  } catch (error) {
    return {
      status: error?.status ? error?.status : 500,
      success: false,
      results: [],
      error:
        error ??
        'There was an issue processing your request. Please try again later.',
    }
  }
}
