/* eslint-disable no-console */
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {assignChildToClass} from '../../users/actions/assignChildToClass'
import {UserSelectField} from '../../users/components/userSelectField'
import {User, UserRole} from '../../users/model'
import {updateClass} from '../actions/updateClass'
import {ClassSelectField} from './classSelectField'

type FormData = {
  linkedClassId: string
}

export const AssignLinkedClassToClassModal = ({
  onClose,
  classId,
  onLinkedClassAssigned,
}: {
  onClose: () => any
  classId: string
  onLinkedClassAssigned?: () => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(
    async (data: FormData) => {
      const result = updateClass({
        id: classId,
        data: {
          linkedClassId: data.linkedClassId,
        },
        authToken: auth.authSession!.token,
      })

      return result
    },
    [classId],
  )

  const handleSubmit = async (data: FormData) => {
    const {result: theClass} = await action.execute(data)
    if (theClass && onLinkedClassAssigned) {
      await onLinkedClassAssigned()
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Link a class"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <ClassSelectField
            required
            name="linkedClassId"
            label="Class"
            form={form}
            classId={classId}
          />

          <Button primary type="submit" fluid loading={action.isLoading}>
            Assign class
          </Button>
        </Form>
      }
    />
  )
}
