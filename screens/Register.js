//pagina donde se decide si registrar manual o por una imagen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [inputType, setInputType] = useState('camera');
  const navigation = useNavigation();

  const handleInputChange = (newInputType) => {
    setInputType(newInputType);
    if (newInputType === 'manual') {
      navigation.navigate('RegisterVerification');
    } else if (newInputType === 'camera') {
      navigation.navigate('RegisterWithCamera');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.description}>
        Seleccione un método para registrar el pago
      </Text>

      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: '#F99417' }}
        onPress={() => handleInputChange('manual')}
      >
        <Text style={styles.buttonText}>Registro Manual</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: '#F99417' }}
        onPress={() => handleInputChange('camera')}
      >
        <Text style={styles.buttonText}>Registro por Cámara</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8280A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F99417',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingTop: 0,
  },
  description: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    margin: 5,
  },
  button: {
    width: 200,
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Register;
