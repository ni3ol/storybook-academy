import router, {useRouter} from 'next/router'
import {useState} from 'react'
import NextLink from 'next/link'
import {Dropdown, Table} from 'semantic-ui-react'
import Link from 'next/link'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {getBooks} from '../../src/books/actions/getBooks'
import {getSchools} from '../../src/schools/actions/getSchools'
import {Button} from '../../src/shared/components/button'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {UsersTable} from '../../src/users/components/usersTable'
import {formatDateSimple} from '../../src/shared/utils'
import {User, UserRole} from '../../src/users/model'
import {getClasses} from '../../src/classes/actions/getClasses'
import {AssignChildToClassModal} from '../../src/classes/components/assignChildToClassModal'
import {UpdateClassModal} from '../../src/classes/components/updateClassModal'
import {AssignBookToClassModal} from '../../src/schools/components/assignBookToClassModal'
import {AssignLinkedClassToClassModal} from '../../src/classes/components/assignLinkedClassToClassModal'
import {DataTable} from '../../src/shared/components/dataTable'
import {PairChildModal} from '../../src/users/components/pairChildModal'

const TheClassPage = ({auth}: {auth: Auth}) => {
  const {classId} = router.query as {classId: string}
  const [showAssignChildModal, setShowAssignChildModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAssignBookModal, setShowAssignBookModal] = useState(false)
  const [showAssignLinkedClassModal, setShowAssignLinkedClassModal] =
    useState(false)
  const [childToPair, setChildToPair] = useState<User | undefined>()

  const getClassAction = usePromise(async () => {
    if (!classId) return Promise.resolve(undefined)
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: classId},
    })
    return theClass
  }, [classId])

  const theClass = getClassAction.result

  const getLinkedClassAction = usePromise(async () => {
    if (!theClass?.linkedClassId) return Promise.resolve(undefined)
    const [linkedClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: theClass.linkedClassId},
    })
    return linkedClass
  }, [theClass])

  const linkedClass = getLinkedClassAction.result

  const getLinkedClassUsersAction = usePromise(async () => {
    if (!theClass?.linkedClassId) return Promise.resolve(undefined)

    return getUsers({
      authToken: auth.token,
      filters: {classId: theClass?.linkedClassId},
    })
  }, [theClass?.linkedClassId])

  const linkedClassUsers = getLinkedClassUsersAction.result || []

  const getClassUsersAction = usePromise(() => {
    return getUsers({authToken: auth.token, filters: {classId}})
  }, [theClass, classId])
  const classUsers = getClassUsersAction.result || []

  const educator = classUsers.find((user) => user.id === theClass?.educatorId)

  const linkedEducator = linkedClassUsers.find(
    (user) => user.id === linkedClass?.educatorId,
  )
  const students = classUsers.filter(
    (user) => user.classId === theClass?.id && user.role === UserRole.Child,
  )

  const getBooksAction = usePromise(() => {
    if (!theClass?.bookId) return Promise.resolve([])
    return getBooks({
      authToken: auth.token,
      filters: {id: theClass?.bookId},
    })
  }, [theClass?.bookId])
  const [book] = getBooksAction.result || []

  const getSchoolsAction = usePromise(async () => {
    const [school] = await getSchools({
      authToken: auth.authSession.token,
      filters: {id: theClass?.schoolId},
    })
    return school
  }, [])
  const school = getSchoolsAction.result

  const getLinkedSchoolsAction = usePromise(async () => {
    const [linkedSchool] = await getSchools({
      authToken: auth.authSession.token,
      filters: {id: linkedClass?.schoolId},
    })
    return linkedSchool
  }, [])
  const linkedSchool = getLinkedSchoolsAction.result

  return (
    <>
      {theClass && showAssignChildModal && (
        <AssignChildToClassModal
          onClose={() => setShowAssignChildModal(false)}
          classId={classId}
          schoolId={theClass.schoolId}
          onChildAssigned={() => {
            getClassAction.execute()
            getClassUsersAction.execute()
            setShowAssignChildModal(false)
          }}
        />
      )}
      {showUpdateModal && (
        <UpdateClassModal
          onClose={() => setShowUpdateModal(false)}
          class={theClass!}
          onClassUpdated={() => {
            getClassAction.execute()
            setShowUpdateModal(false)
          }}
        />
      )}
      {showAssignBookModal && theClass && (
        <AssignBookToClassModal
          schoolId={theClass.schoolId}
          classId={theClass.id}
          onClose={() => setShowAssignBookModal(false)}
          onBookAssigned={() => {
            setShowAssignBookModal(false)
            getClassAction.execute()
            getBooksAction.execute()
          }}
        />
      )}

      {showAssignLinkedClassModal && theClass && (
        <AssignLinkedClassToClassModal
          schoolId={theClass.schoolId}
          classId={theClass.id}
          onClose={() => setShowAssignLinkedClassModal(false)}
          onLinkedClassAssigned={() => {
            setShowAssignLinkedClassModal(false)
            getClassAction.execute()
            getBooksAction.execute()
            getLinkedClassAction.execute()
          }}
        />
      )}
      {childToPair && theClass?.linkedClassId && (
        <PairChildModal
          childId={childToPair.id}
          linkedClassId={theClass.linkedClassId}
          onClose={() => {
            setChildToPair(undefined)
          }}
          onChildPaired={() => {
            setChildToPair(undefined)
            getClassUsersAction.execute()
          }}
        />
      )}

      <DashboardNavigation user={auth.user} />
      <Container>
        <div>
          <Header as="h1" style={{marginBottom: 20}}>
            Class - {theClass?.name}
          </Header>
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
              <Dropdown.Item onClick={() => setShowUpdateModal(true)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>{theClass?.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>
                {theClass?.createdAt && formatDateSimple(theClass?.createdAt)}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>School</Table.Cell>
              <Table.Cell>
                {school && (
                  <NextLink passHref href={`/schools/${school?.id}`}>
                    {school?.name}
                  </NextLink>
                )}
              </Table.Cell>
            </Table.Row>
            {educator && (
              <Table.Row>
                <Table.Cell>Educator</Table.Cell>
                <Table.Cell>
                  <NextLink passHref href={`/users/${educator?.id}`}>
                    {`${educator?.firstName} ${educator?.lastName}`}
                  </NextLink>
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell>Class password</Table.Cell>
              <Table.Cell>{theClass?.password}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Paired school</Table.Cell>
              <Table.Cell>
                {theClass?.linkedClassId ? (
                  <Table definition>
                    <Table.Row>
                      <Table.Cell>School</Table.Cell>
                      <Table.Cell>
                        {linkedSchool && (
                          <NextLink
                            passHref
                            href={`/schools/${linkedSchool?.id}`}
                          >
                            {linkedSchool?.name}
                          </NextLink>
                        )}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Class name</Table.Cell>
                      <Table.Cell>
                        {linkedClass && (
                          <NextLink
                            passHref
                            href={`/classes/${linkedClass?.id}`}
                          >
                            {linkedClass?.name}
                          </NextLink>
                        )}
                      </Table.Cell>
                    </Table.Row>
                    {linkedEducator && (
                      <Table.Row>
                        <Table.Cell>Educator</Table.Cell>
                        <Table.Cell>
                          <NextLink
                            passHref
                            href={`/users/${linkedEducator?.id}`}
                          >
                            {`${linkedEducator?.firstName} ${linkedEducator?.lastName}`}
                          </NextLink>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table>
                ) : (
                  <Button onClick={() => setShowAssignLinkedClassModal(true)}>
                    Pair a class
                  </Button>
                )}
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
            Books
          </Header>
          <Button basic primary onClick={() => setShowAssignBookModal(true)}>
            Assign new reading
          </Button>
        </div>
        {book ? (
          <p style={{fontSize: 16}}>
            The current book is{' '}
            <NextLink passHref href={`/books/${book.id}`}>
              <a>{book.title}</a>
            </NextLink>
          </p>
        ) : (
          <p style={{fontSize: 16}}>
            No book is currently assigned for this class
          </p>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Header style={{margin: 0}} as="h3">
            Children
          </Header>

          <Button basic primary onClick={() => setShowAssignChildModal(true)}>
            Add child to class
          </Button>
        </div>
        <DataTable
          rows={students}
          headers={[
            {
              key: 'name',
              title: 'Name',
              resolve: (user) => {
                return (
                  <NextLink passHref href={`/users/${user.id}`}>
                    <a>
                      {user.firstName} {user.lastName}
                    </a>
                  </NextLink>
                )
              },
            },
            {
              key: 'username',
              title: 'Username',
              resolve: (user: User) => user.username,
            },
            {
              key: 'readingLevel',
              title: 'Reading level',
              resolve: (user: User) => user.readingLevel,
            },
            {
              key: 'pairedChild',
              title: 'Paired child',
              resolve: (user: User) => {
                const linkedChild = linkedClassUsers.find(
                  (u) => u.id === user.linkedChildId,
                )
                return (
                  <div>
                    {user.linkedChildId && linkedChild ? (
                      <Link passHref href={`/users/${linkedChild?.id}`}>
                        <a>
                          {linkedChild?.firstName} {linkedChild?.lastName} (
                          {linkedChild?.username})
                        </a>
                      </Link>
                    ) : (
                      <span>None</span>
                    )}
                  </div>
                )
              },
            },
            {
              key: 'actions',
              title: 'Actions',
              resolve: (user: User) =>
                theClass?.linkedClassId && (
                  <Button onClick={() => setChildToPair(user)}>
                    Pair child
                  </Button>
                ),
            },
          ]}
        />
      </Container>
    </>
  )
}

export default function ClassPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        if (auth.user.role === UserRole.Educator) {
          router.push('/students')
          return
        }

        return <TheClassPage auth={auth} />
      }}
    />
  )
}
