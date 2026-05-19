export type PageKey =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'teachers'
  | 'subjects'
  | 'attendance'
  | 'recap'
  | 'reports'
  | 'profile'
  | 'attendanceHistory'
  | 'settings'

export const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  classes: 'Data Kelas',
  students: 'Data Siswa',
  teachers: 'Data Guru',
  subjects: 'Mata Pelajaran',
  attendance: 'Input Absensi',
  recap: 'Rekap Absensi',
  reports: 'Laporan',
  profile: 'Profil Siswa',
  attendanceHistory: 'Riwayat Absensi',
  settings: 'Pengaturan',
}
