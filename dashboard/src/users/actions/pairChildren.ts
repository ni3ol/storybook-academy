import {makeRequest} from '../../shared/utils'

export const pairChildren = async ({
  data,
  authToken,
}: {
  data: {child1Id: string; child2Id: string}
  authToken: string
}) => {
  await makeRequest({
    authToken,
    method: 'post',
    path: `/users/pairChildren`,
    data: {child1Id: data.child1Id, child2Id: data.child2Id},
  })
}
