import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable/dataTable'
import {User} from '../model'

export const StaffTable = ({
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
        key: 'email',
        title: 'Email',
        resolve: (row) => row.emailAddress,
      },
      {
        key: 'role',
        title: 'Role',
        resolve: (row) => row.role,
      },
      {
        key: 'school',
        title: 'School',
        resolve: (row) => row.school,
      },
      {
        key: 'aveOnlineTime',
        title: 'Ave. online (minutes)',
        resolve: (row) => row.aveOnlineTime,
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
