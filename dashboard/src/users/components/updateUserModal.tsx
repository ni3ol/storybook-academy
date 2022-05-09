import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {
  EmailField,
  Form,
  NumberField,
  SelectField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateUser} from '../actions/updateUser'
import {User, UserRole} from '../model'
import {animals, colors} from './createChildProfileForm'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
  role: UserRole
  username: string
  age: number
  favouriteColor: string
  favouriteAnimal: string
}

export const roles = [
  {
    label: 'Child',
    value: UserRole.Child,
  },
  {
    label: 'Teacher',
    value: UserRole.Teacher,
  },
  {
    label: 'Principal',
    value: UserRole.Principal,
  },
  {
    label: 'Admin',
    value: UserRole.Admin,
  },
]

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
    return updateUser({id: user.id, data, authToken: auth.token!})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: updatedUser} = await action.execute(data)
    if (updatedUser && onUserUpdated) {
      await onUserUpdated(updatedUser)
    }
  }

  const role: UserRole = form.watch('role')
  const isChildRole = (role || user.role) === UserRole.Child

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
            defaultValue={user.firstName}
            form={form}
          />
          <TextField
            required
            name="lastName"
            label="Last name"
            defaultValue={user.lastName}
            form={form}
          />
          {!isChildRole && (
            <EmailField
              required
              name="emailAddress"
              label="Email"
              defaultValue={user.emailAddress}
              form={form}
            />
          )}
          {isChildRole && (
            <TextField
              required
              name="username"
              label="Username"
              defaultValue={user.username}
              form={form}
            />
          )}
          <SelectField
            required
            disabled={auth.user?.role === UserRole.Admin}
            name="role"
            label="Role"
            defaultValue={user.role}
            options={roles}
            form={form}
          />

          {isChildRole && (
            <NumberField
              name="age"
              label="Age"
              defaultValue={user.age}
              form={form}
            />
          )}
          {isChildRole && (
            <SelectField
              name="favouriteColor"
              label="Favourite color"
              defaultValue={user.favouriteColor}
              form={form}
              options={colors}
            />
          )}
          {isChildRole && (
            <SelectField
              name="favouriteAnimal"
              label="Favourite animal"
              defaultValue={user.favouriteAnimal}
              form={form}
              options={animals}
            />
          )}
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update user
          </Button>
        </Form>
      }
    />
  )
}
