export type PageKey =
  | 'dashboard'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'recap'
  | 'reports'
  | 'settings'

export const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  classes: 'Data Kelas',
  students: 'Data Siswa',
  attendance: 'Input Absensi',
  recap: 'Rekap',
  reports: 'Laporan',
  settings: 'Pengaturan',
}
