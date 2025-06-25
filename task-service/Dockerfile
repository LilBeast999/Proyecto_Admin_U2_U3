FROM node:24-alpine

WORKDIR /app

# copiamos primero el package.json para optimizar el build
COPY package.json .

# instalamos dependencias
RUN npm install --only=production

# copiamos el código de la aplicación
COPY src ./src

# configuramos el directorio donde se almacenarán las tareas
RUN mkdir -p /app/data && chmod -R 777 /app/data

EXPOSE 5001
CMD ["node", "src/app.js"]