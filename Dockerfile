FROM node:22

# Instala yt-dlp + ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && pip3 install -U yt-dlp

WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm install

# Copia projeto
COPY . .

# Build do Next
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]