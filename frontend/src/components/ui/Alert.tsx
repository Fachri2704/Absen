type AlertTone = 'success' | 'danger' | 'info'

type AlertProps = {
  tone?: AlertTone
  message: string
}

const alertClasses: Record<AlertTone, string> = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  danger: 'border-rose-100 bg-rose-50 text-rose-700',
  info: 'border-sky-100 bg-sky-50 text-sky-700',
}

export function Alert({ tone = 'info', message }: AlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${alertClasses[tone]}`}>
      {message}
    </div>
  )
}
