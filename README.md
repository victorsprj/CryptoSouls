# CryptoSouls NFT Collection Website

Um site moderno e pixelado para a coleção NFT CryptoSouls, com 4444 almas únicas no estilo pixel art.

## 🎨 **Paleta de Cores Aplicada**

### Verde (Brand Colors)
- **Brand Green**: `#00ff67` - Cor primária para destaques e botões
- **Brand Light Green**: `#32ff84` - Cor secundária para elementos de suporte

### Roxo/Azul (Texto e Fundo)
- **Main Text**: `#BEA5F5` - Cor principal do texto
- **Background Gradient**: `linear-gradient(from #3a225e to #2a1a47)` - Gradiente de fundo elegante

### Cinzas/Preto (Estrutura)
- **Dark BG**: `#121212` - Fundo escuro das seções
- **Dark Card**: `#1E1E1E` - Fundo dos cartões e componentes
- **Dark Text Secondary**: `#A0A0A0` - Texto secundário para melhor contraste

## ✨ **Características**

- **Design Pixel Art**: Estilo retrô autêntico com animações pixeladas
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Interativo**: Animações de hover, filtros dinâmicos e efeitos visuais
- **Acessível**: Alto contraste de cores para boa legibilidade
- **Moderno**: Gradientes elegantes e transições suaves

## 🚀 **Como Executar**

1. Clone o repositório
2. Abra `index.html` no navegador
3. Ou use um servidor local:
   ```bash
   python -m http.server 8000
   ```
   Acesse: http://localhost:8000

## 📁 **Estrutura do Projeto**

```
cryptosouls-site/
├── index.html          # Página principal
├── styles.css          # Estilos com paleta personalizada
├── script.js          # JavaScript interativo
└── README.md          # Este arquivo
```

## 🎮 **Funcionalidades**

- **Hero Section**: Título com efeito glitch e estatísticas da coleção
- **Sobre**: Informações sobre as 4444 almas únicas
- **Coleção**: Grid de NFTs com filtros por raridade
- **Roadmap**: Plano de desenvolvimento em 4 fases
- **Equipe**: Apresentação dos criadores
- **FAQ**: Perguntas frequentes expansíveis
- **Footer**: Links e informações de contato

## 🎯 **NFT Collection Details**

- **Supply Total**: 4444 NFTs únicos
- **Preço de Mint**: 0.08 ETH
- **Características**: 100+ traits únicos
- **Blockchain**: Ethereum (ERC-721)
- **Raridades**: Common, Rare, Epic, Legendary

## 🔧 **Personalização**

### Alterar Cores
Edite as variáveis CSS no `:root` em `styles.css`:

```css
:root {
    --primary-color: #00ff67;        /* Verde principal */
    --secondary-color: #32ff84;      /* Verde claro */
    --main-text: #BEA5F5;           /* Texto principal */
    --dark-bg: #121212;             /* Fundo escuro */
    --dark-card: #1E1E1E;           /* Cartões */
    --dark-text-secondary: #A0A0A0; /* Texto secundário */
    --bg-gradient-from: #3a225e;     /* Gradiente início */
    --bg-gradient-to: #2a1a47;       /* Gradiente fim */
}
```

### Adicionar NFTs
Para adicionar imagens reais dos NFTs, substitua os emojis nos cartões por imagens:
```html
<div class="nft-image">
    <img src="path/to/nft-image.png" alt="CryptoSoul #0001">
</div>
```

## 📱 **Responsivo**

O site é totalmente responsivo com breakpoints para:
- **Desktop**: >768px
- **Tablet/Mobile**: <768px
- **Mobile Small**: <480px

## 🌟 **Efeitos Visuais**

- Animações de estrelas pixeladas no fundo
- Efeito glitch no título principal
- Hover effects com transições pixel art
- Trail de pixels seguindo o mouse
- Botões com sombras pixeladas

## 🎨 **Design System**

- **Tipografia**: Press Start 2P para títulos, VT323 para corpo
- **Sombras**: Pixel shadows para efeito 3D
- **Espaçamento**: Sistema consistente de margens e paddings
- **Botões**: Estilo pixel art com hover effects

---

**CryptoSouls** - 4444 Unique Pixel Souls Living on the Blockchain ⚡🎮
