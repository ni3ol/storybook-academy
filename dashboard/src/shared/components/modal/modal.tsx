import {Button, Header, Modal as SemanticModal} from 'semantic-ui-react'

export const Modal = ({
  isOpen,
  setOpen,
  header,
  icon,
  body,
  action,
  buttonText,
}: {
  isOpen: boolean
  setOpen: any
  header: string
  icon: string
  body: string
  action: any
  buttonText: string
}) => (
  <SemanticModal
    size="small"
    style={{height: 250, margin: 'auto', position: 'relative'}}
    closeIcon
    open={isOpen}
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
  >
    <Header icon={icon} content={header} />
    <SemanticModal.Content>{body}</SemanticModal.Content>
    <SemanticModal.Actions>
      <Button
        primary
        onClick={() => {
          action()
          setOpen(false)
        }}
      >
        {buttonText}
      </Button>
    </SemanticModal.Actions>
  </SemanticModal>
)
