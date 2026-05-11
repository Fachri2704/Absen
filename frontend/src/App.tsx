import { useEffect, useState } from 'react'
import { api } from './lib/api'

function App() {
  const [message, setMessage] = useState<string>('Loading...')

  useEffect(() => {
    api
      .get('/ping')
      .then((response) => {
        setMessage(response.data.message)
      })
      .catch(() => {
        setMessage('Gagal konek ke API Laravel')
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-slate-800">
          Absensi Siswa App
        </h1>

        <p className="mt-4 text-slate-600">
          Response dari backend:
        </p>

        <p className="mt-2 font-semibold text-green-600">
          {message}
        </p>
      </div>
    </div>
  )
}

export default App