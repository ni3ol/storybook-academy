/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {SchoolSelectField} from '../../schools/components/schoolSelectField'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {UserFilters} from '../../users/actions/getUsers'
import {UserSelectField} from '../../users/components/userSelectField'
import {UserRole} from '../../users/model'
import {createClass} from '../actions/createClass'
import {Class} from '../model'

type FormData = {
  name: string
  schoolId: string
  educatorId: string
}

export const CreateClassModal = ({
  schoolId,
  onClose,
  onClassCreated,
}: {
  schoolId?: string
  onClose: () => any
  onClassCreated?: (thClass: Class) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return createClass({
      authToken: auth.token!,
      data: {...data, schoolId: schoolId || data.schoolId},
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: theClass} = await action.execute(data)
    if (theClass && onClassCreated) {
      await onClassCreated(theClass)
    }
  }

  const userFilters: UserFilters = {
    schoolId: form.watch('schoolId') || schoolId,
    role: UserRole.Teacher,
  }

  return (
    <Modal
      onClose={onClose}
      header="New class"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField required name="name" label="Name" form={form} />
          <TextField
            required
            name="password"
            label="Password for children"
            form={form}
          />

          {!schoolId && (
            <SchoolSelectField
              required
              name="schoolId"
              label="School"
              form={form}
            />
          )}

          <UserSelectField
            required
            name="educatorId"
            label="Educator"
            form={form}
            filters={userFilters}
          />

          <Button primary type="submit" fluid loading={action.isLoading}>
            Create class
          </Button>
        </Form>
      }
    />
  )
}
