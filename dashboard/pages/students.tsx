import {useState} from 'react'
import {Container} from 'reactstrap'
import {Header, Menu, Button, Modal, Icon} from 'semantic-ui-react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {CreateUserModal} from '../src/users/components/oldCreateUserModal'
import {DeleteUserModal} from '../src/users/components/deleteUserModal'
import {UpdateUserModal} from '../src/users/components/updateUserModal'
import {UsersTable} from '../src/users/components/usersTable'

export default function Users() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)

  return (
    <RequireAuth
      render={({auth}) => {
        return (
          <>
            <DashboardNavigation role={auth?.user?.role} />
            <Container>
              <Header as="h1">Students</Header>

              <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
                Add student
              </Button>

              <UsersTable
                onEditClick={setIsUpdateUserModalOpen}
                onDeleteClick={setIsDeleteUserModalOpen}
                rows={[
                  {
                    firstName: 'Nicol',
                    lastName: 'Vojacek',
                    childId: 'nic123',
                    age: 8,
                    school: 'FHP',
                    teacher: 'Rory James',
                    readingLevel: 1,
                    lastLoggedIn: '2 April 2022',
                    aveReadingTime: 29,
                  },
                  {
                    firstName: 'Michele',
                    lastName: 'Lemonius',
                    age: 7,
                    childId: 'mic123',
                    school: 'FHP',
                    teacher: 'Rory James',
                    readingLevel: 2,
                    lastLoggedIn: '2 April 2022',
                    aveReadingTime: 31,
                  },
                ]}
              />

              {isCreateUserModalOpen && (
                <CreateUserModal
                  open={isCreateUserModalOpen}
                  setOpen={setIsCreateUserModalOpen}
                />
              )}

              {isUpdateUserModalOpen && (
                <UpdateUserModal
                  open={isUpdateUserModalOpen}
                  setOpen={setIsUpdateUserModalOpen}
                />
              )}

              {isDeleteUserModalOpen && (
                <DeleteUserModal
                  open={isDeleteUserModalOpen}
                  setOpen={setIsDeleteUserModalOpen}
                />
              )}
            </Container>
          </>
        )
      }}
    />
  )
}
