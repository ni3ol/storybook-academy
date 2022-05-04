import {signInEndpoint} from '../auth/endpoints/signInEndpoint'
import {getAuthSessionsEndpoint} from '../authSessions/endpoints/getAuthSessionsEndpoint'
import {createBookEndpoint} from '../books/endpoints/createBookEndpoint'
import {createUserEndpoint} from '../users/endpoints/createUserEndpoint'
import {deleteUserEndpoint} from '../users/endpoints/deleteUserEndpoint'
import {getUserEndpoint} from '../users/endpoints/getUserEndpoint'
import {getUsersEndpoint} from '../users/endpoints/getUsersEndpoint'
import {updateUserEndpoint} from '../users/endpoints/updateUserEndpoint'
import {Endpoint} from './endpoint'

export const endpoints: Endpoint<any, any, any>[] = [
  // Users
  getUsersEndpoint,
  getUserEndpoint,
  createUserEndpoint,
  updateUserEndpoint,
  deleteUserEndpoint,
  // Auth sessions
  getAuthSessionsEndpoint,
  // Auth
  signInEndpoint,
  // Books
  createBookEndpoint,
]
