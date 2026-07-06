# 🍔 África Burger — Website

**Cada hambúrguer é um destino.**

Website imersivo de página única: uma viagem gastronómica por África, do hero em vídeo
até ao rodapé, passando por 6 destinos com pedido direto no WhatsApp.

---

## 📁 Estrutura

```
├── index.html          ← página (estrutura + SEO)
├── css/style.css       ← design system completo
├── js/app.js           ← lógica (rota GPS, overlay, pedidos, cursor…)
├── js/data.js          ← ✏️ TODOS OS DADOS EDITÁVEIS (textos, preços, destinos)
└── assets/             ← imagens, vídeo, fontes
```

## ✏️ Como editar (sem tocar no código)

Tudo o que muda com frequência está em **`js/data.js`**:

| O quê | Onde |
|---|---|
| **Número do WhatsApp** | `contacto.whatsapp` — código do país + número, só dígitos (ex.: `244923456789`) |
| Preços, tamanhos, extras | `tamanhos`, `extras`, `complementos` |
| Hambúrgueres / destinos | lista `destinos` — para adicionar um novo, copie um bloco `{ ... }` e ajuste |
| Textos, morada, horário | `brand`, `contacto`, `sobre`, `newsletter` |
| Redes sociais | `social` |

### Substituir fotos e vídeos
Coloque o novo ficheiro em `assets/` e atualize o caminho no destino em `data.js`
(`img:` e `video:`). O vídeo deve ser MP4; as fotos ficam melhor com fundo escuro.

> ⚠️ **Antes de publicar:** substitua o número de WhatsApp de exemplo
> (`244923456789`) pelo número real da empresa em `js/data.js`.

## 🚀 Publicar

É um site 100% estático — funciona em qualquer alojamento:

- **Netlify / Vercel / Cloudflare Pages:** arraste a pasta inteira.
- **cPanel / hosting clássico:** carregue todos os ficheiros para `public_html`.
- **Teste local:** basta abrir `index.html` num navegador.

## ✨ Funcionalidades

- Hero com vídeo do hambúrguer a montar-se (loop sem cortes) e tipografia da marca
- Rota GPS contínua desenhada com o scroll + carro que viaja pela linha
- Mapa de destinos com pins interativos (clique = viajar até ao destino)
- 6 destinos em ecrã inteiro; overlay de detalhe com foto / vídeo / 360° / detalhes
- Pedido completo (tamanho, extras, acompanhamentos, quantidade) → **WhatsApp**
- HUD "Em viagem" + aviso de chegada a cada destino (estilo GPS)
- Cursor personalizado discreto, som ambiente opcional, micro-interações subtis
- Responsivo (desktop, tablet, mobile), acessível e otimizado para SEO
