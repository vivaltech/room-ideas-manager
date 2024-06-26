/* eslint-disable prefer-destructuring */
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
        images?.map(async (image) => {
          const cleanedFileName = image?.fileName?.replace(/[^\w\s.-]/g, '')

          try {
            const imageBuffer = await imagesClient.open(image?.url)

            const formData = new FormData()

            formData.append('image', imageBuffer, {
              filename: cleanedFileName,
            })

            const result = await catalogImagesExternal.save(
              cleanedFileName,
              token,
              formData
            )

            return {
              fileName: cleanedFileName,
              success: true,
              details: { ...result },
            }
          } catch (error) {
            const status = error?.response?.status

            if (status === 409 || status === '409') {
              const message = error?.response?.data?.message

              const regex = /https:\/\/[^\s']+/
              const match = message?.match(regex)

              if (match && match.length > 0) {
                const imageUrl = match[0]

                return {
                  fileName: cleanedFileName,
                  success: true,
                  details: {
                    id: cleanedFileName,
                    slug: imageUrl,
                    fullUrl: imageUrl,
                  },
                }
              }

              return {
                fileName: image?.fileName,
                success: false,
                details: {
                  error: { message: 'Another Conflict', status },
                },
              }
            }

            return {
              fileName: image?.fileName,
              success: false,
              details: {
                error:
                  status === 403
                    ? {
                        status,
                        message:
                          'Failed to open the image. Please choose another source for images.',
                        file: image?.url,
                      }
                    : error?.response?.data
                    ? {
                        ...error?.response?.data,
                        status,
                      }
                    : { message: 'Another Conflict', status },
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
