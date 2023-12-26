/* eslint-disable @typescript-eslint/no-explicit-any */

import { appKey, appToken } from '../utils/constants'

interface CreateProductsResponse {
  status: number
  success: boolean
  results: any
  error?: string
}

export async function saveImages(
  ctx: Context,
  images: Images[]
): Promise<CreateProductsResponse> {
  const {
    clients: { vtexId },
  } = ctx

  console.info({ images })

  const { token: authCookie } = await vtexId.getToken(appKey, appToken)

  console.info({ authCookie })
  // const saveImagesDetails = async () => {
  //  return Promise.all(
  //    (saveImages || []).map(async (image) => {
  //      try {
  //        const result = await catalogSellerPortal.createProduct(product)

  //        return {
  //          productName: product.name,
  //          success: true,
  //          details: JSON.stringify(result, null, 4),
  //        }
  //      } catch (error) {
  //        return {
  //          productName: product.name,
  //          success: false,
  //          details: JSON.stringify(error.response.data, null, 4),
  //        }
  //      }
  //    })
  //  )
  // }

  try {
    // const createProductsResponse = await createProductDetails()

    return {
      status: 200,
      success: true,
      results: [],
      // results: createProductsResponse,
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
