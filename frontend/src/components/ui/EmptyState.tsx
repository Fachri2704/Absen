import type { ReactNode } from 'react'
import { Icon } from '../icons/Icon'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon className="h-6 w-6" name="spark" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
