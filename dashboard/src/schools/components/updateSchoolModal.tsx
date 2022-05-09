/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateSchool} from '../actions/updateSchool'
import {School} from '../model'

type FormData = {
  name: string
}

export const UpdateSchoolModal = ({
  onClose,
  onSchoolUpdated,
  school,
}: {
  onClose: () => any
  onSchoolUpdated?: (school: School) => any
  school: School
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateSchool({id: school.id, authToken: auth.token!, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: school} = await action.execute(data)
    if (school && onSchoolUpdated) {
      await onSchoolUpdated(school)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Update School"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="name"
            label="Name"
            defaultValue={school.name}
            form={form}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update school
          </Button>
        </Form>
      }
    />
  )
}
