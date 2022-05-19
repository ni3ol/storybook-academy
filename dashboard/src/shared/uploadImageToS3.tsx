import axios from 'axios'
import React, {useState} from 'react'
import {makeRequest} from './utils'

export const UploadImageToS3 = ({authToken}: {authToken: string}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const handleFileInput = (e: any) => setSelectedFile(e.target.files[0])
  const [downloadedFile, setDownloadedFile] = useState(null)

  const getPresignedGetUrl = async (file: any) => {
    const presignedUrlresponse = await makeRequest({
      authToken: authToken,
      method: 'post',
      path: `/generatePreSignedGetUrl`,
      data: {
        fileName: file.name,
        fileType: file.type,
      },
    })

    const url = presignedUrlresponse.data.url

    const response = await axios({
      method: 'get',
      headers: {
        'Content-Type': file.type,
      },
      url: url,
      data: file,
    })

    setDownloadedFile(url)
  }

  const uploadFile = async (file: any) => {
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

  return (
    <>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
      <button onClick={() => getPresignedGetUrl(selectedFile)}> Get pdf</button>
      {downloadedFile && (
        <object
          data={downloadedFile}
          type="application/pdf"
          width="100%"
          height="100%"
        >
          Not found
        </object>
      )}
    </>
  )
}

// export const UploadImageToS3 = () => {
//   const [selectedFile, setSelectedFile] = useState(null)

//   const handleFileInput = (e: any) => setSelectedFile(e.target.files[0])

//   const uploadFile = (file: any) => {
//     const requestObject = {
//       method: 'POST',
//       body: {
//         fileName: file.name,
//         fileType: file.type,
//       },
//     }

//     fetch('generatePreSignedUrl', requestObject).then((res) => {
//       fetch(res.signedUrl, {
//         method: 'PUT',
//         body: file,
//       }).then((res) => {
//         // DO WHATEVER YOU WANT
//         console.log('res', res)
//       })
//     })
//   }

//   return (
//     <>
//       <input type="file" onChange={handleFileInput} />
//       <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
//     </>
//   )
// }
