import { api } from '../lib/api'
import type {
  Attendance,
  AttendancePayload,
  BulkAttendancePayload,
  SchoolClass,
  SchoolClassPayload,
  Student,
  StudentPayload,
} from '../types/school'

type ApiData<T> = {
  data: T
  message?: string
}

type AttendanceFilters = {
  class_id?: number
  student_id?: number
  date?: string
  start_date?: string
  end_date?: string
}

export async function getClasses() {
  const response = await api.get<ApiData<SchoolClass[]>>('/classes')

  return response.data.data
}

export async function createClass(payload: SchoolClassPayload) {
  const response = await api.post<ApiData<SchoolClass>>('/classes', payload)

  return response.data
}

export async function updateClass(id: number, payload: SchoolClassPayload) {
  const response = await api.put<ApiData<SchoolClass>>(`/classes/${id}`, payload)

  return response.data
}

export async function deleteClass(id: number) {
  const response = await api.delete<ApiData<null>>(`/classes/${id}`)

  return response.data
}

export async function getStudents(classId?: number) {
  const response = await api.get<ApiData<Student[]>>('/students', {
    params: classId ? { class_id: classId } : undefined,
  })

  return response.data.data
}

export async function createStudent(payload: StudentPayload) {
  const response = await api.post<ApiData<Student>>('/students', payload)

  return response.data
}

export async function updateStudent(id: number, payload: StudentPayload) {
  const response = await api.put<ApiData<Student>>(`/students/${id}`, payload)

  return response.data
}

export async function deleteStudent(id: number) {
  const response = await api.delete<ApiData<null>>(`/students/${id}`)

  return response.data
}

export async function getAttendances(filters?: AttendanceFilters) {
  const response = await api.get<ApiData<Attendance[]>>('/attendances', {
    params: filters,
  })

  return response.data.data
}

export async function createAttendance(payload: AttendancePayload) {
  const response = await api.post<ApiData<Attendance>>('/attendances', payload)

  return response.data
}

export async function saveBulkAttendances(payload: BulkAttendancePayload) {
  const response = await api.post<ApiData<Attendance[]>>(
    '/attendances/bulk',
    payload,
  )

  return response.data
}
