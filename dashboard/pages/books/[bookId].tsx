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

const BookPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {bookId} = router.query as {bookId: string}

  const getBookAction = usePromise(async () => {
    const [book] = await getBooks({
      authToken: auth.authSession.token,
      filters: {id: bookId},
    })
    return book
  }, [])
  const book = getBookAction.result

  return (
    <>
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div>
          <Header as="h1" style={{marginBottom: 20}}>
            Book - {book?.title}
          </Header>
        </div>
        <Header as="h3">Reading levels</Header>
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Level 1</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Level 2</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Level 3</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Level 4</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Level 5</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {/*    <div
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
        /> */}
      </Container>
    </>
  )
}

export default function BookPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <BookPage auth={auth} />
      }}
    />
  )
}
