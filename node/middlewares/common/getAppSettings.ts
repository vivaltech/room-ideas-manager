/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  const { apps } = ctx.clients

  const appId = process.env.VTEX_APP_ID ? process.env.VTEX_APP_ID : ''

  const { vtexApi } = await apps.getAppSettings(appId)
  const {
    appKey,
    appToken,
  }: {
    appKey: string
    appToken: string
  } = vtexApi

  ctx.state.appKey = appKey
  ctx.state.appToken = appToken

  await next()
}
