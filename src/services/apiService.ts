import { SERVER_BASE_URL } from '@/constants/endpoint'

const apiService = {
  async get(url: string, search?: string) {
    const response = await fetch(
      `${SERVER_BASE_URL}${url}${search ? `?q=${search}` : ''}`,
      {
        cache: 'no-store',
      },
    )
    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.statusText}`)
    }

    return response.json()
  },

  async post(url: string, data) {
    const response = await fetch(`${SERVER_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  async put(url: string, data) {
    const response = await fetch(`${SERVER_BASE_URL}${url}/${data?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },

  async delete(url: string, id: string) {
    const response = await fetch(`${SERVER_BASE_URL}${url}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.statusText}`)
    }
    return response.json()
  },
}

export default apiService
