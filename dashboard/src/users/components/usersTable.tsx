import {Button} from 'semantic-ui-react'
import {DataTable} from '../../shared/components/dataTable'
import {User} from '../model'
import NextLink from 'next/link'

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
        key: 'name',
        title: 'Name',
        resolve: (user) => {
          return (
            <NextLink passHref href={`/users/${user.id}`}>
              <a>
                {user.firstName} {user.lastName}
              </a>
            </NextLink>
          )
        },
      },
      {
        key: 'school',
        title: 'School',
        resolve: (user) => 'TODO',
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
      // ...(onUpdateClick || onDeleteClick
      //   ? [
      //       {
      //         key: 'actions',
      //         title: 'Actions',
      //         resolve: (user: User) => (
      //           <div>
      //             {onUpdateClick && (
      //               <Button basic onClick={() => onUpdateClick(user)} primary>
      //                 Edit
      //               </Button>
      //             )}
      //             {onDeleteClick && (
      //               <Button
      //                 basic
      //                 color="red"
      //                 onClick={() => onDeleteClick(user)}
      //               >
      //                 Delete
      //               </Button>
      //             )}
      //           </div>
      //         ),
      //       },
      //     ]
      //   : []),
    ]}
  />
)
