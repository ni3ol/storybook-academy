/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-misused-promises */
import dotenv from 'dotenv'

dotenv.config()

import morgan from 'morgan'
import express, {ErrorRequestHandler} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {ZodError} from 'zod'
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  InvalidRequestError,
  NotFoundError,
} from '../errors'
import {getAuthSessions} from '../authSessions/actions/getAuthSessions'
import {getUsers} from '../users/actions/getUsers'
import {endpoints} from './endpoints'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev'))

endpoints.forEach((endpoint) => {
  app[endpoint.method](endpoint.path, async (req, res, next) => {
    try {
      const token = req.headers.authorization
      const [authSession] = token
        ? await getAuthSessions({filters: {token}})
        : []

      const [user] = authSession
        ? await getUsers({filters: {id: authSession.userId}, skipAuth: true})
        : []

      if (endpoint.requireAuth && !authSession) {
        next(new AuthenticationError())
        return
      }

      const body = endpoint.validation?.body
        ? endpoint.validation.body.parse(req.body)
        : undefined

      const params = endpoint.validation?.params
        ? endpoint.validation?.params.parse(req.params)
        : undefined

      const queryParams = endpoint.validation?.queryParams
        ? endpoint.validation?.queryParams.parse(req.query)
        : undefined

      const json = await endpoint.handler({
        params,
        body,
        queryParams,
        user,
      })
      res.json(json).status(200)
    } catch (error) {
      next(error)
    }
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error) {
    console.log(error)
  }
  if (
    error instanceof ZodError ||
    error instanceof InvalidRequestError ||
    error instanceof SyntaxError
  ) {
    res.status(400).json({
      error: {...error, message: error.message || 'Invalid request'},
    })
  } else if (error instanceof AuthenticationError) {
    res.status(401).json({error})
  } else if (error instanceof AuthorizationError) {
    res.status(403).json({error})
  } else if (error instanceof NotFoundError) {
    res.status(404).json({error})
  } else if (error instanceof ConflictError) {
    res.status(409).json({error})
  } else {
    res.status(500).json({error: {message: 'Internal server error'}})
  }
}

app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'The requested resource was not found',
    },
  })
})

const port = parseInt(process.env.PORT || '8080', 10)

const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage'

io.on('connection', (socket: any) => {
  // Join a conversation
  const {roomId} = socket.handshake.query
  socket.join(roomId)

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data: any) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data)
  })

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId)
  })
})

server.listen('5002', () => {
  console.log(`Listening on port ${'5002'}`)
})

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
