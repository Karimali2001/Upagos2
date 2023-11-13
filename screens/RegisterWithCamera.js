//pagina donde se registra un pago con una foto
//la foto puede ser tomada por camara o de la galeria
//se usa una api que pasa la imagen a texto y de ahi se 
//sacan los valores y se mandan a la pantalla de verificacion
import React, { useState } from "react";
import { Button, StyleSheet, Text, SafeAreaView, Modal, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function RegisterWithCamera({ navigation }) {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [missingValue, setMissingValue] = useState("");

  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const extractedValues = await performOCR(result.assets[0]);
      if (valuesAreValid(extractedValues)) {
        setImage(result.assets[0].uri);
        navigation.navigate('RegisterVerification', extractedValues);
      } else {
        setModalVisible(true);
      }
    }
  };

  const pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const extractedValues = await performOCR(result.assets[0]);
      if (valuesAreValid(extractedValues)) {
        setImage(result.assets[0].uri);
        navigation.navigate('RegisterVerification', extractedValues);
      } else {
        setModalVisible(true);
      }
    }
  };

  const performOCR = async (file) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20");
      myHeaders.append("Content-Type", "multipart/form-data");

      const raw = file;
      const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch("https://api.apilayer.com/image_to_text/upload", requestOptions);
      const result = await response.json();

      console.log("Extracted Text:", result);

      const match = result["all_text"].match(/(?:referencia|operacion|recibo)\D*(\d+)/i);

      if (match) {
        console.log(`${match[1].charAt(0).toUpperCase() + match[1].slice(1)}`);
      } else {
        console.log("Referencia, Operacion, or Recibo number not found");
        setMissingValue("Referencia, Operacion, or Recibo");
        setModalVisible(true);
      }

      const amountMatch = result["all_text"].match(/(\d+\.\d+)/);

      if (amountMatch) {
        console.log("Amount with Decimals:", amountMatch[0]);
      } else {
        console.log("Amount with decimals not found");
      }

      const dateMatches = result["all_text"].match(/(\d{2}[-/]\d{2}[-/]\d{4})/);

      if (dateMatches) {
        console.log("Date Values:", dateMatches[0]);
      } else {
        console.log("Date values not found");
      }

      return {
        referencia: match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : null,
        amount: amountMatch ? amountMatch[0] : null,
        date: dateMatches ? dateMatches[0] : null,
      };
    } catch (error) {
      console.error("Error in performOCR:", error);
      setMissingValue("Referencia, Operacion, or Recibo");
      setModalVisible(true);
      return {};
    }
  };

  const valuesAreValid = (extractedValues) => {
    return (
      extractedValues.referencia !== null &&
      extractedValues.amount !== null &&
      extractedValues.date !== null
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading2}>Elige una opción</Text>
      <Button
        title="Elige una foto de tu galería"
        onPress={pickImageGallery}
        color="#F99417" // Orange color
      />
      <Button
        title="Toma una foto"
        onPress={pickImageCamera}
        color="#F99417" // Orange color
      />
      <Button
        title="Regresar"
        onPress={() => navigation.goBack()}
        color="#F99417" // Orange color
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Uno de los valores no fue encontrado.{"\n"}
              Vuelve a intentarlo.
            </Text>
            <Button
              title="Ok"
              color="#F99417"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "100%",
    backgroundColor: "#363062",
  },
  heading2: {
    color: "#F99417",
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    paddingTop: 0,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
