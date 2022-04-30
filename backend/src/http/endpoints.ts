import {signInEndpoint} from '../auth/endpoints/signInEndpoint'
import {getAuthSessionsEndpoint} from '../authSessions/endpoints/getAuthSessionsEndpoint'
import {createUserEndpoint} from '../users/endpoints/createUserEndpoint'
import {getUserEndpoint} from '../users/endpoints/getUserEndpoint'
import {getUsersEndpoint} from '../users/endpoints/getUsersEndpoint'
import {Endpoint} from './endpoint'

export const endpoints: Endpoint<any, any, any>[] = [
  // Users
  getUsersEndpoint,
  getUserEndpoint,
  createUserEndpoint,
  // Auth sessions
  getAuthSessionsEndpoint,
  // Auth
  signInEndpoint,
]
