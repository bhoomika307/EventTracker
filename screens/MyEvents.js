import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const RegisteredEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');

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

  const fetchEvents = async () => {
    try {
      const registrationsCollection = db.collection('registrations');
      const querySnapshot = await registrationsCollection.where('email', '==', email).get();

      if (querySnapshot.empty) {
        // No registrations found
        console.log('No registrations found');
        return;
      }

      const eventData = querySnapshot.docs[0].data();
      const eventName = eventData.EventName;
      const eventsCollection = db.collection('events');
      const eventsSnapshot = await eventsCollection.where('Eventname', '==', eventName).get();

      if (eventsSnapshot.empty) {
        // No events found
        console.log('No events found');
        return;
      }

      const eventsData = [];
      eventsSnapshot.forEach((doc) => {
        const event = doc.data();
        const eventId = doc.id;
        eventsData.push({ id: eventId, ...event });
      });

      setEvents(eventsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQr = async (eventName) => {
    try {
      const registrationsCollection = db.collection('registrations');
      const querySnapshot = await registrationsCollection
        .where('email', '==', email)
        .where('EventName', '==', eventName)
        .get();
  
      if (querySnapshot.empty) {
        // No matching registration found
        console.log('No matching registration found');
        return;
      }
  
      const registration = querySnapshot.docs[0].data();
      navigation.navigate('QrCodeDisplay', { registration });
    } catch (error) {
      console.error(error);
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleQr(item.Eventname)}>
      <View style={styles.card}>
        <Text style={styles.name}>Event: {item.Eventname}</Text>
        <Text style={styles.address}>Address: {item.Address}</Text>
        <Text style={styles.description}>Description: {item.EventDescription}</Text>
        <Text style={styles.time}>Start Time: {item.EventStartTime}</Text>
        <Text style={styles.time}>End Time: {item.EventEndTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registered Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text style={styles.noEventsText}>No events found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    marginBottom: 8,
  },
  noEventsText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default RegisteredEvents;
