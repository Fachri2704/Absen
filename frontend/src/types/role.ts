export type UserRole = 'admin' | 'teacher' | 'student'

export const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  teacher: 'Guru',
  student: 'Siswa',
}

export const roleDescriptions: Record<UserRole, string> = {
  admin: 'Mengatur data master dan melihat semua laporan.',
  teacher: 'Input absensi dan melihat rekap kelas yang diajar.',
  student: 'Melihat profil dan riwayat absensi sendiri.',
}
