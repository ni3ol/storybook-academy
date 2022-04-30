import {Button, Header, Modal} from 'semantic-ui-react'

export const UpdateUserModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: any
}) => (
  <Modal
    size="small"
    style={{height: 250, margin: 'auto', position: 'relative'}}
    closeIcon
    open={open}
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
  >
    <Header icon="user" content="Update student" />
    <Modal.Content>Form to go here</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={() => setOpen(false)}>
        Save
      </Button>
    </Modal.Actions>
  </Modal>
)
