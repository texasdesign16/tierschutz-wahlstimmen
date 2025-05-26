import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchEintraege } from '../lib/sheet'

export default function Admin() {
  const [daten, setDaten] = useState([])
  const router = useRouter()

  useEffect(() => {
    const mitglied = localStorage.getItem('mitglied')
    if (mitglied !== 'Admin') router.push('/')
    else ladeAuswertung()
  }, [])

  const ladeAuswertung = async () => {
    const alle = await fetchEintraege()
    const gruppiert = {}

    alle.forEach(eintrag => {
      const m = eintrag.mitglied
      if (!gruppiert[m]) gruppiert[m] = { gesamt: 0, briefwahl: 0 }
      gruppiert[m].gesamt++
      if (eintrag.briefwahl === 'Ja') gruppiert[m].briefwahl++
    })

    const auswertung = Object.entries(gruppiert).map(([mitglied, werte]) => ({
      mitglied,
      ...werte
    }))

    setDaten(auswertung)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Adminbereich</h1>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Mitglied</th>
            <th className="p-2">Stimmen</th>
            <th className="p-2">Briefwahl</th>
          </tr>
        </thead>
        <tbody>
          {daten.map((d, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{d.mitglied}</td>
              <td className="p-2">{d.gesamt}</td>
              <td className="p-2">{d.briefwahl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
