import NextLink from 'next/link'
import {DataTable} from '../../shared/components/dataTable'
import {Class} from '../model'

export const ClassesTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: Class[]
  onUpdateClick: (theClass: Class) => any
  onDeleteClick: (theClass: Class) => any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'name',
        title: 'Name',
        resolve: (theClass) => {
          return (
            <NextLink passHref href={`/classes/${theClass.id}`}>
              <a>{theClass.name}</a>
            </NextLink>
          )
        },
      },
      {
        key: 'schoolId',
        title: 'School',
        resolve: (theClass) => {
          return (
            <NextLink passHref href={`/schools/${theClass.schoolId}`}>
              <a>{theClass.schoolId}</a>
            </NextLink>
          )
        },
      },
      {
        key: 'educatorId',
        title: 'Educator',
        resolve: (theClass) => {
          return (
            <NextLink passHref href={`/users/${theClass.educatorId}`}>
              <a>{theClass.educatorId}</a>
            </NextLink>
          )
        },
      },
      {
        key: 'bookId',
        title: 'Book',
        resolve: (theClass) => {
          return (
            <NextLink passHref href={`/books/${theClass.bookId}`}>
              <a>{theClass.bookId}</a>
            </NextLink>
          )
        },
      },
    ]}
  />
)
