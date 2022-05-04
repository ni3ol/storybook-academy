import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form, NumberField, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateBook} from '../actions/updateBook'
import {Book} from '../model'

type FormData = {
  title: string
  createdByUserId: string
  level: number
}

export const UpdateBookModal = ({
  onClose,
  onBookUpdated,
  book,
}: {
  book: Book
  onClose: () => any
  onBookUpdated?: (book: Book) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateBook({id: book.id, data, authToken: auth.token!})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: updatedBook} = await action.execute(data)
    if (updatedBook && onBookUpdated) {
      await onBookUpdated(updatedBook)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Update book"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="title"
            label="Title"
            form={form}
            defaultValue={book.title}
          />
          <NumberField
            required
            name="level"
            label="Level"
            form={form}
            defaultValue={book.level}
          />
          <TextField
            required
            name="createdByUserId"
            label="Created by"
            form={form}
            defaultValue={book.createdByUserId}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update book
          </Button>
        </Form>
      }
    />
  )
}
