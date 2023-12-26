import { defineMessages } from 'react-intl'

const prefixAdminSellers = 'admin/admin-import-seller-products.'
const prefixAdminSellersMain = `${prefixAdminSellers}main.`
const prefixProductTable = `${prefixAdminSellers}product-table.`
const prefixProductTableColumns = `${prefixProductTable}columns.`

export const adminSellersMainMessages = defineMessages({
  title: { id: `${prefixAdminSellersMain}title` },
})

export const productTableColumnsMessages = defineMessages({
  externalIdTitle: { id: `${prefixProductTableColumns}externalId.title` },
  statusTitle: { id: `${prefixProductTableColumns}status.title` },
  nameTitle: { id: `${prefixProductTableColumns}name.title` },
  brandIdTitle: { id: `${prefixProductTableColumns}brandId.title` },
  categoryIdsTitle: { id: `${prefixProductTableColumns}categoryIds.title` },
  specsTitle: { id: `${prefixProductTableColumns}specs.title` },
  attributesTitle: { id: `${prefixProductTableColumns}attributes.title` },
  slugTitle: { id: `${prefixProductTableColumns}slug.title` },
  imagesTitle: { id: `${prefixProductTableColumns}images.title` },
  skusTitle: { id: `${prefixProductTableColumns}skus.title` },
  originTitle: { id: `${prefixProductTableColumns}origin.title` },
  transportModalTitle: {
    id: `${prefixProductTableColumns}transportModal.title`,
  },
  taxCodeTitle: { id: `${prefixProductTableColumns}taxCode.title` },
})

export const productTableMessages = defineMessages({
  emptyText: { id: `${prefixProductTable}emptyText` },
  of: { id: `${prefixProductTable}of` },
  showRows: { id: `${prefixProductTable}showRows` },
})
