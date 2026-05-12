import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icons/Icon'
import { formatLongDate } from '../../utils/date'
import { pageTitles, type PageKey } from '../../types/navigation'

type DashboardLayoutProps = {
  activePage: PageKey
  children: ReactNode
  onNavigate: (page: PageKey) => void
}

type NavItem = {
  key: PageKey
  label: string
  icon: IconName
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'classes', label: 'Data Kelas', icon: 'book' },
  { key: 'students', label: 'Data Siswa', icon: 'users' },
  { key: 'attendance', label: 'Absensi', icon: 'clipboard' },
  { key: 'recap', label: 'Rekap', icon: 'activity' },
  { key: 'reports', label: 'Laporan', icon: 'file' },
  { key: 'settings', label: 'Pengaturan', icon: 'gear' },
]

export function DashboardLayout({
  activePage,
  children,
  onNavigate,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
              <Icon className="h-6 w-6" name="school" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600">Absensi Siswa</p>
              <h1 className="text-lg font-bold tracking-tight text-slate-950">
                School Admin
              </h1>
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const isActive = item.key === activePage

              return (
                <button
                  className={`group flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  type="button"
                >
                  <Icon className="h-5 w-5" name={item.icon} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* <div className="mt-8 hidden rounded-3xl bg-slate-950 p-5 text-white lg:block">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Icon className="h-5 w-5" name="spark" />
            </div>
            <p className="mt-4 text-sm font-semibold">Versi 1 Basic</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Fokus sekarang: data kelas, data siswa, dan input absensi manual.
            </p>
          </div> */}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-[var(--background)]/90 px-4 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  SMK Nusantara Digital
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  {pageTitles[activePage]}
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  <Icon className="h-4 w-4 text-blue-600" name="calendar" />
                  <span>{formatLongDate()}</span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    AS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      Admin Sekolah
                    </p>
                    <p className="text-xs text-slate-500">Guru piket</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
