/* eslint-disable @typescript-eslint/no-explicit-any */
import { addOriginOfProducts } from '../../services/addOriginOfProducts'
import { addProductImages } from '../../services/addProductImages'
import { createProducts } from '../../services/createProducts'
import GraphQLError from '../../utils/GraphqlError'

export const mutations = {
  importSellerProducts: async (
    _: unknown,
    { productList }: { productList: Product[] },
    ctx: Context
  ) => {
    try {
      const productWithOrigin = addOriginOfProducts(ctx, productList)

      if (!productWithOrigin || productWithOrigin.length === 0) {
        throw new Error('Without productWithOrigin')
      }

      const productWithImageImported = await addProductImages(
        ctx,
        productWithOrigin
      )

      const createProductsResponse = await createProducts(
        ctx,
        productWithImageImported
      )

      if (
        createProductsResponse?.status === 500 ||
        !createProductsResponse?.success ||
        createProductsResponse?.error
      ) {
        throw new Error(createProductsResponse?.error)
      }

      return createProductsResponse
    } catch (error) {
      throw new GraphQLError('importSellerProducts error', { detail: error })
    }
  },
}
