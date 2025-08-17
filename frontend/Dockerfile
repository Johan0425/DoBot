# ---- Etapa 1: Construcción (Build Stage) ----
    FROM node:18-alpine AS build

    # Establece el directorio de trabajo
    WORKDIR /app
    
    # Copia todos los archivos del proyecto
    COPY . .
    
    # Instala todas las dependencias
    RUN npm install
    
    # Genera la compilación para producción
    RUN npm run build
    
    # ---- Etapa 2: Producción (Production Stage) ----
    FROM nginx:stable-alpine
    # Elimina el contenido por defecto de Nginx
    RUN rm -rf /usr/share/nginx/html/*
    # Copia los archivos de la compilación
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Exponer el puerto
    EXPOSE 80
    
    # Comando para correr Nginx
    CMD ["nginx", "-g", "daemon off;"]
    