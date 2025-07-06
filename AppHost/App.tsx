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

// Componente de fallback melhorado
const FallbackComponent = ({ error }: { error?: string }) => {
  const isDarkMode = useColorScheme() === 'dark';
  
  const getErrorMessage = () => {
    if (error?.includes('NetworkFailure') || error?.includes('unexpected end of stream')) {
      return {
        title: '🌐 Servidor MicroApp não encontrado',
        subtitle: 'Verifique se o MicroApp está rodando na porta 8085\ne se a rede está acessível'
      };
    }
    if (error?.includes('Timeout')) {
      return {
        title: '⏱️ Timeout ao carregar MicroApp',
        subtitle: 'O servidor demorou muito para responder.\nTente novamente em alguns segundos'
      };
    }
    if (error?.includes('remoteEntryExports is undefined')) {
      return {
        title: '📦 Bundle MicroApp inválido',
        subtitle: 'O arquivo do MicroApp não foi gerado corretamente.\nVerifique se ele está sendo compilado com Re.Pack'
      };
    }
    return {
      title: '❌ MicroApp não disponível',
      subtitle: 'Verifique se o MicroApp está rodando e acessível'
    };
  };

  const { title, subtitle } = getErrorMessage();
  
  return (
    <View style={fallbackStyles.container}>
      <Text style={[fallbackStyles.errorText, { color: isDarkMode ? '#FF6B6B' : '#CC0000' }]}>
        {title}
      </Text>
      <Text style={[fallbackStyles.subText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
        {subtitle}
      </Text>
      <Text style={[fallbackStyles.helpText, { color: isDarkMode ? '#888888' : '#999999' }]}>
        💡 Modo de desenvolvimento: usando fallback local
      </Text>
    </View>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [SimpleComponent, setSimpleComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Tentando carregar MicroApp/SimpleComponent...');
        
        // Timeout para evitar espera infinita
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: MicroApp server não responde')), 5000)
        );
        
        const modulePromise = import('MicroApp/SimpleComponent');
        
        const module = await Promise.race([modulePromise, timeout]);
        console.log('Módulo carregado:', module);
        
        setSimpleComponent(() => (module as any).default);
      } catch (err: any) {
        const errorMessage = err?.message || err?.toString() || 'Erro desconhecido';
        console.log('Erro ao carregar MicroApp:', errorMessage);
        setError(errorMessage);
        setSimpleComponent(() => (props: any) => <FallbackComponent {...props} error={errorMessage} />);
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
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
    marginBottom: 10,
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});

export default App;
