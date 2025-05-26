const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const SHEET_API_KEY = process.env.NEXT_PUBLIC_SHEET_API_KEY;
const SHEET_NAME = 'Einträge'; // Tabellennamen exakt so wie im Sheet

// 📥 Alle Einträge abrufen
export async function fetchEintraege() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${SHEET_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.values || json.values.length < 2) return [];

    const [header, ...rows] = json.values;
    return rows.map(row => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key.trim()] = row[i] || '';
      });
      return obj;
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Einträge:', error);
    return [];
  }
}

// ➕ Eintrag hinzufügen
export async function appendEintrag(name, briefwahl, mitglied) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=USER_ENTERED&key=${SHEET_API_KEY}`;
    const body = {
      values: [[
        name,
        briefwahl ? 'Ja' : 'Nein',
        mitglied,
        new Date().toISOString()
      ]]
    };

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Fehler beim Hinzufügen:', error);
    }
  } catch (error) {
    console.error('Fehler bei appendEintrag:', error);
  }
}
