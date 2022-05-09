import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {Book} from '../model'

export const LibraryTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: Book[]
  onUpdateClick?: (book: Book) => any
  onDeleteClick?: (book: Book) => any
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
        key: 'levels',
        title: 'Levels',
        resolve: (row) => row.level,
      },
      {
        key: 'actions',
        title: 'Actions',
        resolve: (row) => (
          <>
            {onUpdateClick && (
              <Button onClick={() => onUpdateClick(row)} primary>
                Edit
              </Button>
            )}
            {onDeleteClick && (
              <Button onClick={() => onDeleteClick(row)}>Delete</Button>
            )}
          </>
        ),
      },
    ]}
  />
)
