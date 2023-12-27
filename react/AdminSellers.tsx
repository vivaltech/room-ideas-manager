import type { ChangeEvent } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { Layout, PageBlock, PageHeader, Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { useMutation } from 'react-apollo'
import type { ParseResult } from 'papaparse'
import Papa from 'papaparse'

import importSellerProductsGQL from './graphql/mutations/importSellerProducts.gql'
import { adminSellersMainMessages } from './utils/adminSellersMessages'
import type { ProductData } from './typings/Products'
import ProductsTable from './components/ProductTable'
import ImportResults from './components/ImportResults'

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

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file) {
        return
      }

      const reader = new FileReader()

      reader.onload = async (e) => {
        const csvFile = e.target?.result as string

        setProductData([])
        setErrorProcessingCsv(null)

        Papa.parse<ProductData>(csvFile, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (header: string) => header.trim(),
          transform: (value: string, header: string) => {
            try {
              const arrayHeaders = [
                'categoryIds',
                'specs',
                'attributes',
                'images',
                'skus',
              ]

              if (arrayHeaders.includes(header.toLowerCase())) {
                const jsonValue = value.replace(/'/g, '"').replace(/\\/g, '')

                return JSON.parse(jsonValue)
              }
            } catch (error) {
              const message = (error as Error)?.message

              console.error(`Error al parsear JSON en ${header}: ${message}`)

              return value
            }

            return value
          },
          complete: (result: ParseResult<ProductData>) => {
            if (result.data && Array.isArray(result.data)) {
              const missingDataRows = result?.data?.filter((row) => {
                // TODO: Add validations
                return (
                  !row.status || !row.name || !row.brandId
                  //! row.categoryIds?.length ||
                  //! row.specs?.length ||
                  //! row.attributes?.length ||
                  //! row.slug ||
                  //! row.images?.length ||
                  //! row.skus?.length ||
                )
              })

              if (missingDataRows?.length > 0) {
                setErrorProcessingCsv(
                  'Error: Algunas filas tienen datos incompletos.'
                )
              } else {
                setProductData(result?.data)
                setErrorProcessingCsv(null)
              }
            } else {
              setErrorProcessingCsv(
                'No se pudo analizar el archivo CSV correctamente.'
              )
            }
          },
          error: (err: { message: string }) => {
            setErrorProcessingCsv(
              `Error al analizar el archivo CSV: ${err.message}`
            )
          },
        })
      }

      reader.readAsText(file)
    },
    []
  )

  const handleImportClick = useCallback(async () => {
    try {
      console.info({ productData })

      setImportLoading(true)
      setImportError('')
      setImportResults([])

      await importSellerProductsMutation({
        variables: {
          productList: productData,
        },
      })
    } catch (e) {
      setImportError(JSON.stringify(`Error during import of products: ${e}`))
    }
  }, [importSellerProductsMutation, productData])

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
          <input type="file" onChange={handleFileChange} />
          {errorProcessingCsv && (
            <p style={{ color: 'red' }}>{errorProcessingCsv}</p>
          )}

          {showTable && <ProductsTable products={productData} />}

          {productData && productData.length > 0 && (
            <div className="mt2 mb2 w5">
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
            </div>
          )}

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
