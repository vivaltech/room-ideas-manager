import { defineMessages } from 'react-intl'

const prefixAdminSellers = 'admin/admin-import-seller-products.'
const prefixAdminSellersMain = `${prefixAdminSellers}main.`
const prefixProductTable = `${prefixAdminSellers}product-table.`
const prefixSkuTable = `${prefixAdminSellers}sku-table.`
const prefixImageTable = `${prefixAdminSellers}image-table.`
const prefixProductTableColumns = `${prefixProductTable}columns.`
const prefixSkuTableColumns = `${prefixSkuTable}columns.`
const prefixImageTableColumns = `${prefixImageTable}columns.`

const prefixProductImportResults = `${prefixAdminSellers}import-results.`

export const adminSellersMainMessages = defineMessages({
  title: { id: `${prefixAdminSellersMain}title` },
  importButton: { id: `${prefixAdminSellersMain}importButton` },
  dropFile: { id: `${prefixAdminSellersMain}dropFile` },
  chooseFile: { id: `${prefixAdminSellersMain}chooseFile` },
  errorIncompleteData: { id: `${prefixAdminSellersMain}errorIncompleteData` },
  errorOnAnalyze: { id: `${prefixAdminSellersMain}errorOnAnalyze` },
  errorOnProcessing: { id: `${prefixAdminSellersMain}errorOnProcessing` },
  errorOnImport: { id: `${prefixAdminSellersMain}errorOnImport` },
  tryAgainLater: { id: `${prefixAdminSellersMain}tryAgainLater` },
  product: { id: `${prefixAdminSellersMain}product` },
  withMissingFields: { id: `${prefixAdminSellersMain}withMissingFields` },
  downloadButton: { id: `${prefixAdminSellersMain}downloadButton` },
})

export const productTableColumnsMessages = defineMessages({
  idTitle: { id: `${prefixProductTableColumns}id.title` },
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
  transportModalTitle: {
    id: `${prefixProductTableColumns}transportModal.title`,
  },
  taxCodeTitle: { id: `${prefixProductTableColumns}taxCode.title` },
  descriptionTitle: { id: `${prefixProductTableColumns}description.title` },
})

export const skuTableColumnsMessages = defineMessages({
  idTitle: { id: `${prefixSkuTableColumns}id.title` },
  eanTitle: { id: `${prefixSkuTableColumns}ean.title` },
  manufacturerCodeTitle: {
    id: `${prefixSkuTableColumns}manufacturerCode.title`,
  },
  isActiveTitle: { id: `${prefixSkuTableColumns}isActive.title` },
  weightTitle: { id: `${prefixSkuTableColumns}weight.title` },
  dimensionsTitle: { id: `${prefixSkuTableColumns}dimensions.title` },
  widthTitle: { id: `${prefixSkuTableColumns}width.title` },
  heightTitle: { id: `${prefixSkuTableColumns}height.title` },
  lengthTitle: { id: `${prefixSkuTableColumns}length.title` },
  specsTitle: { id: `${prefixSkuTableColumns}specs.title` },
})

export const imageTableColumnsMessages = defineMessages({
  idTitle: { id: `${prefixImageTableColumns}id.title` },
  imageTitle: { id: `${prefixImageTableColumns}image.title` },
  urlTitle: { id: `${prefixImageTableColumns}url.title` },
  altTitle: { id: `${prefixImageTableColumns}alt.title` },
})

export const productTableMessages = defineMessages({
  emptyText: { id: `${prefixProductTable}emptyText` },
  of: { id: `${prefixProductTable}of` },
  showRows: { id: `${prefixProductTable}showRows` },
})

export const importResultsMessages = defineMessages({
  title: { id: `${prefixProductImportResults}title` },
  product: { id: `${prefixProductImportResults}product` },
  success: { id: `${prefixProductImportResults}success` },
  descriptionUpdated: { id: `${prefixProductImportResults}descriptionUpdated` },
  yes: { id: `${prefixProductImportResults}yes` },
  no: { id: `${prefixProductImportResults}no` },
  errors: { id: `${prefixProductImportResults}errors` },
  conflictWithImage1: { id: `${prefixProductImportResults}conflictWithImage1` },
  conflictWithImage2: { id: `${prefixProductImportResults}conflictWithImage2` },
  openImageError1: { id: `${prefixProductImportResults}openImageError1` },
  openImageError2: { id: `${prefixProductImportResults}openImageError2` },
})
