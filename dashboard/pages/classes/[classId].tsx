import router, {useRouter} from 'next/router'
import {useState} from 'react'
import NextLink from 'next/link'
import {Dropdown, Icon, Table} from 'semantic-ui-react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {getBooks} from '../../src/books/actions/getBooks'
import {LibraryTable} from '../../src/books/components/libraryTable'
import {getSchools} from '../../src/schools/actions/getSchools'
import {UpdateSchoolModal} from '../../src/schools/components/updateSchoolModal'
import {AssignBookToSchoolModal} from '../../src/schools/components/assignBookToSchoolModal'
import {Button} from '../../src/shared/components/button'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {getUsers} from '../../src/users/actions/getUsers'
import {CreateUserModal} from '../../src/users/components/createUserModal'
import {UsersTable} from '../../src/users/components/usersTable'
import {Book} from '../../src/books/model'
import {UnassignBookFromSchoolModal} from '../../src/schools/components/unassignBookFromSchoolModal'
import {formatDateSimple} from '../../src/shared/utils'
import {UserRole} from '../../src/users/model'
import {getClasses} from '../../src/classes/actions/getClasses'
import {AssignChildToClassModal} from '../../src/classes/components/assignChildToClassModal'
import {UpdateClassModal} from '../../src/classes/components/updateClassModal'
import {AssignBookToClassModal} from '../../src/schools/components/assignBookToClassModal'
import {AssignLinkedClassToClassModal} from '../../src/classes/components/assignLinkedClassToClassModal'

const TheClassPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {classId} = router.query as {classId: string}
  const [showAssignChildModal, setShowAssignChildModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAssignBookModal, setShowAssignBookModal] = useState(false)
  const [showAssignLinkedClassModal, setShowAssignLinkedClassModal] =
    useState(false)

  const getClassAction = usePromise(async () => {
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: classId},
    })
    return theClass
  }, [])
  const theClass = getClassAction.result

  const getLinkedClassAction = usePromise(async () => {
    const [linkedClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: theClass?.linkedClassId!},
    })
    return linkedClass
  }, [theClass])
  const linkedClass = getLinkedClassAction.result

  const getUsersAction = usePromise(() => {
    return getUsers({authToken: auth.token})
  }, [])
  const users = getUsersAction.result || []

  const educator = users.find((user) => user.id === theClass?.educatorId)
  const linkedEducator = users.find(
    (user) => user.id === linkedClass?.educatorId,
  )
  const students = users.filter(
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
    return await getSchools({
      authToken: auth.authSession.token,
    })
  }, [])
  const school = getSchoolsAction.result?.find(
    (school) => school.id === theClass?.schoolId,
  )

  const linkedSchool = getSchoolsAction.result?.find(
    (school) => school.id === linkedClass?.schoolId,
  )

  return (
    <>
      {theClass && showAssignChildModal && (
        <AssignChildToClassModal
          onClose={() => setShowAssignChildModal(false)}
          classId={classId}
          schoolId={theClass.schoolId}
          onChildAssigned={() => {
            getClassAction.execute()
            getUsersAction.execute()
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
      {showAssignBookModal && (
        <AssignBookToClassModal
          schoolId={theClass?.schoolId}
          classId={theClass?.id!}
          onClose={() => setShowAssignBookModal(false)}
          onBookAssigned={() => {
            setShowAssignBookModal(false)
            getClassAction.execute()
            getBooksAction.execute()
          }}
        />
      )}

      {showAssignLinkedClassModal && (
        <AssignLinkedClassToClassModal
          schoolId={theClass?.schoolId!}
          classId={theClass?.id!}
          onClose={() => setShowAssignLinkedClassModal(false)}
          onLinkedClassAssigned={() => {
            setShowAssignLinkedClassModal(false)
            getClassAction.execute()
            getBooksAction.execute()
            getLinkedClassAction.execute()
          }}
        />
      )}

      <DashboardNavigation role={auth.user.role} />
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
            <Table.Row>
              <Table.Cell>Teacher</Table.Cell>
              <Table.Cell>
                <NextLink passHref href={`/users/${educator?.id}`}>
                  {educator?.firstName + ' ' + educator?.lastName}
                </NextLink>
              </Table.Cell>
            </Table.Row>
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
                    <Table.Row>
                      <Table.Cell>Teacher</Table.Cell>
                      <Table.Cell>
                        <NextLink
                          passHref
                          href={`/users/${linkedEducator?.id}`}
                        >
                          {linkedEducator?.firstName +
                            ' ' +
                            linkedEducator?.lastName}
                        </NextLink>
                      </Table.Cell>
                    </Table.Row>
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
          <p>the current book is {book?.title}</p>
        ) : (
          <p>No book is currently assigned for this class</p>
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
        <UsersTable auth={auth} rows={students} />
      </Container>
    </>
  )
}

export default function ClassPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        if (auth.user.role !== UserRole.Admin) {
          router.push('/students')
          return
        }

        return <TheClassPage auth={auth} />
      }}
    />
  )
}
