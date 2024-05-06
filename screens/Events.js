import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import { button1 } from '../src/common/button';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const backgroundImage = require('./5.png');

const MyEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  

  useEffect(() => {
    getEmailFromStorage();
  }, []);

  useEffect(() => {
    if (email) {
      fetchEvents();
    }
  }, [email]);

  const getEmailFromStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (error) {
      console.error(error);
    }
  };
   
  const handleEnrollment = () => {
    navigation.navigate("Enrollment")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScanner = () =>{
    navigation.navigate("Scanner");
  }
  const handleEditModify=()=>{
    navigation.navigate("Modify");
  }

  const fetchEvents = async () => {
    try {
      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.where('Mail', '==', email).get();

      if (querySnapshot.empty) {
        // No events found
        console.log('No events found');
        return;
      }

      const eventsData = [];
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        const eventId = doc.id;
        eventsData.push({ id: eventId, ...event });
      });

      setEvents(eventsData);
    } catch (error) {
      console.error(error);
    }
  };
   
  const handleEventPress = (Eventname, eventId, latitude, longitude, radius) => {
    navigation.navigate('Position', {
      Eventname,
      eventId,
      latitude,
      longitude,
      radius,
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <TouchableOpacity onPress={handleScanner} style={styles.scannerButton}>
      <AntDesign name="qrcode" size={25} color="white" />
      {/*<Text style={styles.scannerButtonText}>Scan</Text>*/}
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
          <AntDesign name="bars" size={35} color="white" />
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleEnrollment} style={styles.menuButton}>
              <AntDesign name="pluscircle" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - New Event</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditModify} style={styles.menuButton}>
              <AntDesign name="edit" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - Edit/Modify an Event</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Button 3 pressed')} style={styles.menuButton}>
              <AntDesign name="user" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
              <AntDesign name="logout" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item.Eventname, item.id, item.latitude, item.longitude, item.circleRadius)}>
            <View style={styles.card}>
              <Text style={styles.name}>Event: {item.Eventname}</Text>
              <Text style={styles.email}>Location: {item.Address}</Text>
              <Text style={styles.event}>Description: {item.EventDescription}</Text>
              <Text style={styles.event}>Event Start Time: {item.EventStartTime}</Text>
              <Text style={styles.event}>Event End Time: {item.EventEndTime}</Text>
              <TouchableOpacity onPress={() => handleSendNotification(item.Eventname, item.Mail)}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Send Notification</Text>
  </View>
</TouchableOpacity>

            </View>
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};

export default MyEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scannerButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10, 
  },  
  scannerButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#894DF8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#894DF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#894DF8',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  event: {
    fontSize: 16,
    marginBottom: 16,
    color: 'black',
  },
});