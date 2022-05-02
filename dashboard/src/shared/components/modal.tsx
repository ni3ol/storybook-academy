import {Modal as SemanticModal} from 'semantic-ui-react'

export const Modal = ({
  onClose,
  header,
  body,
}: {
  onClose: () => any
  header: any
  body: any
}) => {
  return (
    <SemanticModal size="small" closeIcon open onClose={() => onClose()}>
      <SemanticModal.Header>
        <div style={{textAlign: 'center'}}>{header}</div>
      </SemanticModal.Header>
      <SemanticModal.Content>{body}</SemanticModal.Content>
    </SemanticModal>
  )
}
