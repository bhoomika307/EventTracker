import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity ,Alert} from 'react-native';
import firebase from 'firebase/compat/app';
import pattern from './5.png';
import 'firebase/compat/database';
import firebaseConfig from '../config/db';
import 'firebase/compat/firestore';
import { errormessage, formgroup, head1, head2, input, input1, label, link, link2 } from '../src/common/formcss';
import { button1 } from '../src/common/button';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const UserSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);

  const handleUserSignup = async () => {
    try {
      if (email === '' || password === '' || name === '') {
        alert('Fill in the details to Signup');
      } else {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = firebase.auth().currentUser;
        if (user) {
          // Update user display name
          await user.updateProfile({
            displayName: name,
          });
          console.log('Signup successful');
          Alert.alert("Signup successful")
          // Set the role value in the Firestore database
          await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: 0,
          });
          alert('User registered successfully');
          navigation.navigate('Login'); // Navigate to the login page
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
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
          <View style={styles.formgroup} >
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.formgroup} >
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity onPress={handleUserSignup}>
            <Text style={button1}>Signup</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default UserSignup;

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