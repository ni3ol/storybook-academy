import {makeRequest} from '../../shared/utils'

export const downloadImageFromS3 = async ({
  authToken,
  fileName,
  fileType,
}: {
  authToken: string
  fileName: string
  fileType: string
}) => {
  const response = await makeRequest({
    authToken: authToken,
    method: 'post',
    path: `/generatePreSignedGetUrl`,
    data: {
      fileName: fileName,
      fileType: fileType,
    },
  })

  return response.data.url
}

// return (
//   <>
//     <input type="file" onChange={handleFileInput} />
//     <button onClick={() => getPresignedGetUrl(selectedFile)}> Get pdf</button>
//     {downloadedFile && (
//       <object
//         data={downloadedFile}
//         type="application/pdf"
//         width="100%"
//         height="100%"
//       >
//         Not found
//       </object>
//       // <a href='/api/v1/print/example.pdf' target='_blank' rel='noopener noreferrer'>
//     )}
//   </>
// )
