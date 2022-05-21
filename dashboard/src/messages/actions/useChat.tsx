import {useEffect, useRef, useState} from 'react'
import socketIOClient from 'socket.io-client'
import {Auth} from '../../auth/hooks'
import {usePromise} from '../../shared/hooks'
import {createMessage} from './createMessage'
import {getMessages} from './getMessages'

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage' // Name of the event
const SOCKET_SERVER_URL = 'http://localhost:5002'

const useChat = ({roomId, auth}: {roomId?: string; auth: Auth}) => {
  const getMessagesAction = usePromise(async () => {
    if (!roomId) return
    return await getMessages({
      authToken: auth.authSession.token,
      filters: {roomId: roomId},
    })
  }, [roomId])

  const [messages, setMessages] = useState(getMessagesAction.result || [])
  // Sent and received messages
  const socketRef = useRef()

  useEffect(() => {
    getMessagesAction.result && setMessages(getMessagesAction.result)
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: {roomId},
    })

    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: any) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
        createdAt: new Date(),
      }
      setMessages((messages) => [...messages, incomingMessage])
    })

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, getMessagesAction.result])

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = async (messageBody: string) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      currentSenderId: auth.userId,
    })

    if (!roomId) return
    await createMessage({
      authToken: auth.authSession.token!,
      data: {
        body: messageBody,
        senderId: auth.userId,
        roomId: roomId,
      },
    })
  }

  return {messages, sendMessage}
}

export default useChat
