import {User} from '../users/model'

export type Serializer<E> = (
  entity: E,
  params?: {as?: {user?: User}},
) => Record<string, any> | Promise<Record<string, any>>
