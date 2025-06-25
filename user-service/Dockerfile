FROM node:24-alpine

WORKDIR /app

# primero copiamos el package.json para aprovechar el cache de capas
COPY package.json .

# instalamos solo las dependencias de producción
RUN npm install --only=production

# ahora copiamos el código fuente
COPY src ./src

# preparamos el directorio donde se guardará la base de datos
RUN mkdir -p /app/data && chmod -R 777 /app/data

EXPOSE 5000
CMD ["node", "src/app.js"]