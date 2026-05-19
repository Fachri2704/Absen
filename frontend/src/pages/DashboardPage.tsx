import { useEffect, useState } from 'react'
import { statusDotClasses, statusLabels } from '../constants/attendance'
import { getAttendances, getClasses, getStudents } from '../services/schoolApi'
import type { Attendance, AttendanceStatus, SchoolClass, Student } from '../types/school'
import { getApiErrorMessage } from '../lib/api'
import { getLastDays, toInputDate } from '../utils/date'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { StatCard } from '../components/ui/StatCard'
import { StatusBadge } from '../components/ui/StatusBadge'

const weeklyDays = getLastDays(7)

export function DashboardPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const today = toInputDate()

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true)
        setError('')

        const [classData, studentData, attendanceData] = await Promise.all([
          getClasses(),
          getStudents(),
          getAttendances({
            start_date: weeklyDays[0].value,
            end_date: today,
          }),
        ])

        setClasses(classData)
        setStudents(studentData)
        setAttendances(attendanceData)
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            'Dashboard belum bisa memuat data dari API Laravel.',
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadDashboard()
  }, [today])

  const todayAttendances = attendances.filter(
    (attendance) => attendance.date.slice(0, 10) === today,
  )
  const countByStatus = (status: AttendanceStatus) =>
    todayAttendances.filter((attendance) => attendance.status === status).length
  const maxDailyAttendance =
    Math.max(
      ...weeklyDays.map((day) =>
        attendances.filter((attendance) => attendance.date.slice(0, 10) === day.value)
          .length,
      ),
      1,
    ) || 1
  const recentAttendances = [...attendances]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className="h-40 animate-pulse rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.04)]"
            key={index}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error ? <Alert message={error} tone="danger" /> : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          description={`${classes.length} kelas aktif terdaftar`}
          icon="users"
          label="Jumlah Siswa"
          value={students.length}
        />
        <StatCard
          description="Siswa hadir hari ini"
          icon="check"
          label="Hadir"
          tone="success"
          value={countByStatus('Hadir')}
        />
        <StatCard
          description="Siswa izin hari ini"
          icon="note"
          label="Izin"
          tone="warning"
          value={countByStatus('Izin')}
        />
        <StatCard
          description="Siswa sakit hari ini"
          icon="medical"
          label="Sakit"
          tone="info"
          value={countByStatus('Sakit')}
        />
        <StatCard
          description="Siswa alpha hari ini"
          icon="alert"
          label="Alpha"
          tone="danger"
          value={countByStatus('Alpa')}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                Grafik Absensi 7 Hari Terakhir
              </h3>
              <p className="text-sm text-slate-500">
                Ringkasan total input absensi harian.
              </p>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Mingguan
            </div>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3 rounded-3xl bg-slate-50 px-4 py-5 sm:gap-5 sm:px-6">
            {weeklyDays.map((day) => {
              const total = attendances.filter(
                (attendance) => attendance.date.slice(0, 10) === day.value,
              ).length
              const height = Math.max((total / maxDailyAttendance) * 100, total ? 18 : 6)

              return (
                <div className="flex flex-1 flex-col items-center gap-3" key={day.value}>
                  <div className="flex h-52 w-full items-end justify-center">
                    <div
                      className="w-full max-w-12 rounded-t-2xl bg-blue-600 shadow-lg shadow-blue-100 transition-all"
                      style={{ height: `${height}%` }}
                      title={`${total} absensi`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{total}</p>
                    <p className="text-xs text-slate-500">{day.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <h3 className="text-lg font-bold text-slate-950">Distribusi Hari Ini</h3>
          <p className="text-sm text-slate-500">
            {/* Warna dibuat soft supaya guru gampang scan status. */}
          </p>

          <div className="mt-6 space-y-4">
            {(['Hadir', 'Sakit', 'Izin', 'Alpa', 'Telat'] as AttendanceStatus[]).map(
              (status) => (
                <div className="flex items-center justify-between" key={status}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${statusDotClasses[status]}`}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {statusLabels[status]}
                    </span>
                  </div>
                  <strong className="text-sm text-slate-950">
                    {countByStatus(status)}
                  </strong>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Riwayat Terbaru</h3>
            <p className="text-sm text-slate-500">
              Data absensi terakhir yang masuk ke sistem.
            </p>
          </div>
        </div>

        {recentAttendances.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Siswa</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendances.map((attendance) => (
                  <tr className="border-b border-slate-50" key={attendance.id}>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {attendance.student?.name ?? '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {attendance.school_class?.name ?? '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {attendance.date.slice(0, 10)}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={attendance.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              description="Begitu guru mulai input absensi, riwayat terbaru akan muncul di sini."
              title="Belum ada data absensi"
            />
          </div>
        )}
      </section>
    </div>
  )
}
