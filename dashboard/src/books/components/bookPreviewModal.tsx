import {BookPreview} from '../../../pages/books/[bookId]'
import {useAuth} from '../../auth/hooks'
import {Button} from '../../shared/components/button'
import {Message} from '../../shared/components/message'
import {Modal} from '../../shared/components/modal'
import {usePromise, usePromiseLazy} from '../../shared/hooks'
import {deleteBook} from '../actions/deleteBook'
import {downloadImageFromS3} from '../actions/downloadImageFromS3'
import {Book} from '../model'

export const BookPreviewModal = ({
  onClose,
  data,
  authToken,
}: {
  onClose: () => any
  data: BookPreview
  authToken: string
}) => {
  const getUrlAction = usePromise(async () => {
    const url = await downloadImageFromS3({
      authToken: authToken,
      fileName: data.fileName,
      fileType: data.fileType,
    })
    return url
  }, [])
  const url = getUrlAction.result

  return (
    <Modal
      size="fullscreen"
      onClose={onClose}
      header={`${data.title} - level ${data.level}`}
      body={
        <object
          data={url}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{height: '800px'}}
        >
          Not found
        </object>
      }
    />
  )
}
