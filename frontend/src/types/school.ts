export type Gender = 'male' | 'female'

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Telat'

export type SchoolClass = {
  id: number
  name: string
  level: string
  major: string
  students_count?: number
  students?: Student[]
  created_at?: string
  updated_at?: string
}

export type Student = {
  id: number
  class_id: number
  name: string
  nis: string
  gender: Gender
  address?: string | null
  phone?: string | null
  school_class?: SchoolClass
  attendances?: Attendance[]
  created_at?: string
  updated_at?: string
}

export type Attendance = {
  id: number
  student_id: number
  class_id: number
  date: string
  status: AttendanceStatus
  note?: string | null
  student?: Student
  school_class?: SchoolClass
  created_at?: string
  updated_at?: string
}

export type SchoolClassPayload = {
  name: string
  level: string
  major: string
}

export type StudentPayload = {
  class_id: number
  name: string
  nis: string
  gender: Gender
  address?: string
  phone?: string
}

export type AttendancePayload = {
  student_id: number
  class_id: number
  date: string
  status: AttendanceStatus
  note?: string
}

export type BulkAttendancePayload = {
  class_id: number
  date: string
  attendances: Array<{
    student_id: number
    status: AttendanceStatus
    note?: string
  }>
}
