import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {Button} from 'semantic-ui-react'
import {useAuth} from '../../auth/hooks'
import {
  FileUploadField,
  Form,
  NumberField,
  TextField,
} from '../../shared/components/form'
import {Modal} from '../../shared/components/modal'
import {usePromiseLazy} from '../../shared/hooks'
import {updateBook} from '../actions/updateBook'
import {uploadImageToS3} from '../actions/uploadImageToS3'
import {Book} from '../model'

type FormData = {
  title: string
}

export const UpdateBookModal = ({
  onClose,
  onBookUpdated,
  book,
}: {
  book: Book
  onClose: () => any
  onBookUpdated?: (book: Book) => any
}) => {
  const form = useForm<FormData>()
  const {auth} = useAuth()

  const [level1File, setLevel1File] = useState<File>()
  const handleLevel1FileInput = (e: any) => setLevel1File(e.target.files[0])

  const [level2File, setLevel2File] = useState<File>()
  const handleLevel2FileInput = (e: any) => setLevel2File(e.target.files[0])

  const [level3File, setLevel3File] = useState<File>()
  const handleLevel3FileInput = (e: any) => setLevel3File(e.target.files[0])

  const [level4File, setLevel4File] = useState<File>()
  const handleLevel4FileInput = (e: any) => setLevel4File(e.target.files[0])

  const [level5File, setLevel5File] = useState<File>()
  const handleLevel5FileInput = (e: any) => setLevel5File(e.target.files[0])

  const uploadFile = ({file}: {file: File}) => {
    uploadImageToS3({authToken: auth.token!, file})
  }

  const action = usePromiseLazy(async (data: FormData) => {
    let fileData = {}
    if (level1File) {
      uploadFile({file: level1File})
      fileData = {
        ...fileData,
        level1Name: level1File?.name,
        level1Type: level1File?.type,
      }
    }

    if (level2File) {
      uploadFile({file: level2File})
      fileData = {
        ...fileData,
        level2Name: level2File?.name,
        level2Type: level2File?.type,
      }
    }

    if (level3File) {
      uploadFile({file: level3File})
      fileData = {
        ...fileData,
        level3Name: level3File?.name,
        level3Type: level3File?.type,
      }
    }

    if (level4File) {
      uploadFile({file: level4File})
      fileData = {
        ...fileData,
        level4Name: level4File?.name,
        level4Type: level4File?.type,
      }
    }

    if (level5File) {
      uploadFile({file: level5File})
      fileData = {
        ...fileData,
        level5Name: level5File?.name,
        level5Type: level5File?.type,
      }
    }

    return updateBook({
      id: book.id,
      authToken: auth.token!,
      data: {...data, ...fileData},
    })
  }, [])

  const handleSubmit = async (data: FormData) => {
    const {result: updatedBook} = await action.execute(data)
    if (updatedBook && onBookUpdated) {
      await onBookUpdated(updatedBook)
    }
  }

  return (
    <Modal
      onClose={onClose}
      header="Update book"
      body={
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextField
            required
            name="title"
            label="Title"
            form={form}
            defaultValue={book.title}
          />
          <FileUploadField
            name="level-1"
            label="Level 1"
            form={form}
            onChange={handleLevel1FileInput}
          />
          <FileUploadField
            name="level-2"
            label="Level 2"
            form={form}
            onChange={handleLevel2FileInput}
          />
          <FileUploadField
            name="level-3"
            label="Level 3"
            form={form}
            onChange={handleLevel3FileInput}
          />
          <FileUploadField
            name="level-4"
            label="Level 4"
            form={form}
            onChange={handleLevel4FileInput}
          />
          <FileUploadField
            name="level-5"
            label="Level 5"
            form={form}
            onChange={handleLevel5FileInput}
          />
          <Button primary type="submit" fluid loading={action.isLoading}>
            Update book
          </Button>
        </Form>
      }
    />
  )
}
