import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      const registrationRef = firebase.firestore().collection('registrations').where('qrData', '==', data);
      const snapshot = await registrationRef.get();
  
      if (snapshot.empty) {
        Alert.alert('Invalid QR Code', 'The scanned QR code is not valid.');
      } else {
        snapshot.forEach(async (doc) => {
          const qrStatus = doc.data().qrStatus;
          if (qrStatus === 'notScanned') {
            // Update the qrStatus field of the matched document to 'scanned'
            await doc.ref.update({ qrStatus: 'scanned' });
            Alert.alert('Valid QR Code', 'The scanned QR code is valid.');
          } else {
            Alert.alert('QR Code Already Scanned', 'The scanned QR code has already been scanned.');
          }
        });
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
    }
  
    setScanned(true);
    setScannedData(data);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      />
      {scannedData !== '' && (
        <View style={styles.scanContainer}></View>
      )}
    </View>
  );
};

export default Scanner;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  camera: {
    flex: 1,
  },
  scanContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});