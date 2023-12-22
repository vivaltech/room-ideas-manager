/* eslint-disable @typescript-eslint/no-explicit-any */

interface CreateProductsResponse {
  status: number
  success: boolean
  results: Array<{ success: boolean; result?: any; error?: string }>
  error?: string
}

export async function createProducts(
  ctx: Context,
  productList: Product[]
): Promise<CreateProductsResponse> {
  const {
    clients: { catalogSellerPortal },
  } = ctx

  // console.info(JSON.stringify(productList, null, 4))

  const createProductDetails = async () => {
    return Promise.all(
      (productList || []).map(async (product) => {
        try {
          const result = await catalogSellerPortal.createProduct(product)

          return { success: true, result }
        } catch (error) {
          console.log({ error: error.response })
          console.log({ error: error.response.data })

          console.info(JSON.stringify(error.response.data, null, 4))

          return {
            success: false,
            error: error.message || 'Unknown error',
          }
        }
      })
    )
  }

  try {
    const createProductsResponse = await createProductDetails()

    // console.info(JSON.stringify(createProductsResponse, null, 4))

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
      error: error?.message
        ? error?.message
        : 'There was an issue processing your request. Please try again later.',
    }
  }
}
