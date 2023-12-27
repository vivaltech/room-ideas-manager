/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class ImagesClient extends ExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async open(url: string): Promise<Buffer> {
    const urlHttp = url.replace(/^https:/, 'http:')

    return this.http.get(urlHttp, {
      headers: { Accept: 'image/*' },
      responseType: 'arraybuffer',
    })
  }
}
