import {useRouter} from 'next/router'
import {Dropdown, Icon, Tab, Table} from 'semantic-ui-react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import format from 'date-fns/format'
import {User, UserRole} from '../../src/users/model'
import NextLink from 'next/link'
import {useState} from 'react'
import {UpdateUserModal} from '../../src/users/components/updateUserModal'
import {DeleteUserModal} from '../../src/users/components/deleteUserModal'
import router from 'next/router'
import {getSchools} from '../../src/schools/actions/getSchools'

const UserPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {userId} = router.query as {userId: string}
  const [isUserUpdateModalOpen, setIsUserUpdateModalOpen] = useState(false)
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false)

  const getUserAction = usePromise(async () => {
    const [user] = await getUsers({
      authToken: auth.authSession.token,
      filters: {id: userId},
    })
    return user
  }, [])
  const user = getUserAction.result

  const schoolsAction = usePromise(() => {
    return getSchools({authToken: auth.authSession.token})
  }, [])

  const schools = schoolsAction.result || []

  return (
    <>
      {isUserUpdateModalOpen && user && (
        <UpdateUserModal
          user={user}
          onClose={() => setIsUserUpdateModalOpen(false)}
          onUserUpdated={() => {
            setIsUserUpdateModalOpen(false)
            getUserAction.execute()
          }}
        />
      )}
      {isUserDeleteModalOpen && user && (
        <DeleteUserModal
          user={user}
          onClose={() => {
            setIsUserDeleteModalOpen(false)
          }}
          onUserDeleted={() => {
            setIsUserDeleteModalOpen(false)
            getUserAction.execute()
            router.push('/users')
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
            <NextLink passHref href={`/users`}>
              Back
            </NextLink>
            <Header as="h1" style={{marginBottom: 20}}>
              User - {user?.firstName} {user?.lastName}
            </Header>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header style={{margin: 0}} as="h3">
            Details
          </Header>
          <Dropdown text="Actions" floating basic>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsUserUpdateModalOpen(true)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setIsUserDeleteModalOpen(true)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}>Name</Table.Cell>
              <Table.Cell>
                {user?.firstName} {user?.lastName}
              </Table.Cell>
            </Table.Row>
            {user?.role !== UserRole.Child && (
              <Table.Row>
                <Table.Cell>Email address</Table.Cell>
                <Table.Cell>{user?.emailAddress}</Table.Cell>
              </Table.Row>
            )}
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Username</Table.Cell>
                <Table.Cell>{user?.username}</Table.Cell>
              </Table.Row>
            )}
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Password</Table.Cell>
                <Table.Cell>TODO - teacher set</Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell>ID (internal use only)</Table.Cell>
              <Table.Cell>{userId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>
                {user?.createdAt && format(user?.createdAt, 'd LLLL y')}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header style={{margin: 0}} as="h3">
            School
          </Header>
        </div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}>Name</Table.Cell>
              <Table.Cell>
                {user && schools && (
                  <NextLink passHref href={`/schools/${user?.schoolId}`}>
                    {
                      schools.find((school) => school.id === user?.schoolId)
                        ?.name
                    }
                  </NextLink>
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Role</Table.Cell>
              <Table.Cell>{user?.role}</Table.Cell>
            </Table.Row>
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Teacher</Table.Cell>
                <Table.Cell>TODO</Table.Cell>
              </Table.Row>
            )}
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Reading level</Table.Cell>
                <Table.Cell>TODO</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        {user?.role === UserRole.Child && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Header style={{margin: 0}} as="h3">
                Profile
              </Header>
            </div>
            <Table definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={4}>Profile created</Table.Cell>
                  <Table.Cell>{user?.profileCreated ? 'Yes' : 'No'}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Reading buddy</Table.Cell>
                  <Table.Cell>TODO</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Age</Table.Cell>
                  <Table.Cell>{user?.age}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Favourite color</Table.Cell>
                  <Table.Cell>{user?.favouriteColor}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Favourite animal</Table.Cell>
                  <Table.Cell>{user?.favouriteAnimal}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </>
        )}
      </Container>
    </>
  )
}

export default function UserPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <UserPage auth={auth} />
      }}
    />
  )
}
