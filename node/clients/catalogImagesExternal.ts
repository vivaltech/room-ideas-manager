import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import type FormData from 'form-data'

export class CatalogImagesExternalClient extends ExternalClient {
  constructor(protected context: IOContext, options?: InstanceOptions) {
    super(`http://app.io.vtex.com`, context, {
      ...options,
    })
  }

  public save(
    fileName: string,
    token: string,
    formData: FormData
  ): Promise<{ id: string; slug: string; fullUrl: string }> {
    return this.http.post(
      `/vtex.catalog-images/v0/${this.context.account}/master/images/save/${fileName}`,
      formData,
      {
        headers: {
          VtexIdclientAutCookie: token,
          ...formData.getHeaders(),
        },
      }
    )
  }
}
