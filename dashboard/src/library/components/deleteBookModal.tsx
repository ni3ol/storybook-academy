import {useAuth} from '../../auth/hooks'
import {Button} from '../../shared/components/button'
import {Message} from '../../shared/components/message'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {deleteBook} from '../actions/deleteBook'
import {Book} from '../model'

export const DeleteBookModal = ({
  onClose,
  book,
  onBookDeleted,
}: {
  onClose: () => any
  book: Book
  onBookDeleted?: () => any
}) => {
  const auth = useAuth()

  const action = usePromiseLazy(() => {
    return deleteBook({id: book.id, authToken: auth.expectAuthToken()})
  }, [])

  const handleDeleteBook = async () => {
    const {error} = await action.execute()
    if (!error && onBookDeleted) {
      onBookDeleted()
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Delete book"
      body={
        <>
          {action.error && <Message negative>{action.error.message}</Message>}
          <p>
            Are you sure you want to delete <b>{book.title}</b>?
          </p>
          <Button
            fluid
            color="red"
            onClick={handleDeleteBook}
            loading={action.isLoading}
          >
            Delete book
          </Button>
        </>
      }
    />
  )
}
