/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

// Componente de fallback simples
const FallbackComponent = () => {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <View style={fallbackStyles.container}>
      <Text style={[fallbackStyles.errorText, { color: isDarkMode ? '#FF6B6B' : '#CC0000' }]}>
        ❌ MicroApp não disponível
      </Text>
      <Text style={[fallbackStyles.subText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
        Verifique se o MicroApp está rodando na porta 8081
      </Text>
    </View>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [SimpleComponent, setSimpleComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        console.log('Tentando carregar MicroApp/SimpleComponent...');
        
        // Timeout para evitar espera infinita
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const modulePromise = import('MicroApp/SimpleComponent');
        
        const module = await Promise.race([modulePromise, timeout]);
        console.log('Módulo carregado:', module);
        
        setSimpleComponent(() => (module as any).default);
      } catch (err) {
        console.log('Usando componente de fallback. Erro:', err);
        setSimpleComponent(() => FallbackComponent);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {/* Título principal */}
      <Text
        style={[
          styles.mainTitle,
          {
            color: isDarkMode ? '#FFFFFF' : '#000000',
          },
        ]}>
        Você está no AppHost
      </Text>
      
      {/* Área do MicroApp */}
      <View style={styles.microAppArea}>
        <Text
          style={[
            styles.areaTitle,
            {
              color: isDarkMode ? '#CCCCCC' : '#666666',
            },
          ]}>
          Área do MicroApp
        </Text>
        
        {/* Componente do MicroApp */}
        {loading && (
          <Text style={styles.loading}>Carregando MicroApp...</Text>
        )}
        
        {SimpleComponent && !loading && (
          <SimpleComponent 
            title="Bem-vindos ao MicroApp integrado!"
            buttonText="Testar Integração"
            onButtonPress={() => Alert.alert('Sucesso!', 'MicroApp integrado com sucesso no AppHost!')}
          />
        )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  microAppArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 123, 255, 0.3)',
    borderStyle: 'dashed',
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
  },
});

const fallbackStyles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default App;
