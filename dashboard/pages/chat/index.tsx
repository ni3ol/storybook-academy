import router from 'next/router'
import {useForm} from 'react-hook-form'
import {Grid, Menu, Segment, TextArea} from 'semantic-ui-react'
import {useEffect, useState} from 'react'
import clsx from 'clsx'
import {Auth} from '../../src/auth/hooks'
import {usePromise, usePromiseLazy} from '../../src/shared/hooks'
import {Container} from '../../src/shared/components/container'
import {Form} from '../../src/shared/components/form'
import {Button} from '../../src/shared/components/button'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {UserRole} from '../../src/users/model'
import {Header} from '../../src/shared/components/header'
import useChat from '../../src/messages/actions/useChat'
import {getChatRooms} from '../../src/chatRooms/actions/getChatRooms'
import {ChatRoom} from '../../src/chatRooms/model'
import {getUsers} from '../../src/users/actions/getUsers'
import {getSchools} from '../../src/schools/actions/getSchools'
import styles from './index.module.css'
import {formatRelativeDate} from '../../src/shared/utils'

const ChatPage = ({auth}: {auth: Auth}) => {
  const [activeChatRoomId, setActiveChatRoomId] = useState<undefined | string>(
    undefined,
  )
  const {messages, sendMessage} = useChat({roomId: activeChatRoomId, auth})
  const [newMessage, setNewMessage] = useState('')

  const form = useForm<FormData>()
  const action = usePromiseLazy(async () => {}, [])

  useEffect(() => {
    router.replace('/chat', undefined, {shallow: true})
  }, [])

  const getChatRoomsAction = usePromise(async () => {
    const chatRooms = await getChatRooms({
      authToken: auth.authSession.token,
    })
    return chatRooms
  }, [])
  const chatRooms = getChatRoomsAction.result

  const myChatRooms = chatRooms
    ? chatRooms.filter(
        (room) =>
          room.participant1Id === auth.userId ||
          room.participant2Id === auth.userId ||
          (auth.user.role === UserRole.Admin && room.isAdmin === true),
      )
    : []

  const handleSubmit = async () => {
    if (newMessage === '') return
    await sendMessage(newMessage)
    setNewMessage('')
  }

  const handleNewMessageChange = (event: any) => {
    setNewMessage(event.target.value)
  }

  const otherUserId = (room: ChatRoom) => {
    if (room.isAdmin) return room.participant1Id
    return auth.userId === room.participant1Id
      ? room.participant2Id
      : room.participant1Id
  }

  const getUsersAction = usePromise(async () => {
    const users = await getUsers({
      authToken: auth.authSession.token,
    })
    return users
  }, [])
  const users = getUsersAction.result

  const getSchoolsAction = usePromise(async () => {
    const schools = await getSchools({
      authToken: auth.authSession.token,
    })
    return schools
  }, [])
  const schools = getSchoolsAction.result

  const getChatRoomLabel = (room: ChatRoom) => {
    if (!users) return ''
    if (room.isAdmin && room.participant1Id === auth.userId) return 'Admin'
    const user = users?.find((u) => u.id === otherUserId(room))
    const schoolName = schools?.find(
      (school) => school.id === user?.schoolId,
    )?.name
    const schoolNameFormatted = schoolName ? `(${schoolName})` : ''
    if (!user) return ''
    return `${user?.firstName} ${user?.lastName}  ${schoolNameFormatted}`
  }

  const getUserName = (senderId: string) => {
    const user = users?.find((u) => u.id === senderId)
    return user?.role === UserRole.Admin
      ? `${user?.firstName} (admin)`
      : user?.firstName
  }

  return (
    <>
      <DashboardNavigation user={auth.user} />
      <Container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Header as="h1" style={{paddingBottom: 20}}>
            My chat conversations
          </Header>
          <Grid style={{width: '100%', height: 'calc(70vh - 70px)'}}>
            <Grid.Column width={4} style={{backgroundColor: '#e6e6e6'}}>
              <Header>Participants</Header>
              <Menu fluid vertical tabular>
                {myChatRooms.map((room) => {
                  const chatRoomLabel = getChatRoomLabel(room)
                  return (
                    <Menu.Item
                      active={activeChatRoomId === room.id}
                      style={{
                        backgroundColor:
                          activeChatRoomId === room.id ? '#4d7298' : 'white',
                        color: activeChatRoomId === room.id ? 'white' : 'black',
                      }}
                      onClick={() => {
                        setActiveChatRoomId(room.id)
                        router.query.chatRoomId = room.id
                        router.push(router)
                      }}
                    >
                      {chatRoomLabel}
                    </Menu.Item>
                  )
                })}
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
              {activeChatRoomId ? (
                <div>
                  <Header as="h4" />
                  <Segment
                    style={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      maxHeight: 'calc(70vh - 70px)',
                      justifyContent: 'space-between',
                      overflow: 'scroll',
                    }}
                  >
                    <ol className={styles.messagesList}>
                      {messages.map((message: any) => {
                        const currentUser =
                          message.ownedByCurrentUser ||
                          message.senderId === auth.userId
                        return (
                          <li style={{display: 'block'}}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: currentUser
                                  ? 'flex-end'
                                  : 'flex-start',
                                fontSize: 10,
                                color: 'gray',
                              }}
                            >
                              {currentUser
                                ? 'You'
                                : getUserName(
                                    message.currentSenderId || message.senderId,
                                  )}
                              ,{' '}
                              {formatRelativeDate(
                                message.createdAt || new Date(),
                              )}
                            </div>
                            <div
                              className={clsx(
                                styles.paragraph,
                                currentUser ? styles.send : styles.receive,
                              )}
                            >
                              {message.body}
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </Segment>
                  <div>
                    <Form
                      error={action.error}
                      onSubmit={form.handleSubmit(handleSubmit)}
                    >
                      <div style={{display: 'flex'}}>
                        <TextArea
                          required
                          name="message"
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
                          icon="send"
                          style={{width: 100, backgroundColor: '#4d7298'}}
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              ) : (
                <p
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 40,
                    fontSize: 16,
                  }}
                >
                  No conversation selected
                </p>
              )}
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
