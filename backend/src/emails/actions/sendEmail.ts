import {z} from 'zod'
import nodeMailer from 'nodemailer'

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'xxx@xx.com',
    pass: 'xxxx',
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
    from: '"Krunal Lathiya" <xx@gmail.com>',
    to: data.to,
    subject: data.subject,
    html: '<b>NodeJS Email Tutorial</b>',
  }

  console.log(`Sending email: ${JSON.stringify(mailOptions)}`)

  await transporter.sendMail(mailOptions)
}
