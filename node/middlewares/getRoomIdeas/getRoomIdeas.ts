/* eslint-disable @typescript-eslint/no-explicit-any */

export type Variables = {
  dataEntity: string
  fields: string[]
  where?: string
  pagination: {
    page: number
    pageSize: number
  }
}

export type RoomIdea = {
  id?: string
  ID?: string
  name?: string
  alt?: string
  image?: string
  order?: string
  url?: string
}

export async function getRoomIdeas(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata },
  } = ctx

  try {
    const variables: Variables = {
      dataEntity: 'RI',
      fields: [
        'id',
        'ID',
        'name',
        'alt',
        'image',
        'order',
        'url'
      ],
      pagination: {
        page: 1,
        pageSize: 20,
      },
    }

    const masterDataRoomIdeas: RoomIdea[] = await masterdata.searchDocuments(variables)

    ctx.status = 200
    ctx.body = masterDataRoomIdeas

    await next()
  } catch (error) {
    console.error('Error fetching Room Ideas:', error)
    if (error.response && error.response.status === 403) {
      ctx.status = 403
      ctx.body = {
        success: false,
        message: error.message
      }
    } else {
      ctx.status = error.response?.status || 500
      ctx.body = {
        success: false,
        message: 'Error fetching Room Ideas',
        error: error.message,
      }
    }
  }
}
