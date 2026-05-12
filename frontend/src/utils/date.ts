export function toInputDate(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().slice(0, 10)
}

export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatShortDate(dateValue: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue))
}

export function getLastDays(totalDays: number) {
  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (totalDays - index - 1))

    return {
      label: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date),
      value: toInputDate(date),
    }
  })
}
