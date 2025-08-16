# ---- Etapa 1: Construcción (Build Stage) ----
    FROM node:18-alpine AS build
    WORKDIR /app
     
    # Copia todos los archivos del proyecto al contenedor.
    # Esto asegura que 'postcss.config.cjs' y 'package.json' estén disponibles.
    COPY . .
     
    # Instala las dependencias.
    RUN npm install
     
    # Ahora que el archivo existe y las dependencias están instaladas, 
    # ejecuta el comando para construir la aplicación para producción.
    RUN npm run build
     
    # ---- Etapa 2: Producción (Production Stage) ----
    FROM nginx:stable-alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    