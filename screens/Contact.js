import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LogBox } from 'react-native';
import image from '../../assets/contact.png';

const Contact = ({navigation}) => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <ImageBackground source={image} style={styles.backgroundImage}>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Contact;