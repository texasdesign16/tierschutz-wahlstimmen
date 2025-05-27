import { useState } from 'react'
import { useRouter } from 'next/router'

const users = {
  Admin2025: 'Admin',
  Kocan2025: 'Bilal Kocan',
  Kocan2026: 'Aleyna Kocan',
  Kocan2027: 'Abdulkerim Kocan',
  Arslan2025: 'Yunus Arslan',
  Arslan2026: 'Aylin Arslan',
  Arslan2027: 'Berra Emine Arslan',
  Kas2025: 'Begüm Kas',
  Arslan2028: 'Yusuf Arslan',
  Kürklü2025: 'Alaattin Kürklü',
  Akpinar2025: 'Ilker Akpinar',
  Topcu2025: 'Bedirhan Topcu',
  Dogan2025: 'Ibrahim Dogan',
  Caydasi2025: 'Beytullah Caydasi',
  Abduli2025: 'Arnes Abduli',
  Tosun2025: 'Emin Tosun',
  Üstünsoy2025: 'Yakup Üstünsoy',
  Ouzelgui2025: 'Ahmed Ouzelgui',
  Kurnaz2025: 'Cihan Kurnaz',
  Aydeniz2025: 'Cem Aydeniz',
  Elci2025: 'Karabey Elci',
  Yildiz2025: 'Seyfullah Yildiz',
  Aksoy2025: 'Emre Aksoy',
  Aksoy2026: 'Arzu Aksoy',
  Kücük2025: 'Mümin Kücük',
  Gökdemir2025: 'Acelya Gökdemir',
  Arslan2029: 'Emre Arslan',
  Tanribuyurdu2025: 'Fatih Tanribuyurdu',
  Üreyil2025: 'Muhammed Üreyil',
  Üreyil2026: 'Sema Nur Üreyil',
  Tanribuyurdu2026: 'Yavuzhan Tanribuyurdu',
  Kücük2026: 'Aslihan Kücük',
  Caydasi2026: 'Elif Caydasi',
  Arslan2030: 'Sare Arslan',
  Üreyil2027: 'Hamza Üreyil',
  Aldemir2025: 'Selman Aldemir',
  Inik2025: 'Muhammed Inik',
  Caka2025: 'Burak Caka',
  Kürklü2026: 'Ismihan Kürklü',
  Erdogan2025: 'Musa Erdogan'
};

export default function Login() {
  const [pw, setPw] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    const name = users[pw];
    if (name) {
      // Setze Cookies für Login und Namen (gültig für 1 Tag)
      document.cookie = `eingeloggt=true; path=/; max-age=86400`;
      document.cookie = `mitglied=${encodeURIComponent(name)}; path=/; max-age=86400`;

      if (pw === 'Admin2025') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      alert('Falsches Passwort');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-800">Login</h1>
        <input
          type="password"
          className="border w-full px-3 py-2 mb-4 rounded"
          placeholder="Passwort eingeben"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
