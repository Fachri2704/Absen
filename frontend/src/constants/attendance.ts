import type { AttendanceStatus } from '../types/school'

export const attendanceStatuses: AttendanceStatus[] = [
  'Hadir',
  'Sakit',
  'Izin',
  'Alpa',
  'Telat',
]

export const statusLabels: Record<AttendanceStatus, string> = {
  Hadir: 'Hadir',
  Sakit: 'Sakit',
  Izin: 'Izin',
  Alpa: 'Alpha',
  Telat: 'Telat',
}

export const statusSoftClasses: Record<AttendanceStatus, string> = {
  Hadir: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Sakit: 'bg-sky-50 text-sky-700 ring-sky-100',
  Izin: 'bg-amber-50 text-amber-700 ring-amber-100',
  Alpa: 'bg-rose-50 text-rose-700 ring-rose-100',
  Telat: 'bg-orange-50 text-orange-700 ring-orange-100',
}

export const statusActiveClasses: Record<AttendanceStatus, string> = {
  Hadir: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-100',
  Sakit: 'border-sky-500 bg-sky-500 text-white shadow-sky-100',
  Izin: 'border-amber-400 bg-amber-400 text-slate-900 shadow-amber-100',
  Alpa: 'border-rose-500 bg-rose-500 text-white shadow-rose-100',
  Telat: 'border-orange-500 bg-orange-500 text-white shadow-orange-100',
}

export const statusDotClasses: Record<AttendanceStatus, string> = {
  Hadir: 'bg-emerald-500',
  Sakit: 'bg-sky-400',
  Izin: 'bg-amber-400',
  Alpa: 'bg-rose-500',
  Telat: 'bg-orange-500',
}
