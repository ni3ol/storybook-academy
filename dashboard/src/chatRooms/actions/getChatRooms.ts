import {makeRequest} from '../../shared/utils'
import {ChatRoom, chatRoomSchema} from '../model'

type Filters = {
  id?: string
}

export const getChatRooms = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/chatRooms',
    queryParams: filters,
  })

  const chatRooms: ChatRoom[] = data.entities.map((dto: any) =>
    chatRoomSchema.parse(dto),
  )
  return chatRooms
}
