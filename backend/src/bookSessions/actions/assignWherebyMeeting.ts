import axios from 'axios'
import {Knex} from 'knex'
import {updateBookSession} from './updateBookSession'

export const assignWherebyMeetingToBookSession = async (
  bookSessionId: string,
  params?: {trx?: Knex.Transaction},
) => {
  const API_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNjUzMzkwMTE1LCJvcmdhbml6YXRpb25JZCI6MTYxMDczLCJqdGkiOiJhNDlmNWQzNS01Mjc1LTQwZTEtOWI2Yi1jZGIzMzgzNjQyZDYifQ.inPJcdiQSp31DmwJQcPNk3It5XP5537fklpuMGNRdjw'

  const postData = {
    endDate: '2099-05-26T14:23:00.000Z',
    fields: ['hostRoomUrl'],
  }

  const response = await axios({
    url: 'https://api.whereby.dev/v1/meetings',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    data: postData,
  })

  const result = response.data.results[0]

  const updatedBookSession = await updateBookSession(
    bookSessionId,
    {
      whereByData: {
        meetingUrl: result.roomUrl,
        endDate: result.endDate,
      },
    },
    {trx: params?.trx},
  )

  return updatedBookSession
}
