/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveImages } from './saveImages'

export async function addProductImages(
  ctx: Context,
  products: ProductWithOrigin[]
): Promise<ProductWithImageImported[]> {
  try {
    const productImages: Images[] = ([] as Images[]).concat(
      ...products.map(
        (p) =>
          p.images.map((image) => ({
            fileName: image.id,
            url: image.url,
          })) as Images[]
      )
    )

    const externalImages = productImages.filter(
      (i) =>
        i?.fileName &&
        i?.url &&
        !i?.url?.trim()?.startsWith(`https://${ctx.vtex.account}`)
    )

    if (externalImages.length > 0) {
      const { results: saveImagesResults } = await saveImages(
        ctx,
        externalImages
      )

      const productsWithImages = products.map((prod: ProductWithOrigin) => {
        const product: ProductWithOrigin = {
          ...prod,
          images: prod?.images?.map((i) => {
            const saveImageResult = saveImagesResults?.find(
              (r) => r?.fileName === i?.id
            )

            const success = saveImageResult?.success

            if (saveImageResult) {
              if (!success) {
                return {
                  id: i?.id,
                  url: i?.url,
                  alt: i?.alt ?? (i?.id as string),
                  error: { imageId: i?.id, ...saveImageResult.details?.error },
                }
              }

              return {
                id: i?.id,
                url: saveImageResult?.details?.fullUrl ?? i?.url,
                alt: i?.alt ?? (i?.id as string),
              }
            }

            return i
          }),
        }

        return product
      })

      return productsWithImages
    }

    return products
  } catch (error) {
    return []
  }
}
