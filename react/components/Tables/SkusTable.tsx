import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  EXPERIMENTAL_Table as Table,
  EXPERIMENTAL_useTableMeasures as useTableMeasures,
  EXPERIMENTAL_useTableVisibility as useTableVisibility,
} from 'vtex.styleguide'

import type { SkuData } from '../../typings/Products'
import {
  productTableColumnsMessages,
  productTableMessages,
  skuTableColumnsMessages,
} from '../../utils/adminSellersMessages'
import StatusTag from './StatusTag'

interface SkusTableProps {
  skus: SkuData[]
}
const SkusTable = ({ skus }: SkusTableProps) => {
  const intl = useIntl()

  const ITEMS_PER_PAGE = 5

  const columns = [
    ...(skus.some((sku) => sku.id)
      ? [
          {
            id: 'id',
            title: intl.formatMessage(skuTableColumnsMessages.idTitle),
          },
        ]
      : []),
    {
      id: 'name',
      title: intl.formatMessage(productTableColumnsMessages.nameTitle),
    },
    {
      id: 'externalId',
      title: intl.formatMessage(productTableColumnsMessages.externalIdTitle),
    },
    {
      id: 'ean',
      title: intl.formatMessage(skuTableColumnsMessages.eanTitle),
    },
    {
      id: 'manufacturerCode',
      title: intl.formatMessage(skuTableColumnsMessages.manufacturerCodeTitle),
    },
    {
      id: 'isActive',
      title: intl.formatMessage(skuTableColumnsMessages.isActiveTitle),
      cellRenderer: ({ data }: { data: boolean }) => (
        <StatusTag data={data ? 'active' : 'inactive'} />
      ),
    },
    {
      id: 'weight',
      title: intl.formatMessage(skuTableColumnsMessages.weightTitle),
    },
    {
      id: 'dimensions',
      title: intl.formatMessage(skuTableColumnsMessages.dimensionsTitle),
      cellRenderer: ({
        data,
      }: {
        data: { width: number; height: number; length: number }
      }) => (
        <ul>
          <li>
            <strong>
              {intl.formatMessage(skuTableColumnsMessages.widthTitle)}:
            </strong>{' '}
            {data.width}
          </li>
          <li>
            <strong>
              {intl.formatMessage(skuTableColumnsMessages.heightTitle)}:
            </strong>{' '}
            {data.height}
          </li>
          <li>
            <strong>
              {intl.formatMessage(skuTableColumnsMessages.lengthTitle)}:
            </strong>{' '}
            {data.length}
          </li>
        </ul>
      ),
    },
    {
      id: 'specs',
      title: intl.formatMessage(skuTableColumnsMessages.specsTitle),
      cellRenderer: ({
        data,
      }: {
        data: Array<{ name: string; value: string }>
      }) => (
        <ul>
          {data?.map((attribute, index) => (
            <li key={index}>
              <strong>{attribute.name}:</strong> {attribute.value}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'images',
      title: intl.formatMessage(productTableColumnsMessages.imagesTitle),
      cellRenderer: ({ data }: { data: string[] }) => {
        return (
          <ul>
            {data?.map((imageId, index) => (
              <li key={index}>
                <strong>ID:</strong> {imageId}
              </li>
            ))}
          </ul>
        )
      },
    },
  ]

  const [filteredItems] = useState<SkuData[]>(skus)

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
      skus.length === 0 ||
      filteredItems.length === 0 ||
      Object.keys(visibility.visibleColumns).length === 0,
    [skus.length, filteredItems.length, visibility.visibleColumns]
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

function usePagination(initialSize: number, items: SkuData[]) {
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

export default SkusTable
