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
import {ClassesTable} from '../../src/classes/components/classesTable'
import {getClasses} from '../../src/classes/actions/getClasses'
import {CreateClassModal} from '../../src/classes/components/createClassModal'

const SchoolPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {schoolId} = router.query as {schoolId: string}
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAssignBookModal, setShowAssignBookModal] = useState(false)
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false)
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

  const getClassesAction = usePromise(() => {
    return getClasses({authToken: auth.token, filters: {schoolId}})
  }, [])

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

      {isCreateClassModalOpen && (
        <CreateClassModal
          onClose={() => setIsCreateClassModalOpen(false)}
          schoolId={schoolId}
          onClassCreated={() => {
            getClassesAction.execute()
            setIsCreateClassModalOpen(false)
          }}
        />
      )}

      <DashboardNavigation user={auth.user} />
      <Container>
        <div>
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
              <Table.Cell>Created at</Table.Cell>
              <Table.Cell>
                {school?.createdAt && formatDateSimple(school?.createdAt)}
              </Table.Cell>
            </Table.Row>
            {auth.user.role === UserRole.Administrator && (
              <>
                <Table.Row>
                  <Table.Cell>Subscribe</Table.Cell>
                  <Table.Cell>
                    <form
                      action="https://www.paypal.com/cgi-bin/webscr"
                      method="post"
                      target="_blank"
                    >
                      <input type="hidden" name="cmd" value="_s-xclick" />
                      <input
                        type="hidden"
                        name="hosted_button_id"
                        value="LQHVKZ25VHPXC"
                      />
                      <input
                        type="image"
                        src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif"
                        border="0"
                        name="submit"
                        alt="PayPal - The safer, easier way to pay online!"
                      />
                      <img
                        alt=""
                        border="0"
                        src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                        width="1"
                        height="1"
                      />
                    </form>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Unsubscribe</Table.Cell>
                  <Table.Cell>
                    <a
                      target="_blank"
                      href="https://www.paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=KYGRJRX9VFPUA"
                      rel="noreferrer"
                    >
                      <img
                        src="https://www.paypalobjects.com/en_US/i/btn/btn_unsubscribe_LG.gif"
                        border="0"
                      />
                    </a>
                  </Table.Cell>
                </Table.Row>
              </>
            )}
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
            Classes
          </Header>
          <Button onClick={() => setIsCreateClassModalOpen(true)} primary>
            New class
          </Button>
        </div>
        <ClassesTable
          auth={auth}
          onUpdateClick={() => {}}
          onDeleteClick={() => {}}
          rows={getClassesAction.result || []}
          basic
        />

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
      </Container>
    </>
  )
}

export default function SchoolPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        if (auth.user.role === UserRole.Educator) {
          router.push('/students')
          return
        }

        return <SchoolPage auth={auth} />
      }}
    />
  )
}
