/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {UserFilters} from '../../users/actions/getUsers'
import {UserSelectField} from '../../users/components/userSelectField'
import {UserRole} from '../../users/model'
import {updateClass} from '../actions/updateClass'
import {Class} from '../model'

type FormData = {
  name: string
  schoolId: string
  educatorId: string
}

export const UpdateClassModal = ({
  class: theClass,
  onClose,
  onClassUpdated,
}: {
  class: Class
  onClose: () => any
  onClassUpdated?: (thClass: Class) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateClass({id: theClass.id, authToken: auth.token!, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result} = await action.execute(data)
    if (result && onClassUpdated) {
      await onClassUpdated(result)
    }
  }

  const userFilters: UserFilters = {
    schoolId: theClass.schoolId,
    role: UserRole.Educator,
  }

  return (
    <Modal
      onClose={onClose}
      header="Update class"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="name"
            label="Name"
            form={form}
            defaultValue={theClass.name}
          />
          <TextField
            required
            name="password"
            label="Password for children"
            form={form}
            defaultValue={theClass.password}
          />

          <UserSelectField
            required
            name="educatorId"
            label="Educator"
            form={form}
            filters={userFilters}
            defaultValue={theClass.educatorId}
          />

          <Button primary type="submit" fluid loading={action.isLoading}>
            Update class
          </Button>
        </Form>
      }
    />
  )
}
