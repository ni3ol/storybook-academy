import {useAuth} from '../../auth/hooks'
import {Button} from '../../shared/components/button'
import {Message} from '../../shared/components/message'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {deleteUser} from '../actions/deleteUser'
import {User} from '../model'

export const DeleteUserModal = ({
  onClose,
  user,
  onUserDeleted,
}: {
  onClose: () => any
  user: User
  onUserDeleted?: () => any
}) => {
  const auth = useAuth()

  const action = usePromiseLazy(() => {
    return deleteUser({id: user.id, authToken: auth.expectAuthToken()})
  }, [])

  const handleDeleteUser = async () => {
    const {error} = await action.execute()
    if (!error && onUserDeleted) {
      onUserDeleted()
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Delete user"
      body={
        <>
          {action.error && <Message negative>{action.error.message}</Message>}
          <p>
            Are you sure you want to delete this user <b>{user.emailAddress}</b>
            ?
          </p>
          <Button
            fluid
            color="red"
            onClick={handleDeleteUser}
            loading={action.isLoading}
          >
            Delete user
          </Button>
        </>
      }
    />
  )
}
