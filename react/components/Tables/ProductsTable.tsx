import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  EXPERIMENTAL_Table as Table,
  EXPERIMENTAL_useTableMeasures as useTableMeasures,
  EXPERIMENTAL_useTableVisibility as useTableVisibility,
  ButtonWithIcon,
  Modal,
  IconExternalLink,
} from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import type { ProductData, SkuData, ImageData } from '../../typings/Products'
import {
  productTableColumnsMessages,
  productTableMessages,
} from '../../utils/adminSellersMessages'
import StatusTag from './StatusTag'
import SkusTable from './SkusTable'
import ImagesTable from './ImagesTable'
import wakeUpGQL from '../../graphql/mutations/wakeUp.gql'
import styles from '../../styles/ProductTable.module.css'

const linkIcon = <IconExternalLink />

interface ProductsTableProps {
  products: ProductData[]
}
const ProductsTable = ({ products }: ProductsTableProps) => {
  const intl = useIntl()
  const [wakeUpMutation] = useMutation(wakeUpGQL)

  const [openSkusModal, setOpenSkusModal] = useState(false)
  const [skusSelected, setSkusSelected] = useState<SkuData[]>([])
  const [openImagesModal, setOpenImagesModal] = useState(false)
  const [imagesSelected, setImagesSelected] = useState<ImageData[]>([])

  const handleWakeUp = useCallback(async () => {
    await wakeUpMutation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ITEMS_PER_PAGE = 5

  const handleOpenSkusTable = (skus: SkuData[]) => {
    setOpenSkusModal(true)
    setSkusSelected(skus)
  }

  const handleCloseSkusTable = () => {
    setOpenSkusModal(false)
    setSkusSelected([])
  }

  const handleOpenImagesTable = (images: ImageData[]) => {
    setOpenImagesModal(true)
    setImagesSelected(images?.map((i, index) => ({ ...i, index })))
  }

  const handleCloseImagesTable = () => {
    setOpenImagesModal(false)
    setImagesSelected([])
  }

  const columns = [
    ...(products.some((product) => product.id)
      ? [
          {
            id: 'id',
            title: intl.formatMessage(productTableColumnsMessages.idTitle),
          },
        ]
      : []),
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
      id: 'skus',
      title: intl.formatMessage(productTableColumnsMessages.skusTitle),
      cellRenderer: ({ data }: { data: SkuData[] }) => (
        <div className="flex justify-center">
          <ButtonWithIcon
            variation="secondary"
            onClick={() => handleOpenSkusTable(data)}
            icon={linkIcon}
          />
        </div>
      ),
    },
    {
      id: 'images',
      title: intl.formatMessage(productTableColumnsMessages.imagesTitle),
      cellRenderer: ({ data }: { data: ImageData[] }) => (
        <div className="flex justify-center">
          <ButtonWithIcon
            variation="secondary"
            onClick={() => handleOpenImagesTable(data)}
            icon={linkIcon}
          />
        </div>
      ),
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
          {data?.map((spec, index) => (
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
          {data?.map((attribute, index) => (
            <li key={index}>
              <strong>{attribute?.name}:</strong> {attribute?.value}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'slug',
      title: intl.formatMessage(productTableColumnsMessages.slugTitle),
    },
    ...(products.some((product) => product.transportModal)
      ? [
          {
            id: 'transportModal',
            title: intl.formatMessage(
              productTableColumnsMessages.transportModalTitle
            ),
          },
        ]
      : []),
    ...(products.some((product) => product.taxCode)
      ? [
          {
            id: 'taxCode',
            title: intl.formatMessage(productTableColumnsMessages.taxCodeTitle),
          },
        ]
      : []),
    ...(products.some((product) => product.description)
      ? [
          {
            id: 'description',
            title: intl.formatMessage(
              productTableColumnsMessages.descriptionTitle
            ),
          },
        ]
      : []),
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

  useEffect(() => {
    handleWakeUp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!products || products.length === 0) {
      return
    }

    const preloadImages = () => {
      const allImageUrls: string[] = []

      products.forEach((product) => {
        product.images.forEach((image) => {
          allImageUrls.push(image.url)
        })
      })

      const imagePromises = allImageUrls?.map((url) => {
        return new Promise((resolve, reject) => {
          const tempImage = new Image()

          tempImage.onload = resolve
          tempImage.onerror = reject
          tempImage.src = url
        })
      })

      Promise.all(imagePromises)
    }

    preloadImages()
  }, [products])

  return (
    <div className={styles.productsTable}>
      <Table
        empty={empty}
        emptyState={emptyState}
        measures={{ ...measures, tableHeight: 'auto' }}
        items={slicedItems}
        columns={visibility.visibleColumns}
        highlightOnHover
        stickyHeader
      >
        <Table.Pagination {...pagination} />
      </Table>
      <Modal centered isOpen={openSkusModal} onClose={handleCloseSkusTable}>
        <SkusTable skus={skusSelected} />
      </Modal>
      <Modal centered isOpen={openImagesModal} onClose={handleCloseImagesTable}>
        <ImagesTable images={imagesSelected} />
      </Modal>
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
