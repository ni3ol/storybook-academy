/* eslint-disable jsx-a11y/aria-role */
import {RequireAuth} from '../src/auth/components/requireAuth'
import {DashboardNavigation} from '../src/shared/components/dashboardNavigation/dashboardNavigation'
import {LibraryTable} from '../src/library/components/libraryTable'
import {Header} from '../src/shared/components/header'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Auth} from '../src/auth/hooks'
import {useState} from 'react'
import {usePromise} from '../src/shared/hooks'
import {getBooks} from '../src/library/actions/getBooks'
import {CreateBookModal} from '../src/library/components/createBookModal'
import {Book} from '../src/library/model'
import {UpdateBookModal} from '../src/library/components/updateBookModal'
import {DeleteBookModal} from '../src/library/components/deleteBookModal'

const Library = ({auth}: {auth: Auth}) => {
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false)
  const [bookToUpdate, setBookToUpdate] = useState<Book | undefined>()
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>()

  const action = usePromise(() => {
    return getBooks({authToken: auth.token})
  }, [])

  return (
    <>
      {isCreateBookModalOpen && (
        <CreateBookModal
          onClose={() => setIsCreateBookModalOpen(false)}
          onBookCreated={() => {
            setIsCreateBookModalOpen(false)
            action.execute()
          }}
        />
      )}
      {bookToUpdate && (
        <UpdateBookModal
          book={bookToUpdate}
          onClose={() => setBookToUpdate(undefined)}
          onBookUpdated={() => {
            setBookToUpdate(undefined)
            action.execute()
          }}
        />
      )}
      {bookToDelete && (
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
          <Header as="h1">Library</Header>
          <Button onClick={() => setIsCreateBookModalOpen(true)} primary>
            Add book
          </Button>
        </div>
        <LibraryTable
          onUpdateClick={(book) => setBookToUpdate(book)}
          onDeleteClick={(book) => setBookToDelete(book)}
          rows={action.result || []}
        />
      </Container>
    </>
  )
}

export default function LibraryPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Library auth={auth} />
      }}
    />
  )
}
