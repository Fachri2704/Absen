import { Icon, type IconName } from '../components/icons/Icon'

type PlaceholderPageProps = {
  description: string
  icon: IconName
  title: string
}

export function PlaceholderPage({ description, icon, title }: PlaceholderPageProps) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon className="h-7 w-7" name={icon} />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
      <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
        Bagian ini sengaja disiapkan sebagai placeholder supaya struktur sidebar
        sudah lengkap. Nanti saat masuk Versi 2 dan fitur login, kita tinggal isi
        kontennya tanpa bongkar layout utama.
      </div>
    </section>
  )
}
