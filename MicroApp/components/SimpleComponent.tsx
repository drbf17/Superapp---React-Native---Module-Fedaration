import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from 'react-native';

interface SimpleComponentProps {
  title?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const SimpleComponent = memo<SimpleComponentProps>(
  ({
    title = 'Meu Componente Simples',
    buttonText = 'Clique Aqui',
    onButtonPress,
  }) => {
    const isDarkMode = useColorScheme() === 'dark';

    const handleButtonPress = () => {
      if (onButtonPress) {
        onButtonPress();
      } else {
        Alert.alert('Botão pressionado!', 'O botão foi clicado com sucesso.');
      }
    };

    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const buttonColor = isDarkMode ? '#4444FF' : '#0066CC';

    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleButtonPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleComponent;
