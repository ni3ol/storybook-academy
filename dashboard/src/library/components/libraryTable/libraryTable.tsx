import {Button} from 'semantic-ui-react'
import {DataTable} from '../../../shared/components/dataTable/dataTable'

export const LibraryTable = ({
  rows,
  setIsUpdateMaterialModalOpen,
  setIsDeleteMaterialModalOpen,
}: {
  rows: any
  setIsUpdateMaterialModalOpen: any
  setIsDeleteMaterialModalOpen: any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'title',
        title: 'Title',
        resolve: (row) => row.title,
      },
      {
        key: 'course',
        title: 'Course',
        resolve: (row) => row.course,
      },
      {
        key: 'area',
        title: 'Area',
        resolve: (row) => row.area,
      },
      {
        key: 'readingDate',
        title: 'Reading date',
        resolve: (row) => row.readingDate,
      },
      {
        key: 'levels',
        title: 'Levels',
        resolve: (row) => row.levels,
      },
      {
        key: 'actions',
        title: 'Actions',
        resolve: (row) => (
          <>
            <Button onClick={() => setIsUpdateMaterialModalOpen(true)} primary>
              Edit
            </Button>
            <Button onClick={() => setIsDeleteMaterialModalOpen(true)}>
              Delete
            </Button>
          </>
        ),
      },
    ]}
  />
)
