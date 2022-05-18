/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {BookSelectField} from '../../books/components/bookSelectField'
import {Book} from '../../books/model'
import {updateClass} from '../../classes/actions/updateClass'
import {Form} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'

type FormData = {
  bookId?: string
  classId?: string
  schoolId?: string
}

export const AssignBookToClassModal = ({
  onClose,
  bookId,
  classId,
  schoolId,
  onBookAssigned,
}: {
  onClose: () => any
  bookId?: string
  classId: string
  schoolId?: string
  onBookAssigned?: () => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateClass({
      authToken: auth.token!,
      id: classId,
      data: {
        bookId: (bookId || data.bookId) as string,
        classId: (classId || data.classId) as string,
      },
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: book} = await action.execute(data)
    if (book && onBookAssigned) {
      await onBookAssigned()
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="New book assignment"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          {!bookId && (
            <BookSelectField
              required
              name="bookId"
              label="Book"
              form={form}
              classId={classId}
              schoolId={schoolId}
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
