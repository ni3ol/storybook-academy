import React, {useState} from 'react'
import {uploadFile} from 'react-s3'

const S3_BUCKET = 'storybook-library'
const REGION = 'us-west-2'
const ACCESS_KEY = 'AKIAXWFILWYEWVLWBMU4'
const SECRET_ACCESS_KEY = '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'

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
}

export const UploadImageToS3WithReactS3 = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileInput = (e: any) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = async (file: any) => {
    uploadFile(file, config)
      .then((data: any) => console.log(data))
      .catch((err: any) => console.error(err))
  }

  return (
    <div>
      <div>React S3 File Upload</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div>
  )
}
