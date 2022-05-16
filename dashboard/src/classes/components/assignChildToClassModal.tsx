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
import {ClassSelectField} from './classSelectField'

type FormData = {
  childId: string
  classId: string
}

export const AssignChildToClassModal = ({
  onClose,
  childId,
  classId,
  schoolId,
  onChildAssigned: onChildAssigned,
}: {
  onClose: () => any
  childId?: string
  classId?: string
  schoolId: string
  onChildAssigned?: (child: User) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const action = usePromiseLazy(
    async (data: FormData) => {
      return assignChildToClass({
        data: {
          classId: data.classId || classId!,
          userId: data.childId || childId!,
        },
        authToken: auth.authSession!.token,
      })
    },
    [classId, childId],
  )

  const handleSubmit = async (data: FormData) => {
    const {result: child} = await action.execute(data)
    if (child && onChildAssigned) {
      await onChildAssigned(child)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Assign child to class"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          {!childId && (
            <UserSelectField
              required
              name="childId"
              label="Child"
              form={form}
              filters={{schoolId, role: UserRole.Child}}
            />
          )}
          {!classId && (
            <ClassSelectField
              required
              name="classId"
              label="Class"
              form={form}
              filters={{schoolId}}
            />
          )}
          <Button primary type="submit" fluid loading={action.isLoading}>
            Assign child
          </Button>
        </Form>
      }
    />
  )
}
