import { getAdminStats } from '../../lib/sqlite';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Nur GET erlaubt' });
  }

  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error('Fehler beim Abrufen der Statistik:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Statistik' });
  }
}
