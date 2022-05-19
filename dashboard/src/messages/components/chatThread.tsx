import {Segment, TextArea} from 'semantic-ui-react'
import styles from './index.module.css'
import clsx from 'clsx'
import {Form} from '../../shared/components/form'
import {Button} from '../../shared/components/button'
import {useForm} from 'react-hook-form'
import {usePromiseLazy} from '../../shared/hooks'
import {useState} from 'react'
import useChat from '../actions/useChat'
import {Auth} from '../../auth/hooks'

type Data = {}

export const ChatThread = ({auth}: {auth: Auth}) => {
  const handleSubmit = async (data: Data) => {}

  const form = useForm<FormData>()

  const action = usePromiseLazy(async (data: FormData) => {}, [])

  const [activeChat, setActiveChat] = useState('a')
  const roomId = 'test' // Gets roomId from URL
  const {messages, sendMessage} = useChat({roomId, auth}) // Creates a websocket and manages messaging
  const [newMessage, setNewMessage] = useState('') // Message to be sent

  const handleNewMessageChange = (event: any) => {
    setNewMessage(event.target.value)
  }

  const handleSendMessage = () => {
    sendMessage(newMessage)
    setNewMessage('')
  }

  return (
    <Segment
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(80vh - 70px)',
        justifyContent: 'space-between',
      }}
    >
      <ol className="messages-list">
        {messages.map((message: any, i) => (
          <li
            key={i}
            className={clsx(
              styles.messageItem,
              message.ownedByCurrentUser || message.senderId === auth.userId
                ? styles.myMessage
                : styles.receivedMessage,
            )}
          >
            {message.body}
          </li>
        ))}
      </ol>
      <div>
        <Form error={action.error} onSubmit={form.handleSubmit(handleSubmit)}>
          <TextArea
            required
            name="firstName"
            label="First name"
            form={form}
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Write message..."
          />
          <Button
            primary
            type="submit"
            fluid
            loading={action.isLoading}
            onClick={handleSendMessage}
          >
            Send message
          </Button>
        </Form>
      </div>
    </Segment>
  )
}
