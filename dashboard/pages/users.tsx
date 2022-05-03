import {useState} from 'react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {UsersTable} from '../src/users/components/usersTable'
import {Auth} from '../src/auth/hooks'
import {usePromise} from '../src/shared/hooks'
import {getUsers} from '../src/users/actions/getUsers'
import {CreateUserModal} from '../src/users/components/createUserModal'
import {User} from '../src/users/model'
import {UpdateUserModal} from '../src/users/components/updateUserModal'
import {Container} from '../src/shared/components/container'
import {Button} from '../src/shared/components/button'
import {Header} from '../src/shared/components/header'
import {DeleteUserModal} from '../src/users/components/deleteUserModal'

const Users = ({auth}: {auth: Auth}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<User | undefined>()
  const [userToDelete, setUserToDelete] = useState<User | undefined>()

  const action = usePromise(() => {
    return getUsers({authToken: auth.token})
  }, [])

  return (
    <>
      {isCreateUserModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateUserModalOpen(false)}
          onUserCreated={() => {
            setIsCreateUserModalOpen(false)
            action.execute()
          }}
        />
      )}
      {userToUpdate && (
        <UpdateUserModal
          user={userToUpdate}
          onClose={() => setUserToUpdate(undefined)}
          onUserUpdated={() => {
            setUserToUpdate(undefined)
            action.execute()
          }}
        />
      )}
      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(undefined)}
        />
      )}
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header as="h1">Users</Header>
          <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
            Add user
          </Button>
        </div>
        <UsersTable
          onUpdateClick={(user) => setUserToUpdate(user)}
          onDeleteClick={(user) => setUserToDelete(user)}
          rows={action.result || []}
        />
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
