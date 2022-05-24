/* eslint-disable jsx-a11y/aria-role */
import {useState} from 'react'
import {Header} from 'semantic-ui-react'
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
import {AssignBookToClassModal} from '../../src/schools/components/assignBookToClassModal'
import {getClasses} from '../../src/classes/actions/getClasses'

const Books = ({auth}: {auth: Auth}) => {
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false)
  const [bookToUpdate, setBookToUpdate] = useState<Book | undefined>()
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>()
  const isAdmin = auth.user.role === UserRole.Admin
  const [showAssignBookModal, setShowAssignBookModal] = useState(false)

  const action = usePromise(() => {
    return getBooks({
      authToken: auth.token,
      filters: {
        schoolId: isAdmin ? undefined : auth.user.schoolId || undefined,
      },
    })
  }, [])

  const booksAssignedToSchool = action.result || []

  const getClassAction = usePromise(async () => {
    if (!auth.user.classId) return Promise.resolve(undefined)
    const [theClass] = await getClasses({
      authToken: auth.authSession.token,
      filters: {id: auth.user.classId},
    })
    return theClass
  }, [auth.user])

  const theClass = getClassAction.result

  const getBooksAction = usePromise(() => {
    if (!theClass?.bookId) return Promise.resolve([])
    return getBooks({
      authToken: auth.token,
      filters: {id: theClass?.bookId},
    })
  }, [theClass?.bookId])
  const [book] = getBooksAction.result || []

  return (
    <>
      {isCreateBookModalOpen && isAdmin && (
        <CreateBookModal
          onClose={() => setIsCreateBookModalOpen(false)}
          onBookCreated={async () => {
            setIsCreateBookModalOpen(false)
            await action.execute()
          }}
        />
      )}
      {bookToUpdate && isAdmin && (
        <UpdateBookModal
          book={bookToUpdate}
          onClose={() => setBookToUpdate(undefined)}
          onBookUpdated={async () => {
            setBookToUpdate(undefined)
            await action.execute()
          }}
        />
      )}
      {bookToDelete && isAdmin && (
        <DeleteBookModal
          book={bookToDelete}
          onClose={() => {
            setBookToDelete(undefined)
          }}
          onBookDeleted={async () => {
            setBookToDelete(undefined)
            await action.execute()
          }}
        />
      )}
      {showAssignBookModal && auth.user.schoolId && auth.user.classId && (
        <AssignBookToClassModal
          schoolId={auth.user.schoolId}
          classId={auth.user.classId}
          onClose={() => setShowAssignBookModal(false)}
          onBookAssigned={async () => {
            setShowAssignBookModal(false)
            await getClassAction.execute()
            await getBooksAction.execute()
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
          <div
            style={{display: 'flex', flexDirection: 'column', width: '100%'}}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Header as="h1">Library</Header>
              <Button onClick={() => setShowAssignBookModal(true)}>
                Assign new book for students
              </Button>
            </div>
            {auth.user.role === UserRole.Educator && (
              <p>The book currently assigned is: {book?.title}</p>
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
          onUpdateClick={(b) => setBookToUpdate(b)}
          onDeleteClick={(b) => setBookToDelete(b)}
          rows={booksAssignedToSchool}
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
