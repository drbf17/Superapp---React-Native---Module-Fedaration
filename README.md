# 🚀 Superapp - Module Federation com React Native

Este projeto demonstra uma arquitetura de **microfrontends** usando React Native com **Module Federation** via Re.Pack, onde o **AppHost** consome componentes do **MicroApp** de forma dinâmica.

## 📋 Estrutura do Projeto

```
Superapp/
├── AppHost/          # Aplicação host que consome microfrontends
│   ├── App.tsx       # Interface principal com área dedicada ao MicroApp
│   ├── rspack.config.mjs  # Configuração Module Federation (consumer)
│   └── package.json
└── MicroApp/         # Microfrontend que expõe componentes
    ├── App.tsx       # App standalone do MicroApp
    ├── components/
    │   └── SimpleComponent.tsx  # Componente exposto via Module Federation
    ├── rspack.config.mjs  # Configuração Module Federation (provider)
    └── package.json
```

## 🛠️ Pré-requisitos

- **Node.js** >= 18
- **React Native CLI** configurado
- **Android Studio** ou emulador Android configurado
- **Xcode** (para iOS) - versão 12 ou superior
- **CocoaPods** (para iOS) - `sudo gem install cocoapods`

## ⚙️ Configuração Inicial

### **Android**
1. Configure o Android SDK e emulador
2. Inicie o emulador Android
3. Configure mapeamento de portas: 
   ```bash
   adb reverse tcp:8085 tcp:8085  # Porta do MicroApp (desenvolvimento)
   adb reverse tcp:8090 tcp:8090  # Porta do servidor HTTP (produção)
   adb reverse tcp:8081 tcp:8081  # Porta do AppHost (se necessário)
   ```

### **iOS**
1. Abra o Xcode e aceite as licenças
2. Configure um simulador iOS
3. Instale CocoaPods: `sudo gem install cocoapods`

## � Scripts Disponíveis

### **MicroApp**
```bash
npm start              # Servidor de desenvolvimento (porta 8085)
npm run bundle:android:prod  # Build para produção Android
npm run serve:prod     # Servidor HTTP para produção (porta 8090)
npm run prod          # Build + servidor (comando combinado)
```

### **AppHost**
```bash
npm start             # Servidor de desenvolvimento (porta 8081)
npm run android       # Build e executar no Android
npm run ios          # Build e executar no iOS
```

## �🚀 Como Executar

### 1️⃣ **Primeiro: Iniciar o MicroApp (Porta 8085)**

O MicroApp deve estar rodando **ANTES** do AppHost, pois expõe os componentes.

```bash
# Navegar para o diretório do MicroApp
cd MicroApp

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento na porta 8085
npm start 

```

### 2️⃣ **Segundo: Iniciar o AppHost (Porta 8081)**

```bash
# Navegar para o diretório do AppHost
cd ../AppHost

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento na porta 8081
npm start 

```

### 🤖 **Executar no Android**

```bash
# Em outro terminal, configurar mapeamento de portas para emulador
adb reverse tcp:8085 tcp:8085  # MicroApp (desenvolvimento)
adb reverse tcp:8090 tcp:8090  # MicroApp (produção)
adb reverse tcp:8081 tcp:8081  # AppHost (se necessário)

# Executar no Android
npx react-native run-android 

```

### 🍎 **Executar no iOS**

```bash
# Instalar dependências nativas do iOS (CocoaPods)
cd ios
pod install
cd ..

# Executar no iOS
npx react-native run-ios

```

## 🧪 Como Testar a Integração

### ✅ **Teste 1: MicroApp Standalone**
1. Abra apenas o **MicroApp**
2. Deve exibir: "Bem-vindo ao MicroApp!" com botão **vermelho**
3. Clique no botão para testar funcionamento

### ✅ **Teste 2: AppHost com MicroApp Integrado**
1. Certifique-se que o **MicroApp está rodando** na porta 8085
2. Abra o **AppHost** na porta 8081
3. Deve exibir:
   - Título: "Você está no AppHost"
   - Área destacada: "Área do MicroApp"
   - Componente integrado com botão **vermelho** (mesmo do MicroApp)
4. Clique no botão para testar integração

### ✅ **Teste 3: Comportamento de Fallback**
1. **Pare o MicroApp** (Ctrl+C no terminal)
2. **Recarregue o AppHost** (R+R no emulador)
3. Deve exibir mensagem de erro: "❌ MicroApp não disponível"

### ✅ **Teste 4: Hot Reload entre Apps**
1. Com ambos rodando, **modifique a cor do botão** no MicroApp:
   ```tsx
   // Em MicroApp/components/SimpleComponent.tsx
   backgroundColor: isDarkMode ? '#00FF00' : '#008800', // Verde
   ```
2. **Recarregue o AppHost**
3. O botão deve aparecer **verde** no AppHost também!

## 🔧 Configurações Importantes

### **Module Federation - MicroApp (Provider)**
```javascript
// MicroApp/rspack.config.mjs
new Repack.plugins.ModuleFederationPluginV2({
  name: 'MicroApp',
  filename: 'MicroApp.container.js.bundle',
  exposes: {
    './SimpleComponent': './components/SimpleComponent',
  },
  shared: { /* dependências compartilhadas */ }
})
```

### **Module Federation - AppHost (Consumer)**
```javascript
// AppHost/rspack.config.mjs
new Repack.plugins.ModuleFederationPluginV2({
  name: 'AppHost',
  filename: 'AppHost.container.js.bundle',
  remotes: {
    MicroApp: 'MicroApp@http://127.0.0.1:8090/MicroApp.container.js.bundle',
  },
  shared: { /* dependências compartilhadas */ }
})
```

## 📱 Portas Utilizadas

| Aplicação | Porta | Descrição | Mapeamento Android |
|-----------|-------|-----------|-------------------|
| **MicroApp** | `8085` | Servidor de desenvolvimento | `adb reverse tcp:8085 tcp:8085` |
| **MicroApp** | `8090` | Servidor HTTP produção | `adb reverse tcp:8090 tcp:8090` |
| **AppHost** | `8081` | Servidor de desenvolvimento | `adb reverse tcp:8081 tcp:8081` |

## 🔍 Troubleshooting

### ❌ **Erro: "MicroApp não disponível"**
- **Causa:** MicroApp não está rodando na porta 8085 (desenvolvimento) ou 8090 (produção)
- **Solução:** Inicie o MicroApp primeiro

### ❌ **Erro: "EADDRINUSE: address already in use"**
- **Causa:** Porta já está sendo utilizada
- **Solução:** Use portas diferentes ou mate processos existentes:
  ```bash
  pkill -f "react-native start"
  ```

### ❌ **Problemas de Rede no Android**
- **Causa:** Emulador Android não consegue acessar localhost do host
- **Solução:** Configure mapeamento de portas:
  ```bash
  # Mapear portas do emulador para host
  adb reverse tcp:8085 tcp:8085  # MicroApp (desenvolvimento)
  adb reverse tcp:8090 tcp:8090  # MicroApp (produção)
  adb reverse tcp:8081 tcp:8081  # AppHost
  
  # Verificar se o mapeamento está ativo
  adb reverse --list
  ```

### ❌ **Problemas no iOS com CocoaPods**
- **Causa:** Dependências nativas não instaladas
- **Solução:** 
  ```bash
  cd AppHost/ios
  pod deintegrate  # Limpar instalação anterior
  pod install      # Reinstalar dependências
  cd ../..
  ```

### ❌ **Erro: "Failed to symbolicate"**
- **Causa:** Source maps não encontrados para bundles remotos
- **Solução:** Adicionar supressão no App.tsx:
  ```tsx
  // Suprimir warnings de source map para bundles federados
  if (__DEV__) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('Source map')) return;
      originalWarn.apply(console, args);
    };
  }
  ```

### ❌ **Erro: "should have __webpack_require__.f.consumes"**
- **Causa:** Problema na configuração do Module Federation
- **Solução:** Verifique se as URLs dos remotes estão corretas

### ❌ **Componente não carrega no AppHost**
- **Causa:** Timeout ou erro de rede
- **Solução:** 
  1. Verifique se o MicroApp está acessível: `curl http://127.0.0.1:8090/MicroApp.container.js.bundle`
  2. Verifique logs do console no AppHost

## 🎯 Funcionalidades Demonstradas

- ✅ **Module Federation** entre React Native apps
- ✅ **Carregamento dinâmico** de componentes remotos
- ✅ **Compartilhamento de dependências** (React, React Native)
- ✅ **Fallback automático** quando microfrontend não está disponível
- ✅ **Hot reload** independente entre apps
- ✅ **Tipagem TypeScript** para componentes federados

## 📚 Tecnologias Utilizadas

- **React Native** 0.79.5
- **Re.Pack** 5.1.3 (Module Federation)
- **Rspack** 1.3.4 (Bundler)
- **TypeScript** 5.0.4
- **Module Federation** V2

## 🚀 Próximos Passos

- [ ] Adicionar mais microfrontends
- [ ] Implementar roteamento federado
- [ ] Adicionar autenticação compartilhada
- [ ] Deploy em ambiente de produção
- [ ] Testes automatizados para integração

---

## 📦 Build de Release - Guia Completo

### 🎯 Conceitos Importantes

**Module Federation em Release** é diferente do desenvolvimento porque:
- **Hermes Engine**: JavaScript otimizado para produção
- **Network Security**: Android bloqueia HTTP por padrão
- **Bundle Optimization**: Minificação e otimização de código
- **Source Maps**: Mapeamento para debug pode causar problemas

### 🛠️ Pré-requisitos para Release

1. **Android SDK** configurado
2. **Keystore** para assinatura (debug ou release)
3. **Servidor HTTP** para servir bundles do MicroApp
4. **Network Security** configurado para cleartext traffic

### 📋 Passo a Passo - Build de Release

#### **1️⃣ Configurar Network Security (Android)**

⚠️ **IMPORTANTE**: A configuração de cleartext traffic é apenas para **TESTE e DESENVOLVIMENTO**. Em produção, use sempre **HTTPS** com certificados SSL válidos.

**Criar arquivo:** `AppHost/android/app/src/main/res/xml/network_security_config.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- ⚠️ APENAS PARA DESENVOLVIMENTO - NÃO USAR EM PRODUÇÃO -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">192.168.1.0</domain>
    </domain-config>
</network-security-config>
```

**Configurar AndroidManifest.xml:**
```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config">
```

> **🔒 Segurança em Produção**: Remova `android:usesCleartextTraffic="true"` e configure apenas domínios HTTPS no network security config para produção.

#### **2️⃣ Build do MicroApp (Remote)**

```bash
cd MicroApp

# Instalar dependências
npm install

# Build para produção
npm run bundle:android:prod

# Iniciar servidor HTTP (porta 8090)
npm run serve:prod
# ou comando combinado
npm run prod
```

**Verificar arquivos gerados:**
- `build/generated/android/MicroApp.container.js.bundle`
- `build/generated/android/mf-manifest.json`
- Chunks de dependências e componentes

#### **3️⃣ Build do AppHost (Host)**

```bash
cd AppHost

# Instalar dependências
npm install

# Limpar cache
npx @callstack/repack clean

# Build APK de release
cd android
./gradlew assembleRelease

# Localizar APK gerado
ls -la app/build/outputs/apk/release/
```

#### **4️⃣ Troubleshooting de Build**

**Erro: Source map não encontrado**
```bash
# Criar symlink para source map
cd AppHost/android/app/build/intermediates/sourcemaps/react/release/
ln -sf index.android.bundle.map index.android.bundle.packager.map
```

**Erro: remoteEntryExports is undefined**
- Verificar se servidor MicroApp está rodando
- Testar URL: `curl http://localhost:8090/MicroApp.container.js.bundle`
- Verificar network security config

### 🌐 Servidor HTTP para MicroApp

**Criar:** `MicroApp/server.js`
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'build/generated/android')));

// Mapear remoteEntry.js para o container real
app.get('/remoteEntry.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/generated/android/MicroApp.container.js.bundle'));
});

// Headers CORS para desenvolvimento
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

const PORT = 8090;
app.listen(PORT, () => {
  console.log(`🚀 MicroApp server running on http://localhost:${PORT}`);
});
```

### 🔧 Configurações de Produção

**MicroApp rspack.config.mjs:**
```javascript
export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  
  // Otimizações para produção
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: false,
  },
  
  // Desabilitar source maps em produção
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  
  plugins: [
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'MicroApp',
      filename: 'MicroApp.container.js.bundle',
      exposes: {
        './SimpleComponent': './components/SimpleComponent',
      },
      shared: {
        react: { singleton: true, eager: false },
        "react-native": { singleton: true, eager: false },
      },
    }),
  ],
};
```

### 🚀 Deploy em Produção

#### **Opção 1: Servidor Dedicado (Produção)**
```bash
# Fazer upload dos arquivos para servidor HTTPS
scp -r build/generated/android/ user@server:/var/www/microapp/

# Configurar nginx/apache com SSL para servir arquivos
# Exemplo nginx com SSL:
# server {
#     listen 443 ssl;
#     server_name seu-dominio.com;
#     ssl_certificate /path/to/cert.pem;
#     ssl_certificate_key /path/to/key.pem;
#     location / {
#         root /var/www/microapp;
#     }
# }
```

#### **Opção 2: CDN (Recomendado)**
```bash
# Upload para AWS S3, Google Cloud Storage, etc.
aws s3 cp build/generated/android/ s3://seu-bucket/microapp/ --recursive
```

#### **Opção 3: Embed no APK**
```bash
# Copiar bundles para assets do Android
cp build/generated/android/* AppHost/android/app/src/main/assets/
```

### 🧪 Testes de Release

**1. Teste Local:**
```bash
# Instalar APK no emulador
adb install AppHost/android/app/build/outputs/apk/release/app-release.apk

# Verificar logs
adb logcat | grep -i "apphost\|microapp\|federation"

# Abrir a activity principal do app
adb shell am start -n com.apphost/.MainActivity
```

**2. Teste de Conectividade:**
```bash
# Testar do emulador
adb shell curl http://10.0.2.2:8090/MicroApp.container.js.bundle
```

**3. Teste de Funcionalidade:**
- Abrir APK instalado
- Verificar se MicroApp carrega
- Testar interações do botão
- Verificar fallback quando servidor offline

### ⚠️ Limitações Conhecidas

1. **Hermes Engine**: Pode ter problemas com eval() dinâmico
2. **Source Maps**: Desabilitados em produção por padrão
3. **Network Security**: Requer configuração específica para HTTP (apenas desenvolvimento)
4. **Bundle Size**: Componentes federados aumentam tamanho
5. **Offline Support**: Requer estratégia de cache/fallback

### 🔒 Considerações de Segurança

- **Cleartext Traffic**: Configuração atual permite HTTP apenas para desenvolvimento
- **Produção**: Use sempre HTTPS com certificados SSL válidos
- **Network Security**: Whitelist apenas domínios necessários
- **Bundle Integrity**: Considere verificação de hash dos bundles remotos

### 📊 Métricas de Performance

**Bundle Sizes:**
- MicroApp container: ~200KB
- AppHost base: ~500KB
- Shared dependencies: ~300KB

**Load Times:**
- First load: ~2-3s
- Cached load: ~500ms
- Fallback: ~100ms

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Module Federation + React Native**
