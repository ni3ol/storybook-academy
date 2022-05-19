/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {signIn} from '../src/auth/actions'
import {useAuth} from '../src/auth/hooks'
import {Button} from '../src/shared/components/button'
import {Container} from '../src/shared/components/container'
import {Form, PasswordField, TextField} from '../src/shared/components/form'
import {Navigation} from '../src/shared/components/navigation'
import {usePromiseLazy} from '../src/shared/hooks'
import {UserRole} from '../src/users/model'
import NextLink from 'next/link'

type Data = {
  emailAddress?: string
  username?: string
  password: string
}

export default function SignIn() {
  const form = useForm<Partial<Data>>()
  const router = useRouter()
  const auth = useAuth()
  const [isChildSelected, setIsChild] = useState(true)

  const action = usePromiseLazy((data: Data) => {
    const userData = isChildSelected
      ? {username: data.username}
      : {emailAddress: data.emailAddress}
    return signIn({
      ...userData,
      password: data.password,
    })
  }, [])

  if (auth.isAuthenticated()) {
    const path =
      auth.auth.user?.role === UserRole.Child
        ? auth.auth.user?.profileCreated
          ? '/child-dashboard'
          : '/child-profile-building'
        : '/dashboard'
    router.push(path)
  }

  const handleSubmit = async (data: Data) => {
    const {result} = await action.execute(data)
    if (result) {
      auth.authenticate({user: result.user, authSession: result.authSession})
      const path =
        result.user.role === UserRole.Child
          ? '/child-profile-building'
          : '/dashboard'
      router.push(path)
    }
  }

  useEffect(() => {
    action.clearError()
    form.reset({emailAddress: '', username: '', password: ''})
  }, [isChildSelected])

  const UserTypeButton = ({
    role,
    color,
    onClick,
  }: {
    role: string
    color: string
    onClick: any
  }) => {
    const adult = role === 'adult'
    const child = role === 'child'
    return (
      <Button
        color={color}
        style={{
          width: '50%',
          margin: 0,
          borderRadius: 0,
          opacity:
            (child && isChildSelected) || (adult && !isChildSelected)
              ? '100%'
              : '70%',
        }}
        onClick={onClick}
      >
        {child ? "I'm a child" : "I'm an adult"}
      </Button>
    )
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
            <div style={{width: '90%', margin: 'auto', paddingBottom: 20}}>
              <UserTypeButton
                role="child"
                color="green"
                onClick={() => setIsChild(true)}
              />
              <UserTypeButton
                role="adult"
                color="blue"
                onClick={() => setIsChild(false)}
              />
              <div style={{marginTop: 20}}>
                <Form
                  error={action.error}
                  onSubmit={form.handleSubmit((data) =>
                    handleSubmit(data as Data),
                  )}
                >
                  {isChildSelected ? (
                    <TextField
                      name="username"
                      form={form}
                      required
                      label="Child username"
                    />
                  ) : (
                    <TextField
                      name="emailAddress"
                      form={form}
                      required
                      label="Email address"
                    />
                  )}
                  <PasswordField
                    name="password"
                    form={form}
                    required
                    label="Password"
                  />
                  {!isChildSelected && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'right',
                        marginBottom: '1em',
                      }}
                    >
                      <NextLink passHref href={`/reset-password`}>
                        Forgot your password?
                      </NextLink>
                    </div>
                  )}

                  <Button
                    type="submit"
                    fluid
                    disabled={action.isLoading}
                    loading={action.isLoading}
                  >
                    Log in
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
