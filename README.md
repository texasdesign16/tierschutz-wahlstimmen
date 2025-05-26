# 🐾 Tierschutz Wahlstimmen Plattform

Webbasierte Plattform zur Erfassung von Unterstützerstimmen für die Tierschutz Fraktion Oberhausen bei der Kommunalwahl 2025.

## 🔧 Funktionen
- Passwort-Login (nur Passwort, kein Benutzername)
- Stimmen-Eintrag mit Briefwahl-Checkbox
- Adminübersicht mit Auswertung
- Supabase PostgreSQL-Datenbank
- Deployment via Fly.io
- 100 % responsive für Smartphone, Tablet und Desktop

## 📁 Aufbau
- `pages/index.js` → Login
- `pages/dashboard.js` → Mitgliederbereich
- `pages/admin.js` → Adminbereich
- `lib/supabase.js` → Datenbankverbindung

## 📦 Installation
```bash
npm install
npm run dev
