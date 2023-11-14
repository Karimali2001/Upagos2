//pagina donde se recibe la fecha dada
//se sacan los pagos del almacenamiento asincrono 
//se filtran los pagos por la fecha dada y se muestran
//los pagos se pueden eliminar si existio algun error 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Image, ScrollView } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';

const Payments = ({ route, navigation }) => {
  const { data } = route.params;
  const selectedDate = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');

  const [payments, setPayments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await AsyncStorage.getItem('payments');
        if (paymentsData) {
          const allPayments = JSON.parse(paymentsData);
          const filteredPayments = allPayments.filter(payment =>
            moment(payment.date).isSame(selectedDate, 'day')
          );
          setPayments(filteredPayments);
        }
      } catch (error) {
        console.error('Error fetching payments from AsyncStorage:', error);
      }
    };

    fetchPayments();
  }, [selectedDate]);

  const deletePayment = async (index) => {
    try {
      const updatedPayments = [...payments];
      const deletedPayment = updatedPayments.splice(index, 1)[0];
      await AsyncStorage.setItem('payments', JSON.stringify(updatedPayments));
      setPayments(updatedPayments);

      Alert.alert(
        'Pago eliminado',
        `Se ha eliminado el pago con referencia ${deletedPayment.referencia}`,
      );
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const viewImage = (imageUri) => {
    setSelectedImageUri(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUri('');
  };

  const saveToGallery = async () => {
    if (selectedImageUri) {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status === 'granted') {
          await MediaLibrary.saveToLibraryAsync(selectedImageUri);
          Alert.alert('Imagen guardada', 'La imagen se ha guardado en la galería.');
        } else {
          Alert.alert('Permiso denegado', 'No se otorgó permiso para acceder a la galería.');
        }
      } catch (error) {
        console.error('Error saving image to gallery:', error);
        Alert.alert('Error', 'Ocurrió un error al intentar guardar la imagen en la galería.');
      }
    }
  };

  const renderRow = ({ item, index }) => {
    const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

    return (
      <View style={[styles.row, rowStyle]}>
        <View style={styles.dataColumn}>
          <Text style={styles.rowData}>{item.referencia}</Text>
          <Text style={styles.rowData}>{item.telefono}</Text>
          <Text style={styles.rowData}>{item.monto}</Text>
        </View>
        <View style={styles.actionColumn}>
          <TouchableOpacity onPress={() => showDeleteConfirmation(index)}>
            <Ionicons name="trash-outline" size={24} color="red" style={styles.actionIcon} />
          </TouchableOpacity>
          {item.imageUri && (
            <TouchableOpacity onPress={() => viewImage(item.imageUri)}>
              <Ionicons name="eye" size={24} color="green" style={styles.actionIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  const showDeleteConfirmation = (index) => {
    Alert.alert(
      'Eliminar pago',
      '¿Estás seguro de que deseas eliminar este pago?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deletePayment(index),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagos del día {selectedDate}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Referencia</Text>
          <Text style={styles.tableTitle}>Nro. Celular</Text>
          <Text style={styles.tableTitle}>Monto (Bs)</Text>
          <Text style={styles.tableTitle}>Acción</Text>
        </View>
        <FlatList
          data={payments}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderRow}
        />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1} // Touching the modal won't close it
          onPress={closeModal}
        >
          <Ionicons
            name="close"
            size={32}
            color="white"
            style={styles.closeIcon}
            onPress={closeModal}
          />
          <ScrollView>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </ScrollView>
          <TouchableOpacity style={styles.saveButton} onPress={saveToGallery}>
            <Text style={styles.saveButtonText}>Guardar en la galería</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
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
  table: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 10,
    backgroundColor: '#8280A3',
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 10,
  },
  rowEven: {
    backgroundColor: '#C4C3CF',
  },
  rowOdd: {
    backgroundColor: 'white',
  },
  rowData: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#363062',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  trashIcon: {
    marginLeft: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalImage: {
    width: '100%',
    height: 500,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dataColumn: {
    flex: 3, // Adjust the flex value as needed
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionColumn: {
    flex: 1, // Adjust the flex value as needed
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionIcon: {
    marginLeft: 10,
  },
});

export default Payments;
