import { useEffect, useState } from 'react'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { getApiErrorMessage } from '../lib/api'
import { getStudents } from '../services/schoolApi'
import type { Student } from '../types/school'

export function StudentProfilePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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
          setSelectedStudentId(String(studentData[0].id))
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, 'Profil siswa gagal dimuat.'))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const selectedStudent = students.find(
    (student) => String(student.id) === selectedStudentId,
  )

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-3xl bg-white" />
  }

  return (
    <div className="space-y-6">
      {error ? <Alert message={error} tone="danger" /> : null}

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Mode Siswa</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">Profil Saya</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Karena login belum dipasang, halaman ini memakai pemilih siswa sementara.
              Nanti setelah login, data ini otomatis berasal dari akun siswa yang masuk.
            </p>
          </div>

          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            onChange={(event) => setSelectedStudentId(event.target.value)}
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
      </section>

      {selectedStudent ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">Nama</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{selectedStudent.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">NIS</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{selectedStudent.nis}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">Kelas</p>
            <p className="mt-2 text-xl font-bold text-slate-950">
              {selectedStudent.school_class?.name ?? '-'}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm text-slate-500">Jenis Kelamin</p>
            <p className="mt-2 text-xl font-bold text-slate-950">
              {selectedStudent.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
            </p>
          </div>
        </section>
      ) : (
        <EmptyState
          description="Admin perlu menambahkan data siswa dulu supaya profil siswa bisa tampil."
          title="Belum ada profil siswa"
        />
      )}
    </div>
  )
}
