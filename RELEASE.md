# 🚀 Release Build Guide - Module Federation React Native

Este guia fornece instruções detalhadas para criar builds de produção do Superapp com Module Federation.

## 📋 Checklist Pré-Release

- [ ] MicroApp buildado e servidor HTTP configurado
- [ ] Network Security configurado no AndroidManifest.xml
- [ ] Source maps desabilitados em produção
- [ ] Keystore configurado para assinatura
- [ ] Testes de integração executados

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente

```bash
# Configurar para produção
export NODE_ENV=production
export REPACK_CACHE_ENABLED=false
```

### 2. Configurações de Rede

**IP da Máquina (substitua localhost):**
```bash
# Descobrir IP da máquina
ipconfig getifaddr en0  # macOS
ifconfig | grep "inet " | grep -v 127.0.0.1  # Linux
```

**Atualizar URLs nos configs:**
- `AppHost/rspack.config.mjs` - remote URL
- `AppHost/App.tsx` - fetch URL
- `MicroApp/server.js` - IP binding

## 📦 Build Process

### Phase 1: MicroApp (Remote)

```bash
cd MicroApp

# 1. Limpar cache
rm -rf node_modules/.cache
rm -rf build/

# 2. Instalar dependências
npm install

# 3. Build para produção
npm run bundle:android:prod

# 4. Verificar arquivos gerados
ls -la android/app/build/outputs/bundle/release/
# Deve conter:
# - app-release.aab (Android App Bundle)
# - Ou verificar APK em outputs/apk/release/

# 5. Iniciar servidor HTTP
npm run serve:prod
# ou comando combinado
npm run prod
```

### Phase 2: AppHost (Host)

```bash
cd AppHost

# 1. Limpar cache e builds anteriores
rm -rf node_modules/.cache
rm -rf android/app/build/
npx @callstack/repack clean

# 2. Instalar dependências
npm install

# 3. Configurar Android
cd android

# 4. Build APK de release
./gradlew assembleRelease

# 5. Localizar APK
ls -la app/build/outputs/apk/release/
```

## 🛠️ Troubleshooting Common Issues

### Issue 1: Source Map Error

**Erro:**
```
Could not find source map file: index.android.bundle.map
```

**Solução:**
```bash
cd AppHost/android/app/build/intermediates/sourcemaps/react/release/
ln -sf index.android.bundle.map index.android.bundle.packager.map
```

### Issue 2: Network Security

**Erro:**
```
CLEARTEXT communication not permitted
```

**Solução:** Verificar `network_security_config.xml` e `AndroidManifest.xml`

### Issue 3: Module Federation Error

**Erro:**
```
remoteEntryExports is undefined
```

**Debugging:**
```bash
# Testar conectividade
curl http://localhost:8090/MicroApp.container.js.bundle

# Verificar logs
adb logcat | grep -i federation

# Testar no emulador
adb shell curl http://10.0.2.2:8090/MicroApp.container.js.bundle
```

## 🧪 Testing Strategy

### 1. Unit Tests
```bash
# MicroApp
cd MicroApp
npm test

# AppHost
cd AppHost
npm test
```

### 2. Integration Tests
```bash
# Testar servidor MicroApp
curl -I http://localhost:8090/MicroApp.container.js.bundle

# Testar conectividade do emulador
adb shell curl -I http://10.0.2.2:8090/MicroApp.container.js.bundle
```

### 3. End-to-End Tests
```bash
# Instalar APK
adb install AppHost/android/app/build/outputs/apk/release/app-release.apk

# Verificar logs em tempo real
adb logcat | grep -i "apphost\|microapp\|federation"

# Testar funcionalidades:
# - Carregamento do MicroApp
# - Interação com botão
# - Fallback quando servidor offline
```

## 📊 Performance Monitoring

### Bundle Analysis
```bash
# Analisar tamanho dos bundles
du -h MicroApp/build/generated/android/*
du -h AppHost/android/app/build/outputs/apk/release/app-release.apk

# Verificar dependências compartilhadas
grep -r "shared" */rspack.config.mjs
```

### Runtime Performance
```bash
# Monitorar uso de memória
adb shell dumpsys meminfo com.apphost

# Monitorar CPU
adb shell top -p $(adb shell pidof com.apphost)
```

## 🚀 Deployment Strategies

### Strategy 1: Local Development
- MicroApp servidor local (localhost:8090)
- AppHost consome via HTTP
- Ideal para testes

### Strategy 2: Staging Environment
- MicroApp deployed em servidor staging
- AppHost aponta para staging URL
- Testes de integração

### Strategy 3: Production
- MicroApp em CDN/servidor produção
- AppHost com fallback local
- Monitoramento de uptime

## 🔐 Security Considerations

### 1. Network Security
- Produção deve usar HTTPS
- Certificados SSL válidos
- Whitelist de domínios

### 2. Bundle Integrity
- Verificação de hash dos bundles
- Assinatura digital
- Versionamento de bundles

### 3. Access Control
- Autenticação para bundles privados
- Rate limiting
- Logging de acesso

## 📈 Scaling Considerations

### Multiple MicroApps
```javascript
// AppHost/rspack.config.mjs
remotes: {
  MicroApp: 'MicroApp@http://cdn.example.com/microapp/latest/container.js',
  AuthApp: 'AuthApp@http://cdn.example.com/authapp/latest/container.js',
  ProfileApp: 'ProfileApp@http://cdn.example.com/profileapp/latest/container.js',
}
```

### Version Management
```bash
# Estrutura de versionamento
cdn.example.com/
├── microapp/
│   ├── v1.0.0/
│   ├── v1.1.0/
│   └── latest/
├── authapp/
│   ├── v2.0.0/
│   └── latest/
```

### Load Balancing
```javascript
// Múltiplos servidores para alta disponibilidade
const servers = [
  'http://cdn1.example.com/microapp/container.js',
  'http://cdn2.example.com/microapp/container.js',
  'http://cdn3.example.com/microapp/container.js'
];
```

## 🎯 Best Practices

1. **Always test release builds** antes de deploy
2. **Monitor bundle sizes** para performance
3. **Implement proper error handling** para falhas de rede
4. **Use versioning** para controle de releases
5. **Keep fallbacks** para componentes críticos
6. **Log federation events** para debugging
7. **Cache bundles** quando possível
8. **Implement health checks** para servidores

---

## 📞 Support

Em caso de problemas, verifique:
1. Logs do Android: `adb logcat`
2. Conectividade: `curl` tests
3. Servidor MicroApp: Status e logs
4. Configurações de rede: Security config

**Documentação adicional:**
- [Re.Pack Docs](https://re-pack.netlify.app/)
- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [React Native Release Builds](https://reactnative.dev/docs/signed-apk-android)
