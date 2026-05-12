import { statusLabels, statusSoftClasses } from '../../constants/attendance'
import type { AttendanceStatus } from '../../types/school'

type StatusBadgeProps = {
  status: AttendanceStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusSoftClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
