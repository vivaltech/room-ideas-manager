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

export type RoomScene = {
  id?: string
  ID?: string
  image?: string
  collectionId?: string
  roomId?: string
  order?: string
  url?: string
  alt?: string
}

export async function getRoomScenes(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterdata },
    vtex: {
      route: {
        params
      }
    }
  } = ctx

  try {
    const { roomId } = params

    const variables: Variables = {
      dataEntity: 'RS',
      fields: [
        'id',
        'ID',
        'image',
        'collectionId',
        'roomId',
        'order',
        'url',
        'alt'
      ],
      where: `roomId=${roomId}`,
      pagination: {
        page: 1,
        pageSize: 20,
      },
    }

    const masterDataRoomScenes: RoomScene[] = await masterdata.searchDocuments(variables)

    const sortedSceneData = masterDataRoomScenes.sort((a, b) => {
      const orderA = parseInt(a.order ?? '0');
      const orderB = parseInt(b.order ?? '0');
      return orderA - orderB;
    });

    ctx.status = 200
    ctx.body = sortedSceneData

    await next()
  } catch (error) {
    ctx.status = error?.status
    ctx.body = {
      success: false,
      error: error?.message,
    }
  }
}
