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
import {
  exampleCsvContentPT,
  exampleCsvContentEN,
} from './examples/exampleCsvContent'
import { documentationPDF } from './examples/documentationPDF'

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

  function normalizeProductName(productName: string) {
    return productName
      ?.normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '')
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^\w\s-]/g, '')
      ?.replace(/\s+/g, '-')
      ?.replace(/--+/g, '-')
  }

  function generateNewUniqueId(productName?: string) {
    if (!productName) {
      return (
        Date.now()?.toString() + Math.floor(Math.random() * 1000)?.toString()
      )
    }

    return normalizeProductName(productName)
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
            const parsedValue = value
              ?.replace(/"__parsed_extra": "[^"]*"/g, '')
              ?.trim()

            const headerLowerCase = header.toLowerCase()

            try {
              const productSpecsValueHeaders = [
                'productSpecs_values_1',
                'productSpecs_values_2',
                'productSpecs_values_3',
                'productSpecs_values_4',
                'productSpecs_values_5',
              ].map((h) => h.toLowerCase())

              const arrayHeaders = [
                'categoryIds',
                ...productSpecsValueHeaders,
              ].map((h) => h.toLowerCase())

              if (arrayHeaders.includes(headerLowerCase)) {
                const jsonValue = parsedValue
                  ?.replace(/'/g, '"')
                  ?.replace(/\\/g, '')

                let parsedJSONValue

                if (productSpecsValueHeaders.includes(headerLowerCase)) {
                  parsedJSONValue = jsonValue.slice(1, -1).split(';')
                } else {
                  parsedJSONValue = JSON.parse(jsonValue)
                }

                return parsedJSONValue
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
                } else if (row?.productName) {
                  productId = generateNewUniqueId(row?.productName)
                } else {
                  productId = generateNewUniqueId()
                }

                const existingProduct =
                  productId !== undefined
                    ? productMap.get(productId)
                    : undefined

                if (existingProduct) {
                  const existingImages = existingProduct.images
                  const imageQuantity = existingImages.length
                  const newProductImages = [
                    ...[
                      row?.skuImage_url_1,
                      row?.skuImage_url_2,
                      row?.skuImage_url_3,
                      row?.skuImage_url_4,
                      row?.skuImage_url_5,
                      row?.skuImage_url_6,
                      row?.skuImage_url_7,
                      row?.skuImage_url_8,
                      row?.skuImage_url_9,
                      row?.skuImage_url_10,
                    ]
                      ?.filter((s) => s)
                      ?.map((url, index) => {
                        return {
                          id: `${normalizeProductName(row?.productName)}_${
                            index + 1 + imageQuantity
                          }.png`?.replace(/[^\w\s.-]/g, ''),
                          url: url?.trim(),
                          alt: `${normalizeProductName(row?.productName)}_${
                            index + 1 + imageQuantity
                          }`,
                        }
                      }),
                  ].filter((i) => i?.id && i?.url)

                  existingProduct.images.push(...newProductImages)

                  // Add the SKU to the existing product
                  const sku: SkuData = {
                    id: row?.skuId,
                    name: `${existingProduct?.name} ${[
                      row?.skuSpecs_value_1,
                      row?.skuSpecs_value_2,
                      row?.skuSpecs_value_3,
                      row?.skuSpecs_value_4,
                      row?.skuSpecs_value_5,
                    ]
                      ?.filter((s) => s)
                      ?.join(' ')}`,
                    externalId: row?.skuExternalId,
                    ean: row?.skuEan,
                    isActive: true,
                    weight: row?.skuWeight,
                    dimensions: {
                      width: row?.skuWidth,
                      height: row?.skuHeight,
                      length: row?.skuLength,
                    },
                    specs: [
                      {
                        name: row?.skuSpecs_name_1,
                        value: row?.skuSpecs_value_1,
                      },
                      {
                        name: row?.skuSpecs_name_2,
                        value: row?.skuSpecs_value_2,
                      },
                      {
                        name: row?.skuSpecs_name_3,
                        value: row?.skuSpecs_value_3,
                      },
                      {
                        name: row?.skuSpecs_name_4,
                        value: row?.skuSpecs_value_4,
                      },
                      {
                        name: row?.skuSpecs_name_5,
                        value: row?.skuSpecs_value_5,
                      },
                    ].filter((s) => s?.name && s?.value),
                    images: newProductImages.map((image) => image.id),
                  }

                  existingProduct.skus.push(sku)
                } else {
                  const newProductImages = [
                    ...[
                      row?.skuImage_url_1,
                      row?.skuImage_url_2,
                      row?.skuImage_url_3,
                      row?.skuImage_url_4,
                      row?.skuImage_url_5,
                      row?.skuImage_url_6,
                      row?.skuImage_url_7,
                      row?.skuImage_url_8,
                      row?.skuImage_url_9,
                      row?.skuImage_url_10,
                    ]
                      ?.filter((s) => s)
                      ?.map((url, index) => {
                        return {
                          id: `${normalizeProductName(row?.productName)}_${
                            index + 1
                          }.png`?.replace(/[^\w\s.-]/g, ''),
                          url: url?.trim(),
                          alt: `${normalizeProductName(row?.productName)}_${
                            index + 1
                          }`,
                        }
                      }),
                  ].filter((i) => i?.id && i?.url)

                  // Create a new product with the SKU
                  const product: ProductData = {
                    id: row?.productId,
                    externalId: row?.productExternalId,
                    status: 'active',
                    name: row?.productName,
                    brandId: row?.brandId,
                    categoryIds: row?.categoryIds,
                    specs: [],
                    attributes: [
                      {
                        name: row?.productAttributes_name_1,
                        value: row?.productAttributes_value_1,
                      },
                      {
                        name: row?.productAttributes_name_2,
                        value: row?.productAttributes_value_2,
                      },
                      {
                        name: row?.productAttributes_name_3,
                        value: row?.productAttributes_value_3,
                      },
                      {
                        name: row?.productAttributes_name_4,
                        value: row?.productAttributes_value_4,
                      },
                      {
                        name: row?.productAttributes_name_5,
                        value: row?.productAttributes_value_5,
                      },
                      {
                        name: row?.productAttributes_name_6,
                        value: row?.productAttributes_value_6,
                      },
                      {
                        name: row?.productAttributes_name_7,
                        value: row?.productAttributes_value_7,
                      },
                      {
                        name: row?.productAttributes_name_8,
                        value: row?.productAttributes_value_8,
                      },
                      {
                        name: row?.productAttributes_name_9,
                        value: row?.productAttributes_value_9,
                      },
                      {
                        name: row?.productAttributes_name_10,
                        value: row?.productAttributes_value_10,
                      },
                    ].filter((a) => a?.name && a?.value),
                    slug: `/${normalizeProductName(row?.productName)?.slice(
                      0,
                      50
                    )}`,
                    images: newProductImages,
                    skus: [
                      {
                        id: row?.skuId,
                        name: `${row?.productName} ${[
                          row?.skuSpecs_value_1,
                          row?.skuSpecs_value_2,
                          row?.skuSpecs_value_3,
                          row?.skuSpecs_value_4,
                          row?.skuSpecs_value_5,
                        ]
                          ?.filter((s) => s)
                          ?.join(' ')}`,
                        externalId: row?.skuExternalId,
                        ean: row?.skuEan,
                        isActive: true,
                        weight: row?.skuWeight,
                        dimensions: {
                          width: row?.skuWidth,
                          height: row?.skuHeight,
                          length: row?.skuLength,
                        },
                        specs: [
                          {
                            name: row?.skuSpecs_name_1,
                            value: row?.skuSpecs_value_1,
                          },
                          {
                            name: row?.skuSpecs_name_2,
                            value: row?.skuSpecs_value_2,
                          },
                          {
                            name: row?.skuSpecs_name_3,
                            value: row?.skuSpecs_value_3,
                          },
                          {
                            name: row?.skuSpecs_name_4,
                            value: row?.skuSpecs_value_4,
                          },
                          {
                            name: row?.skuSpecs_name_5,
                            value: row?.skuSpecs_value_5,
                          },
                        ].filter((s) => s?.name && s?.value),
                        images: newProductImages.map((image) => image.id),
                      },
                    ],
                    description: row?.productDescription,
                  }

                  productMap.set(productId, product)
                }
              })

              productMap.forEach((product) => {
                const combinedSpecs: Array<{
                  name: string
                  values: string[]
                }> = []

                product?.skus?.forEach((sku) => {
                  sku?.specs?.forEach((spec) => {
                    const existingSpec = combinedSpecs?.find(
                      (s) => s?.name === spec?.name
                    )

                    if (existingSpec) {
                      existingSpec?.values?.push(spec?.value)
                    } else {
                      combinedSpecs.push({
                        name: spec?.name,
                        values: [spec?.value],
                      })
                    }
                  })
                })

                product.specs = combinedSpecs
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

              const missingDataRows = validRows.filter((row: ProductData) => {
                const missingFields = []

                if (!row?.status) {
                  missingFields.push('status')
                }

                if (!row?.name) {
                  missingFields.push('name')
                }

                if (!row?.brandId) {
                  missingFields.push('brandId')
                }

                // if (!row?.specs?.length) {
                //  missingFields.push('specs')
                // }

                if (!row?.attributes?.length) {
                  missingFields.push('attributes')
                }

                if (!row?.images?.length) {
                  missingFields.push('images')
                }

                if (!row?.skus?.length) {
                  missingFields.push('skus')
                }

                if (missingFields.length > 0) {
                  return true
                }

                return false
              })

              if (missingDataRows.length > 0) {
                const errorMessage = intl.formatMessage(
                  adminSellersMainMessages.errorIncompleteData
                )

                const productMessage = intl.formatMessage(
                  adminSellersMainMessages.product
                )

                const withMissingFieldsMessage = intl.formatMessage(
                  adminSellersMainMessages.withMissingFields
                )

                const formattedMessage = `${errorMessage}\n${missingDataRows
                  .map((row) => {
                    const missingFieldsInRow: string[] = []

                    Object.keys(row).forEach((field) => {
                      if (!row[field as keyof Required<ProductData>]) {
                        missingFieldsInRow.push(field)
                      }
                    })

                    return `${productMessage} ${`${
                      row.id ?? row.externalId
                    } - ${
                      row.name
                    }`} ${withMissingFieldsMessage} (${missingFieldsInRow.join(
                      ', '
                    )}).`
                  })
                  .join('\n')}`

                setErrorProcessingCsv(formattedMessage)
              } else {
                setProductData(validRows)
                setShowTable(true)
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

  const handleDownloadExampleClick = useCallback(() => {
    const link = document.createElement('a')

    const lang = intl?.locale?.substring(0, 2)?.toLowerCase()

    const exampleCsvContent =
      lang === 'pt' ? exampleCsvContentPT : exampleCsvContentEN

    const blob = new Blob([exampleCsvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'importSellerProductsExample.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [intl?.locale])

  const handleDownloadDocumentationPDFClick = useCallback(() => {
    const linkSource = `data:application/pdf;base64,${documentationPDF}`
    const downloadLink = document.createElement('a')
    const fileNameWithExtension = `MEDIS-Import Seller Products.pdf`

    downloadLink.href = linkSource
    downloadLink.download = fileNameWithExtension
    downloadLink.click()
  }, [])

  useEffect(() => {
    if (!errorProcessingCsv) {
      return
    }

    setProductData([])
  }, [errorProcessingCsv])

  useEffect(() => {
    if (errorImportSellerProducts) {
      setImportError(intl.formatMessage(adminSellersMainMessages.tryAgainLater))
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
    setErrorProcessingCsv(null)
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
            className={`flex mt2 mb2
            ${
              productData && productData.length > 0
                ? ' flex-row justify-between'
                : ' flex-column justify-center items-center'
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

            {productData && productData.length > 0 ? (
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
            ) : (
              <div className="mt4 mb4 flex flex-column">
                <div className="">
                  <Button
                    variation="secondary"
                    onClick={handleDownloadExampleClick}
                  >
                    {intl.formatMessage(
                      adminSellersMainMessages.downloadButton
                    )}
                  </Button>
                </div>
                <div className="mt3 flex flex-column">
                  <Button
                    variation="secondary"
                    onClick={handleDownloadDocumentationPDFClick}
                  >
                    {intl.formatMessage(
                      adminSellersMainMessages.downloadPDFButton
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {errorProcessingCsv && (
            <div
              id="errorProcessingCsv"
              style={{ whiteSpace: 'pre-line', color: 'red' }}
            >
              {errorProcessingCsv}
            </div>
          )}

          {showTable && <ProductsTable products={productData} />}

          {importError && !importLoading && (
            <div
              id="importError"
              style={{
                marginTop: '0.75rem',
                whiteSpace: 'pre-line',
                color: 'red',
              }}
            >
              {importError}
            </div>
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
