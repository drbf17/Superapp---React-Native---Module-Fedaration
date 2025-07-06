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
- **Android Studio** ou emulador Android
- **Xcode** (para iOS)

## 🚀 Como Executar

### 1️⃣ **Primeiro: Iniciar o MicroApp (Porta 8081)**

O MicroApp deve estar rodando **ANTES** do AppHost, pois expõe os componentes.

```bash
# Navegar para o diretório do MicroApp
cd MicroApp

# Instalar dependências
npm install

# Iniciar o Metro bundler na porta 8081
npm start
# ou
npx react-native start --port 8081

# Em outro terminal, executar no Android
npx react-native run-android
```

### 2️⃣ **Segundo: Iniciar o AppHost (Porta 8083)**

```bash
# Navegar para o diretório do AppHost
cd ../AppHost

# Instalar dependências
npm install

# Iniciar o Metro bundler na porta 8083
npm start
# ou
npx react-native start --port 8083

# Em outro terminal, executar no Android
npx react-native run-android --port 8083
```

## 🧪 Como Testar a Integração

### ✅ **Teste 1: MicroApp Standalone**
1. Abra apenas o **MicroApp**
2. Deve exibir: "Bem-vindo ao MicroApp!" com botão **vermelho**
3. Clique no botão para testar funcionamento

### ✅ **Teste 2: AppHost com MicroApp Integrado**
1. Certifique-se que o **MicroApp está rodando** na porta 8081
2. Abra o **AppHost** na porta 8083
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
    MicroApp: 'MicroApp@http://127.0.0.1:8081/android/MicroApp.container.js.bundle',
  },
  shared: { /* dependências compartilhadas */ }
})
```

## 📱 Portas Utilizadas

| Aplicação | Porta | Descrição |
|-----------|--------|-----------|
| **MicroApp** | `8081` | Expõe componentes via Module Federation |
| **AppHost** | `8083` | Consome componentes do MicroApp |

## 🔍 Troubleshooting

### ❌ **Erro: "MicroApp não disponível"**
- **Causa:** MicroApp não está rodando na porta 8081
- **Solução:** Inicie o MicroApp primeiro

### ❌ **Erro: "EADDRINUSE: address already in use"**
- **Causa:** Porta já está sendo utilizada
- **Solução:** Use portas diferentes ou mate processos existentes:
  ```bash
  pkill -f "react-native start"
  ```

### ❌ **Erro: "should have __webpack_require__.f.consumes"**
- **Causa:** Problema na configuração do Module Federation
- **Solução:** Verifique se as URLs dos remotes estão corretas

### ❌ **Componente não carrega no AppHost**
- **Causa:** Timeout ou erro de rede
- **Solução:** 
  1. Verifique se o MicroApp está acessível: `curl http://127.0.0.1:8081/android/MicroApp.container.js.bundle`
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

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Module Federation + React Native**
