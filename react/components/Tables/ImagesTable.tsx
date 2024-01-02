import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  EXPERIMENTAL_Table as Table,
  EXPERIMENTAL_useTableMeasures as useTableMeasures,
  EXPERIMENTAL_useTableVisibility as useTableVisibility,
  Modal,
  ButtonWithIcon,
  IconExternalLink,
  Link,
} from 'vtex.styleguide'

import type { ImageData } from '../../typings/Products'
import {
  imageTableColumnsMessages,
  productTableMessages,
} from '../../utils/adminSellersMessages'
import styles from '../../styles/ImagesTable.module.css'

const linkIcon = <IconExternalLink />

interface ImagesTableProps {
  images: ImageData[]
}
const ImagesTable = ({ images }: ImagesTableProps) => {
  const intl = useIntl()

  const [openImageModal, setOpenImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    images.forEach((image) => {
      const tempImage = new Image()

      tempImage.src = image.url
    })
  }, [images])

  const handleOpenImageModal = (imageUrl: string) => {
    setOpenImageModal(true)
    setSelectedImage(imageUrl)
  }

  const handleCloseImageModal = () => {
    setOpenImageModal(false)
    setTimeout(() => {
      setSelectedImage('')
    }, 1000)
  }

  const ITEMS_PER_PAGE = 5

  const columns = [
    {
      id: 'id',
      title: intl.formatMessage(imageTableColumnsMessages.idTitle),
    },
    {
      id: 'url',
      title: intl.formatMessage(imageTableColumnsMessages.imageTitle),
      cellRenderer: ({ data }: { data: string }) => (
        <div className="flex justify-center">
          <ButtonWithIcon
            variation="secondary"
            onClick={() => handleOpenImageModal(data)}
            icon={linkIcon}
          />
        </div>
      ),
    },
    {
      id: 'alt',
      title: intl.formatMessage(imageTableColumnsMessages.altTitle),
    },
    {
      id: 'url',
      title: intl.formatMessage(imageTableColumnsMessages.urlTitle),
      cellRenderer: ({ data }: { data: string }) => (
        <Link href={data} target="_blank">
          {data}
        </Link>
      ),
    },
  ]

  const [filteredItems] = useState<ImageData[]>(images)

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
      images.length === 0 ||
      filteredItems.length === 0 ||
      Object.keys(visibility.visibleColumns).length === 0,
    [images.length, filteredItems.length, visibility.visibleColumns]
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
      <Modal centered isOpen={openImageModal} onClose={handleCloseImageModal}>
        <div className={styles.modalContent}>
          <img src={selectedImage} alt="" />
        </div>
      </Modal>
    </div>
  )
}

function usePagination(initialSize: number, items: ImageData[]) {
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

export default ImagesTable
