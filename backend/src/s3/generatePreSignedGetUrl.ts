import AWS from 'aws-sdk'
import {z} from 'zod'
import {Endpoint} from '../http/endpoint'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
AWS.config.update({
  accessKeyId: 'AKIAXWFILWYEWVLWBMU4',
  secretAccessKey: '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',
})

const S3_BUCKET = 'storybook-library'
const REGION = 'us-west-2'
const URL_EXPIRATION_TIME = 10000 // in seconds

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const myBucket = new AWS.S3({
  params: {Bucket: S3_BUCKET},
  region: REGION,
  apiVersion: '2012-10-17',
  signatureVersion: 'v4',
})

const inputSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
})

export const generatePreSignedGetUrl: Endpoint<any, any, any> = {
  method: 'post',
  path: '/generatePreSignedGetUrl',
  requireAuth: true,
  validation: {
    body: inputSchema,
  },
  handler: async ({body}) => {
    const promise = new Promise((resolve) => {
      myBucket.getSignedUrl(
        'getObject',
        {
          Key: body.fileName,
          Expires: URL_EXPIRATION_TIME,
        },
        (err, url) => {
          resolve(url) // API Response Here
        },
      )
    })
    const url = await promise
    return {url}
  },
}
