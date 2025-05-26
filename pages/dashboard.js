import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Sicherer Supabase-Import mit Fallback
let supabase = null
try {
  const { createClient } = require('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('⚠️ Supabase-Konfiguration fehlt.')
  } else {
    supabase = createClient(url, key)
  }
} catch (e) {
  console.error('❌ Supabase konnte nicht geladen werden:', e.message)
}

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
      if (supabase) fetchEintraege(stored)
    }
  }, [])

  const fetchEintraege = async (mitgliedName) => {
    try {
      const { data, error } = await supabase
        .from('wahlstimmen1')
        .select('*')
        .eq('mitglied', mitgliedName)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEintraege(data || [])
    } catch (err) {
      console.error('❌ Fehler beim Laden:', err.message)
    }
  }

  const addEintrag = async () => {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return alert('Bitte einen Namen eingeben')
    if (!supabase) return alert('Supabase nicht verfügbar')

    try {
      const { data: existing } = await supabase
        .from('wahlstimmen1')
        .select('id, name')
        .eq('mitglied', mitglied)

      const duplikat = existing?.some(e => e.name.trim().toLowerCase() === trimmed)
      if (duplikat) return alert('Name bereits eingetragen')

      const { error } = await supabase.from('wahlstimmen1').insert({
        name: name.trim(),
        briefwahl,
        mitglied
      })

      if (!error) {
        setName('')
        setBriefwahl(false)
        fetchEintraege(mitglied)
      }
    } catch (err) {
      console.error('❌ Fehler beim Eintrag:', err.message)
    }
  }

  const deleteEintrag = async (id) => {
    if (!supabase) return
    try {
      await supabase.from('wahlstimmen1').delete().eq('id', id)
      fetchEintraege(mitglied)
    } catch (err) {
      console.error('❌ Fehler beim Löschen:', err.message)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Willkommen, {mitglied}!</h1>
      {!supabase && (
        <p className="text-red-600 mb-4">
          ⚠️ Supabase nicht korrekt konfiguriert. Bitte Secrets prüfen.
        </p>
      )}
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
