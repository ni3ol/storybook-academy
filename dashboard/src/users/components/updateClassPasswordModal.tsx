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
  password: string
}

export const UpdateClassPasswordModal = ({
  onClose,
  onClassPasswordUpdated,
  educatorId,
  password,
}: {
  educatorId: string
  password: string
  onClose: () => any
  onClassPasswordUpdated: (password: string) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    return {}
  }, [])

  const handleSubmit = async (data: FormData) => {
    onClassPasswordUpdated(data.password)
    return {}
  }

  return (
    <Modal
      onClose={onClose}
      header="Update class password"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="password"
            label="Password"
            defaultValue={password}
            form={form}
            helperText="This will update the password for all of your students"
          />

          <Button primary type="submit" fluid loading={action.isLoading}>
            Update class password
          </Button>
        </Form>
      }
    />
  )
}
