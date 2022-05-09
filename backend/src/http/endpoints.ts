import {signInEndpoint} from '../auth/endpoints/signInEndpoint'
import {getAuthSessionsEndpoint} from '../authSessions/endpoints/getAuthSessionsEndpoint'
import {createBookEndpoint} from '../books/endpoints/createBookEndpoint'
import {deleteBookEndpoint} from '../books/endpoints/deleteBookEndpoint'
import {getBooksEndpoint} from '../books/endpoints/getBooksEndpoint'
import {updateBookEndpoint} from '../books/endpoints/updateBookEndpoint'
import {createSchoolEndpoint} from '../schools/endpoints/createSchoolEndpoint'
import {assignBookToSchoolEndpoint} from '../schools/endpoints/createSchoolEndpoint copy'
import {getSchoolsEndpoint} from '../schools/endpoints/getSchoolsEndpoint'
import {updateSchoolEndpoint} from '../schools/endpoints/updateSchoolEndpoint'
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
  getBooksEndpoint,
  updateBookEndpoint,
  deleteBookEndpoint,
  // Schools
  createSchoolEndpoint,
  getSchoolsEndpoint,
  updateSchoolEndpoint,
  assignBookToSchoolEndpoint,
]
