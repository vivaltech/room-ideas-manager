import React, { useCallback, useEffect, useState } from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Button,
  Dropzone,
} from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useMutation } from 'react-apollo'
import type { ParseResult } from 'papaparse'
import Papa from 'papaparse'

import importSellerProductsGQL from './graphql/mutations/importSellerProducts.gql'
import { adminSellersMainMessages } from './utils/adminSellersMessages'
import type { CsvProductData, ProductData, SkuData } from './typings/Products'
import ProductsTable from './components/Tables/ProductsTable'
import ImportResults from './components/ImportResults'
import styles from './styles/AdminSellers.module.css'

const AdminSellers: React.FC = () => {
  const intl = useIntl()
  const [productData, setProductData] = useState<ProductData[]>([])
  const [errorProcessingCsv, setErrorProcessingCsv] = useState<string | null>(
    null
  )

  const [showTable, setShowTable] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState('')
  const [importResults, setImportResults] = useState<ResultData[]>([])
  const [
    importSellerProductsMutation,
    {
      loading: loadingImportSellerProducts,
      error: errorImportSellerProducts,
      data: dataImportSellerProducts,
    },
  ] = useMutation(importSellerProductsGQL)

  const handleResetUpload = () => {
    setProductData([])
    setErrorProcessingCsv(null)
    setImportLoading(false)
    setImportError('')
    setImportResults([])
    setShowTable(false)
  }

  function generateNewUniqueId() {
    return Date.now()?.toString() + Math.floor(Math.random() * 1000)?.toString()
  }

  const handleFileUpload = useCallback((acceptedFiles) => {
    try {
      // eslint-disable-next-line prefer-destructuring
      const file = acceptedFiles[0]

      if (!file) {
        return
      }

      const reader = new FileReader()

      reader.onload = async (e) => {
        const csvFile = e.target?.result as string

        handleResetUpload()

        Papa.parse<ProductData>(csvFile, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (header: string) => header.trim(),
          transform: (value: string, header: string) => {
            const parsedValue = value?.replace(/"__parsed_extra": "[^"]*"/g, '')

            try {
              const arrayHeaders = [
                'categoryIds',
                'productSpecs',
                'productAttributes',
                'productImages',
                'skuSpecs',
                'skuImages',
                'skuDimensions',
              ].map((h) => h.toLowerCase())

              if (arrayHeaders.includes(header.toLowerCase())) {
                const jsonValue = parsedValue
                  .replace(/'/g, '"')
                  .replace(/\\/g, '')

                return JSON.parse(jsonValue)
              }
            } catch (error) {
              const message = (error as Error)?.message

              setErrorProcessingCsv(
                `${intl.formatMessage(
                  adminSellersMainMessages.errorOnProcessing
                )} - ${header}: ${message}`
              )

              return parsedValue
            }

            return parsedValue
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          complete: (result: ParseResult<any>) => {
            const rows: CsvProductData[] = result.data

            if (rows && Array.isArray(rows)) {
              const productMap: Map<string, ProductData> = new Map()

              rows.forEach((row) => {
                let productId

                if (row?.productId) {
                  productId = row?.productId?.toString()
                } else if (row?.productExternalId) {
                  productId = row?.productExternalId?.toString()
                } else {
                  productId = generateNewUniqueId()
                }

                const existingProduct =
                  productId !== undefined
                    ? productMap.get(productId)
                    : undefined

                if (existingProduct) {
                  // Add the SKU to the existing product
                  const sku: SkuData = {
                    id: row.skuId,
                    name: row.skuName,
                    externalId: row.skuExternalId,
                    ean: row.skuEan,
                    manufacturerCode: row.skuManufacturerCode,
                    isActive: row.skuIsActive,
                    weight: row.skuWeight,
                    dimensions: row.skuDimensions,
                    specs: row.skuSpecs,
                    images: row.skuImages,
                  }

                  existingProduct.skus.push(sku)
                } else {
                  // Create a new product with the SKU
                  const product: ProductData = {
                    externalId: row.productExternalId,
                    status: row.productStatus,
                    name: row.productName,
                    brandId: row.brandId,
                    categoryIds: row.categoryIds,
                    specs: row.productSpecs,
                    attributes: row.productAttributes,
                    slug: row.productSlug,
                    images: row.productImages,
                    skus: [
                      {
                        id: row.skuId,
                        name: row.skuName,
                        externalId: row.skuExternalId,
                        ean: row.skuEan,
                        manufacturerCode: row.skuManufacturerCode,
                        isActive: row.skuIsActive,
                        weight: row.skuWeight,
                        dimensions: row.skuDimensions,
                        specs: row.skuSpecs,
                        images: row.skuImages,
                      },
                    ],
                    transportModal: row.productTransportModal,
                    taxCode: row.productTaxCode,
                    description: row.productDescription,
                  }

                  productMap.set(productId, product)
                }
              })

              const validRows: ProductData[] = Array.from(
                productMap.values()
              ).map((p) => {
                if ('__parsed_extra' in p) {
                  // eslint-disable-next-line dot-notation
                  delete p['__parsed_extra']
                }

                return p
              })

              const missingDataRows = validRows.filter((_row) => {
                // TODO: Add validations
                return (
                  //  !row.status ||
                  //  !row.name ||
                  //  !row.brandId ||
                  //  !row.categoryIds?.length ||
                  //  !row.specs?.length ||
                  //  !row.attributes?.length ||
                  //  !row.slug ||
                  //  !row.images?.length ||
                  //  !row.skus?.length
                  false
                )
              })

              if (missingDataRows.length > 0) {
                setErrorProcessingCsv(
                  intl.formatMessage(
                    adminSellersMainMessages.errorIncompleteData
                  )
                )
              } else {
                setProductData(validRows)
                setErrorProcessingCsv(null)
              }
            } else {
              setErrorProcessingCsv(
                intl.formatMessage(adminSellersMainMessages.errorOnAnalyze)
              )
            }
          },
          error: () => {
            setErrorProcessingCsv(
              intl.formatMessage(adminSellersMainMessages.errorOnProcessing)
            )
          },
        })
      }

      reader.readAsText(file)
    } catch (_error) {
      setErrorProcessingCsv(
        intl.formatMessage(adminSellersMainMessages.errorOnProcessing)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImportClick = useCallback(async () => {
    try {
      setImportLoading(true)
      setImportError('')
      setImportResults([])

      await importSellerProductsMutation({
        variables: {
          productList: productData,
        },
      })
    } catch (e) {
      setImportError(
        JSON.stringify(
          `${intl.formatMessage(adminSellersMainMessages.errorOnImport)} ${e}`
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData])

  useEffect(() => {
    if (!errorProcessingCsv) {
      return
    }

    setProductData([])
  }, [errorProcessingCsv])

  useEffect(() => {
    if (errorImportSellerProducts) {
      setImportError(JSON.stringify(errorImportSellerProducts))
      setImportLoading(false)
    }

    if (
      loadingImportSellerProducts ||
      errorImportSellerProducts ||
      !dataImportSellerProducts
    ) {
      return
    }

    const resultsAux = dataImportSellerProducts?.importSellerProducts?.results

    setImportLoading(false)
    setImportError('')
    setImportResults(resultsAux)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingImportSellerProducts,
    errorImportSellerProducts,
    dataImportSellerProducts,
  ])

  useEffect(() => {
    if (!productData || productData.length === 0) {
      setShowTable(false)

      return
    }

    setShowTable(true)
  }, [productData])

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={intl.formatMessage(adminSellersMainMessages.title)}
        />
      }
    >
      <PageBlock variation="full">
        <div className="flex flex-column">
          <div
            className={`flex flex-row mt2 mb2 ${
              productData && productData.length > 0
                ? 'justify-between'
                : 'justify-center'
            }`}
          >
            <div
              className={`${
                productData && productData.length > 0 ? styles.dropzone : ''
              } ${importLoading ? styles.disableResetButton : ''}`}
            >
              <Dropzone
                accept=".csv"
                // minSize={2000}
                // maxSize={10000}
                onDropAccepted={handleFileUpload}
                onFileReset={() => {
                  if (importLoading) {
                    return
                  }

                  handleResetUpload()
                }}
              >
                <div className="pt7">
                  <div>
                    <span className="f4">
                      {intl.formatMessage(adminSellersMainMessages.dropFile)}{' '}
                    </span>
                    <span className="f4 c-link" style={{ cursor: 'pointer' }}>
                      {intl.formatMessage(adminSellersMainMessages.chooseFile)}
                    </span>
                    {/* <p className="f6 c-muted-2 tc">Maximum file size of 10 KB.</p> */}
                  </div>
                </div>
              </Dropzone>
            </div>

            {productData && productData.length > 0 && (
              <Button
                variation="primary"
                onClick={handleImportClick}
                disabled={
                  !productData ||
                  productData.length === 0 ||
                  loadingImportSellerProducts
                }
                isLoading={importLoading}
              >
                {intl.formatMessage(adminSellersMainMessages.importButton)}
              </Button>
            )}
          </div>

          {errorProcessingCsv && (
            <p style={{ color: 'red' }}>{errorProcessingCsv}</p>
          )}

          {showTable && <ProductsTable products={productData} />}

          {importError && !importLoading && (
            <div className="flex justify-center">{importError}</div>
          )}

          {!importLoading && importResults?.length > 0 && (
            <ImportResults importResults={importResults} />
          )}
        </div>
      </PageBlock>
    </Layout>
  )
}

export default AdminSellers
