/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserInputError } from '@vtex/api'

interface AddProductsDescriptionResponse {
  status: number
  success: boolean
  results: Array<{
    productId: string | number
    success: boolean
    details?: string
  }>
  error?: string
}

export async function addProductDescription(
  ctx: Context,
  productsWithDescription: ProductWithDescription[]
): Promise<AddProductsDescriptionResponse> {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  const { appKey, appToken } = ctx.state

  if (!appKey) {
    throw new UserInputError('Without appKey')
  }

  if (!appToken) {
    throw new UserInputError('Without appToken')
  }

  const addProductDescriptionDetails = async () => {
    return Promise.all(
      (productsWithDescription || []).map(async (product) => {
        try {
          if (!product?.description) {
            return {
              productId: product?.productId,
              success: false,
              details: 'No description',
            }
          }

          await catalogSellerPortal.updateDescription(product, appKey, appToken)

          return {
            productId: product?.productId,
            success: true,
            details: 'Description updated',
          }
        } catch (error) {
          return {
            productId: product?.productId,
            success: false,
            details: JSON.stringify(error?.response?.data, null, 4),
          }
        }
      })
    )
  }

  try {
    const addProductDescriptionResponse = await addProductDescriptionDetails()

    return {
      status: 200,
      success: true,
      results: addProductDescriptionResponse,
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
