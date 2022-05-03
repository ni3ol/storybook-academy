import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {signIn} from '../src/auth/actions'
import {useAuth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Form, PasswordField, TextField} from '../src/shared/components/form'
import {Navigation} from '../src/shared/components/navigation'
import {usePromiseLazy} from '../src/shared/hooks'

type Data = {
  emailAddress: string
  password: string
}

export default function SignIn() {
  const form = useForm<Partial<Data>, Data>()
  const router = useRouter()
  const auth = useAuth()

  const action = usePromiseLazy((data: Data) => {
    return signIn({emailAddress: data.emailAddress, password: data.password})
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
          <div style={{width: 400}}>
            <h2 style={{textAlign: 'center', margin: 28}}>Sign in</h2>
            <Form
              error={action.error}
              onSubmit={form.handleSubmit((data) => handleSubmit(data as Data))}
            >
              <TextField
                name="emailAddress"
                form={form}
                required
                label="Email address"
              />
              <PasswordField
                name="password"
                form={form}
                required
                label="Password"
              />
              <Button type="submit" disabled={action.isLoading}>
                Sign in
              </Button>
            </Form>
          </div>
        </div>
      </Container>
    </>
  )
}
