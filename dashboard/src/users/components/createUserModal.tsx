/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {SchoolSelectField} from '../../schools/components/schoolSelectField'
import {
  EmailField,
  Form,
  PasswordField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {createUser} from '../actions/createUser'
import {User} from '../model'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
  schoolId?: string
}

export const CreateUserModal = ({
  onClose,
  schoolId,
  onUserCreated,
}: {
  onClose: () => any
  schoolId?: string
  onUserCreated?: (user: User) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return createUser({
      authToken: auth.token!,
      data: {...data, schoolId: schoolId || data.schoolId},
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: user} = await action.execute(data)
    if (user && onUserCreated) {
      await onUserCreated(user)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="New user"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField required name="firstName" label="First name" form={form} />
          <TextField required name="lastName" label="Last name" form={form} />
          <EmailField required name="emailAddress" label="Email" form={form} />
          {!schoolId && (
            <SchoolSelectField
              required
              name="schoolId"
              label="School"
              form={form}
            />
          )}
          <PasswordField
            required
            name="password"
            label="Password"
            form={form}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Create user
          </Button>
        </Form>
      }
    />
  )
}
