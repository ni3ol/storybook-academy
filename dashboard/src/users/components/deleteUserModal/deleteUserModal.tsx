import { Button, Form, Header, Icon, Image, Modal } from "semantic-ui-react";

export const DeleteUserModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) => (
  <Modal
    size="small"
    style={{ height: 250, margin: "auto", position: "relative" }}
    closeIcon={true}
    open={open}
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
  >
    <Header icon="user" content="Delete student" />
    <Modal.Content>Are you sure you would like to delete X?</Modal.Content>
    <Modal.Actions style={{ display: "flex", justifyContent: "space-between" }}>
      <Button color="red" onClick={() => setOpen(false)}>
        No
      </Button>
      <Button primary onClick={() => setOpen(false)}>
        Yes
      </Button>
    </Modal.Actions>
  </Modal>
);
