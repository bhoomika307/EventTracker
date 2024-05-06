import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeDisplay = ({ route }) => {
  const { qrData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>QR Code</Text>
      <QRCode
        value={JSON.stringify(qrData)}
        size={200}
        backgroundColor="white"
        color="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default QRCodeDisplay;
