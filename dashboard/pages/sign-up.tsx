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

type Data = {
  firstName: string
  lastName: string
  emailAddress: string
  password: string
}

export default function SignUp() {
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
    router.push('/books')
  }

  const handleSubmit = async (data: Data) => {
    const {result} = await action.execute(data)
    if (result) {
      auth.authenticate({user: result.user, authSession: result.authSession})
      router.push('/books')
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
          <div style={{width: 400}}>
            <h2 style={{textAlign: 'center', margin: 28}}>Sign up</h2>
            <Form
              error={action.error}
              onSubmit={form.handleSubmit((data) => handleSubmit(data as Data))}
            >
              <TextField
                required
                label="First name"
                name="firstName"
                form={form}
              />
              <TextField
                required
                label="Last name"
                name="lastName"
                form={form}
              />
              <EmailField
                required
                label="Email address"
                name="emailAddress"
                form={form}
              />
              <PasswordField
                required
                name="password"
                form={form}
                label="Password"
              />
              <Button type="submit" block disabled={action.isLoading}>
                Sign up
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </>
  )
}
