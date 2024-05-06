import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { button1 } from '../src/common/button';
import pattern from './5.png';

const Home = ({ navigation }) => {
  const handleHostEvent = () => {
    navigation.navigate('Login');
  };

  const handleRegisterEvent = () => {
    navigation.navigate('UserLogin');
  };

  return (
    <ImageBackground source={pattern} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={button1} onPress={handleHostEvent}>
            <Text style={styles.buttonText}>Host Event</Text>
          </TouchableOpacity>
          <TouchableOpacity style={button1} onPress={handleRegisterEvent}>
            <Text style={styles.buttonText}>Register Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    alignContent:'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  },
});