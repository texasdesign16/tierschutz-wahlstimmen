import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [briefwahl, setBriefwahl] = useState(false)
  const [eintraege, setEintraege] = useState([])
  const [mitglied, setMitglied] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('mitglied')
    if (!stored || stored === 'Admin') router.push('/')
    else {
      setMitglied(stored)
      fetchEintraege(stored)
    }
  }, [])

  const fetchEintraege = async (mitgliedName) => {
    const { data } = await supabase
      .from('wahlstimmen')
      .select('*')
      .eq('mitglied', mitgliedName)
      .order('created_at', { ascending: false })
    setEintraege(data || [])
  }

  const addEintrag = async () => {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return alert('Bitte einen Namen eingeben')
    
    const { data: existing } = await supabase
      .from('wahlstimmen')
      .select('id')
      .eq('mitglied', mitglied)
    
    const duplikat = existing?.some(e => e.name.trim().toLowerCase() === trimmed)
    if (duplikat) return alert('Name bereits eingetragen')

    const { error } = await supabase.from('wahlstimmen').insert({
      name: name.trim(),
      briefwahl,
      mitglied
    })

    if (!error) {
      setName('')
      setBriefwahl(false)
      fetchEintraege(mitglied)
    }
  }

  const deleteEintrag = async (id) => {
    await supabase.from('wahlstimmen').delete().eq('id', id)
    fetchEintraege(mitglied)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Willkommen, {mitglied}!</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Eintragen
        </button>
      </div>

      <ul className="space-y-2">
        {eintraege.map(e => (
          <li key={e.id} className="flex justify-between items-center border p-2 rounded">
            <span>
              {e.name} {e.briefwahl && <span className="text-sm text-green-600">(Briefwahl)</span>}
            </span>
            <button
              onClick={() => deleteEintrag(e.id)}
              className="text-red-600 hover:underline"
            >
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
