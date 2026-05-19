import { useEffect, useState } from 'react'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getApiErrorMessage } from '../lib/api'
import { getAttendances, getStudents } from '../services/schoolApi'
import type { Attendance, Student } from '../types/school'
import { formatShortDate } from '../utils/date'

export function StudentAttendanceHistoryPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [isLoadingStudents, setIsLoadingStudents] = useState(true)
  const [isLoadingAttendances, setIsLoadingAttendances] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    getStudents()
      .then((studentData) => {
        if (!isMounted) {
          return
        }

        setStudents(studentData)

        if (studentData[0]) {
          setIsLoadingAttendances(true)
          setSelectedStudentId(String(studentData[0].id))
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, 'Data siswa gagal dimuat.'))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingStudents(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedStudentId) {
      return
    }

    let isMounted = true

    getAttendances({ student_id: Number(selectedStudentId) })
      .then((attendanceData) => {
        if (isMounted) {
          setAttendances(attendanceData)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, 'Riwayat absensi gagal dimuat.'))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingAttendances(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [selectedStudentId])

  if (isLoadingStudents) {
    return <div className="h-72 animate-pulse rounded-3xl bg-white" />
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Mode Siswa</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-950">
            Riwayat Absensi Saya
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Siswa hanya melihat absensi miliknya sendiri. Pemilih siswa ini sementara
            sampai login session dipasang.
          </p>
        </div>

        <select
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          onChange={(event) => {
            setError('')
            setSelectedStudentId(event.target.value)

            if (!event.target.value) {
              setAttendances([])
              setIsLoadingAttendances(false)
            } else {
              setIsLoadingAttendances(true)
            }
          }}
          value={selectedStudentId}
        >
          <option value="">Pilih siswa</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 space-y-3">
        {error ? <Alert message={error} tone="danger" /> : null}
      </div>

      {isLoadingAttendances ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="h-16 animate-pulse rounded-2xl bg-slate-50" key={index} />
          ))}
        </div>
      ) : attendances.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Kelas</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr className="border-b border-slate-50" key={attendance.id}>
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {formatShortDate(attendance.date)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {attendance.school_class?.name ?? '-'}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={attendance.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">{attendance.note ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            description="Riwayat akan muncul setelah guru menyimpan absensi untuk siswa ini."
            title="Belum ada riwayat absensi"
          />
        </div>
      )}
    </section>
  )
}
