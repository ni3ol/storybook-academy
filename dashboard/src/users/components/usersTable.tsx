import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable/dataTable'
import {User} from '../model'

export const UsersTable = ({
  rows,
  onEditClick,
  onDeleteClick,
}: {
  rows: User[]
  onEditClick: any
  onDeleteClick: any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'firstName',
        title: 'First name',
        resolve: (row) => row.firstName,
      },
      {
        key: 'lastName',
        title: 'Last name',
        resolve: (row) => row.lastName,
      },
      {
        key: 'childId',
        title: 'Child ID',
        resolve: (row) => row.childId,
      },
      {
        key: 'age',
        title: 'Age',
        resolve: (row) => row.age,
      },
      {
        key: 'school',
        title: 'School',
        resolve: (row) => row.school,
      },
      {
        key: 'teacher',
        title: 'Teacher',
        resolve: (row) => row.teacher,
      },
      {
        key: 'readingLevel',
        title: 'Reading level',
        resolve: (row) => row.readingLevel,
      },
      {
        key: 'aveReadingTime',
        title: 'Ave. reading (minutes)',
        resolve: (row) => row.aveReadingTime,
      },
      {
        key: 'lastLoggedIn',
        title: 'Last logged in',
        resolve: (row) => row.lastLoggedIn,
      },
      {
        key: 'actions',
        title: 'Actions',
        resolve: (row) => (
          <>
            <Button onClick={() => onEditClick(true)} primary>
              Edit
            </Button>
            <Button onClick={() => onDeleteClick(true)}>Delete</Button>
          </>
        ),
      },
    ]}
  />
)
