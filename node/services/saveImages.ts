/* eslint-disable @typescript-eslint/no-explicit-any */

import FormData from 'form-data'
import { UserInputError } from '@vtex/api'

interface SaveImagesResponse {
  results: Array<{
    fileName?: string
    success?: boolean
    details?: {
      id?: string | number
      slug?: string
      fullUrl?: string
      error?: any
    }
  }>
}

export async function saveImages(
  ctx: Context,
  images: Images[]
): Promise<SaveImagesResponse> {
  const {
    clients: { vtexId, images: imagesClient, catalogImagesExternal },
  } = ctx

  try {
    const { appKey, appToken } = ctx.state

    if (!appKey) {
      throw new UserInputError('Without appKey')
    }

    if (!appToken) {
      throw new UserInputError('Without appToken')
    }

    const { token } = await vtexId.getToken(appKey, appToken)

    const uploadImageDetails = async () => {
      return Promise.all(
        images.map(async (image) => {
          try {
            const imageBuffer = await imagesClient.open(image?.url)

            const formData = new FormData()

            formData.append('image', imageBuffer, {
              filename: image.fileName,
            })

            const result = await catalogImagesExternal.save(
              image.fileName,
              token,
              formData
            )

            return {
              fileName: image.fileName,
              success: true,
              details: { ...result },
            }
          } catch (error) {
            return {
              fileName: image.fileName,
              success: false,
              details: {
                error: error?.response?.data || error?.response || error?.data,
              },
            }
          }
        })
      )
    }

    const uploadResults = await uploadImageDetails()

    return {
      results: uploadResults,
    }
  } catch (error) {
    return {
      results: [
        {
          details: {
            error:
              error ??
              'There was an issue processing your request. Please try again later.',
          },
        },
      ],
    }
  }
}
