import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { button1 } from '../src/common/button';
import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const EditEventScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [eventName, setEventName] = useState(event.Eventname);
  const [eventLocation, setEventLocation] = useState(event.Address);
  const [eventDescription, setEventDescription] = useState(event.EventDescription);
  const [eventStartTime, setEventStartTime] = useState(event.EventStartTime);
  const [eventEndTime, setEventEndTime] = useState(event.EventEndTime);
  const [name, setName] = useState(event.Name);
  const [eventDate, setEventDate] = useState(event.EventDate);

  const handleSaveEvent = async () => {
    try {
      await db.collection('events').doc(event.id).update({
        Eventname: eventName,
        Address: eventLocation,
        EventDescription: eventDescription,
        EventStartTime: eventStartTime,
        EventEndTime: eventEndTime,
        Name: name,
        EventDate: eventDate,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Location"
        value={eventLocation}
        onChangeText={setEventLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Start Time"
        value={eventStartTime}
        onChangeText={setEventStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Event End Time"
        value={eventEndTime}
        onChangeText={setEventEndTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date"
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TouchableOpacity onPress={handleSaveEvent}>
        <Text style={button1}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
