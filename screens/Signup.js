import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import pattern from './5.png';
import firebaseConfig from '../config/db';
import { formgroup } from '../src/common/formcss';
import { button1 } from '../src/common/button';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ...
// ...


const handleSignup = async (navigation) => {
  try {
    if (email === '' || password === '' || name === '') {
      alert('Fill in the details to Signup');
    } else {
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = response.user;

      // Store additional user details in Firestore
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      await userRef.set({
        name,
        email,
        role: 1, // Set the role to 1 for signed-up users
      });

      console.log('Signup successful');
      Alert.alert("Signup succesfull");
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error(error);
  }
}

  return(
      <View style={styles.container}>
      <Image style={styles.patternbg} source={pattern} />
      <View style={styles.container1}>
      <View style={styles.s1}></View>
      <ScrollView style={styles.s2}>
      <View style={styles.formgroup}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={name}
        onChangeText={setName}
      />
      </View>
      <View style={styles.formgroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(1, 1, 1, 0.5)"
        value={email}
        onChangeText={setEmail}
      />
      </View>
      <View style={styles.formgroup}>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      </View>
      <TouchableOpacity
      onPress={handleSignup}
      >

        <Text style={button1}>Signup</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
    </View>

  );
};
export default Signup;
const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
    },
    patternbg: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
    },
    container1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    s1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '25%',
    },
    small1: {
      color: '#fff',
      fontSize: 17,
    },
    h1: {
      fontSize: 30,
      color: '#fff',
    },
    s2: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: '100%',
      height: '75%',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
    },
    formgroup: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginVertical: 10,
    },
    label: {
      fontSize: 15,
      color: 'black',
      marginLeft: 10,
      marginBottom: 5,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.6)', // Change the background color for all fields
      borderRadius: 20,
      padding: 10,
      color: 'black', // Change the text color for all fields
    },
    fp: {
      display: 'flex',
      alignItems: 'flex-end',
      marginHorizontal: 10,
      marginVertical: 5,
    },
});