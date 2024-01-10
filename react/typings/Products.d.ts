export interface CsvProductData {
  productId?: string | number
  productExternalId?: string | number
  productStatus: string
  productName: string
  brandId: string | number
  categoryIds: string | number | string[] | number[]
  productSpecs: Array<{
    name: string
    values: string[]
  }>
  productAttributes: Array<{
    name: string
    value: string
  }>
  productSlug: string
  productImages: ImageData[]
  skuId?: string | number
  skuName: string
  skuExternalId?: string | number
  skuEan?: string | number
  skuManufacturerCode?: string | number
  skuIsActive: boolean
  skuWeight: number
  skuDimensions: { width: number; height: number; length: number }
  skuSpecs: Array<{
    name: string
    value: string
  }>
  skuImages: string[]
  productTransportModal?: string | number
  productTaxCode?: string | number
  productDescription?: string
}

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
  index?: number
  id: string | number
  url: string
  alt?: string
}
