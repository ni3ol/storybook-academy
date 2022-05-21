import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {Form} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {pairChildren} from '../actions/pairChildren'
import {UserRole} from '../model'
import {UserSelectField} from './userSelectField'

type FormData = {
  pairedChildId: string
}

export const PairChildModal = ({
  onClose,
  childId,
  linkedClassId,
  onChildPaired,
}: {
  onClose: () => any
  childId: string
  linkedClassId: string
  onChildPaired: () => any
}) => {
  const form = useForm<FormData>()
  const {expectAuthToken} = useAuth()

  const action = usePromiseLazy(async (data: FormData) => {
    await pairChildren({
      data: {child1Id: childId, child2Id: data.pairedChildId},
      authToken: expectAuthToken(),
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {error} = await action.execute(data)
    if (!error) {
      await onChildPaired()
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Pair child with buddy"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <UserSelectField
            required
            name="pairedChildId"
            label="Buddy"
            form={form}
            filters={{
              classId: linkedClassId,
              role: UserRole.Child,
              notId: childId,
            }}
          />

          <Button primary type="submit" fluid loading={action.isLoading}>
            Pair children
          </Button>
        </Form>
      }
    />
  )
}
