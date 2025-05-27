import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [stats, setStats] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('eingeloggt=true');
    if (!isLoggedIn) {
      router.push('/');
    } else {
      ladeStatistik();
    }
  }, []);

  const ladeStatistik = async () => {
    const res = await fetch('/api/adminstats');
    const data = await res.json();
    setStats(data);
  };

  const logout = () => {
    document.cookie = 'eingeloggt=; Max-Age=0';
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Adminbereich – Statistik</h1>
        <button onClick={logout} className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700">
          Logout
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Mit Briefwahl</th>
              <th className="p-2">Ohne Briefwahl</th>
              <th className="p-2">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((eintrag, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{eintrag.name}</td>
                <td className="p-2 text-green-700 font-semibold">{eintrag.mitBriefwahl}</td>
                <td className="p-2 text-yellow-700 font-semibold">{eintrag.ohneBriefwahl}</td>
                <td className="p-2 text-gray-700">{eintrag.gesamt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
