import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pattern from './5.png';
import { button1 } from '../src/common/button';
import { formgroup, label, input } from '../src/common/formcss';
import { Notifications } from 'expo';

import firebaseConfig from '../config/db';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const db = firebase.firestore();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    checkToken(); // Check token on component mount
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log("logged in");
        // If token exists, navigate to the card page
        await AsyncStorage.setItem('email', email);
        navigation.navigate('Card');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (email === '' || password === '') {
        alert('Fill in the details to Log in');
      } else {
        const response = await firebase.auth().signInWithEmailAndPassword(email, password);
        const uid=response.user.uid;

        // Fetch user details from Firestore
        const userRef = db.collection('users');
        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
          // No documents found
          console.log('No users found in the collection');
          return;
        }

        // Check the role for each user
        let roleFound = false;
        userSnapshot.forEach((doc) => {
          const user = doc.data();
          const userId = doc.id;
          if (userId === uid && user.role === 0) {
            roleFound = true;
          }
        });
        console.log(roleFound);

        if (roleFound) {
          const token = uid;
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('email',email);
          alert('Logged in successfully');

          // Redirect to the appropriate page for the first login purpose
           navigation.navigate('Card');
        } else {
          alert('You do not have the necessary role to log in');
        }
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
  };

  const handleSignup = () => {
    navigation.navigate('UserSignup'); // Navigate to the signup page
  };

  return (
    <View style={styles.container}>
      <Image style={styles.patternbg} source={pattern} />
      <View style={styles.container1}>
        <View style={styles.s1}></View>
        <ScrollView style={styles.s2}>
          <View style={styles.formgroup}>
            <Text style={styles.label}>Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
          <TouchableOpacity onPress={handleLogin}>
            <Text style={button1}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.label}>Not signed up? Signup here</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default Login;

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
    height: '40%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Decreased transparency (20% opacity)
    width: '100%',
    height: '60%',
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
