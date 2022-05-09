/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {BookSelectField} from '../../books/components/bookSelectField'
import {Book} from '../../books/model'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {assignBookToSchool} from '../actions/assignBookToSchool'
import {SchoolSelectField} from './schoolSelectField'

type FormData = {
  bookId?: string
  schoolId?: string
}

export const AssignBookToSchoolModal = ({
  onClose,
  schoolId,
  bookId,
  onBookAssigned,
}: {
  onClose: () => any
  schoolId?: string
  bookId?: string
  onBookAssigned?: (book: Book) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return assignBookToSchool({
      authToken: auth.token!,
      data: {
        bookId: (bookId || data.bookId) as string,
        schoolId: (schoolId || data.schoolId) as string,
      },
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: book} = await action.execute(data)
    if (book && onBookAssigned) {
      await onBookAssigned(book)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="New book assignment"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          {!bookId && (
            <BookSelectField required name="bookId" label="Book" form={form} />
          )}
          {!schoolId && (
            <SchoolSelectField
              required
              name="schoolId"
              label="School"
              form={form}
            />
          )}
          <Button primary type="submit" fluid loading={action.isLoading}>
            Assign book
          </Button>
        </Form>
      }
    />
  )
}
