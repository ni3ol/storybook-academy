import {z} from 'zod'
import nodeMailer from 'nodemailer'
import {requireEnvVar} from '../../shared/utils'

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: requireEnvVar('EMAIL_USERNAME'),
    pass: requireEnvVar('EMAIL_PASSWORD'),
  },
})

const sendEmailSchema = z.object({
  to: z.array(z.string().email()),
  subject: z.string(),
  body: z.string(),
})

type SendEmailData = z.infer<typeof sendEmailSchema>

export const sendEmail = async ({data}: {data: SendEmailData}) => {
  const mailOptions = {
    from: '"Storybook Academy" <admin@storybook.academy>',
    to: data.to,
    subject: data.subject,
    html: data.body,
  }
  if (process.env.DUMMY_EMAILS) {
    console.log('Sending dummy email: ', mailOptions)
  } else {
    await transporter.sendMail(mailOptions)
  }
}
