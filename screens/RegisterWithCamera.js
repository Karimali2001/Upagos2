//pagina donde se registra un pago con una foto
//la foto puede ser tomada por camara o de la galeria
//se usa una api que pasa la imagen a texto y de ahi se 
//sacan los valores y se mandan a la pantalla de verificacion
import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, SafeAreaView, View, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function RegisterWithCamera({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const loadingRef = useRef(null);

  useEffect(() => {
    // Reset state when the component mounts
    setImage(null);
    setLoading(false);
  }, []);

  const pickImageGallery = async () => {
    setLoading(true); // Show loading indicator
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const extractedValues = await performOCR(result.assets[0]);
      setImage(result.assets[0].uri);
      navigation.navigate('RegisterVerification', { ...extractedValues, imageUri: result.assets[0].uri });
    }
    setLoading(false); // Hide loading indicator
  };

  const pickImageCamera = async () => {
    setLoading(true); // Show loading indicator
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const extractedValues = await performOCR(result.assets[0]);
      setImage(result.assets[0].uri);
      navigation.navigate('RegisterVerification', { ...extractedValues, imageUri: result.assets[0].uri });
    }
    setLoading(false); // Hide loading indicator
  };

  const performOCR = async (file) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20");
      myHeaders.append("Content-Type", "multipart/form-data");

      const requestOptions = {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: file,
      };

      const response = await fetch("https://api.apilayer.com/image_to_text/upload", requestOptions);
      const result = await response.json();

      console.log("Extracted Text:", result);

      if (!result.annotations || result.annotations.length === 0) {
        console.log("No text detected");
        return { imageUri: file.uri };
      }

      let referencia = null;
      let cleanedAmount = null;
      let date = null;

      const referenceMatches = result["all_text"].match(/\D(\d{9,})(?!\d)|(\d{9}(?=\D|$))/g);
      if (referenceMatches) {
        for (const match of referenceMatches) {
          const digits = match.replace(/\D/g, ''); // Extract digits from the match
          if (!isNaN(digits) && digits.length === 11) {
            continue; // Skip this match and proceed to the next one if it has exactly 11 digits
          }
          if (digits.length >= 9) { // Check if the digits have 9 or more digits
            referencia = digits;
            break; // Break loop once a valid reference number is found
          }
        }
      }

      const amountMatch = result["all_text"].match(/\b\d{1,3}(?:,\d{3})*(?:,\d{1,2})\b/);
      if (amountMatch) {
        cleanedAmount = parseFloat(amountMatch[0].replace(',', '.'));
      } else {
        console.log("Amount with decimals not found");
        return { imageUri: file.uri };
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
        imageUri: file.uri,
      };
    } catch (error) {
      console.error("Error in performOCR:", error);
      return { imageUri: file.uri };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading2}>Elige una opción</Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#F99417" />
        </View>
      ) : null}
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
  loading: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
