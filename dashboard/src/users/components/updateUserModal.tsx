import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {
  EmailField,
  Form,
  PasswordField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateUser} from '../actions/updateUser'
import {User} from '../model'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
}

export const UpdateUserModal = ({
  onClose,
  onUserUpdated,
  user,
}: {
  user: User
  onClose: () => any
  onUserUpdated?: (user: User) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateUser({id: user.id, authToken: auth.token!, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: updatedUser} = await action.execute(data)
    if (updatedUser && onUserUpdated) {
      await onUserUpdated(updatedUser)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Update user"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="firstName"
            label="First name"
            value={user.firstName}
            form={form}
          />
          <TextField
            value={user.lastName}
            required
            name="lastName"
            label="Last name"
            form={form}
          />
          <EmailField
            required
            value={user.emailAddress}
            name="emailAddress"
            label="Email"
            form={form}
          />
          <PasswordField
            required
            name="password"
            label="Password"
            form={form}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update user
          </Button>
        </Form>
      }
    />
  )
}
