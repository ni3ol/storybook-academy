import {useState} from 'react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {UsersTable} from '../../src/users/components/usersTable'
import {Auth} from '../../src/auth/hooks'
import {useDebounce, usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {CreateUserModal} from '../../src/users/components/createUserModal'
import {Container} from '../../src/shared/components/container'
import {Button} from '../../src/shared/components/button'
import {Header} from '../../src/shared/components/header'
import {Input} from 'semantic-ui-react'

const Users = ({auth}: {auth: Auth}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const action = usePromise(() => {
    return getUsers({authToken: auth.token, filters: {search: debouncedSearch}})
  }, [debouncedSearch])

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header as="h1">Users</Header>
          <div>
            <Input
              icon="search"
              iconPosition="left"
              placeholder="Search email"
              style={{marginRight: 10}}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
              New user
            </Button>
          </div>
        </div>
        <UsersTable
          authToken={auth?.authSession!.token}
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
