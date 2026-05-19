import { useEffect, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  attendanceStatuses,
  statusActiveClasses,
  statusLabels,
  statusSoftClasses,
} from '../constants/attendance'
import { getApiErrorMessage } from '../lib/api'
import {
  getAttendances,
  getClasses,
  getStudents,
  saveBulkAttendances,
} from '../services/schoolApi'
import type { Attendance, AttendanceStatus, SchoolClass, Student } from '../types/school'
import { formatShortDate, toInputDate } from '../utils/date'

type AttendanceRowState = {
  status: AttendanceStatus
  note: string
}

type AttendanceRowsState = Record<number, AttendanceRowState>

export function AttendancePage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedDate, setSelectedDate] = useState(toInputDate())
  const [rows, setRows] = useState<AttendanceRowsState>({})
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRowsLoading, setIsRowsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClasses() {
      try {
        setIsInitialLoading(true)
        setError('')

        const classData = await getClasses()

        setClasses(classData)

        if (classData[0]) {
          setSelectedClassId(String(classData[0].id))
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Data kelas gagal dimuat.'))
      } finally {
        setIsInitialLoading(false)
      }
    }

    void loadClasses()
  }, [])

  useEffect(() => {
    if (!selectedClassId) {
      return
    }

    async function loadAttendanceRows() {
      try {
        setIsRowsLoading(true)
        setError('')
        setMessage('')

        const classId = Number(selectedClassId)
        const [studentData, attendanceData] = await Promise.all([
          getStudents(classId),
          getAttendances({
            class_id: classId,
            date: selectedDate,
          }),
        ])

        const existingAttendanceByStudent = new Map(
          attendanceData.map((attendance) => [attendance.student_id, attendance]),
        )
        const nextRows: AttendanceRowsState = {}

        studentData.forEach((student) => {
          const existingAttendance = existingAttendanceByStudent.get(student.id)

          nextRows[student.id] = {
            status: existingAttendance?.status ?? 'Hadir',
            note: existingAttendance?.note ?? '',
          }
        })

        setStudents(studentData)
        setAttendances(attendanceData)
        setRows(nextRows)
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Data absensi gagal dimuat.'))
      } finally {
        setIsRowsLoading(false)
      }
    }

    void loadAttendanceRows()
  }, [selectedClassId, selectedDate])

  const selectedClass = classes.find(
    (schoolClass) => String(schoolClass.id) === selectedClassId,
  )
  const totalByStatus = (status: AttendanceStatus) =>
    students.filter((student) => rows[student.id]?.status === status).length

  function updateRow(studentId: number, nextRow: Partial<AttendanceRowState>) {
    setRows((current) => ({
      ...current,
      [studentId]: {
        status: current[studentId]?.status ?? 'Hadir',
        note: current[studentId]?.note ?? '',
        ...nextRow,
      },
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedClassId) {
      setError('Pilih kelas terlebih dahulu.')
      return
    }

    if (!students.length) {
      setError('Kelas ini belum punya siswa untuk diabsen.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setMessage('')

      const response = await saveBulkAttendances({
        class_id: Number(selectedClassId),
        date: selectedDate,
        attendances: students.map((student) => ({
          student_id: student.id,
          status: rows[student.id]?.status ?? 'Hadir',
          note: rows[student.id]?.note ?? '',
        })),
      })

      setAttendances(response.data)
      setMessage(response.message ?? 'Data absensi berhasil disimpan.')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data absensi gagal disimpan.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Input Absensi Manual</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Pilih kelas dan tanggal, lalu tentukan status setiap siswa. Kalau data
              untuk tanggal yang sama sudah ada, sistem akan update otomatis.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Kelas</span>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                disabled={isInitialLoading}
                onChange={(event) => {
                  setSelectedClassId(event.target.value)

                  if (!event.target.value) {
                    setStudents([])
                    setAttendances([])
                    setRows({})
                  }
                }}
                value={selectedClassId}
              >
                <option value="">Pilih kelas</option>
                {classes.map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tanggal</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) => setSelectedDate(event.target.value)}
                type="date"
                value={selectedDate}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {attendanceStatuses.map((status) => (
          <div
            className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)] ring-1 ${statusSoftClasses[status]}`}
            key={status}
          >
            <p className="text-sm font-semibold">{statusLabels[status]}</p>
            <strong className="mt-2 block text-3xl font-bold text-slate-950">
              {totalByStatus(status)}
            </strong>
          </div>
        ))}
      </section>

      <form
        className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">
              {selectedClass?.name ?? 'Pilih kelas dulu'}
            </h3>
            <p className="text-sm text-slate-500">
              Tanggal {formatShortDate(selectedDate)} - {students.length} siswa
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || isRowsLoading || !students.length}
            type="submit"
          >
            <Icon className="h-4 w-4" name="check" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {error ? <Alert message={error} tone="danger" /> : null}
          {message ? <Alert message={message} tone="success" /> : null}
        </div>

        {isRowsLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="h-24 animate-pulse rounded-3xl bg-slate-50" key={index} />
            ))}
          </div>
        ) : students.length ? (
          <div className="mt-6 space-y-4">
            {students.map((student) => (
              <article
                className="rounded-3xl border border-slate-100 bg-slate-50/60 p-4"
                key={student.id}
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-950">{student.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      NIS {student.nis} - {student.school_class?.name ?? selectedClass?.name}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attendanceStatuses.map((status) => {
                      const isActive = rows[student.id]?.status === status

                      return (
                        <button
                          className={`rounded-full border px-4 py-2 text-sm font-bold shadow-lg transition ${
                            isActive
                              ? statusActiveClasses[status]
                              : 'border-slate-200 bg-white text-slate-500 shadow-transparent hover:border-blue-200 hover:text-blue-700'
                          }`}
                          key={status}
                          onClick={() => updateRow(student.id, { status })}
                          type="button"
                        >
                          {statusLabels[status]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold text-slate-500">
                    Catatan opsional
                  </span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    onChange={(event) =>
                      updateRow(student.id, { note: event.target.value })
                    }
                    placeholder="Contoh: surat dokter, izin keluarga, telat 10 menit"
                    value={rows[student.id]?.note ?? ''}
                  />
                </label>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              description="Pilih kelas yang sudah punya siswa. Kalau kosong, isi data siswa dulu dari menu Data Siswa."
              title="Belum ada siswa untuk diabsen"
            />
          </div>
        )}
      </form>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <h3 className="text-lg font-bold text-slate-950">Absensi Tersimpan</h3>
        <p className="text-sm text-slate-500">
          Riwayat untuk kelas dan tanggal yang sedang dipilih.
        </p>

        {attendances.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Siswa</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr className="border-b border-slate-50" key={attendance.id}>
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {attendance.student?.name ?? '-'}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={attendance.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {attendance.note ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              description="Setelah tombol Simpan Absensi ditekan, data untuk tanggal ini akan muncul di sini."
              title="Belum ada absensi tersimpan"
            />
          </div>
        )}
      </section>
    </div>
  )
}
