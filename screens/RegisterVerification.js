//esta pagina donde se mandan los datos o se registran manualmente
//para ser guardados en almacenamiento asincrono
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const formattedDate = route.params?.date
  ? new Date(
      parseInt(route.params.date.split('/')[2]), // Year
      parseInt(route.params.date.split('/')[1]) - 1, // Month (subtract 1 as months are zero-based)
      parseInt(route.params.date.split('/')[0]) // Day
    )
  : new Date();
const [date, setDate] = useState(formattedDate);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [referenciaValue, setReferenciaValue] = useState(route.params?.referencia?.toString() || '');
  const [telefonoValue, setTelefonoValue] = useState('');
  const [montoValue, setMontoValue] = useState(route.params?.amount?.toString() || '');

  const [imageUri, setImageUri] = useState(route.params?.imageUri || ''); // Extract the image URI



  const handleDateSelect = (event, selectedDate) => {
    if (selectedDate === undefined) {
      // User dismissed the date picker
      setShowDatePicker(false);
      return;
    }

    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleButtonClick = () => {
    if (!date) {
      setShowModal(true);
      return;
    }

    const formattedDate = moment(date).format('YYYY-MM-DD');
    navigation.navigate('Payments', {
      data: formattedDate,
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };


  const goBack = () => {
    navigation.goBack();
  };

  const submitPayment = async () => {
    if (!date || !referenciaValue || !telefonoValue || !montoValue) {
      alert('Por favor ingrese todos los campos');
      return;
    }

    // Save payment details to AsyncStorage along with the image URI
    const paymentDetails = {
      date: date.toISOString(),
      referencia: referenciaValue.slice(-4),
      telefono: telefonoValue,
      monto: montoValue,
      imageUri: imageUri, // Save the image URI
    };

    try {
      // Fetch existing payments from AsyncStorage
      const existingPaymentsJSON = await AsyncStorage.getItem('payments');
      const existingPayments = existingPaymentsJSON ? JSON.parse(existingPaymentsJSON) : [];

      // Add the new payment to the list
      existingPayments.push(paymentDetails);
      (paymentDetails);
      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem('payments', JSON.stringify(existingPayments));

      // Navigate to the success screen
      navigation.navigate('Success');
    } catch (error) {
      console.error('Error saving payment to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Pago</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
          <Text style={{ flex: 1 }}>
            {date.toLocaleDateString('es-ES') || 'Ingrese la fecha'}
          </Text>
          <Ionicons name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={handleDateSelect}
        />
      )}

      {Platform.OS === 'ios' && showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateSelect}
        />
      )}

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="calendar"
          onChange={handleDateSelect}
        />
      )}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Detalles de Pago</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLeftTitle}>Referencia:</Text>
          <TextInput
            style={styles.tableRightItem}
            value={referenciaValue.slice(-4)} // Display only the last 4 digits
            onChangeText={text => setReferenciaValue(text)} // Keep the original logic for handling the value change
            placeholder="Ingrese la referencia"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.tableRowAlternate}>
          <Text style={styles.tableLeftTitle}>Nro. Teléfono:</Text>
          <TextInput
            style={styles.tableRightItem}
            value={telefonoValue}
            onChangeText={text => setTelefonoValue(text)}
            placeholder="Ingrese el nro. de teléfono"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLeftTitle}>Monto (Bs):</Text>
          <TextInput
            style={styles.tableRightItem}
            value={montoValue}
            onChangeText={text => setMontoValue(text)}
            placeholder="Ingrese el monto"
            keyboardType="numeric" // Set keyboard type to numeric
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={goBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={submitPayment}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20, // Margin on the sides
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5', // Background color
    flex: 1,
    justifyContent: 'space-between',
  },
  tableContainer: {
    backgroundColor: '#C4C3CF',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    width: '80%', // Set the width to 100%
  },
  tableRowAlternate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#C4C3CF',
    padding: 10,
    borderRadius: 8,
    width: '80%', // Set the width to 100%
  },
  tableLeftTitle: {
    color: 'black',
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  tableRightItem: {
    color: 'black',
    flex: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#363062',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
});

export default RegisterVerification;

