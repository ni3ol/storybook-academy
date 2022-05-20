import {z} from 'zod'

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
})

type SendEmailData = z.infer<typeof sendEmailSchema>

export const sendEmail = ({data}: {data: SendEmailData}) => {
  console.log(`Sending email: ${JSON.stringify(data)}`)
  return Promise.resolve(data)
}
