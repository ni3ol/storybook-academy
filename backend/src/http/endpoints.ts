import {signInEndpoint} from '../auth/endpoints/signInEndpoint'
import {getAuthSessionsEndpoint} from '../authSessions/endpoints/getAuthSessionsEndpoint'
import {createBookEndpoint} from '../books/endpoints/createBookEndpoint'
import {deleteBookEndpoint} from '../books/endpoints/deleteBookEndpoint'
import {getBooksEndpoint} from '../books/endpoints/getBooksEndpoint'
import {updateBookEndpoint} from '../books/endpoints/updateBookEndpoint'
import {createSchoolEndpoint} from '../schools/endpoints/createSchoolEndpoint'
import {assignBookToSchoolEndpoint} from '../schools/endpoints/assignBookToSchoolEndpoint'
import {getSchoolsEndpoint} from '../schools/endpoints/getSchoolsEndpoint'
import {updateSchoolEndpoint} from '../schools/endpoints/updateSchoolEndpoint'
import {createUserEndpoint} from '../users/endpoints/createUserEndpoint'
import {deleteUserEndpoint} from '../users/endpoints/deleteUserEndpoint'
import {getUserEndpoint} from '../users/endpoints/getUserEndpoint'
import {getUsersEndpoint} from '../users/endpoints/getUsersEndpoint'
import {updateUserEndpoint} from '../users/endpoints/updateUserEndpoint'
import {Endpoint} from './endpoint'
import {unassignBookFromSchoolEndpoint} from '../schools/endpoints/unassignBookFromSchoolEndpoint'
import {createClassEndpoint} from '../classes/endpoints/createClassEndpoint'
import {getClassesEndpoint} from '../classes/endpoints/getClassesEndpoint'
import {assignChildToClassEndpoint} from '../users/endpoints/assignChildToClassEndpoint'
import {updateClassEndpoint} from '../classes/endpoints/updateClassEndpoint'
import {assignBookToClassEndpoint} from '../schools/endpoints/assignBookToClassEndpoint'

export const endpoints: Endpoint<any, any, any>[] = [
  // Users
  getUsersEndpoint,
  getUserEndpoint,
  createUserEndpoint,
  updateUserEndpoint,
  deleteUserEndpoint,
  assignChildToClassEndpoint,
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
  unassignBookFromSchoolEndpoint,
  assignBookToClassEndpoint,
  // classes
  createClassEndpoint,
  getClassesEndpoint,
  updateClassEndpoint,
]
