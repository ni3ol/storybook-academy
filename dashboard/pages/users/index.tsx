import {useState} from 'react'
import {Input, Pagination as SRPagination} from 'semantic-ui-react'
import router from 'next/router'
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
import {UserRole} from '../../src/users/model'
import {Pagination} from '../../src/shared/utils'

const Users = ({auth}: {auth: Auth}) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
  })
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const action = usePromise(() => {
    return getUsers({
      authToken: auth.token,
      filters: {search: debouncedSearch},
      pagination,
    })
  }, [debouncedSearch, pagination])

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
      <DashboardNavigation user={auth.user} />
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
              placeholder="Search name"
              style={{marginRight: 10}}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
              New user
            </Button>
          </div>
        </div>
        <UsersTable auth={auth} rows={action.result?.entities || []} />
        {pagination.pageSize && (
          <SRPagination
            defaultActivePage={pagination.page}
            onPageChange={(e, data) =>
              setPagination({
                ...pagination,
                page: parseInt(String(data.activePage), 10),
              })
            }
            totalPages={Math.ceil(
              (action.result?.count || 0) / pagination.pageSize,
            )}
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
        if (auth.user.role !== UserRole.Admin) {
          router.push('/students')
          return
        }

        return <Users auth={auth} />
      }}
    />
  )
}
