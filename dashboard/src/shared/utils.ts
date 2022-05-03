import axios from 'axios'
import queryString from 'query-string'
import {format} from 'date-fns'

export type Pagination = {
  page: number
  pageSize: number
}

export class ValidationError extends Error {
  fields?: any[]

  super(message: string, fields?: any[]) {
    this.message = message
    this.fields = fields
  }
}

const baseUrl = process.env.BASE_URL || 'http://localhost:5000'

export const makeRequest = async ({
  method,
  path,
  queryParams,
  data,
  authToken,
}: {
  method: 'get' | 'post' | 'patch' | 'delete'
  path: string
  queryParams?: Record<string, any>
  data?: Record<string, any>
  authToken?: string
}) => {
  try {
    const response = await axios({
      headers: {
        'Content-type': 'application/json',
        ...(authToken ? {Authorization: authToken} : {}),
      },
      method,
      url: `${baseUrl}${path}${
        queryParams ? `?${queryString.stringify(queryParams)}` : ''
      }`,
      data,
    })

    return {
      status: response.status,
      data: response.data,
    }
  } catch (error: any) {
    const response: Record<string, any> | undefined = error?.response
    const errorJson = response?.data?.error
    const message = errorJson?.message

    if (response) {
      if (response.status >= 400 && response.status < 500) {
        throw new ValidationError(message, response.data)
      }
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(message)
      }
    }

    throw error
  }
}

export const requireEnvVar = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const formatDate = (date: Date) => {
  return format(date, 'd MMM yyy HH:mm:ss')
}
