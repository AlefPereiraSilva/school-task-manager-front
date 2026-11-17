# Estágio 1: Compilação do React + Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de pacotes para otimizar o cache de download de dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Compila o projeto gerando a pasta 'dist' estática
RUN npm run build

# Estágio 2: Servidor Web de Produção (Nginx)
FROM nginx:alpine

# Copia os arquivos compilados do estágio anterior para o Nginx servir
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
