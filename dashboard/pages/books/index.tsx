/* eslint-disable jsx-a11y/aria-role */
import {useState} from 'react'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {LibraryTable} from '../../src/books/components/libraryTable'
import {Button} from '../../src/shared/components/button'
import {Container} from '../../src/shared/components/container'
import {Auth} from '../../src/auth/hooks'
import {usePromise} from '../../src/shared/hooks'
import {getBooks} from '../../src/books/actions/getBooks'
import {CreateBookModal} from '../../src/books/components/createBookModal'
import {Book} from '../../src/books/model'
import {UpdateBookModal} from '../../src/books/components/updateBookModal'
import {DeleteBookModal} from '../../src/books/components/deleteBookModal'
import {UserRole} from '../../src/users/model'
import {Header} from 'semantic-ui-react'

const Books = ({auth}: {auth: Auth}) => {
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false)
  const [bookToUpdate, setBookToUpdate] = useState<Book | undefined>()
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>()
  const isAdmin = auth.user.role === UserRole.Admin

  const action = usePromise(() => {
    return getBooks({
      authToken: auth.token,
      filters: {
        schoolId: isAdmin ? undefined : auth.user.schoolId || undefined,
      },
    })
  }, [])

  const currentReading = (action.result || [])[0]

  return (
    <>
      {isCreateBookModalOpen && isAdmin && (
        <CreateBookModal
          onClose={() => setIsCreateBookModalOpen(false)}
          onBookCreated={() => {
            setIsCreateBookModalOpen(false)
            action.execute()
          }}
        />
      )}
      {bookToUpdate && isAdmin && (
        <UpdateBookModal
          book={bookToUpdate}
          onClose={() => setBookToUpdate(undefined)}
          onBookUpdated={() => {
            setBookToUpdate(undefined)
            action.execute()
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
            action.execute()
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
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Header as="h1">Library</Header>
            {auth.user.role === UserRole.Teacher && (
              <p>
                Currently assigned reading: {currentReading?.title} (Backend
                needed)
              </p>
            )}
          </div>
          {isAdmin && (
            <Button onClick={() => setIsCreateBookModalOpen(true)} primary>
              New book
            </Button>
          )}
        </div>
        <LibraryTable
          auth={auth}
          onUpdateClick={(book) => setBookToUpdate(book)}
          onDeleteClick={(book) => setBookToDelete(book)}
          rows={action.result || []}
        />
      </Container>
    </>
  )
}

export default function BooksPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Books auth={auth} />
      }}
    />
  )
}
