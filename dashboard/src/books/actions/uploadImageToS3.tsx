import axios from 'axios'
import {makeRequest} from '../../shared/utils'

export const uploadImageToS3 = async ({
  authToken,
  file,
}: {
  authToken: string
  file: any
}) => {
  const response = await makeRequest({
    authToken: authToken,
    method: 'post',
    path: `/generatePreSignedPutUrl`,
    data: {
      fileName: file.name,
      fileType: file.type,
    },
  })

  const url = response.data.url

  await axios({
    method: 'put',
    headers: {
      'Content-Type': file.type,
    },
    url: url,
    data: file,
  })
}
