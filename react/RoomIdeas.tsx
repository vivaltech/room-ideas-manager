import React from 'react'
import {
  Layout,
  PageBlock,
  PageHeader,
  Button,
  IconDelete,
  Table
} from 'vtex.styleguide'

const RoomIdeas: React.FC = () => {
  const defaultSchema = {
    properties: {
      name: {
        title: 'Room Name',
        width: 400,
      },
      scenes: {
        title: 'Scenes',
        width: 300,
      },
      ID: {
        title: 'ID',
        width: 100,
      },
      delete: {
        title: 'Delete',
        width: 80,
      },
    },
  }

  const itemsCopy = [
    {name: 'Bathroom', ID: 'bedroom', scenes: '3', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Bedroom', ID: 'bathroom',  scenes:'4', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Living Room', ID: 'livin',  scenes:'3', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Dining Room', ID: 'dining',  scenes:'6', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button> },
    {name: 'Kitchen', ID: 'kitchen',  scenes: '3', delete: <Button variation="secondary" size="small"><IconDelete size={16} /></Button>}
  ]

  return (
    <Layout
      pageHeader={
        <PageHeader
          title='Room Ideas'
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
            label: 'New Room',
            handleCallback: () => {},
          },
        }}
        pagination={{
          onNextClick: 'this.handleNextClick',
          onPrevClick: 'this.handlePrevClick',
          currentItemFrom: '1',
          currentItemTo: '5',
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

export default RoomIdeas
