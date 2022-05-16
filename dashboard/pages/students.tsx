import {useState} from 'react'
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {UsersTable} from '../src/users/components/usersTable'
import {Auth} from '../src/auth/hooks'
import {useDebounce, usePromise} from '../src/shared/hooks'
import {getUsers} from '../src/users/actions/getUsers'
import {CreateUserModal} from '../src/users/components/createUserModal'
import {Container} from '../src/shared/components/container'
import {Button} from '../src/shared/components/button'
import {Header} from '../src/shared/components/header'
import {Input} from 'semantic-ui-react'
import {UpdateClassPasswordModal} from '../src/users/components/updateClassPasswordModal'

const Students = ({auth}: {auth: Auth}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isUpdateClassPasswordModalOpen, setIsUpdateClassPasswordModalOpen] =
    useState(false)
  const [classPassword, setClassPassword] = useState('flower')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const action = usePromise(() => {
    return getUsers({
      authToken: auth.authSession!.token,
      filters: {educatorId: auth.user.id, search: debouncedSearch},
    })
  }, [debouncedSearch])

  return (
    <>
      {isCreateUserModalOpen && (
        <CreateUserModal
          schoolId={auth.user.schoolId}
          educatorId={auth.user.id}
          onClose={() => setIsCreateUserModalOpen(false)}
          onUserCreated={() => {
            setIsCreateUserModalOpen(false)
            action.execute()
          }}
        />
      )}
      {isUpdateClassPasswordModalOpen && (
        <UpdateClassPasswordModal
          educatorId={auth.user.id}
          password={classPassword}
          onClose={() => setIsUpdateClassPasswordModalOpen(false)}
          onClassPasswordUpdated={(password) => {
            setIsUpdateClassPasswordModalOpen(false)
            setClassPassword(password)
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
          <div>
            <Header as="h1">Students</Header>
            <p>
              Password for student's login: <strong>{classPassword}</strong>{' '}
              (Missing Backend)
            </p>
          </div>
          <div style={{display: 'grid', gridGap: 10}}>
            {/* <Input
              icon="search"
              iconPosition="left"
              placeholder="Search email"
              style={{marginRight: 10}}
              onChange={(e) => setSearch(e.target.value)}
            /> */}
            <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
              Add new student
            </Button>
            <Button
              onClick={() => setIsUpdateClassPasswordModalOpen(true)}
              primary
            >
              Set password for students login
            </Button>
          </div>
        </div>
        <UsersTable auth={auth} rows={action.result || []} />
      </Container>
    </>
  )
}

export default function StudentsPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Students auth={auth} />
      }}
    />
  )
}
