import {useState} from 'react'
import {Input} from 'semantic-ui-react'
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
import {UpdateClassPasswordModal} from '../src/users/components/updateClassPasswordModal'
import {UserRole} from '../src/users/model'
import {getClasses} from '../src/classes/actions/getClasses'

const Students = ({auth}: {auth: Auth}) => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isUpdateClassPasswordModalOpen, setIsUpdateClassPasswordModalOpen] =
    useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const action = usePromise(() => {
    if (!auth.user.classId) return Promise.resolve(undefined)
    return getUsers({
      authToken: auth.authSession.token,
      filters: {
        classId: auth.user.classId,
        role: UserRole.Child,
        search,
      },
    })
  }, [debouncedSearch])

  const getClassAction = usePromise(async () => {
    if (!auth.user.classId) return Promise.resolve(undefined)
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: auth.user.classId},
    })
    return theClass
  }, [auth.user])

  const theClass = getClassAction.result

  return (
    <>
      {isCreateUserModalOpen && auth.user.schoolId && auth.user.classId && (
        <CreateUserModal
          auth={auth}
          schoolId={auth.user.schoolId}
          classId={auth.user.classId}
          onClose={() => setIsCreateUserModalOpen(false)}
          onUserCreated={async () => {
            setIsCreateUserModalOpen(false)
            await action.execute()
          }}
        />
      )}
      {isUpdateClassPasswordModalOpen && theClass?.password && theClass.id && (
        <UpdateClassPasswordModal
          auth={auth}
          classId={theClass.id}
          password={theClass?.password}
          onClose={() => setIsUpdateClassPasswordModalOpen(false)}
          onClassPasswordUpdated={async () => {
            setIsUpdateClassPasswordModalOpen(false)
            await getClassAction.execute()
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
          <div>
            <Header as="h1">Students</Header>
            <p>
              Password for student&apos;s login:{' '}
              <strong>{theClass?.password}</strong>{' '}
            </p>
          </div>
          <div>
            <Input
              icon="search"
              iconPosition="left"
              placeholder="Search name"
              style={{marginRight: 10}}
              onChange={(e) => setSearch(e.target.value)}
            />
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
