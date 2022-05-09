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
        key: 'role',
        title: 'Role',
        resolve: (user) => user.role,
      },
      {
        key: 'email',
        title: 'Email',
        resolve: (user) => user.emailAddress,
      },
      {
        key: 'username',
        title: 'Username',
        resolve: (user) => user.username,
      },
      {
        key: 'profileCreated',
        title: 'Profile created',
        resolve: (user) => user.profileCreated && 'Yes',
      },
      {
        key: 'age',
        title: 'Age',
        resolve: (user) => user.age,
      },
      {
        key: 'favouriteColor',
        title: 'Favourite color',
        resolve: (user) => user.favouriteColor,
      },
      {
        key: 'favouriteAnimal',
        title: 'Favourite animal',
        resolve: (user) => user.favouriteAnimal,
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
