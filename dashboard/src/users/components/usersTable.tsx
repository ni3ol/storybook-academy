import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {User} from '../model'

export const UsersTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: User[]
  onUpdateClick: (user: User) => any
  onDeleteClick: () => any
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
        key: 'actions',
        title: 'Actions',
        resolve: (row) => (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <div>
              <Button onClick={() => onUpdateClick(row)} primary>
                Edit
              </Button>
              <Button onClick={() => onDeleteClick()}>Delete</Button>
            </div>
          </div>
        ),
      },
    ]}
  />
)
