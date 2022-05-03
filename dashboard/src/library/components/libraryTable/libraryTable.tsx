import {Button} from 'semantic-ui-react'
import {DataTable} from '../../../shared/components/dataTable'

export const LibraryTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: any
  onUpdateClick: () => any
  onDeleteClick: () => any
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
            <Button onClick={() => onUpdateClick()} primary>
              Edit
            </Button>
            <Button onClick={() => onDeleteClick()}>Delete</Button>
          </>
        ),
      },
    ]}
  />
)
