/* eslint-disable @typescript-eslint/no-floating-promises */
import {atom, useRecoilState} from 'recoil'
import {useEffect} from 'react'
import {AuthSession} from '../authSessions/model'
import {User} from '../users/model'
import {getAuthSessions} from '../authSessions/actions'
import {usePromiseLazy} from '../shared/hooks'
import {getUsers} from '../users/actions/getUsers'

export type Auth = {
  user: User
  token: string
  userId: string
  authSession: AuthSession
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

const authState = atom<Partial<Auth>>({
  key: 'auth',
  default: {},
})

const userIdPath = 'userId'
const authTokenPath = 'authToken'

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState)

  const deAuthenticate = () => {
    localStorage.removeItem(userIdPath)
    localStorage.removeItem(authTokenPath)
    setAuth({status: 'unauthenticated'})
  }

  const action = usePromiseLazy(
    async ({token, userId}: {token: string; userId: string}) => {
      try {
        const [authSession] = await getAuthSessions({
          authToken: token,
          filters: {token},
        })
        const [user] = await getUsers({
          authToken: token,
          filters: {id: userId},
        })
        if (!authSession || !user) {
          deAuthenticate()
        } else {
          const newAuth = {
            userId,
            token,
            user,
            authSession,
          }
          setAuth({...newAuth, status: 'authenticated'})
        }
      } catch (error: any) {
        console.error(error)
        if (error.message === 'Authentication required') {
          deAuthenticate()
        }
        throw error
      }
    },
    [],
  )

  useEffect(() => {
    const userId = auth.userId || localStorage.getItem(userIdPath)
    const token = auth.token || localStorage.getItem(authTokenPath)

    ;(async () => {
      if (!auth.user && !auth.authSession && token && userId) {
        action.execute({token, userId})
      }
      if (!token && !userId) {
        deAuthenticate()
      }
    })()
  }, [])

  const authenticate = ({
    user,
    authSession,
  }: {
    user: User
    authSession: AuthSession
  }) => {
    localStorage.setItem(userIdPath, user.id)
    localStorage.setItem(authTokenPath, authSession.token)
    setAuth({
      user,
      userId: user.id,
      authSession,
      token: authSession.token,
      status: 'authenticated',
    })
  }

  const isAuthenticated = () => {
    if (auth.userId && auth.token) {
      return true
    }

    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId')
      const token = localStorage.getItem('authToken')
      return userId && token
    }

    return false
  }

  const expectAuthToken = () => {
    if (!auth.authSession?.token) {
      throw new Error('Expected auth token')
    }

    return auth.authSession.token
  }

  return {authenticate, isAuthenticated, deAuthenticate, auth, expectAuthToken}
}
