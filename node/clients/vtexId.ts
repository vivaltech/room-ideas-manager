import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

interface VtexIdLoginResponse {
  token: string
}

export class VtexIdClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        'x-vtex-user-agent': context.userAgent,
      },
    })
  }

  public getToken(
    appkey: string,
    apptoken: string
  ): Promise<VtexIdLoginResponse> {
    return this.http.post(
      `/api/vtexid/apptoken/login`,
      {
        appkey,
        apptoken,
      },
      {
        metric: 'vtexid-login',
      }
    )
  }
}
