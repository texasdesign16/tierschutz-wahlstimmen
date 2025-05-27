import { getEntries } from '../../lib/sqlite';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Nur GET erlaubt' });
  }

  try {
    const eintraege = await getEntries();
    res.status(200).json(eintraege);
  } catch (err) {
    console.error('Fehler beim Laden:', err);
    res.status(500).json({ error: 'Fehler beim Abrufen' });
  }
}
