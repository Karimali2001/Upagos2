//pagina donde se ingresa la fecha y se le manda a la pagina de Payments
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const Queries = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    if (date) {
      const formattedDate = date.toLocaleDateString('es-ES'); // Format: DD-MM-YYYY
      navigation.navigate('Payments', {
        data: formattedDate,
      });
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>
          Consulta {'\n'}
          de Pagos {'\n'}
          por Fecha
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
          <Text>{date.toLocaleDateString('es-ES') || 'Ingrese la fecha'}</Text>
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

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Por favor, ingrese la fecha antes de consultar.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.submitButton} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Consultar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#363062',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    height: 40,
    marginBottom: 10,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
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
  submitButton: {
    backgroundColor: '#F99417',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#F99417',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Queries;
