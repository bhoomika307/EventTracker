import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Register = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [mobile, setMobile] = useState('');

  const { Eventname } = route.params;
  console.log(Eventname);
  const handleRegistration = async () => {
    const registrationData = {
      name,
      email,
      mobile,
      college,
      Eventname,
      qrStatus: 'notScanned', // Set default qrStatus to 'notScanned'
    };

    try {
      const registrationRef = await db.collection('registrations').add(registrationData);

      // Generate QR code data
      const qrData = {
        email,
        createdDateTime: new Date().toISOString(),
      };

      // Convert qrData to JSON string
      const qrDataString = JSON.stringify(qrData);

      // Save QR code data as a string in Firebase
      await registrationRef.update({
        qrData: qrDataString,
      });

      // Redirect to QR code display page
      navigation.navigate('QrCodeDisplay', { qrData });
    } catch (error) {
      console.error('Error registering and saving QR code:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registration</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>College</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your college"
          value={college}
          onChangeText={(text) => setCollege(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
        />
      </View>
      <Button title="Register" onPress={handleRegistration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
});

export default Register;