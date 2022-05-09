/* eslint-disable no-console */
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {SchoolSelectField} from '../../schools/components/schoolSelectField'
import {
  EmailField,
  Form,
  NumberField,
  PasswordField,
  SelectField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {createUser} from '../actions/createUser'
import {User, UserRole} from '../model'
import {animals, colors} from './createChildProfileForm'
import {roles} from './updateUserModal'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
  role: UserRole
  username: string
  age: number
  favouriteColor: string
  favouriteAnimal: string
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

  const role: UserRole = form.watch('role')
  const isChildRole = role === UserRole.Child

  useEffect(() => {
    form.reset()
    form.reset({role})
    action.clearError()
  }, [role])

  return (
    <Modal
      onClose={onClose}
      header="New user"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <SelectField
            required
            name="role"
            label="Role"
            options={roles}
            form={form}
          />
          <TextField required name="firstName" label="First name" form={form} />
          <TextField required name="lastName" label="Last name" form={form} />
          {!isChildRole && (
            <EmailField
              required
              name="emailAddress"
              label="Email"
              form={form}
            />
          )}
          {!schoolId && (
            <SchoolSelectField
              required
              name="schoolId"
              label="School"
              form={form}
            />
          )}
          {isChildRole && (
            <TextField required name="username" label="Username" form={form} />
          )}
          {isChildRole && <NumberField name="age" label="Age" form={form} />}
          {isChildRole && (
            <SelectField
              name="favouriteColor"
              label="Favourite color"
              form={form}
              options={colors}
            />
          )}
          {isChildRole && (
            <SelectField
              name="favouriteAnimal"
              label="Favourite animal"
              form={form}
              options={animals}
            />
          )}
          <PasswordField
            required={!isChildRole}
            name="password"
            disabled={isChildRole}
            label="Password"
            form={form}
            helpText="Password will be assigned on a class level"
            showHelpText={isChildRole}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Create user
          </Button>
        </Form>
      }
    />
  )
}
