import {useRouter} from 'next/router'
import {Dropdown, Table} from 'semantic-ui-react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {UserRole} from '../../src/users/model'
import NextLink from 'next/link'
import {useState} from 'react'
import {UpdateUserModal} from '../../src/users/components/updateUserModal'
import {DeleteUserModal} from '../../src/users/components/deleteUserModal'
import {getSchools} from '../../src/schools/actions/getSchools'
import {UsersTable} from '../../src/users/components/usersTable'
import {formatDateSimple} from '../../src/shared/utils'

const UserPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {userId} = router.query as {userId: string}
  const [isUserUpdateModalOpen, setIsUserUpdateModalOpen] = useState(false)
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false)

  const getUserAction = usePromise(async () => {
    const users = await getUsers({
      authToken: auth.authSession.token,
    })
    return users
  }, [])
  const user = (getUserAction.result || []).find((user) => user.id === userId)
  const educator = (getUserAction.result || []).find(
    (u) => user?.educatorId === u.id,
  )

  const students = (getUserAction.result || []).filter(
    (u) => u.educatorId === user?.id && user?.role === UserRole.Teacher,
  )

  console.log(students, educator)

  const schoolsAction = usePromise(() => {
    return getSchools({authToken: auth.authSession.token})
  }, [])

  const schools = schoolsAction.result || []

  const schoolName =
    schools.find((school) => school.id === user?.schoolId)?.name || ''

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
            router.push(
              auth.user.role === UserRole.Teacher ? '/students' : '/users',
            )
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
            <NextLink
              passHref
              href={
                auth.user.role === UserRole.Teacher ? '/students' : `/users`
              }
            >
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
            {/* {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Password</Table.Cell>
                <Table.Cell>TODO - teacher set</Table.Cell>
              </Table.Row>
            )} */}
            {auth.user?.role === UserRole.Admin && (
              <Table.Row>
                <Table.Cell>ID (internal use only)</Table.Cell>
                <Table.Cell>{userId}</Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>
                {user?.createdAt && formatDateSimple(user.createdAt)}
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
                {auth.user?.role === UserRole.Teacher
                  ? user?.schoolId && schools && schoolName
                  : user?.schoolId &&
                    schools && (
                      <NextLink passHref href={`/schools/${user?.schoolId}`}>
                        {schoolName}
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
                <Table.Cell>
                  {educator &&
                    (auth.user.role === UserRole.Teacher ? (
                      educator.firstName + ' ' + educator.lastName
                    ) : (
                      <NextLink passHref href={`/users/${educator?.id}`}>
                        {educator.firstName + ' ' + educator.lastName}
                      </NextLink>
                    ))}
                </Table.Cell>
              </Table.Row>
            )}
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Reading level</Table.Cell>
                <Table.Cell>{user.readingLevel}</Table.Cell>
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

        {user?.role === UserRole.Teacher && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Header style={{margin: 0}} as="h3">
                Class
              </Header>
            </div>
            <UsersTable rows={students} auth={auth} />
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
