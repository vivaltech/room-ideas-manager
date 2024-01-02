export interface ProductData {
  id?: string | number
  externalId?: string | number
  status: string
  name: string
  brandId: string | number
  categoryIds: string | number | string[] | number[]
  specs: Array<{
    name: string
    values: string[]
  }>
  attributes: Array<{
    name: string
    value: string
  }>
  slug: string
  images: ImageData[]
  skus: SkuData[]
  transportModal?: string | number
  taxCode?: string | number
  description?: string
}

export interface SkuData {
  id?: string | number
  name: string
  externalId?: string | number
  ean?: string | number
  manufacturerCode?: string | number
  isActive: boolean
  weight: number
  dimensions: {
    width: number
    height: number
    length: number
  }
  specs: Array<{
    name: string
    value: string
  }>
  images: string[]
}

export interface ImageData {
  id: string | number
  url: string
  alt?: string
}
