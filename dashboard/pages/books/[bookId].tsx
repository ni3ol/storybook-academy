import {useRouter} from 'next/router'
import {useState} from 'react'
import {Dropdown, Table} from 'semantic-ui-react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {getBooks} from '../../src/books/actions/getBooks'
import {BookPreviewModal} from '../../src/books/components/bookPreviewModal'
import {DeleteBookModal} from '../../src/books/components/deleteBookModal'
import {UpdateBookModal} from '../../src/books/components/updateBookModal'
import {Book} from '../../src/books/model'
import {Button} from '../../src/shared/components/button'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {Header} from '../../src/shared/components/header'
import {usePromise} from '../../src/shared/hooks'
import {UserRole} from '../../src/users/model'

export type BookPreview = {
  title: string
  level: number
  fileName: string
  fileType: string
}

const BookPage = ({auth}: {auth: Auth}) => {
  const router = useRouter()
  const {bookId} = router.query as {bookId: string}
  const [bookToPreview, setBookToPreview] = useState<BookPreview | undefined>()
  const [bookToUpdate, setBookToUpdate] = useState<Book | undefined>()
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>()
  const isAdmin = auth.user.role === UserRole.Admin

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
      {bookToUpdate && isAdmin && (
        <UpdateBookModal
          book={bookToUpdate}
          onClose={() => setBookToUpdate(undefined)}
          onBookUpdated={() => {
            setBookToUpdate(undefined)
            getBookAction.execute()
          }}
        />
      )}
      {bookToDelete && isAdmin && (
        <DeleteBookModal
          book={bookToDelete}
          onClose={() => {
            setBookToDelete(undefined)
          }}
          onBookDeleted={() => {
            setBookToDelete(undefined)
            getBookAction.execute()
            router.push('/books')
          }}
        />
      )}
      {bookToPreview && (
        <BookPreviewModal
          authToken={auth.authSession.token}
          data={bookToPreview}
          onClose={() => setBookToPreview(undefined)}
        />
      )}
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div>
          <Header as="h1" style={{marginBottom: 20}}>
            Book - {book?.title}
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
            Reading levels
          </Header>
          <Dropdown text="Actions" floating basic>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setBookToUpdate(book)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setBookToDelete(book)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Table>
          <Table.Body>
            <Table.Row>
              {book?.level1Name && book.level1Type && (
                <Table.Cell>
                  <Button
                    onClick={() =>
                      setBookToPreview({
                        title: book.title,
                        fileName: book.level1Name,
                        fileType: book.level1Type,
                        level: 1,
                      })
                    }
                  >
                    Level 1
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
            <Table.Row>
              {book?.level2Name && book.level2Type && (
                <Table.Cell>
                  <Button
                    onClick={() =>
                      setBookToPreview({
                        title: book.title,
                        fileName: book.level2Name,
                        fileType: book.level2Type,
                        level: 2,
                      })
                    }
                  >
                    Level 2
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
            <Table.Row>
              {book?.level3Name && book.level3Type && (
                <Table.Cell>
                  <Button
                    onClick={() =>
                      setBookToPreview({
                        title: book.title,
                        fileName: book.level3Name,
                        fileType: book.level3Type,
                        level: 3,
                      })
                    }
                  >
                    Level 3
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
            <Table.Row>
              {book?.level4Name && book.level4Type && (
                <Table.Cell>
                  <Button
                    onClick={() =>
                      setBookToPreview({
                        title: book.title,
                        fileName: book.level4Name,
                        fileType: book.level4Type,
                        level: 4,
                      })
                    }
                  >
                    Level 4
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
            <Table.Row>
              {book?.level5Name && book.level5Type && (
                <Table.Cell>
                  <Button
                    onClick={() =>
                      setBookToPreview({
                        title: book.title,
                        fileName: book.level5Name,
                        fileType: book.level5Type,
                        level: 5,
                      })
                    }
                  >
                    Level 5
                  </Button>
                </Table.Cell>
              )}
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
