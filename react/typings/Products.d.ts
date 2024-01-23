export interface CsvProductData {
  productId?: string | number
  productExternalId?: string | number
  productStatus: string
  productName: string
  brandId: string | number
  categoryIds: string | number | string[] | number[]
  //productSpecs: Array<{
  //  name: string
  //  values: string[]
  //}>

  productSpecs_name_1: string
  productSpecs_values_1: string[]
  productSpecs_name_2: string
  productSpecs_values_2: string[]
  //productAttributes: Array<{
  //  name: string
  //  value: string
  //}>
  productAttributes_name_1: string
  productAttributes_value_1: string
  productAttributes_name_2: string
  productAttributes_value_2: string
  productAttributes_name_3: string
  productAttributes_value_3: string
  productSlug: string
  //productImages: ImageData[]
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
  skuName: string
  skuExternalId?: string | number
  skuEan?: string | number
  skuManufacturerCode?: string | number
  skuIsActive: boolean
  skuWeight: number
  //skuDimensions: { width: number; height: number; length: number }
  skuWidth: number
  skuHeight: number
  skuLength: number
  //skuSpecs: Array<{
  //  name: string
  //  value: string
  //}>
  skuSpecs_name_1: string
  skuSpecs_value_1: string
  skuSpecs_name_2: string
  skuSpecs_value_2: string
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
