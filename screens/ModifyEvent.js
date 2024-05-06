import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { button1 } from '../src/common/button';
import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const MyEventsScreen = ({ navigation }) => {
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

  const handleEditEvent = (event) => {
    navigation.navigate('EditEvent', { event });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await db.collection('events').doc(eventId).delete();
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const confirmDeleteEvent = (event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete the event "${event.Eventname}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteEvent(event.id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={button1}>Back</Text>
      </TouchableOpacity>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleEditEvent(item)}>
            <View style={styles.card}>
              <Text style={styles.name}>Event: {item.Eventname}</Text>
              <Text style={styles.email}>Location: {item.Address}</Text>
              <Text style={styles.event}>Description: {item.EventDescription}</Text>
              <Text style={styles.event}>Event Start Time: {item.EventStartTime}</Text>
              <Text style={styles.event}>Event End Time: {item.EventEndTime}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDeleteEvent(item)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  event: {
    fontSize: 16,
    marginBottom: 16,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
