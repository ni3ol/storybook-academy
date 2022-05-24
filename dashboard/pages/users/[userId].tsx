import {useRouter} from 'next/router'
import {Button, Dropdown, Table} from 'semantic-ui-react'
import NextLink from 'next/link'
import {useState} from 'react'
import Image from 'next/image'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {UserRole} from '../../src/users/model'
import {UpdateUserModal} from '../../src/users/components/updateUserModal'
import {DeleteUserModal} from '../../src/users/components/deleteUserModal'
import {getSchools} from '../../src/schools/actions/getSchools'
import {UsersTable} from '../../src/users/components/usersTable'
import {formatDateSimple} from '../../src/shared/utils'
import {getClasses} from '../../src/classes/actions/getClasses'
import {PairChildModal} from '../../src/users/components/pairChildModal'

const UserPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {userId} = router.query as {userId: string}
  const [isUserUpdateModalOpen, setIsUserUpdateModalOpen] = useState(false)
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false)
  const [showPairChildModal, setShowPairChildModal] = useState(false)

  const getUserAction = usePromise(async () => {
    const [user] = await getUsers({
      authToken: auth.authSession.token,
      filters: {id: userId},
    })
    return user
  }, [])
  const user = getUserAction.result

  const linkedUserAction = usePromise(async () => {
    if (!user?.linkedChildId) return Promise.resolve(undefined)

    const [linkedChild] = await getUsers({
      authToken: auth.authSession.token,
      filters: {id: user?.linkedChildId},
    })
    return linkedChild
  }, [user])
  const linkedChild = linkedUserAction.result

  const getClassAction = usePromise(async () => {
    if (!user?.classId) return Promise.resolve(undefined)
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: user?.classId},
    })
    return theClass
  }, [user])

  const theClass = getClassAction.result

  const getEducatorAction = usePromise(async () => {
    const [educator] = await getUsers({
      authToken: auth.authSession.token,
      filters: {id: theClass?.educatorId},
    })
    return educator
  }, [])
  const educator = getEducatorAction.result

  const getStudentsAction = usePromise(async () => {
    if (user?.role !== UserRole.Educator) await Promise.resolve([])
    const students = await getUsers({
      authToken: auth.authSession.token,
      filters: {classId: theClass?.id, role: UserRole.Child},
    })
    return students
  }, [])
  const students = getStudentsAction.result

  const schoolsAction = usePromise(async () => {
    if (!user?.schoolId) return Promise.resolve(undefined)

    const [school] = await getSchools({
      authToken: auth.authSession.token,
      filters: {id: user?.schoolId},
    })
    return school
  }, [user])

  const school = schoolsAction.result
  const schoolName = school?.name || ''

  const [image, setImage] = useState()

  usePromise(async () => {
    if (!user?.profilePicture) return
    const importedImage = await import(
      `../../public/${user.profilePicture}.svg`
    )
    if (importedImage) setImage(importedImage)
  }, [user])

  return (
    <>
      {isUserUpdateModalOpen && user && (
        <UpdateUserModal
          user={user}
          onClose={() => setIsUserUpdateModalOpen(false)}
          onUserUpdated={async () => {
            setIsUserUpdateModalOpen(false)
            await getUserAction.execute()
          }}
        />
      )}
      {isUserDeleteModalOpen && user && (
        <DeleteUserModal
          user={user}
          onClose={() => {
            setIsUserDeleteModalOpen(false)
          }}
          onUserDeleted={async () => {
            setIsUserDeleteModalOpen(false)
            await getUserAction.execute()
            await router.push(
              auth.user.role === UserRole.Educator ? '/students' : '/users',
            )
          }}
        />
      )}
      {showPairChildModal &&
        user &&
        user.role === UserRole.Child &&
        theClass?.linkedClassId && (
          <PairChildModal
            childId={user.id}
            linkedClassId={theClass.linkedClassId}
            onClose={() => {
              setShowPairChildModal(false)
            }}
            onChildPaired={async () => {
              setShowPairChildModal(false)
              await getUserAction.execute()
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
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Header as="h1" style={{marginBottom: 0, marginRight: 10}}>
              User - {user?.firstName} {user?.lastName}
            </Header>
            {image && user?.role === UserRole.Child && (
              <Image src={image} width={50} height={50} />
            )}
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
                {user?.schoolId && auth.user.role !== UserRole.Educator && (
                  <NextLink passHref href={`/schools/${user?.schoolId}`}>
                    {schoolName}
                  </NextLink>
                )}
                {user?.schoolId &&
                  auth.user.role === UserRole.Educator &&
                  schoolName}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Role</Table.Cell>
              <Table.Cell>{user?.role}</Table.Cell>
            </Table.Row>
            {(user?.role === UserRole.Child ||
              user?.role === UserRole.Educator) && (
              <Table.Row>
                <Table.Cell>Class</Table.Cell>
                <Table.Cell>
                  {theClass && auth.user.role === UserRole.Admin && (
                    <NextLink passHref href={`/classes/${theClass.id}`}>
                      {theClass.name}
                    </NextLink>
                  )}
                  {theClass &&
                    auth.user.role !== UserRole.Admin &&
                    theClass.name}
                </Table.Cell>
              </Table.Row>
            )}
            {user?.role === UserRole.Child && (
              <Table.Row>
                <Table.Cell>Educator</Table.Cell>
                <Table.Cell>
                  {educator &&
                    (auth.user.role === UserRole.Educator ? (
                      `${educator.firstName} ${educator.lastName}`
                    ) : (
                      <NextLink passHref href={`/users/${educator?.id}`}>
                        <a>{`${educator.firstName} ${educator.lastName}`}</a>
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
                {linkedChild && (
                  <Table.Row>
                    <Table.Cell>Linked child</Table.Cell>
                    <Table.Cell>
                      <NextLink passHref href={`/users/${linkedChild.id}`}>
                        <a>
                          {linkedChild?.firstName} {linkedChild?.lastName}
                        </a>
                      </NextLink>
                      <Button onClick={() => setShowPairChildModal(true)}>
                        Pair child
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )}
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

        {user?.role === UserRole.Educator && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Header style={{margin: 0}} as="h3">
                Students in {theClass?.name}
              </Header>
            </div>
            <UsersTable rows={students || []} auth={auth} />
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
