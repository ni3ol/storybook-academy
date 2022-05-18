import {Button} from 'semantic-ui-react'
import {Auth} from '../../auth/hooks'
import {DataTable} from '../../shared/components/dataTable'
import {UserRole} from '../../users/model'
import {Book} from '../model'
import NextLink from 'next/link'

export const LibraryTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
  unassign,
  auth,
}: {
  rows: Book[]
  onUpdateClick?: (book: Book) => any
  onDeleteClick?: (book: Book) => any
  unassign?: boolean
  auth?: Auth
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'title',
        title: 'Title',
        resolve: (row) => (
          <NextLink passHref href={`/books/${row.id}`}>
            <a>{row.title}</a>
          </NextLink>
        ),
      },

      {
        key: 'actions',
        title: 'Actions',
        resolve: (row: Book) =>
          auth?.user.role === UserRole.Admin ? (
            <>
              {onUpdateClick && (
                <Button onClick={() => onUpdateClick(row)} primary>
                  Edit
                </Button>
              )}
              {onDeleteClick && (
                <Button onClick={() => onDeleteClick(row)}>
                  {unassign ? 'Unassign' : 'Delete'}
                </Button>
              )}
            </>
          ) : (
            auth?.user.role === UserRole.Teacher && (
              <Button onClick={() => {}}>Assign as current reading</Button>
            )
          ),
      },
    ]}
  />
)
