/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOClients } from '@vtex/api'

import { CatalogSellerPortalClient } from './catalogSellerPortal'

export class Clients extends IOClients {
  public get catalogSellerPortal() {
    return this.getOrSet('catalogSellerPortal', CatalogSellerPortalClient)
  }
}
