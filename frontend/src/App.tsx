import { useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { roleHomePage } from './constants/navigation'
import { AttendancePage } from './pages/AttendancePage'
import { ClassesPage } from './pages/ClassesPage'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { StudentAttendanceHistoryPage } from './pages/StudentAttendanceHistoryPage'
import { StudentProfilePage } from './pages/StudentProfilePage'
import { StudentsPage } from './pages/StudentsPage'
import type { PageKey } from './types/navigation'
import type { UserRole } from './types/role'

function App() {
  const [role, setRole] = useState<UserRole>('admin')
  const [activePage, setActivePage] = useState<PageKey>('dashboard')

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole)
    setActivePage(roleHomePage[nextRole])
  }

  function renderPage() {
    if (activePage === 'dashboard') {
      return <DashboardPage />
    }

    if (activePage === 'classes') {
      return <ClassesPage readonly={role === 'teacher'} />
    }

    if (activePage === 'students') {
      return <StudentsPage />
    }

    if (activePage === 'teachers') {
      return (
        <PlaceholderPage
          description="Action admin untuk tambah guru sudah disiapkan di menu. Supaya bisa benar-benar CRUD, tahap berikutnya kita perlu tambah tabel teachers, model, controller, dan API teachers."
          icon="school"
          title="Data Guru"
        />
      )
    }

    if (activePage === 'subjects') {
      return (
        <PlaceholderPage
          description="Action admin untuk tambah mata pelajaran sudah disiapkan di menu. CRUD mapel butuh tabel subjects dan API subjects sebelum login dipasang."
          icon="note"
          title="Mata Pelajaran"
        />
      )
    }

    if (activePage === 'attendance') {
      return <AttendancePage />
    }

    if (activePage === 'recap') {
      return (
        <PlaceholderPage
          description="Admin bisa melihat rekap semua kelas, sedangkan guru nanti dibatasi ke kelas yang diajar. Filter detail dan export akan masuk ke Versi 2."
          icon="activity"
          title="Rekap Absensi"
        />
      )
    }

    if (activePage === 'reports') {
      return (
        <PlaceholderPage
          description="Admin bisa melihat semua laporan. Export PDF dan Excel masuk ke Versi 2, jadi halaman laporan sudah disiapkan tempatnya."
          icon="file"
          title="Laporan"
        />
      )
    }

    if (activePage === 'profile') {
      return <StudentProfilePage />
    }

    if (activePage === 'attendanceHistory') {
      return <StudentAttendanceHistoryPage />
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
    <DashboardLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onRoleChange={handleRoleChange}
      role={role}
    >
      {renderPage()}
    </DashboardLayout>
  )
}

export default App
