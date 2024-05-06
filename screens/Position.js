import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import SendNotifications from './SendNotifications';

const Position = ({ route, navigation }) => {
  const [peopleInLocationEmails, setPeopleInLocationEmails] = useState([]);

  const { Eventname, eventId, latitude, longitude, radius } = route.params;
  const [peopleInLocation, setPeopleInLocation] = useState([]);
  const [peopleNotInLocation, setPeopleNotInLocation] = useState([]);

  // Function to calculate the distance between two coordinates using the Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };


  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  

  const handleSendNotifications = () => {
    navigation.navigate('SendNotifications', { peopleInLocationEmails });
  };

  const handleEventPress = async () => {
    try {
      const db = firebase.firestore();
  
      const registrationsCollection = db.collection('registrations');
      const registrationsSnapshot = await registrationsCollection.where('Eventname', '==', Eventname).get();
  
      if (registrationsSnapshot.empty) {
        // No registrations found for the event
        console.log('No registrations found for the event');
        return;
      }
  
      const peopleInLocationData = [];
      const peopleNotInLocationData = [];
  
      const userPositionsCollection = db.collection('user_positions');
      const userPositionsSnapshot = await userPositionsCollection.get();
  
      registrationsSnapshot.forEach((doc) => {
        const registration = doc.data();
        const { email } = registration;
  
        const userPositionDoc = userPositionsSnapshot.docs.find((positionDoc) => {
          const position = positionDoc.data();
          return position.email === email;
        });
  
        if (userPositionDoc) {
          const position = userPositionDoc.data();
          const { latitude: userLat, longitude: userLng, isLocationTracking } = position;
          const distance = getDistance(latitude, longitude, userLat, userLng);
  
          if (distance <= radius && isLocationTracking) {
            peopleInLocationData.push({ ...registration, position });
          } else {
            peopleNotInLocationData.push({ ...registration, position });
          }
        }
      });
  
      setPeopleInLocation(peopleInLocationData);
      setPeopleNotInLocation(peopleNotInLocationData);
      setPeopleInLocationEmails(peopleInLocationData.map((person) => person.email));
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEventPress} style={styles.button}>
        <Text style={styles.buttonText}>Load Registrations</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Event ID: {eventId}</Text>

      <Text style={styles.subheading}>People in Location:</Text>
      <View>
        {peopleInLocation.map((person) => (
          <Text key={person.email} style={styles.person}>
            {person.email}
          </Text>
        ))}
      </View>

      {/* Pass the 'email' variable when the button is pressed */}

      <Text style={styles.subheading}>People Not in Location:</Text>
      <View>
        {peopleNotInLocation.map((person) => (
          <Text key={person.email} style={styles.person}>
            {person.email}
          </Text>
        ))}
        <TouchableOpacity onPress={handleSendNotifications} style={styles.button}>
        <Text style={styles.buttonText}>Send Notifications</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default Position;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  person: {
    fontSize: 16,
    marginBottom: 4,
  },
});