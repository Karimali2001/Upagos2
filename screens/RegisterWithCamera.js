//pagina donde se registra un pago con una foto
//la foto puede ser tomada por camara o de la galeria
//se usa una api que pasa la imagen a texto y de ahi se 
//sacan los valores y se mandan a la pantalla de verificacion
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, SafeAreaView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function RegisterWithCamera({ navigation }) {
  const [image, setImage] = useState(null);
  const [missingValue, setMissingValue] = useState("");

  useEffect(() => {
    // Reset state when the component mounts
    setImage(null);
    setMissingValue("");
  }, []);

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
        log(result.assets[0].uri);
        navigation.navigate('RegisterVerification', { ...extractedValues, imageUri: result.assets[0].uri });
      } else {
        // Handle the case when values are not valid
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
        navigation.navigate('RegisterVerification', { ...extractedValues, imageUri: result.assets[0].uri });
      } else {
        // Handle the case when values are not valid
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
  
      // Check if any text is detected
      if (!result.annotations || result.annotations.length === 0) {
        console.log("No text detected");
        // Set imageUri to the original image URI
        return { imageUri: file.uri };
      }
  
      let cleanedAmount = null;
      let referencia = null;
      let date = null;
  
      for (let attempt = 1; attempt <= 3; attempt++) {
        const match = result["all_text"].match(/(?:referencia|operacion|recibo)\D*(\d+)/i);
  
        if (match) {
          referencia = match[1].charAt(0).toUpperCase() + match[1].slice(1);
          break;
        }
  
        if (attempt === 3) {
          console.log("Referencia, Operacion, or Recibo number not found");
          setMissingValue("Referencia, Operacion, or Recibo");
          // Set imageUri to the original image URI
          return { imageUri: file.uri };
        }
      }
  
      for (let attempt = 1; attempt <= 3; attempt++) {
        const amountMatch = result["all_text"].match(/(\d+\.\d+)/);
  
        if (amountMatch) {
          cleanedAmount = parseFloat(amountMatch[0].replace(',', '.'));
          break;
        }
  
        if (attempt === 3) {
          console.log("Amount with decimals not found");
          // Set imageUri to the original image URI
          return { imageUri: file.uri };
        }
      }
  
      const dateMatches = result["all_text"].match(/(\d{2}[-/]\d{2}[-/]\d{4})/);
  
      if (dateMatches) {
        date = dateMatches[0];
      } else {
        console.log("Date values not found");
      }
  
      return {
        referencia,
        amount: cleanedAmount,
        date,
        imageUri: file.uri, // Set imageUri to the original image URI
      };
    } catch (error) {
      console.error("Error in performOCR:", error);
      setMissingValue("Referencia, Operacion, or Recibo");
      // Set imageUri to the original image URI
      return { imageUri: file.uri };
    }
  };
  
  const handleImage = async (imageData) => {
    const extractedValues = await performOCR(imageData);

    if (valuesAreValid(extractedValues)) {
      setImage(imageData.uri);
      navigation.navigate('RegisterVerification', extractedValues);
    } else {
      console.log("Image sent to RegisterVerification");
      navigation.navigate('RegisterVerification', { image: imageData.uri });
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
});
