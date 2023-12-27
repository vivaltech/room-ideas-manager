/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOClients } from '@vtex/api'

import { CatalogSellerPortalClient } from './catalogSellerPortal'
import { VtexIdClient } from './vtexId'
import { ImagesClient } from './images'
import { CatalogImagesClient } from './catalogImages'
import { CatalogImagesExternalClient } from './catalogImagesExternal'

export class Clients extends IOClients {
  public get catalogSellerPortal() {
    return this.getOrSet('catalogSellerPortal', CatalogSellerPortalClient)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexIdClient)
  }

  public get images() {
    return this.getOrSet('images', ImagesClient)
  }

  public get catalogImages() {
    return this.getOrSet('catalogImages', CatalogImagesClient)
  }

  public get catalogImagesExternal() {
    return this.getOrSet('catalogImagesExternal', CatalogImagesExternalClient)
  }
}
