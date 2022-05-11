/* eslint-disable no-console */
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
import {createBook} from '../actions/createBook'
import {Book} from '../model'

type FormData = {
  title: string
  level: number
}

export const CreateBookModal = ({
  onClose,
  onBookCreated,
}: {
  onClose: () => any
  onBookCreated?: (book: Book) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return createBook({authToken: auth.token!, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: book} = await action.execute(data)
    if (book && onBookCreated) {
      await onBookCreated(book)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="New Book"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField required name="title" label="Title" form={form} />
          <NumberField required name="level" label="Level" form={form} />
          <FileUploadField
            required
            name="level-1"
            label="Level 1"
            form={form}
          />
          <FileUploadField name="level-2" label="Level 2" form={form} />
          <FileUploadField name="level-3" label="Level 3" form={form} />
          <FileUploadField name="level-4" label="Level 4" form={form} />
          <FileUploadField name="level-5" label="Level 5" form={form} />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Create book
          </Button>
        </Form>
      }
    />
  )
}
