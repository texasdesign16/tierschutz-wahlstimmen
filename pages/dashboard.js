import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchEintraege, appendEintrag } from '../lib/sheet'

export default function Dashboard() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [briefwahl, setBriefwahl] = useState(false)
  const [eintraege, setEintraege] = useState([])
  const [mitglied, setMitglied] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('mitglied')
    if (!stored || stored === 'Admin') {
      router.push('/')
    } else {
      setMitglied(stored)
      ladeEintraege()
    }
  }, [])

  const ladeEintraege = async () => {
    const daten = await fetchEintraege()
    const gefiltert = daten.filter(e => e.mitglied === mitglied)
    setEintraege(gefiltert.reverse())
  }

  const addEintrag = async () => {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return alert('Bitte einen Namen eingeben')

    const vorhanden = eintraege.some(e => e.name?.trim().toLowerCase() === trimmed)
    if (vorhanden) return alert('Name wurde bereits eingetragen')

    await appendEintrag(name.trim(), briefwahl, mitglied)
    setName('')
    setBriefwahl(false)
    ladeEintraege()
  }

  const handleLogout = () => {
    localStorage.removeItem('mitglied')
    router.push('/')
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Willkommen, {mitglied}!</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 underline">
          Logout
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded flex-1"
          placeholder="Name der wählenden Person"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={briefwahl}
            onChange={e => setBriefwahl(e.target.checked)}
          />
          Briefwahl
        </label>
        <button
          onClick={addEintrag}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Eintragen
        </button>
      </div>

      <ul className="space-y-2">
        {eintraege.map((e, i) => (
          <li
            key={i}
            className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
          >
            <span>
              {e.name}{' '}
              {e.briefwahl?.toLowerCase() === 'ja' && (
                <span className="text-sm text-green-600">(Briefwahl)</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
