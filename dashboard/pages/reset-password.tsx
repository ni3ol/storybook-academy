import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {signUp} from '../src/auth/actions'
import {useAuth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {
  EmailField,
  Form,
  PasswordField,
  TextField,
} from '../src/shared/components/form'
import {Navigation} from '../src/shared/components/navigation'
import {usePromiseLazy} from '../src/shared/hooks'
import NextLink from 'next/link'

type Data = {
  firstName: string
  lastName: string
  emailAddress: string
  password: string
}

export default function ResetPassword() {
  const form = useForm<Partial<Data>, Data>()
  const router = useRouter()
  const auth = useAuth()

  const action = usePromiseLazy((data: Data) => {
    return signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.emailAddress,
      password: data.password,
    })
  }, [])

  if (auth.isAuthenticated()) {
    router.push('/dashboard')
  }

  const handleSubmit = async (data: Data) => {
    const {result} = await action.execute(data)
    if (result) {
      auth.authenticate({user: result.user, authSession: result.authSession})
      router.push('/dashboard')
    }
  }

  return auth.isAuthenticated() ? null : (
    <>
      <Navigation />
      <Container>
        <div
          style={{
            display: 'flex',
            minHeight: 'calc(80vh - 70px)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 400,
            }}
          >
            <h2 style={{textAlign: 'center', margin: 28}}>Reset password</h2>
            <p>
              Enter the email address associated with your account, and we'll
              send you a link to reset your password.
            </p>
            <Form
              error={action.error}
              onSubmit={form.handleSubmit((data) => handleSubmit(data as Data))}
            >
              <EmailField
                required
                label="Email address"
                name="emailAddress"
                form={form}
              />
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button type="submit" block disabled={action.isLoading}>
                  Send reset password email
                </Button>
              </div>
            </Form>
            <div
              style={{display: 'flex', justifyContent: 'center', marginTop: 20}}
            >
              <NextLink passHref href={`/sign-in`}>
                Return to sign in
              </NextLink>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
