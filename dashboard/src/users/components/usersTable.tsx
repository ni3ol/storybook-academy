import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {User} from '../model'

export const UsersTable = ({
  rows,
  onUpdateClick,
  onDeleteClick,
}: {
  rows: User[]
  onUpdateClick?: (user: User) => any
  onDeleteClick?: (user: User) => any
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: 'firstName',
        title: 'First name',
        resolve: (user) => user.firstName,
      },
      {
        key: 'lastName',
        title: 'Last name',
        resolve: (user) => user.lastName,
      },
      {
        key: 'email',
        title: 'Email',
        resolve: (user) => user.emailAddress,
      },
      ...(onUpdateClick || onDeleteClick
        ? [
            {
              key: 'actions',
              title: 'Actions',
              resolve: (user: User) => (
                <div>
                  {onUpdateClick && (
                    <Button basic onClick={() => onUpdateClick(user)} primary>
                      Edit
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      basic
                      color="red"
                      onClick={() => onDeleteClick(user)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ]}
  />
)
