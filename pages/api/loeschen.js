import { deleteEntry } from '../../lib/sqlite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID erforderlich' });
  }

  try {
    await deleteEntry(id);
    res.status(200).json({ message: 'Eintrag gelöscht' });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ error: 'Fehler beim Löschen' });
  }
}
