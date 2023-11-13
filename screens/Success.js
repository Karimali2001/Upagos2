//pagina donde se le dice al usuario que su 
//pago fue exitosamente registrado
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Success = () => {
    const navigation = useNavigation();
  const goToRegisterPayment = () => {
    // Navigate to the screen for registering another payment
    navigation.navigate('Register'); // Replace 'RegisterPayment' with the actual screen name
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={100} color="#32CD32" />
      <Text style={styles.successMessage}>Pago Registrado Exitosamente</Text>
      <TouchableOpacity style={styles.registerButton} onPress={goToRegisterPayment}>
        <Text style={styles.buttonText}>Registrar Otro Pago</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32CD32',
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: '#363062',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Success;
