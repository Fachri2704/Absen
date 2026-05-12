import { useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AttendancePage } from './pages/AttendancePage'
import { ClassesPage } from './pages/ClassesPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { StudentsPage } from './pages/StudentsPage'
import type { PageKey } from './types/navigation'

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')

  function renderPage() {
    if (activePage === 'dashboard') {
      return <DashboardPage />
    }

    if (activePage === 'classes') {
      return <ClassesPage />
    }

    if (activePage === 'students') {
      return <StudentsPage />
    }

    if (activePage === 'attendance') {
      return <AttendancePage />
    }

    if (activePage === 'recap') {
      return (
        <PlaceholderPage
          description="Rekap absensi per kelas dan per siswa akan kita isi setelah fitur input absensi stabil."
          icon="activity"
          title="Rekap Absensi"
        />
      )
    }

    if (activePage === 'reports') {
      return (
        <PlaceholderPage
          description="Export PDF dan Excel masuk ke Versi 2, jadi halaman laporan sudah disiapkan tempatnya."
          icon="file"
          title="Laporan"
        />
      )
    }

    return (
      <PlaceholderPage
        description="Pengaturan sekolah, role, dan akun akan lebih masuk akal setelah login Sanctum kita pasang."
        icon="gear"
        title="Pengaturan"
      />
    )
  }

  return (
    <DashboardLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  )
}

export default App
