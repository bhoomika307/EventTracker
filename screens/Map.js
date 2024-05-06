import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Map = ({ route }) => {
  const { Name, Mail, Eventname, EventDescription, EventDate, EventStartTime, EventEndTime,EventIntervalTime } = route.params;
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [circleRadius, setCircleRadius] = useState(100);
  const [customRadius, setCustomRadius] = useState('');

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
      setMarkerLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (placeName.trim() === '') {
      return;
    }

    const apiKey = 'c965d4215e96ffe46c89cc060c565783';
  const searchURL = `https://atlas.mapmyindia.com/api/places/search/json?query=${encodeURIComponent(placeName)}&region=IND&apiKey=${apiKey}`;
console.log(searchURL);

    try {
      const response = await fetch(searchURL);
      const data = await response.json();

      if (
        data &&
        data.resourceSets &&
        data.resourceSets.length > 0 &&
        data.resourceSets[0].resources &&
        data.resourceSets[0].resources.length > 0
      ) {
        const { coordinates } = data.resourceSets[0].resources[0].point;

        if (coordinates && coordinates.length === 2) {
          const latitude = coordinates[0];
          const longitude = coordinates[1];
          setLocation({ latitude, longitude });
          setMarkerLocation({ latitude, longitude });
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } else {
        Alert.alert('Location not found', 'Please try a different place name.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong while fetching location data.');
    }
  };

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setMarkerLocation(newLocation);
    setLocation(newLocation); // Update circle position
  };

  const handleCircleDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const handleConfirmLocation = async () => {
    const { latitude, longitude } = location;
    if (!location) {
      Alert.alert('Error', 'Please select a location first.');
      return;
    }
  
    try {
      const Address = placeName;
      const db = firebase.firestore();
      const eventsCollection = db.collection('events');
  
      const enrollmentData = {
        Name,
        Mail,
        Eventname,
        EventDate,
        EventStartTime,
        EventDescription,
        EventEndTime,
        Address,
        latitude,
        longitude,
        circleRadius,
        EventIntervalTime
      };
  
      await eventsCollection.add(enrollmentData);
  
      console.log('Event Enrollment successful');
      Alert.alert('Event Enrollment successful');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to save location to Firebase Firestore.');
    }
  };

  const handleCustomRadiusChange = (text) => {
    setCustomRadius(text);
  };

  const handleSetCustomRadius = () => {
    const parsedRadius = parseInt(customRadius);
    if (!isNaN(parsedRadius)) {
      setCircleRadius(parsedRadius);
    } else {
      Alert.alert('Invalid radius', 'Please enter a valid number for the radius.');
    }
  };

  return (
    <View style={styles.container}>
      {location && (
        <View style={styles.radiusContainer}>
          <Button style={styles.button} title="Set Radius" onPress={handleSetCustomRadius} />
          <TextInput
            style={styles.radiusInput}
            placeholder="Enter radius (in meters)"
            value={customRadius}
            onChangeText={handleCustomRadiusChange}
            keyboardType="numeric"
          />
        </View>
      )}
  
      <Button title="Confirm Location" onPress={handleConfirmLocation} />
  
      <TextInput
        style={styles.input}
        placeholder="Search for a place"
        value={placeName}
        onChangeText={setPlaceName}
      />
      <Button title="Search" onPress={handleSearch} />
  
      {region && (
        <MapView style={styles.map} region={region}>
          {markerLocation && (
            <Marker
              coordinate={markerLocation}
              title="Your Location"
              draggable
              onDragEnd={handleMarkerDragEnd}
            />
          )}
          {location && (
            <Circle
              center={location}
              radius={circleRadius}
              fillColor="rgba(255, 0, 0, 0.3)"
              strokeColor="rgba(255, 0, 0, 0.5)"
              draggable
              onDragEnd={handleCircleDragEnd}
            />
          )}
        </MapView>
      )}
    </View>
  );  
};

export default Map;

const styles = StyleSheet.create({
  button: {
    lineHeight: 12,
    width: 18,
    fontSize: 8,
    marginTop: 1,
    marginRight: 2,
    top: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  radiusContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  radiusInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});



