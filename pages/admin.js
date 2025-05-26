import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchEintraege } from '../lib/sheet'

export default function Admin() {
  const [daten, setDaten] = useState([])
  const router = useRouter()

  useEffect(() => {
    const mitglied = localStorage.getItem('mitglied')
    if (mitglied !== 'Admin') {
      router.push('/')
    } else {
      ladeAuswertung()
    }
  }, [])

  const ladeAuswertung = async () => {
    const eintraege = await fetchEintraege()
    const gruppiert = {}

    eintraege.forEach(eintrag => {
      const m = eintrag.mitglied || 'Unbekannt'
      if (!gruppiert[m]) gruppiert[m] = { gesamt: 0, briefwahl: 0 }
      gruppiert[m].gesamt++
      if (eintrag.briefwahl?.toLowerCase() === 'ja') gruppiert[m].briefwahl++
    })

    const auswertung = Object.entries(gruppiert).map(([mitglied, werte]) => ({
      mitglied,
      ...werte,
    }))

    setDaten(auswertung)
  }

  const handleLogout = () => {
    localStorage.removeItem('mitglied')
    router.push('/')
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Adminbereich – Auswertung</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Mitglied</th>
              <th className="p-3 border">Gesamt</th>
              <th className="p-3 border">Briefwahl</th>
            </tr>
          </thead>
          <tbody>
            {daten.map((d, i) => (
              <tr key={i} className="text-center border-t hover:bg-gray-50">
                <td className="p-3 border font-medium">{d.mitglied}</td>
                <td className="p-3 border">{d.gesamt}</td>
                <td className="p-3 border">{d.briefwahl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
