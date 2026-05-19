import type { IconName } from '../components/icons/Icon'
import type { PageKey } from '../types/navigation'
import type { UserRole } from '../types/role'

export type NavItem = {
  key: PageKey
  label: string
  icon: IconName
}

export const roleHomePage: Record<UserRole, PageKey> = {
  admin: 'dashboard',
  teacher: 'dashboard',
  student: 'profile',
}

export const navItemsByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { key: 'dashboard', label: 'Dashboard', icon: 'home' },
    { key: 'classes', label: 'Data Kelas', icon: 'book' },
    { key: 'students', label: 'Data Siswa', icon: 'users' },
    { key: 'teachers', label: 'Data Guru', icon: 'school' },
    { key: 'subjects', label: 'Mata Pelajaran', icon: 'note' },
    { key: 'attendance', label: 'Absensi', icon: 'clipboard' },
    { key: 'recap', label: 'Rekap', icon: 'activity' },
    { key: 'reports', label: 'Laporan', icon: 'file' },
    { key: 'settings', label: 'Pengaturan', icon: 'gear' },
  ],
  teacher: [
    { key: 'dashboard', label: 'Dashboard', icon: 'home' },
    { key: 'classes', label: 'Kelas Diajar', icon: 'book' },
    { key: 'attendance', label: 'Input Absensi', icon: 'clipboard' },
    { key: 'recap', label: 'Rekap Kelas', icon: 'activity' },
  ],
  student: [
    { key: 'profile', label: 'Profil', icon: 'users' },
    { key: 'attendanceHistory', label: 'Riwayat Absensi', icon: 'calendar' },
  ],
}

export function canAccessPage(role: UserRole, page: PageKey) {
  return navItemsByRole[role].some((item) => item.key === page)
}
