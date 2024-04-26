export interface CsvProductData {
  productId?: string | number
  productExternalId?: string | number
  productName: string
  brandId: string | number
  categoryIds: string | number | string[] | number[]
  productAttributes_name_1: string
  productAttributes_value_1: string
  productAttributes_name_2: string
  productAttributes_value_2: string
  productAttributes_name_3: string
  productAttributes_value_3: string
  productAttributes_name_4: string
  productAttributes_value_4: string
  productAttributes_name_5: string
  productAttributes_value_5: string
  productAttributes_name_6: string
  productAttributes_value_6: string
  productAttributes_name_7: string
  productAttributes_value_7: string
  productAttributes_name_8: string
  productAttributes_value_8: string
  productAttributes_name_9: string
  productAttributes_value_9: string
  productAttributes_name_10: string
  productAttributes_value_10: string
  skuId?: string | number
  skuExternalId?: string | number
  skuEan?: string | number
  skuImage_url_1: string
  skuImage_url_2: string
  skuImage_url_3: string
  skuImage_url_4: string
  skuImage_url_5: string
  skuImage_url_6: string
  skuImage_url_7: string
  skuImage_url_8: string
  skuImage_url_9: string
  skuImage_url_10: string
  skuWeight: number
  skuWidth: number
  skuHeight: number
  skuLength: number
  skuSpecs_name_1: string
  skuSpecs_value_1: string
  skuSpecs_name_2: string
  skuSpecs_value_2: string
  skuSpecs_name_3: string
  skuSpecs_value_3: string
  skuSpecs_name_4: string
  skuSpecs_value_4: string
  skuSpecs_name_5: string
  skuSpecs_value_5: string
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
