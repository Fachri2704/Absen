import { Icon, type IconName } from '../icons/Icon'

type StatTone = 'primary' | 'success' | 'info' | 'warning' | 'danger'

type StatCardProps = {
  label: string
  value: string | number
  description: string
  icon: IconName
  tone?: StatTone
}

const toneClasses: Record<StatTone, string> = {
  primary: 'bg-blue-50 text-blue-700 ring-blue-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  danger: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export function StatCard({
  label,
  value,
  description,
  icon,
  tone = 'primary',
}: StatCardProps) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <strong className="mt-3 block text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </strong>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" name={icon} />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  )
}
