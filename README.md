# 🚀 Superapp - Module Federation com React Native

Este projeto demonstra uma arquitetura de **microfrontends** usando React Native com **Module Federation** via Re.Pack, onde o **AppHost** consome componentes do **MicroApp** de forma dinâmica.

## 📋 Estrutura do Projeto

```
Superapp/
├── AppHost/          # Aplicação host que consome microfrontends
│   ├── App.tsx       # Interface principal com área dedicada ao MicroApp
│   ├── rspack.config.mjs  # Configuração Module Federation (consumer)
│   └── package.json
├── MicroApp/         # Microfrontend que expõe componentes
│   ├── App.tsx       # App standalone do MicroApp
│   ├── components/
│   │   └── SimpleComponent.tsx  # Componente exposto via Module Federation
│   ├── rspack.config.mjs  # Configuração Module Federation (provider)
│   └── package.json
└── http-server/      # Servidor para bundles estáticos (produção)
    ├── server.js     # Servidor Express com CORS e MIME types corretos
    ├── package.json
    └── android/      # Bundles copiados do dev server
        ├── MicroApp.container.js.bundle
        ├── MicroApp.container.js.bundle.map
        ├── __federation_expose_SimpleComponent.chunk.bundle
        ├── __federation_expose_SimpleComponent.chunk.bundle.map
        ├── mf-manifest.json
        └── mf-stats.json
```

## 🛠️ Pré-requisitos

- **Node.js** >= 18
- **React Native CLI** configurado
- **Android Studio** ou emulador Android configurado
- **Xcode** (para iOS) - versão 12 ou superior
- **CocoaPods** (para iOS) - `sudo gem install cocoapods`

## ⚙️ Configuração Inicial

### **Instalar Dependências**

```bash
# MicroApp
cd MicroApp
npm install

# AppHost
cd ../AppHost
npm install

# Servidor HTTP (para bundles estáticos)
cd ../http-server
npm install
```

### **Android**
1. Configure o Android SDK e emulador
2. Inicie o emulador Android
3. Configure mapeamento de portas: 
   ```bash
   # Para desenvolvimento (dev servers)
   adb reverse tcp:8085 tcp:8085  # Porta do MicroApp
   adb reverse tcp:8081 tcp:8081  # Porta do AppHost
   
   # Para produção (servidor estático)
   adb reverse tcp:8090 tcp:8090  # Porta do servidor estático
   adb reverse tcp:8081 tcp:8081  # Porta do AppHost
   ```

### **iOS**
1. Abra o Xcode e aceite as licenças
2. Configure um simulador iOS
3. Instale CocoaPods: `sudo gem install cocoapods`
4. Instale dependências nativas:
   ```bash
   # MicroApp
   cd MicroApp/ios
   pod install
   
   # AppHost
   cd ../../AppHost/ios
   pod install
   ```

## 🚀 Como Executar

### **Método 1: Desenvolvimento com Dev Servers (Recomendado)**

#### 1️⃣ **Primeiro: Iniciar o MicroApp (Porta 8085)**

O MicroApp deve estar rodando **ANTES** do AppHost, pois expõe os componentes.

```bash
# Navegar para o diretório do MicroApp
cd MicroApp

# Instalar dependências
npm install

# Iniciar o dev server Re.Pack na porta 8085
npm run webpack-start
```

#### 2️⃣ **Segundo: Iniciar o AppHost (Porta 8081)**

```bash
# Navegar para o diretório do AppHost
cd ../AppHost

# Instalar dependências
npm install

# Iniciar o dev server Re.Pack na porta 8081
npm run webpack-start
```

### **Método 2: Produção com Servidor Estático (Porta 8090)**

Para simular um ambiente de produção servindo bundles estáticos:

#### 1️⃣ **Iniciar MicroApp Dev Server (Temporariamente)**

```bash
cd MicroApp
npm run webpack-start
# Servidor necessário para gerar bundles dinâmicos
```

#### 2️⃣ **Copiar Bundles e Iniciar Servidor Estático**

```bash
# No MicroApp, copiar todos os arquivos necessários e iniciar servidor estático
npm run serve:dev-bundles
```

Este comando irá:
- Baixar o bundle principal: `MicroApp.container.js.bundle`
- Baixar o chunk do componente: `__federation_expose_SimpleComponent.chunk.bundle`
- Baixar arquivos de metadata: `mf-manifest.json`, `mf-stats.json`
- Baixar source maps para debugging
- Iniciar servidor Express na porta 8090

#### 3️⃣ **Configurar AppHost para Servidor Estático**

Atualize `AppHost/rspack.config.mjs` para apontar para o servidor estático:

```javascript
remotes: {
  MicroApp: {
    external: 'MicroApp@http://127.0.0.1:8090/android/MicroApp.container.js.bundle',
    shareScope: 'default',
    type: 'global'
  }
}
```

#### 4️⃣ **Iniciar AppHost**

```bash
cd AppHost
npm run webpack-start
```

## 🛠️ Scripts Disponíveis

### **MicroApp**
- `npm run webpack-start` - Inicia dev server Re.Pack na porta 8085
- `npm run copy:dev-bundles` - Copia bundles e chunks do dev server para servidor estático
- `npm run serve:dev-bundles` - Copia bundles e inicia servidor estático na porta 8090
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS

### **AppHost**
- `npm run webpack-start` - Inicia dev server Re.Pack na porta 8081
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS

### **Arquivos Copiados pelo `serve:dev-bundles`**

O script `npm run serve:dev-bundles` baixa os seguintes arquivos do dev server (8085) para o servidor estático (8090):

| Arquivo | Descrição | Tamanho Aprox. |
|---------|-----------|----------------|
| `MicroApp.container.js.bundle` | Bundle principal com Module Federation | ~4.8MB |
| `MicroApp.container.js.bundle.map` | Source map do bundle principal | ~5.7MB |
| `__federation_expose_SimpleComponent.chunk.bundle` | Chunk específico do SimpleComponent | ~4KB |
| `__federation_expose_SimpleComponent.chunk.bundle.map` | Source map do chunk | ~3KB |
| `mf-manifest.json` | Manifest do Module Federation | ~9KB |
| `mf-stats.json` | Estatísticas de build | ~79B |

**Por que precisamos copiar estes arquivos?**

1. **Bundle Principal**: Contém a interface do Module Federation e exposição global
2. **Chunk do Componente**: Arquivo separado contendo o SimpleComponent específico
3. **Source Maps**: Para debugging e symbolication de erros
4. **Manifests**: Metadata necessária para resolução de módulos federados

### 🤖 **Executar no Android**

```bash
# Configurar mapeamento de portas para emulador
# Para desenvolvimento:
adb reverse tcp:8085 tcp:8085  # MicroApp dev server
adb reverse tcp:8081 tcp:8081  # AppHost dev server

# Para produção:
adb reverse tcp:8090 tcp:8090  # Servidor estático
adb reverse tcp:8081 tcp:8081  # AppHost dev server

# Executar aplicação
cd AppHost
npm run android
```

### 🍎 **Executar no iOS**

```bash
# iOS não precisa de port mapping, usa localhost diretamente
cd AppHost
npm run ios
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
    MicroApp: 'MicroApp@http://127.0.0.1:8085/android/MicroApp.container.js.bundle',
  },
  shared: { /* dependências compartilhadas */ }
})
```

## 📱 Portas Utilizadas

| Aplicação | Porta | Descrição | Mapeamento Android | Uso |
|-----------|-------|-----------|-------------------|-----|
| **MicroApp** | `8085` | Dev server (Module Federation) | `adb reverse tcp:8085 tcp:8085` | Desenvolvimento |
| **AppHost** | `8081` | Dev server do AppHost | `adb reverse tcp:8081 tcp:8081` | Desenvolvimento |
| **HTTP Server** | `8090` | Servidor para bundles estáticos | `adb reverse tcp:8090 tcp:8090` | Produção/Teste |

### **Configuração por Cenário**

**Desenvolvimento (Dev Servers):**
```bash
adb reverse tcp:8085 tcp:8085  # MicroApp
adb reverse tcp:8081 tcp:8081  # AppHost
```

**Produção (Servidor Estático):**
```bash
adb reverse tcp:8090 tcp:8090  # Servidor estático
adb reverse tcp:8081 tcp:8081  # AppHost
```

## 📦 Arquivos e Estrutura do Module Federation

### **Arquivos Gerados pelo Dev Server (8085)**
- `MicroApp.container.js.bundle` - Bundle principal com Module Federation runtime
- `__federation_expose_SimpleComponent.chunk.bundle` - Chunk específico do componente
- `mf-manifest.json` - Manifest com informações de exposição
- `mf-stats.json` - Estatísticas de build
- Source maps (`.map`) para todos os arquivos acima

### **Servidor Estático Express (8090)**
O arquivo `http-server/server.js` é um servidor Express customizado que:
- Serve bundles com `Content-Type: application/javascript`
- Habilita CORS para requisições cross-origin
- Desabilita cache para desenvolvimento
- Serve chunks com headers corretos para Module Federation

## 🔍 Troubleshooting

### ❌ **Erro: "MicroApp não disponível"**
- **Causa:** MicroApp não está rodando na porta correta
- **Solução:** 
  - Desenvolvimento: Inicie `npm run webpack-start` no MicroApp (porta 8085)
  - Produção: Inicie `npm run serve:dev-bundles` no MicroApp (porta 8090)

### ❌ **Erro: "Loading chunk __federation_expose_SimpleComponent failed"**
- **Causa:** Chunk do componente não foi copiado ou não está sendo servido
- **Solução:** 
  ```bash
  cd MicroApp
  npm run serve:dev-bundles  # Isso copia TODOS os arquivos necessários
  ```

### ❌ **Erro: "EADDRINUSE: address already in use"**
- **Causa:** Porta já está sendo utilizada
- **Solução:** Use portas diferentes ou mate processos existentes:
  ```bash
  pkill -f "react-native start"
  pkill -f "node.*server.js"  # Para servidor estático
  ```

### ❌ **Problemas de Rede no Android**
- **Causa:** Emulador Android não consegue acessar localhost do host
- **Solução:** Configure mapeamento de portas correto:
  ```bash
  # Para desenvolvimento
  adb reverse tcp:8085 tcp:8085  # MicroApp dev server
  adb reverse tcp:8081 tcp:8081  # AppHost
  
  # Para produção
  adb reverse tcp:8090 tcp:8090  # Servidor estático
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

### ❌ **Erro: "Failed to symbolicate" ou "Source map missing"**
- **Causa:** Source maps não encontrados para bundles remotos
- **Solução:** Os source maps são copiados automaticamente pelo `serve:dev-bundles`

### ❌ **Erro: "should have __webpack_require__.f.consumes"**
- **Causa:** Problema na configuração do Module Federation
- **Solução:** Verifique se as URLs dos remotes estão corretas no `rspack.config.mjs`

### ❌ **Componente não carrega no AppHost**
- **Causa:** Timeout ou erro de rede
- **Solução:** 
  1. Verifique se o servidor está acessível:
     ```bash
     # Para dev server
     curl http://127.0.0.1:8085/android/MicroApp.container.js.bundle
     
     # Para servidor estático
     curl http://127.0.0.1:8090/android/MicroApp.container.js.bundle
     ```
  2. Verifique logs do console no AppHost

### ❌ **Servidor estático não inicia**
- **Causa:** Dependências do http-server não instaladas
- **Solução:**
  ```bash
  cd http-server
  npm install
  cd ../MicroApp
  npm run serve:dev-bundles
  ```

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

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Module Federation + React Native**
