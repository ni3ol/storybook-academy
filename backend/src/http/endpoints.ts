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
import {generatePreSignedPutUrl} from '../s3/generatePreSignedPutUrl'
import {generatePreSignedGetUrl} from '../s3/generatePreSignedGetUrl'
import {getMessagesEndpoint} from '../messages/endpoints/getMessagesEndpoint'
import {createMessageEndpoint} from '../messages/endpoints/createMessageEndpoint'
import {createPasswordResetRequestEndpoint} from '../passwordResetRequests/endpoints/createPasswordResetRequestEndpoint'
import {setNewPasswordEndpoint} from '../auth/endpoints/setNewPasswordEndpoint'

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
  createPasswordResetRequestEndpoint,
  setNewPasswordEndpoint,
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
  // Classes
  createClassEndpoint,
  getClassesEndpoint,
  updateClassEndpoint,
  // AWS
  generatePreSignedPutUrl,
  generatePreSignedGetUrl,
  // Messages
  getMessagesEndpoint,
  createMessageEndpoint,
]
