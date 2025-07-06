import React from 'react';
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

const SimpleComponent: React.FC<SimpleComponentProps> = ({
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

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: isDarkMode ? '#FFFFFF' : '#000000',
          },
        ]}>
        {title}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDarkMode ? '#FF4444' : '#CC0000',
          },
        ]}
        onPress={handleButtonPress}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SimpleComponent;
