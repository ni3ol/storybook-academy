import {useState} from 'react'
import {Container} from 'reactstrap'
import {Header, Button} from 'semantic-ui-react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {UsersTable} from '../src/users/components/usersTable'
import {Auth} from '../src/auth/hooks'
import {usePromise} from '../src/shared/hooks'
import {getUsers} from '../src/users/actions/getUsers'
import {CreateUserModal} from '../src/users/components/createUserModal'

const Users = ({auth}: {auth: Auth}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)

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
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <Header as="h1">Users</Header>
        <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
          Add user
        </Button>
        <UsersTable
          onEditClick={() => null}
          onDeleteClick={() => null}
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
