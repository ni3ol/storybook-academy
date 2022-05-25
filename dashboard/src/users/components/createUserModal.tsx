/* eslint-disable no-console */
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {Auth} from '../../auth/hooks'
import {ClassSelectField} from '../../classes/components/classSelectField'
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
import {adminRole, readingLevels, roles} from './updateUserModal'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
  role: UserRole
  age: number
  favouriteColor: string
  favouriteAnimal: string
  schoolId?: string
  classId?: string
}

export const CreateUserModal = ({
  onClose,
  schoolId,
  onUserCreated,
  classId,
  auth,
}: {
  onClose: () => any
  schoolId?: string
  onUserCreated?: (user: User) => any
  classId?: string
  auth: Auth
}) => {
  const form = useForm<FormData>()

  const action = usePromiseLazy(async (data: FormData) => {
    return createUser({
      authToken: auth.token,
      data: {
        ...data,
        schoolId: schoolId || data.schoolId,
        role: data.role || UserRole.Child,
        classId: classId || data.classId,
      },
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

  const schoolIdValue = form.watch('schoolId')
  const isEducator = auth?.user?.role === UserRole.Educator

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
          {!isEducator && (
            <SelectField
              required
              name="role"
              label="Role"
              options={
                auth?.user?.role === UserRole.Admin
                  ? [...roles, adminRole]
                  : roles
              }
              form={form}
            />
          )}
          <TextField required name="firstName" label="First name" form={form} />
          <TextField required name="lastName" label="Last name" form={form} />
          {!isChildRole && !isEducator && (
            <EmailField
              required
              name="emailAddress"
              label="Email"
              form={form}
            />
          )}
          {!schoolId && role !== UserRole.Admin && (
            <SchoolSelectField
              required
              name="schoolId"
              label="School"
              form={form}
            />
          )}

          {role === UserRole.Child && (
            <ClassSelectField
              name="classId"
              label="Class"
              form={form}
              filters={{schoolId: schoolIdValue || schoolId}}
            />
          )}

          {isChildRole ||
            (auth?.user.role === UserRole.Educator && (
              <SelectField
                name="readingLevel"
                label="Reading level"
                form={form}
                options={readingLevels}
              />
            ))}

          {isChildRole ||
            (isEducator && (
              <>
                {!isEducator && (
                  <TextField
                    required
                    name="username"
                    label="Username"
                    form={form}
                  />
                )}

                {!isEducator && (
                  <>
                    <NumberField name="age" label="Age" form={form} />

                    <SelectField
                      name="favouriteColor"
                      label="Favourite color"
                      form={form}
                      options={colors}
                    />

                    <SelectField
                      name="favouriteAnimal"
                      label="Favourite animal"
                      form={form}
                      options={animals}
                    />
                  </>
                )}
              </>
            ))}
          {!isEducator && role !== UserRole.Child && (
            <PasswordField
              required
              name="password"
              label="Password"
              form={form}
            />
          )}
          <Button primary type="submit" fluid loading={action.isLoading}>
            Create user
          </Button>
        </Form>
      }
    />
  )
}
