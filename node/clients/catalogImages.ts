import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'
import type FormData from 'form-data'

export class CatalogImagesClient extends AppClient {
  constructor(ioContext: IOContext, options?: InstanceOptions) {
    super(
      'vtex.catalog-images@0.x',
      { ...ioContext, account: ioContext?.account, workspace: 'master' },
      { ...options }
    )
  }

  // Didn't work, Forbidden error
  public save(
    fileName: string,
    token: string,
    formData: FormData
  ): Promise<{ id: string; slug: string; fullUrl: string }> {
    return this.http.post(`/images/save/${fileName}`, formData, {
      headers: {
        VtexIdclientAutCookie: token,
      },
    })
  }
}
