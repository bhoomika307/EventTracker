import React, { useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('An error occurred in background location task:', error);
    return;
  }
  if (data) {
    const { locations, eventId } = data;
    const { latitude, longitude } = locations[0].coords;

    try {
      const email = await AsyncStorage.getItem('email');
      // Store the location in the 'user_positions' collection
      lastLocationUpdateRef.current = new Date();
      const userPositionRef = db.collection('user_positions').doc(email);
      await userPositionRef.set(
        {
          email,
          latitude,
          longitude,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          trackingStatus: true, // Assuming tracking is active when the location is received
          eventId, // Assuming you want to store the eventId as well
        },
        { merge: true } // Merge the new data with the existing document
      );
    } catch (error) {
      console.log(error);
    }
  }
});


const Card = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  const lastLocationUpdateRef = useRef(null);
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      // Fetch user details from AsyncStorage
  
      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.get();
  
      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();
  
        return {
          id: doc.id, // Add the document ID to the returned data
          ...enrollment,
        };
      });
  
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };
  

  const  registerForPushNotificationsAsync= async(eventId) => {
    console.log(eventId);
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    console.log(email);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    storeToken(token,email,eventId);
  }

  const storeToken = async(token,email,eventId) => {
    console.log(token);
    await db.collection('tokens').add({token:token,email:email,eventId: eventId,});
  }

  const logout = async () => {
    try {
      // Clear AsyncStorage values
      await AsyncStorage.removeItem('user');
      navigation.navigate('UserLogin');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = (Eventname) => {
    console.log(Eventname);
    navigation.navigate('Register', { Eventname });
  };

  const startBackgroundLocationTask = async (eventId) => {
    // Check if background location permission is granted
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Permission Required',
        'Please enable background location permissions to track your location in the background.'
      );
      return;
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
      data: { eventId },
    });

    // Set the state to indicate location tracking has started
    setIsLocationTracking(true);

    // Update the database with the new tracking status
    const email = await AsyncStorage.getItem('email');
    const userPositionRef = db.collection('user_positions').doc(email);
    await userPositionRef.set({ trackingStatus: true }, { merge: true });

    console.log('Background location task started.');
  };

  const stopBackgroundLocationTask = async () => {
    // Stop the background location task
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

    // Set the state to indicate location tracking has stopped
    setIsLocationTracking(false);

    // Update the database with the new tracking status
    const email = await AsyncStorage.getItem('email');
    const userPositionRef = db.collection('user_positions').doc(email);
    await userPositionRef.set({ trackingStatus: false }, { merge: true });

    console.log('Background location task stopped.');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        {enrollments.map((enrollment) => (
          <View key={enrollment.id} style={styles.card}>
            <Text style={styles.name}>Event: {enrollment.Eventname}</Text>
            <Text style={styles.email}>Location: {enrollment.Address}</Text>
            <Text style={styles.event}>Description: {enrollment.EventDescription}</Text>
            <Text style={styles.event}>Event Start Time: {enrollment.EventStartTime}</Text>
            <Text style={styles.event}>Event End Time: {enrollment.EventEndTime}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                startBackgroundLocationTask();
              }}
            >
              <Text style={styles.buttonText}>Track Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isLocationTracking) {
              stopBackgroundLocationTask();
            } else {
              startBackgroundLocationTask(enrollment.id);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isLocationTracking ? 'Stop Tracking' : 'Track Location'}
          </Text>
        </TouchableOpacity>
<TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleRegister(enrollment.Eventname);
        }}
      >
        <Text style={styles.button}>Register</Text>
      </TouchableOpacity>
<Pressable>
      <View style={styles.bluebutton}>
 <Text style={styles.button}  onPress={() => {
        registerForPushNotificationsAsync(enrollment.id); 
      }}>Get Notifications!</Text>
</View>
 </Pressable>
          </View>
          
        ))}
      </ScrollView>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  button: {
    backgroundColor: '#FFB0CC',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
import { Stopwatch } from 'react-native-stopwatch-timer'
const db = firebase.firestore();

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('An error occurred in background location task:', error);
    return;
  }
  if (data) {
    const { locations, eventId } = data;
    const { latitude, longitude } = locations[0].coords;

    try {
      const email = await AsyncStorage.getItem('email');
      // Store the location in the 'user_positions' collection
      const userPositionRef = db.collection('user_positions').doc(email);
      await userPositionRef.set(
        {
          email,
          latitude,
          longitude,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          trackingStatus: true, // Assuming tracking is active when the location is received
          eventId, // Assuming you want to store the eventId as well
        },
        { merge: true } // Merge the new data with the existing document
      );
    } catch (error) {
      console.log(error);
    }
  }
});


const Card = ({ navigation }) => {
  const[isTimerRunning,setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0);

  const [enrollments, setEnrollments] = useState([]);
  const [isLocationTracking, setIsLocationTracking] = useState(false);
  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(()=> {
    let interval;

    if(isTimerRunning)
    {
     interval = setInterval (()=> {
        setElapsedTime((prevtime) => prevtime+1)
        console.log('Time interval:', elapsedTime);
      },1000)
    }
    return () =>{
       clearInterval(interval)
    }
  },[isTimerRunning, elapsedTime]);


  useEffect(() => {
    // Check location update status every second
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const lastUpdateTime = lastLocationUpdateRef.current?.getTime();
      // Assuming 5000 ms (5 seconds) as the expected update interval
      const expectedInterval = 5000;

      if (lastUpdateTime && currentTime - lastUpdateTime > expectedInterval) {
        setIsLocationTracking(false);
      } else {
        setIsLocationTracking(true);
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(interval);
    };
  }, []);


  const getEventTimings = async() => {
    const  event = await db.collection('events')
    .where(Eventname,'==',Eventname)
    .get()
  
  if(!event.empty)
  {
  
  const doc = event.docs[0]
  
  const startTime = doc.data().EventStartTime;
  const endTime = doc.data().EventEndTime;
  const intervalTime = doc.data().EventIntervalTime;
  const date = doc.data().EventDate;
  
  const startHour  = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1])
  const endHour = parseInt(endTime.split(':')[0])
  const endMinute = parseInt(endTime.split(':')[1])
  const breakTime = parseInt(intervalTime)
  
  const hourIntervalinMin = Math.abs(startHour - endHour) *60
  const MinInterval  = Math.abs(startMinute - endMinute)
   eventInterval = hourIntervalinMin + MinInterval- breakTime ;
  return {eventInterval, endTime};
  
  }}
  
  
  const fetchEnrollments = async () => {
    try {
      // Fetch user details from AsyncStorage
  
      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.get();
  
      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();
  
        return {
          id: doc.id, // Add the document ID to the returned data
          ...enrollment,
        };
      });
  
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };
  

  const  registerForPushNotificationsAsync= async(eventId) => {
    console.log(eventId);
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    console.log(email);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    storeToken(token,email,eventId);
  }

  const storeToken = async(token,email,eventId) => {
    console.log(token);
    await db.collection('tokens').add({token:token,email:email,eventId: eventId,});
  }

  const logout = async () => {
    try {
      // Clear AsyncStorage values
      await AsyncStorage.removeItem('user');
      navigation.navigate('UserLogin');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = (Eventname) => {
    console.log(Eventname);
    navigation.navigate('Register', { Eventname });
  };

  const startBackgroundLocationTask = async (eventId) => {
    // Check if background location permission is granted
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Permission Required',
        'Please enable background location permissions to track your location in the background.'
      );
      return;
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
      data: { eventId },
    });

    // Set the state to indicate location tracking has started
    setIsLocationTracking(true);

    // Update the database with the new tracking status
    const email = await AsyncStorage.getItem('email');
    const userPositionRef = db.collection('user_positions').doc(email);
    await userPositionRef.set({ trackingStatus: true }, { merge: true });
    const {eventInterval} = await getEventTimings()
    console.log('Background location task started.');
  };
  const stopBackgroundLocationTask = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setIsLocationTracking(false);
    const email = await AsyncStorage.getItem('email');
    const userPositionRef = db.collection('user_positions').doc(email);
    await userPositionRef.set({ trackingStatus: false }, { merge: true });
    console.log('Location updates stopped.');
    const user = await db.collection('users_positions')
    .where(email,'==',email)
    .get()
    if(!user.empty)
    {
     userref = user.docs[0].ref;
    await userref.update({trackingStatus:false})
    if(elapsedTime/60 >= eventInterval)
    {
      await userref.update({Attendance:'Yes'})
    }else{
      await userref.update({Attendance:'No'})
    }
    }
   
  };*/