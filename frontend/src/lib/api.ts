import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

type LaravelErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan. Coba lagi sebentar.',
) {
  if (!axios.isAxiosError<LaravelErrorResponse>(error)) {
    return fallback
  }

  const responseData = error.response?.data
  const firstValidationError = responseData?.errors
    ? Object.values(responseData.errors)[0]?.[0]
    : undefined

  return firstValidationError ?? responseData?.message ?? fallback
}
