import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import NextLink from 'next/link'
import {useState} from 'react'
import {useAuth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Form, PasswordField} from '../src/shared/components/form'
import {Navigation} from '../src/shared/components/navigation'
import {usePromiseLazy} from '../src/shared/hooks'
import {setNewPassword} from '../src/auth/actions'

type Data = {
  newPassword: string
  confirmNewPassword: string
}

export default function NewPassword() {
  const form = useForm<Partial<Data>>()
  const router = useRouter()
  const auth = useAuth()
  const [passwordChanged, setPasswordChanged] = useState(false)

  const action = usePromiseLazy(async (data: Data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      throw new Error('Passwords do not match')
    }

    await setNewPassword({
      newPassword: data.newPassword,
      passwordResetRequestToken: (router.query.token as string) || 'abc',
    })
  }, [])

  if (auth.isAuthenticated()) {
    router.push('/dashboard')
  }

  const handleSubmit = async (data: Data) => {
    const {error} = await action.execute(data)
    if (!error) {
      setPasswordChanged(true)
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
            {!passwordChanged ? (
              <>
                <h2 style={{textAlign: 'center', margin: 28}}>
                  Set new password
                </h2>
                <p>Enter a new password for your account</p>
                <Form
                  error={action.error}
                  onSubmit={form.handleSubmit((data) =>
                    handleSubmit(data as Data),
                  )}
                >
                  <PasswordField
                    required
                    label="New password"
                    name="newPassword"
                    form={form}
                  />
                  <PasswordField
                    required
                    label="Confirm new password"
                    name="confirmNewPassword"
                    form={form}
                  />
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button type="submit" block disabled={action.isLoading}>
                      Set new password
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
                <h2>New password set</h2>
                <p>
                  Your new account password has been set. You can now log in
                  with your new password here:
                </p>
                <NextLink passHref href="/sign-in">
                  Sign in
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
