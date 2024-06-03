import React from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Button,
  IconDelete,
  Table
} from 'vtex.styleguide'

const RoomDetails: React.FC = () => {
  const defaultSchema = {
    properties: {
      name: {
        title: 'Scene Name',
        width: 400,
      },
      param: {
        title: 'URL Param',
        width: 300,
      },
      collectionID: {
        title: 'Collection ID',
        width: 100,
      },
      delete: {
        title: 'Delete',
        width: 80,
      },
    },
  }

  const itemsCopy = [
    {name: 'Dining Room 01', collectionID: '156', param: 'modern-dining-room', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Dining Room 02', collectionID: '144', param: 'mid-century',  delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Dining Room 03', collectionID: '154', param: 'classic-dining-room', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Dining Room 04', collectionID: '147', param: 'rustic', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Dining Room 05', collectionID: '167', param: 'retro', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button>},
    {name: 'Dining Room 06', collectionID: '145', param: 'minimalistic', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button>}
  ]

  return (
    <Layout
      pageHeader={
        <PageHeader
          title='Room Details'
        >
        </PageHeader>
      }
    >
      <PageBlock variation="full">
      <Table
        fullWidth
        schema={defaultSchema}
        items={itemsCopy}
        density="high"
        onRowClick={''}
        toolbar={{
          inputSearch: {
            value: '',
            placeholder: 'Search...',
            onChange: '',
            onClear: '',
            onSubmit: '',
          },
          density: {
            buttonLabel: 'Line density',
            lowOptionLabel: 'Low',
            mediumOptionLabel: 'Medium',
            highOptionLabel: 'High',
          },
          download: {
            label: 'Export',
            handleCallback: () => {},
          },
          upload: {
            label: 'Import',
            handleCallback: () => {},
          },
          fields: {
            label: 'Toggle visible fields',
            showAllLabel: 'Show All',
            hideAllLabel: 'Hide All',
            onToggleColumn: (params: any) => {
              console.log(params.toggledField)
              console.log(params.activeFields)
            },
            onHideAllColumns: (activeFields: any) => console.log(activeFields),
            onShowAllColumns: (activeFields: any) => console.log(activeFields),
          },
          extraActions: {
            label: 'More options',
            actions: [
              {
                label: 'An action',
                handleCallback: () => alert('An action'),
              },
              {
                label: 'Another action',
                handleCallback: () => alert('Another action'),
              },
              {
                label: 'A third action',
                handleCallback: () => alert('A third action'),
              },
            ],
          },
          newLine: {
            label: 'New Scene',
            handleCallback: () => {},
          },
        }}
        pagination={{
          onNextClick: 'this.handleNextClick',
          onPrevClick: 'this.handlePrevClick',
          currentItemFrom: '1',
          currentItemTo: '6',
          onRowsChange: 'this.handleRowsChange',
          textShowRows: 'Show rows',
          textOf: 'of',
          totalItems: '8',
          rowsOptions: [5, 10, 15, 25],
        }}
      />
      </PageBlock>
    </Layout>
  )
}

export default RoomDetails
