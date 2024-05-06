import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';
import image from './5.png';

const Intro = ({navigation}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleWelcome=()=>{
    navigation.navigate('Home');
  }
  const handleContact=()=>{
    navigation.navigate('Contact');
  }
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  return (
    <ImageBackground source={image} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}></Text>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          buttonTextStyle={styles.menuText}
          icon={<Icon name="menu" style={styles.menuIcon} />}
          onPress={() => setMenuOpen(!menuOpen)}
          bgColor="rgba(0,0,0,0.7)"
          radius={100}
          offsetY={-60}
          offsetX={-30}
          spacing={25}
          active={menuOpen}
          useNativeDriver={true}
          position="right" 
          horizontalOrientation="up" 
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Home"
            onPress={handleWelcome}
          >
            <Icon name="home" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="contact"
            onPress={handleContact}
          >
            <Icon name="call" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 48,
    color: '#fff',
  },
  menuText: {
    color: '#fff',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Intro;