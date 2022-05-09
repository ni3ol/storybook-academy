/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {createSchool} from '../actions/createSchool'
import {School} from '../model'

type FormData = {
  name: string
}

export const CreateSchoolModal = ({
  onClose,
  onSchoolCreated,
}: {
  onClose: () => any
  onSchoolCreated?: (school: School) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return createSchool({authToken: auth.token!, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: book} = await action.execute(data)
    if (book && onSchoolCreated) {
      await onSchoolCreated(book)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="New School"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField required name="name" label="Name" form={form} />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Create school
          </Button>
        </Form>
      }
    />
  )
}
