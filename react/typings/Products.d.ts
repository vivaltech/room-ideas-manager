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
  productImages_id_1
  productImages_url_1
  productImages_alt_1
  productImages_id_2
  productImages_url_2
  productImages_alt_2
  productImages_id_3
  productImages_url_3
  productImages_alt_3
  productImages_id_4
  productImages_url_4
  productImages_alt_4
  productImages_id_5
  productImages_url_5
  productImages_alt_5
  productImages_id_6
  productImages_url_6
  productImages_alt_6
  productImages_id_7
  productImages_url_7
  productImages_alt_7
  productImages_id_8
  productImages_url_8
  productImages_alt_8
  productImages_id_9
  productImages_url_9
  productImages_alt_9
  productImages_id_10
  productImages_url_10
  productImages_alt_10
  skuId?: string | number
  skuExternalId?: string | number
  skuEan?: string | number
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
  skuImages: string[]
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
