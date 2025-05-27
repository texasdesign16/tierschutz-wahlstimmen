# OFFIZIELLER NODE BUILDER
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# PRODUKTIONSSTAGE
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]
