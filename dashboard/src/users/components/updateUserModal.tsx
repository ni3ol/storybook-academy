import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {SchoolSelectField} from '../../schools/components/schoolSelectField'
import {
  EmailField,
  Form,
  NumberField,
  SelectField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromise, usePromiseLazy} from '../../shared/hooks'
import {getUsers} from '../actions/getUsers'
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
  profileCreated: boolean
  readingLevel: number
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

export const readingLevels = [
  {
    label: 'Level 1',
    value: 1,
  },
  {
    label: 'Level 2',
    value: 2,
  },
  {
    label: 'Level 3',
    value: 3,
  },
  {
    label: 'Level 4',
    value: 4,
  },
  {
    label: 'Level 5',
    value: 5,
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
    const isChildProfileCreated =
      data.age && data.favouriteAnimal && data.favouriteColor ? true : false
    const {result: updatedUser} = await action.execute({
      ...data,
      profileCreated: isChildProfileCreated,
    })
    if (updatedUser && onUserUpdated) {
      await onUserUpdated(updatedUser)
    }
  }

  const role: UserRole = form.watch('role')
  const isChildRole = (role || user.role) === UserRole.Child

  const [selectedSchool, setSelectedSchool] = useState<
    string | undefined | null
  >(user?.schoolId)

  const educatorsAction = usePromise(async () => {
    const result = await getUsers({
      authToken: auth.authSession?.token!,
      filters: {role: UserRole.Teacher},
    })

    return result
  }, [])

  const educators = educatorsAction.result || []

  const educatorOptions = educators
    .filter((educator) => educator.schoolId === selectedSchool)
    .map((educator) => ({
      label: `${educator.firstName} ${educator.lastName}`,
      value: educator.id,
    })) as any[]

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

          <SchoolSelectField
            required
            name="schoolId"
            label="School"
            form={form}
            defaultValue={user.schoolId}
            setSelectedSchool={(schoolId: string) =>
              setSelectedSchool(schoolId)
            }
          />

          {isChildRole && (
            <>
              <SelectField
                name="educatorId"
                label="Educator"
                form={form}
                defaultValue={user.educatorId}
                options={educatorOptions}
              />
              <SelectField
                name="readingLevel"
                label="Reading level"
                form={form}
                defaultValue={user.readingLevel}
                options={readingLevels}
              />
              <NumberField
                name="age"
                label="Age"
                defaultValue={user.age}
                form={form}
              />

              <SelectField
                name="favouriteColor"
                label="Favourite color"
                defaultValue={user.favouriteColor}
                form={form}
                options={colors}
              />

              <SelectField
                name="favouriteAnimal"
                label="Favourite animal"
                defaultValue={user.favouriteAnimal}
                form={form}
                options={animals}
              />
            </>
          )}
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update user
          </Button>
        </Form>
      }
    />
  )
}
