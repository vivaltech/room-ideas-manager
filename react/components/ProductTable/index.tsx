import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  EXPERIMENTAL_Table as Table,
  EXPERIMENTAL_useTableMeasures as useTableMeasures,
  EXPERIMENTAL_useTableVisibility as useTableVisibility,
} from 'vtex.styleguide'

import type { ProductData } from '../../typings/Products'
import {
  productTableColumnsMessages,
  productTableMessages,
} from '../../utils/adminSellersMessages'
import StatusTag from './StatusTag'

interface ProductsTableProps {
  products: ProductData[]
}
const ProductsTable = ({ products }: ProductsTableProps) => {
  const intl = useIntl()

  const ITEMS_PER_PAGE = 5

  const columns = [
    {
      id: 'id',
      title: 'id',
    },
    {
      id: 'externalId',
      title: intl.formatMessage(productTableColumnsMessages.externalIdTitle),
    },
    {
      id: 'status',
      title: intl.formatMessage(productTableColumnsMessages.statusTitle),
      cellRenderer: ({ data }: { data: string }) => {
        return <StatusTag data={data} />
      },
    },
    {
      id: 'name',
      title: intl.formatMessage(productTableColumnsMessages.nameTitle),
    },
    {
      id: 'brandId',
      title: intl.formatMessage(productTableColumnsMessages.brandIdTitle),
    },
    {
      id: 'categoryIds',
      title: intl.formatMessage(productTableColumnsMessages.categoryIdsTitle),
      cellRenderer: ({
        data,
      }: {
        data: string | number | string[] | number[]
      }) => {
        const dataArray = Array.isArray(data) ? data : [data]

        return <div>{dataArray.join(', ')}</div>
      },
    },
    {
      id: 'specs',
      title: intl.formatMessage(productTableColumnsMessages.specsTitle),
      cellRenderer: ({
        data,
      }: {
        data: Array<{ name: string; values: string[] }>
      }) => (
        <ul>
          {data.map((spec, index) => (
            <li key={index}>
              <strong>{spec.name}:</strong> {spec.values.join(', ')}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'attributes',
      title: intl.formatMessage(productTableColumnsMessages.attributesTitle),
      cellRenderer: ({
        data,
      }: {
        data: Array<{ name: string; value: string }>
      }) => (
        <ul>
          {data.map((attribute, index) => (
            <li key={index}>
              <strong>{attribute.name}:</strong> {attribute.value}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'slug',
      title: intl.formatMessage(productTableColumnsMessages.slugTitle),
    },
    {
      id: 'images',
      title: intl.formatMessage(productTableColumnsMessages.imagesTitle),
      cellRenderer: ({
        data,
      }: {
        data: Array<{ id: string | number; url: string; alt?: string }>
      }) => (
        <ul>
          {data.map((image, index) => (
            <li key={index}>
              <strong>ID:</strong> {image.id}, <strong>URL:</strong> {image.url}
              , <strong>Alt:</strong> {image.alt ?? ''}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'skus',
      title: intl.formatMessage(productTableColumnsMessages.skusTitle),
      cellRenderer: ({
        data,
      }: {
        data: Array<{
          id?: string | number
          name: string
          externalId?: string | number
          ean?: string | number
          manufacturerCode?: string | number
          isActive: boolean
          weight: number
          dimensions: { width: number; height: number; length: number }
          specs: Array<{ name: string; value: string }>
          images: string[]
        }>
      }) => (
        <ul>
          {data.map((sku, index) => (
            <li key={index}>
              {sku?.id ? (
                <>
                  <strong>Id:</strong>
                  {sku?.id},{' '}
                </>
              ) : (
                ''
              )}
              <strong>Name:</strong> {sku.name}, <strong>External ID:</strong>{' '}
              {sku.externalId ?? ''}, <strong>EAN:</strong> {sku.ean ?? ''},{' '}
              <strong>Manufacturer Code:</strong> {sku.manufacturerCode ?? ''},{' '}
              <strong>Active:</strong> {sku.isActive ? 'Yes' : 'No'},{' '}
              <strong>Weight:</strong> {sku.weight},{' '}
              <strong>Dimensions:</strong> {sku.dimensions.width}x
              {sku.dimensions.height}x{sku.dimensions.length},{' '}
              <strong>Specs:</strong>{' '}
              {sku.specs
                .map((spec) => `${spec.name}: ${spec.value}`)
                .join(', ')}{' '}
              <strong>Images IDs:</strong>{' '}
              {sku.images.map((images) => `${images}`).join(', ')}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'transportModal',
      title: intl.formatMessage(
        productTableColumnsMessages.transportModalTitle
      ),
    },
    {
      id: 'taxCode',
      title: intl.formatMessage(productTableColumnsMessages.taxCodeTitle),
    },
  ]

  const [filteredItems] = useState<ProductData[]>(products)

  const measures = useTableMeasures({
    size: ITEMS_PER_PAGE,
  })

  const visibility = useTableVisibility({
    columns,
    hiddenColumns: [],
  })

  const emptyState = {
    label: intl.formatMessage(productTableMessages.emptyText),
  }

  const empty = useMemo(
    () =>
      products.length === 0 ||
      filteredItems.length === 0 ||
      Object.keys(visibility.visibleColumns).length === 0,
    [products.length, filteredItems.length, visibility.visibleColumns]
  )

  const { slicedItems, ...paginationProps } = usePagination(
    ITEMS_PER_PAGE,
    filteredItems
  )

  const pagination = {
    ...paginationProps,
    textOf: intl.formatMessage(productTableMessages.of),
    rowsOptions: calculateNewOptions(filteredItems.length),
    textShowRows: intl.formatMessage(productTableMessages.showRows),
    totalItems: filteredItems.length,
  }

  return (
    <div>
      <Table
        empty={empty}
        emptyState={emptyState}
        measures={measures}
        items={slicedItems}
        columns={visibility.visibleColumns}
        highlightOnHover
        stickyHeader
      >
        <Table.Pagination {...pagination} />
      </Table>
    </div>
  )
}

function usePagination(initialSize: number, items: ProductData[]) {
  const [state, setState] = useState({
    tableSize: initialSize,
    currentPage: 1,
    currentItemFrom: 1,
    currentItemTo: initialSize,
    slicedItems: [...items].slice(0, initialSize),
  })

  /** resets state on items change */
  useEffect(() => {
    setState({
      tableSize: initialSize,
      currentPage: 1,
      currentItemFrom: 1,
      currentItemTo: initialSize,
      slicedItems: [...items].slice(0, initialSize),
    })
  }, [initialSize, items])

  /** gets the next page */
  const onNextClick = useCallback(() => {
    const newPage = state.currentPage + 1
    const itemFrom = state.currentItemTo + 1
    const itemTo = state.tableSize * newPage
    const newItems = [...items].slice(itemFrom - 1, itemTo)

    setState((s) => ({
      ...s,
      currentPage: newPage,
      currentItemFrom: itemFrom,
      currentItemTo: itemTo,
      slicedItems: newItems,
    }))
  }, [state, items])

  /** gets the previous page */
  const onPrevClick = useCallback(() => {
    if (state.currentPage === 0) return
    const newPage = state.currentPage - 1
    const itemFrom = state.currentItemFrom - state.tableSize
    const itemTo = state.currentItemFrom - 1
    const newItems = [...items].slice(itemFrom - 1, itemTo)

    setState((s) => ({
      ...s,
      currentPage: newPage,
      currentItemFrom: itemFrom,
      currentItemTo: itemTo,
      slicedItems: newItems,
    }))
  }, [state, items])

  /** deals rows change of Pagination component */
  const onRowsChange = useCallback(
    (_e, value) => {
      const rowValue = parseInt(value, 10)

      const newItems = [...items].slice(state.currentItemFrom - 1, rowValue)

      setState((s) => ({
        ...s,
        tableSize: rowValue,
        currentItemTo: rowValue,
        slicedItems: newItems,
      }))
    },
    [state, items]
  )

  return {
    onNextClick,
    onPrevClick,
    onRowsChange,
    ...state,
  }
}

function calculateNewOptions(totalItems: number) {
  const newOptions = []

  if (totalItems <= 5) {
    newOptions.push(5)
  } else if (totalItems <= 10) {
    newOptions.push(5)
    newOptions.push(10)
  } else if (totalItems <= 15) {
    newOptions.push(5)
    newOptions.push(10)
    newOptions.push(15)
  } else {
    newOptions.push(5)
    newOptions.push(10)
    newOptions.push(15)
    newOptions.push(20)
  }

  return newOptions
}

export default ProductsTable
