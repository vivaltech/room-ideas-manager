/* eslint-disable @typescript-eslint/no-explicit-any */

import { appKey, appToken } from '../utils/constants'

interface CreateProductsResponse {
  status: number
  success: boolean
  results: Array<{ productName: string; success: boolean; details?: string }>
  error?: string
}

export async function createProducts(
  ctx: Context,
  productList: Product[]
): Promise<CreateProductsResponse> {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  const createProductDetails = async () => {
    return Promise.all(
      (productList || []).map(async (product) => {
        try {
          const result = await catalogSellerPortal.createProduct(
            product,
            appKey,
            appToken
          )

          return {
            productName: product.name,
            success: true,
            details: JSON.stringify(result, null, 4),
          }
        } catch (error) {
          return {
            productName: product.name,
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
