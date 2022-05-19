import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import NextLink from 'next/link'
import {Auth, useAuth} from '../../src/auth/hooks'
import {usePromiseLazy} from '../../src/shared/hooks'
import {Navigation} from '../../src/shared/components/navigation'
import {Container} from '../../src/shared/components/container'
import {EmailField, Form} from '../../src/shared/components/form'
import {Button} from '../../src/shared/components/button'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {UserRole} from '../../src/users/model'
import {Grid, Input, Menu, Segment, TextArea} from 'semantic-ui-react'
import {useState} from 'react'
import {Header} from '../../src/shared/components/header'
import useChat from '../../src/messages/actions/useChat'
import clsx from 'clsx'
import {ChatThread} from '../../src/messages/components/chatThread'

type Data = {}

const ChatPage = ({auth}: {auth: Auth}) => {
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
    <>
      <DashboardNavigation role={auth.user.role} />
      <Container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Header>Chat</Header>
          <Grid style={{width: '100%'}}>
            <Grid.Column width={4}>
              <Menu fluid vertical tabular>
                <Menu.Item
                  name="a"
                  active={activeChat === 'a'}
                  onClick={() => setActiveChat('a')}
                />
                <Menu.Item
                  name="b"
                  active={activeChat === 'b'}
                  onClick={() => setActiveChat('b')}
                />
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
              <ChatThread auth={auth} />
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    </>
  )
}

export default function ChatPageWrapper() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <ChatPage auth={auth} />
      }}
    />
  )
}
