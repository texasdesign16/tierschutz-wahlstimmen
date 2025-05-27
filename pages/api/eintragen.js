import { addEntry } from '../../lib/sqlite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { name, briefwahl } = req.body;

  if (!name || !briefwahl) {
    return res.status(400).json({ error: 'Name und Briefwahl erforderlich' });
  }

  try {
    await addEntry(name, briefwahl);
    res.status(200).json({ message: 'Eintrag gespeichert' });
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).json({ error: 'Fehler beim Speichern' });
  }
}
