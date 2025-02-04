# Build stage
FROM node:18-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production-stage

# Criar diretório para os arquivos do app
RUN mkdir -p /usr/share/nginx/html

# Copiar arquivos estáticos
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar configuração do nginx
RUN nginx -t

# Definir permissões corretas
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]