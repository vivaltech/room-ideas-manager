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
  images: Array<{
    id: string | number
    url: string
    alt?: string
  }>
  skus: Array<{
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
  }>
  transportModal?: string | number
  taxCode?: string | number
}
