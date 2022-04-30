import {useState} from 'react'
import {Container} from 'reactstrap'
import {Header, Menu, Button} from 'semantic-ui-react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {CreateUserModal} from '../src/users/components/createUserModal'
import {DeleteUserModal} from '../src/users/components/deleteUserModal'
import {UpdateUserModal} from '../src/users/components/updateUserModal'
import {UsersTable} from '../src/users/components/usersTable'
import {StaffTable} from '../src/users/components/staffTable'
import {Auth} from '../src/auth/hooks'

const Users = ({auth}: {auth: Auth}) => {
  const [activeItem, setActiveItem] = useState('student')
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false)

  return (
    <>
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
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <Header as="h1">Users</Header>
        <Menu pointing secondary>
          <Menu.Item
            name="student"
            active={activeItem === 'student'}
            onClick={() => setActiveItem('student')}
          >
            Students
          </Menu.Item>
          <Menu.Item
            name="staff member"
            active={activeItem === 'staff member'}
            onClick={() => setActiveItem('staff member')}
          >
            Staff
          </Menu.Item>
        </Menu>
        <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
          Add {activeItem}
        </Button>
        {activeItem === 'student' && (
          <UsersTable
            onEditClick={() => setIsUpdateUserModalOpen(true)}
            onDeleteClick={() => setIsDeleteUserModalOpen(true)}
            rows={[]}
          />
        )}
        {activeItem === 'staff member' && (
          <StaffTable
            onEditClick={setIsUpdateUserModalOpen}
            onDeleteClick={setIsDeleteUserModalOpen}
            rows={[]}
          />
        )}
      </Container>
    </>
  )
}

export default function UsersPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Users auth={auth} />
      }}
    />
  )
}
