import {Button} from 'semantic-ui-react'
import NextLink from 'next/link'
import {Auth} from '../../auth/hooks'
import {DataTable} from '../../shared/components/dataTable'
import {UserRole} from '../../users/model'
import {Book} from '../model'

export const LibraryTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
  auth,
}: {
  rows: Book[]
  onUpdateClick?: (book: Book) => any
  onDeleteClick?: (book: Book) => any
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
      ...(auth?.user.role !== UserRole.Educator
        ? [
            {
              key: 'actions',
              title: 'Actions',
              resolve: (row: Book) =>
                auth?.user.role === UserRole.Admin && (
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
          ]
        : []),
    ]}
  />
)
