// lib/sheet.js
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const SHEET_API_KEY = process.env.NEXT_PUBLIC_SHEET_API_KEY;
const SHEET_NAME = 'Einträge'; // Tabellenblattname

export async function fetchEintraege() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${SHEET_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  const rows = json.values || [];
  const header = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    header.forEach((key, i) => (obj[key] = row[i]));
    return obj;
  });
}

export async function appendEintrag(name, briefwahl, mitglied) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=USER_ENTERED&key=${SHEET_API_KEY}`;
  const body = {
    values: [[name, briefwahl ? 'Ja' : 'Nein', mitglied, new Date().toISOString()]],
  };
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}
