import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {Auth} from '../../auth/hooks'
import {updateClass} from '../../classes/actions/updateClass'
import {Form, TextField} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'

type FormData = {
  password: string
}

export const UpdateClassPasswordModal = ({
  onClose,
  onClassPasswordUpdated,
  password,
  classId,
  auth,
}: {
  classId: string
  password: string
  onClose: () => any
  onClassPasswordUpdated: () => any
  auth: Auth
}) => {
  const form = useForm<FormData>()

  const action = usePromiseLazy(async (data: FormData) => {
    return updateClass({id: classId, authToken: auth.token, data})
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result} = await action.execute(data)
    if (result && onClassPasswordUpdated) {
      await onClassPasswordUpdated()
    }
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
