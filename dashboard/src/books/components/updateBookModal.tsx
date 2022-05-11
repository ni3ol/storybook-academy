import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {
  FileUploadField,
  Form,
  NumberField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateBook} from '../actions/updateBook'
import {Book} from '../model'

type FormData = {
  title: string
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
          <FileUploadField
            required
            name="level-1"
            label="Level 1"
            form={form}
            // defaultValue={book.level1Copy}
          />
          <FileUploadField
            name="level-2"
            label="Level 2"
            form={form}
            // defaultValue={book.level2Copy}
          />
          <FileUploadField
            name="level-3"
            label="Level 3"
            form={form}
            // defaultValue={book.level3Copy}
          />
          <FileUploadField
            name="level-4"
            label="Level 4"
            form={form}
            // defaultValue={book.level4Copy}
          />
          <FileUploadField
            name="level-5"
            label="Level 5"
            form={form}
            // defaultValue={book.level5Copy}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update book
          </Button>
        </Form>
      }
    />
  )
}
