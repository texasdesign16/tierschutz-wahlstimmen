# Basis-Image mit Node.js
FROM node:18-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Dateien kopieren
COPY . .

# Abhängigkeiten installieren
RUN npm install

# Next.js builden
RUN npm run build

# App starten
CMD ["npm", "start"]
