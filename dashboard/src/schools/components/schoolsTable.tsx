import NextLink from 'next/link'
import {DataTable} from '../../shared/components/dataTable'
import {School} from '../model'

export const SchoolsTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: School[]
  onUpdateClick: (school: School) => any
  onDeleteClick: (school: School) => any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'name',
        title: 'Name',
        resolve: (school) => {
          return (
            <NextLink passHref href={`/schools/${school.id}`}>
              <a>{school.name}</a>
            </NextLink>
          )
        },
      },
    ]}
  />
)
