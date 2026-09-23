# 🚀 Pixel Nexo Dev Launcher (Android & Web PWA)

Bem-vindo ao **Pixel Nexo Dev Launcher**, um launcher Android moderno projetado para desenvolvedores e criadores digitais. O projeto combina identidade visual refinada (tons de roxo `#23083B` e dourado `#F5B942`), terminais interativos (Bash, GitHub CLI, Google Drive CLI), sistema de abas de fichário por ambientes e código nativo em Kotlin.

---

## 📱 Como Rodar Localmente (Web / PWA)

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra no navegador:
   ```text
   http://localhost:3000
   ```
4. Para compilar a versão estática otimizada de produção:
   ```bash
   npm run build
   ```

---

## 📲 Como Instalar no Celular via PWA (1-Clique)

1. Acesse o link da aplicação no navegador do celular:
   - **Android (Chrome)**: Toque nos três pontinhos verticais (`⋮`) e selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
   - **iPhone (Safari)**: Toque no botão de Compartilhar (`⎋`) e selecione **"Adicionar à Tela de Início"**.
2. O aplicativo funcionará em tela cheia com ícone próprio na sua gaveta de apps, sem barras do navegador e com suporte offline.

---

## 🤖 Instalar como Launcher no Android (APK)

O APK é compilado automaticamente pelo GitHub Actions (`.github/workflows/android-apk.yml`) a cada push.

1. No celular, abra a página **Releases** do repositório → **apk-latest** → baixe `PixelNexoLauncher.apk`.
2. Toque no arquivo e permita **"Instalar apps desconhecidos"** para o navegador.
3. Pressione o botão **Home** e escolha **Pixel Nexo** → **Sempre**
   (ou: Configurações → Apps → Apps padrão → **App de tela inicial**).

A gaveta de apps mostra a seção **"Apps do celular"** com os apps reais instalados.
Toque longo em um app abre as informações dele. Para voltar ao launcher antigo, troque o app de tela inicial nas configurações.

### Build local

```bash
npm install
npm run build:android          # gera a interface web em android/app/src/main/assets/www
gradle -p android assembleRelease  # requer Android SDK (ANDROID_HOME)
```

---

## 🎨 Identidade Visual Pixel Nexo
- **Fundo Principal:** `#160324` / `#23083B`
- **Dourado Pixel Nexo:** `#F5B942`
- **Violeta de Destaque:** `#8022B8`
- **Modos de Fichário:** Nexo, Dev, Work, Social e Ops
