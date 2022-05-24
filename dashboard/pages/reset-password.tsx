import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import NextLink from 'next/link'
import {useState} from 'react'
import {useAuth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {EmailField, Form} from '../src/shared/components/form'
import {Navigation} from '../src/shared/components/navigation'
import {usePromiseLazy} from '../src/shared/hooks'
import {requestPasswordReset} from '../src/auth/actions'

type Data = {
  emailAddress: string
}

export default function ResetPassword() {
  const form = useForm<Partial<Data>>()
  const router = useRouter()
  const auth = useAuth()
  const [resetRequested, setResetRequested] = useState(false)

  const action = usePromiseLazy(async (data: Data) => {
    await requestPasswordReset({emailAddress: data.emailAddress})
  }, [])

  if (auth.isAuthenticated()) {
    router.push('/books')
  }

  const handleSubmit = async (data: Data) => {
    const {error} = await action.execute(data)
    if (!error) {
      setResetRequested(true)
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
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              padding: 20,
              borderRadius: 20,
            }}
          >
            {!resetRequested ? (
              <>
                <h2 style={{textAlign: 'center', margin: 28}}>
                  Reset password
                </h2>
                <p>
                  Enter the email address associated with your account, and
                  we'll send you a link to reset your password.
                </p>
                <Form
                  error={action.error}
                  onSubmit={form.handleSubmit((data) =>
                    handleSubmit(data as Data),
                  )}
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
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}
                >
                  <NextLink passHref href="/sign-in">
                    Return to sign in
                  </NextLink>
                </div>
              </>
            ) : (
              <div style={{textAlign: 'center'}}>
                <h2>Password reset requested</h2>
                <p>
                  Please check your email and follow the instructions to reset
                  your password.
                </p>
                <NextLink passHref href="/sign-in">
                  Return to sign in
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
