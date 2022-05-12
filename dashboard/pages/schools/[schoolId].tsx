import {useRouter} from 'next/router'
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

const SchoolPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {schoolId} = router.query as {schoolId: string}
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAssignBookModal, setShowAssignBookModal] = useState(false)
  const [bookToUnassign, setBookToUnassign] = useState<Book | undefined>(
    undefined,
  )

  const getSchoolAction = usePromise(async () => {
    const [school] = await getSchools({
      authToken: auth.authSession.token,
      filters: {id: schoolId},
    })
    return school
  }, [])
  const school = getSchoolAction.result

  const getUsersAction = usePromise(() => {
    return getUsers({authToken: auth.token, filters: {schoolId}})
  }, [])
  const users = getUsersAction.result || []

  const getBooksAction = usePromise(() => {
    return getBooks({authToken: auth.token, filters: {schoolId}})
  }, [])
  const books = getBooksAction.result || []

  return (
    <>
      {showNewUserModal && (
        <CreateUserModal
          onClose={() => setShowNewUserModal(false)}
          schoolId={schoolId}
          onUserCreated={() => {
            getUsersAction.execute()
            setShowNewUserModal(false)
          }}
        />
      )}
      {showUpdateModal && (
        <UpdateSchoolModal
          onClose={() => setShowUpdateModal(false)}
          school={school}
          onSchoolUpdated={() => {
            getUsersAction.execute()
            getSchoolAction.execute()
            setShowUpdateModal(false)
          }}
        />
      )}
      {showAssignBookModal && (
        <AssignBookToSchoolModal
          schoolId={schoolId}
          onClose={() => setShowAssignBookModal(false)}
          onBookAssigned={() => {
            setShowAssignBookModal(false)
            getBooksAction.execute()
          }}
        />
      )}
      {bookToUnassign && school && (
        <UnassignBookFromSchoolModal
          school={school}
          book={bookToUnassign}
          onClose={() => setBookToUnassign(undefined)}
          onBookUnassigned={() => {
            setBookToUnassign(undefined)
            getBooksAction.execute()
          }}
        />
      )}

      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div>
          <NextLink passHref href={`/schools`}>
            Back
          </NextLink>
          <Header as="h1" style={{marginBottom: 20}}>
            School - {school?.name}
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
              <Table.Cell>{school?.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>ID (internal use only)</Table.Cell>
              <Table.Cell>{schoolId}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>
                {school?.createdAt && formatDateSimple(school?.createdAt)}
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
            Users
          </Header>
          <Button basic primary onClick={() => setShowNewUserModal(true)}>
            New user
          </Button>
        </div>
        <UsersTable auth={auth} rows={users} />
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
            Assign new book
          </Button>
        </div>
        <LibraryTable
          rows={books}
          unassign
          onDeleteClick={(row) => setBookToUnassign(row)}
        />
      </Container>
    </>
  )
}

export default function SchoolPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <SchoolPage auth={auth} />
      }}
    />
  )
}
