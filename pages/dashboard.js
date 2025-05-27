import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [briefwahl, setBriefwahl] = useState('ja');
  const [eintraege, setEintraege] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('eingeloggt=true');
    if (!isLoggedIn) {
      router.push('/');
    } else {
      ladeEintraege();
    }
  }, []);

  const ladeEintraege = async () => {
    const res = await fetch('/api/alle');
    const data = await res.json();
    setEintraege(data);
  };

  const speichern = async (e) => {
    e.preventDefault();
    if (!name) return;

    await fetch('/api/eintragen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, briefwahl }),
    });

    setName('');
    ladeEintraege();
  };

  const loeschen = async (id) => {
    await fetch('/api/loeschen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    ladeEintraege();
  };

  const logout = () => {
    document.cookie = 'eingeloggt=; Max-Age=0';
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Mitgliederbereich</h1>
        <button onClick={logout} className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Logout
        </button>
      </div>

      <form onSubmit={speichern} className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="border p-2" value={briefwahl} onChange={(e) => setBriefwahl(e.target.value)}>
          <option value="ja">Briefwahl: Ja</option>
          <option value="nein">Briefwahl: Nein</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Speichern
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Briefwahl</th>
              <th className="p-2">Zeitpunkt</th>
              <th className="p-2">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {eintraege.map((eintrag) => (
              <tr key={eintrag.id} className="border-t">
                <td className="p-2">{eintrag.name}</td>
                <td className="p-2">{eintrag.briefwahl}</td>
                <td className="p-2">{new Date(eintrag.zeitpunkt).toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => loeschen(eintrag.id)}
                    className="text-red-600 hover:underline"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
