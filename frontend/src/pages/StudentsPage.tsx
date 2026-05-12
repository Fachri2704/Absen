import { useEffect, useState } from 'react'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { getApiErrorMessage } from '../lib/api'
import {
  createStudent,
  deleteStudent,
  getClasses,
  getStudents,
  updateStudent,
} from '../services/schoolApi'
import type { Gender, SchoolClass, Student, StudentPayload } from '../types/school'

type StudentForm = {
  class_id: string
  name: string
  nis: string
  gender: Gender
  address: string
  phone: string
}

const emptyForm: StudentForm = {
  class_id: '',
  name: '',
  nis: '',
  gender: 'male',
  address: '',
  phone: '',
}

export function StudentsPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState<StudentForm>(emptyForm)
  const [classFilter, setClassFilter] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadData() {
    try {
      setIsLoading(true)
      setError('')

      const [classData, studentData] = await Promise.all([getClasses(), getStudents()])

      setClasses(classData)
      setStudents(studentData)

      if (!form.class_id && classData[0]) {
        setForm((current) => ({ ...current, class_id: String(classData[0].id) }))
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data siswa gagal dimuat.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([getClasses(), getStudents()])
      .then(([classData, studentData]) => {
        if (!isMounted) {
          return
        }

        setClasses(classData)
        setStudents(studentData)

        if (classData[0]) {
          setForm((current) =>
            current.class_id ? current : { ...current, class_id: String(classData[0].id) },
          )
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, 'Data siswa gagal dimuat.'))
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

  const displayedStudents = classFilter
    ? students.filter((student) => String(student.class_id) === classFilter)
    : students

  function buildPayload(): StudentPayload {
    return {
      class_id: Number(form.class_id),
      name: form.name,
      nis: form.nis,
      gender: form.gender,
      address: form.address,
      phone: form.phone,
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.class_id) {
      setError('Pilih kelas terlebih dahulu sebelum menyimpan siswa.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setMessage('')

      const response = editingId
        ? await updateStudent(editingId, buildPayload())
        : await createStudent(buildPayload())

      setMessage(response.message ?? 'Data siswa berhasil disimpan.')
      setEditingId(null)
      setForm({
        ...emptyForm,
        class_id: form.class_id,
      })
      await loadData()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data siswa gagal disimpan.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(student: Student) {
    setEditingId(student.id)
    setForm({
      class_id: String(student.class_id),
      name: student.name,
      nis: student.nis,
      gender: student.gender,
      address: student.address ?? '',
      phone: student.phone ?? '',
    })
    setMessage('')
    setError('')
  }

  async function handleDelete(student: Student) {
    const confirmed = window.confirm(`Hapus data siswa ${student.name}?`)

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')
      const response = await deleteStudent(student.id)

      setMessage(response.message ?? 'Data siswa berhasil dihapus.')
      await loadData()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data siswa gagal dihapus.'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <h3 className="text-lg font-bold text-slate-950">
          {editingId ? 'Edit Siswa' : 'Tambah Siswa'}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Data ini akan dipakai saat guru melakukan input absensi manual.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Kelas</span>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                setForm((current) => ({ ...current, class_id: event.target.value }))
              }
              required
              value={form.class_id}
            >
              <option value="">Pilih kelas</option>
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Nama siswa</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Nama lengkap"
                required
                value={form.name}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">NIS</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({ ...current, nis: event.target.value }))
                }
                placeholder="Nomor induk siswa"
                required
                value={form.nis}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Jenis kelamin
              </span>
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value as Gender,
                  }))
                }
                value={form.gender}
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">No. HP</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="Opsional"
                value={form.phone}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Alamat</span>
            <textarea
              className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                setForm((current) => ({ ...current, address: event.target.value }))
              }
              placeholder="Opsional"
              value={form.address}
            />
          </label>

          {error ? <Alert message={error} tone="danger" /> : null}
          {message ? <Alert message={message} tone="success" /> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !classes.length}
              type="submit"
            >
              {isSubmitting ? 'Menyimpan...' : editingId ? 'Update Siswa' : 'Simpan Siswa'}
            </button>

            {editingId ? (
              <button
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                onClick={() => {
                  setEditingId(null)
                  setForm({
                    ...emptyForm,
                    class_id: form.class_id,
                  })
                }}
                type="button"
              >
                Batal Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Daftar Siswa</h3>
            <p className="text-sm text-slate-500">
              Total {displayedStudents.length} siswa ditampilkan.
            </p>
          </div>

          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            onChange={(event) => setClassFilter(event.target.value)}
            value={classFilter}
          >
            <option value="">Semua kelas</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="h-20 animate-pulse rounded-2xl bg-slate-50" key={index} />
            ))}
          </div>
        ) : displayedStudents.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">NIS</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Gender</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => (
                  <tr className="border-b border-slate-50" key={student.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.phone ?? '-'}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{student.nis}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {student.school_class?.name ?? '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                          onClick={() => handleEdit(student)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700"
                          onClick={() => void handleDelete(student)}
                          type="button"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              description="Kalau kelas sudah ada, tambahkan siswa dari form di samping kiri."
              title="Belum ada data siswa"
            />
          </div>
        )}
      </section>
    </div>
  )
}
