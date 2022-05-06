import {useRouter} from 'next/router'
import {useState} from 'react'
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
  username: string
  password: string
}

export default function SignIn() {
  const form = useForm<Partial<Data>, Data>()
  const router = useRouter()
  const auth = useAuth()
  const [isChild, setIsChild] = useState(true)

  const action = usePromiseLazy((data: Data) => {
    return signIn({
      emailAddress: data.emailAddress,
      password: data.password,
      username: data.username,
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

  const AdultForm = () => (
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
      <PasswordField name="password" form={form} required label="Password" />
      <Button type="submit" disabled={action.isLoading}>
        Log in
      </Button>
    </Form>
  )

  const ChildForm = () => (
    <Form
      error={action.error}
      onSubmit={form.handleSubmit((data) => handleSubmit(data as Data))}
    >
      <TextField name="username" form={form} required label="Child username" />
      <PasswordField name="password" form={form} required label="Password" />
      <Button type="submit" disabled={action.isLoading}>
        Log in
      </Button>
    </Form>
  )

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
            <div style={{width: '90%', margin: 'auto', paddingBottom: 20}}>
              <Button
                color="green"
                style={{width: '50%', margin: 0, borderRadius: 0}}
                onClick={() => setIsChild(true)}
              >
                I'm a child
              </Button>
              <Button
                color="blue"
                style={{width: '50%', margin: 0, borderRadius: 0}}
                onClick={() => setIsChild(false)}
              >
                I'm an adult
              </Button>
            </div>
            {isChild ? ChildForm() : AdultForm()}
          </div>
        </div>
      </Container>
    </>
  )
}
