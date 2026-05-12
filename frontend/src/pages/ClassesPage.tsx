import { useEffect, useState } from 'react'
import { Alert } from '../components/ui/Alert'
import { EmptyState } from '../components/ui/EmptyState'
import { getApiErrorMessage } from '../lib/api'
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from '../services/schoolApi'
import type { SchoolClass, SchoolClassPayload } from '../types/school'

const emptyForm: SchoolClassPayload = {
  name: '',
  level: '',
  major: '',
}

export function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [form, setForm] = useState<SchoolClassPayload>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadClasses() {
    try {
      setIsLoading(true)
      setError('')
      setClasses(await getClasses())
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data kelas gagal dimuat.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    getClasses()
      .then((classData) => {
        if (isMounted) {
          setClasses(classData)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, 'Data kelas gagal dimuat.'))
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError('')
      setMessage('')

      const response = editingId
        ? await updateClass(editingId, form)
        : await createClass(form)

      setMessage(response.message ?? 'Data kelas berhasil disimpan.')
      setForm(emptyForm)
      setEditingId(null)
      await loadClasses()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data kelas gagal disimpan.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(schoolClass: SchoolClass) {
    setEditingId(schoolClass.id)
    setForm({
      name: schoolClass.name,
      level: schoolClass.level,
      major: schoolClass.major,
    })
    setMessage('')
    setError('')
  }

  async function handleDelete(schoolClass: SchoolClass) {
    const confirmed = window.confirm(
      `Hapus kelas ${schoolClass.name}? Data siswa dan absensi di kelas ini juga ikut terhapus.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')
      const response = await deleteClass(schoolClass.id)

      setMessage(response.message ?? 'Data kelas berhasil dihapus.')
      await loadClasses()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data kelas gagal dihapus.'))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <h3 className="text-lg font-bold text-slate-950">
          {editingId ? 'Edit Kelas' : 'Tambah Kelas'}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Simpan data kelas sebagai dasar pengelompokan siswa.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nama kelas</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Contoh: X RPL 1"
              required
              value={form.name}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tingkat</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({ ...current, level: event.target.value }))
                }
                placeholder="X / XI / XII"
                required
                value={form.level}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Jurusan</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                onChange={(event) =>
                  setForm((current) => ({ ...current, major: event.target.value }))
                }
                placeholder="RPL / TKJ / AKL"
                required
                value={form.major}
              />
            </label>
          </div>

          {error ? <Alert message={error} tone="danger" /> : null}
          {message ? <Alert message={message} tone="success" /> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Menyimpan...' : editingId ? 'Update Kelas' : 'Simpan Kelas'}
            </button>

            {editingId ? (
              <button
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm)
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Daftar Kelas</h3>
            <p className="text-sm text-slate-500">
              Total {classes.length} kelas tersimpan.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-20 animate-pulse rounded-2xl bg-slate-50" key={index} />
            ))}
          </div>
        ) : classes.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Nama Kelas</th>
                  <th className="px-4 py-3 font-semibold">Tingkat</th>
                  <th className="px-4 py-3 font-semibold">Jurusan</th>
                  <th className="px-4 py-3 font-semibold">Siswa</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((schoolClass) => (
                  <tr className="border-b border-slate-50" key={schoolClass.id}>
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {schoolClass.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{schoolClass.level}</td>
                    <td className="px-4 py-4 text-slate-600">{schoolClass.major}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {schoolClass.students_count ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                          onClick={() => handleEdit(schoolClass)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700"
                          onClick={() => void handleDelete(schoolClass)}
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
              description="Tambahkan kelas pertama dulu, lalu lanjut isi data siswa."
              title="Belum ada data kelas"
            />
          </div>
        )}
      </section>
    </div>
  )
}
