/* eslint-disable no-console */
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
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
import {getUsers} from '../actions/getUsers'
import {User, UserRole} from '../model'
import {animals, colors} from './createChildProfileForm'
import {readingLevels, roles} from './updateUserModal'

type FormData = {
  firstName: string
  lastName: string
  emailAddress: string
  role: UserRole
  // username: string
  age: number
  favouriteColor: string
  favouriteAnimal: string
  schoolId?: string
}

export const CreateUserModal = ({
  onClose,
  schoolId,
  onUserCreated,
  educatorId,
}: {
  onClose: () => any
  schoolId?: string
  onUserCreated?: (user: User) => any
  educatorId?: string
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return createUser({
      authToken: auth.authSession!.token,
      data: {
        ...data,
        schoolId: schoolId || data.schoolId,
        role: data.role || UserRole.Child,
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
          {!educatorId && (
            <SelectField
              required
              name="role"
              label="Role"
              options={roles}
              form={form}
            />
          )}
          <TextField required name="firstName" label="First name" form={form} />
          <TextField required name="lastName" label="Last name" form={form} />
          {!isChildRole && !educatorId && (
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

          {role !== UserRole.Admin && role !== UserRole.Principal && (
            <ClassSelectField
              name="classId"
              label="Class"
              form={form}
              filters={{schoolId: schoolIdValue || schoolId}}
            />
          )}

          {isChildRole ||
            (educatorId && (
              <>
                {!educatorId && (
                  <TextField
                    required
                    name="username"
                    label="Username"
                    form={form}
                  />
                )}

                <SelectField
                  required
                  name="readingLevel"
                  label="Reading level"
                  form={form}
                  options={readingLevels}
                />

                {!educatorId && (
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
          {!educatorId && role !== UserRole.Child && (
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
