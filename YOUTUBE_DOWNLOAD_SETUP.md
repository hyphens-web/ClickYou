# ClickYou - YouTube Download Setup

Para que a funcionalidade de download de vídeos do YouTube funcione completamente, você precisa configurar o `yt-dlp` no seu servidor.

## Opção 1: Configuração Local com yt-dlp (Recomendado)

### Pré-requisitos
- Python 3.8 ou superior
- FFmpeg instalado

### Instalação no macOS
```bash
# Instalar Python (se necessário)
brew install python3

# Instalar yt-dlp
pip install yt-dlp

# Instalar FFmpeg
brew install ffmpeg

# Iniciar o servidor yt-dlp
node scripts/yt-dlp-server.js

# Em outro terminal, inicie a aplicação Next.js normalmente
npm run dev
```

### Instalação no Windows
```bash
# Instalar Python via https://www.python.org/downloads/

# Instalar yt-dlp
pip install yt-dlp

# Instalar FFmpeg
# Opção 1: via chocolatey
choco install ffmpeg

# Opção 2: Baixar diretamente de https://ffmpeg.org/download.html

# Iniciar o servidor
node scripts/yt-dlp-server.js

# Em outro terminal, inicie a aplicação
npm run dev
```

### Instalação no Linux (Ubuntu/Debian)
```bash
# Instalar yt-dlp
sudo apt-get install yt-dlp

# Instalar FFmpeg
sudo apt-get install ffmpeg

# Iniciar o servidor
node scripts/yt-dlp-server.js

# Em outro terminal
npm run dev
```

## Opção 2: Deployment na Vercel

Se você quer fazer deploy na Vercel, você pode usar APIs públicas de download. Neste caso:

1. O endpoint `/api/download` tentará usar várias APIs públicas na seguinte ordem:
   - HeyLink API
   - GetVideoLinks API
   - Servidor local yt-dlp (se disponível)

2. As APIs públicas têm limitações:
   - Taxa de limite (rate limiting)
   - Qualidade limitada
   - Podem estar indisponíveis

## Como Funciona

1. Usuário coloca o link do YouTube
2. Clica em "Baixar"
3. A página de download carrega as informações do vídeo
4. Mostra 4 opções de formato:
   - MP4 Full HD (1080p)
   - MP4 HD (720p)
   - MP4 SD (480p)
   - MP3 (320kbps)
5. Quando clica em qualquer opção, o download é iniciado

## Troubleshooting

### "yt-dlp not found"
- Verifique que yt-dlp está instalado: `yt-dlp --version`
- Reinstale se necessário: `pip install --upgrade yt-dlp`

### "ffmpeg not found"
- Verifique instalação: `ffmpeg -version`
- O FFmpeg é necessário para converter formatos

### Servidor yt-dlp não conecta
- Verifique que o servidor está rodando: `node scripts/yt-dlp-server.js`
- Verifique a porta 8081 está livre
- Altere a porta em `scripts/yt-dlp-server.js` se necessário

### Downloads lentos
- Isso é normal, depende da velocidade da internet e tamanho do vídeo
- Vídeos em 1080p podem levar vários minutos

## Recursos Adicionais

- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)
- [Documentação yt-dlp](https://github.com/yt-dlp/yt-dlp/wiki)
