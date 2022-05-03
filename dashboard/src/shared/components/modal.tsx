import {Modal as SemanticModal, ModalProps} from 'semantic-ui-react'

export const Modal = ({
  onClose,
  header,
  body,
  size,
}: {
  onClose: () => any
  header: any
  body: any
  size?: ModalProps['size']
}) => {
  return (
    <SemanticModal
      size={size || 'mini'}
      closeIcon
      open
      onClose={() => onClose()}
    >
      <SemanticModal.Header>
        <div style={{textAlign: 'center'}}>{header}</div>
      </SemanticModal.Header>
      <SemanticModal.Content>{body}</SemanticModal.Content>
    </SemanticModal>
  )
}
