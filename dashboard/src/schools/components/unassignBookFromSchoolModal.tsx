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
import {unassignBookFromSchool} from '../actions/unassignBookFromSchool'
import {School} from '../model'
import {SchoolSelectField} from './schoolSelectField'

export const UnassignBookFromSchoolModal = ({
  onClose,
  school,
  book,
  onBookUnassigned,
}: {
  onClose: () => any
  school: School
  book: Book
  onBookUnassigned?: (book: Book) => any
}) => {
  // const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return unassignBookFromSchool({
      authToken: auth.token!,
      data: {
        bookId: book.id,
        schoolId: school.id,
      },
    })
  }, [])

  // const handleSubmit = async (data: FormData) => {
  //   const {result: book} = await action.execute(data)
  //   if (book && onBookUnassigned) {
  //     await onBookUnassigned(book)
  //   }
  // }

  return (
    <Modal
      onClose={onClose}
      header="Unassign book"
      body={
        <>
          <p>
            Are you sure you want to remove <b>{book?.title}</b> from{' '}
            {school?.name}'s library?
          </p>
          <Button primary type="submit" fluid loading={action.isLoading}>
            Unassign book
          </Button>
        </>
      }
    />
  )
}
