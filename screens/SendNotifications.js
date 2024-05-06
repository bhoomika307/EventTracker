import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import firebaseConfig from '../config/db';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat';
import 'firebase/compat/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const SendNotifications = ({ route }) => {
  const { peopleInLocationData } = route.params;
  console.log("got in");
  const [alltokens, setAllTokens] = useState([]);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notTitle, setNotTitle] = useState('');
  const [notBody, setNotBody] = useState('');
  const [notData, setNotData] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const sendPushNotification = async (peopleInLocationData, notTitle, notBody, notData) => {
    try {
      const messages = [];
  
      for (const person of peopleInLocationData) {
        const { email } = person;
        console.log(email);
        const tokensRef = db.collection('tokens');
        const querySnapshot = await tokensRef.where('email', '==', email).get();
  
        querySnapshot.forEach((doc) => {
          const token = doc.data().token;
          console.log(token);
          messages.push({
            to: token,
            sound: 'default',
            title: notTitle,
            body: notBody,
            data: {
              notData: notData,
            },
          });
        });
      }
  
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });
  
      Alert.alert('Success', 'Sent notifications to everyone inside');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send notifications');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.arrowButton}>
        <Pressable onPress={() => navigation.navigate('myevents', { email: email })}></Pressable>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Enter the title:</Text>
        <TextInput
          name="title"
          placeholder="Enter title:"
          value={notTitle}
          onChangeText={setNotTitle}
          style={{ height: 50, width: 300, backgroundColor: 'white', borderRadius: 20, marginBottom: 20, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
        />
        <Text>Enter the body:</Text>
        <TextInput
          multiline
          name="body"
          placeholder="Enter body:"
          value={notBody}
          onChangeText={setNotBody}
          style={{ height: 100, width: 300, backgroundColor: 'white', borderRadius: 20, marginBottom: 20, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
        />
        <Text>Enter the Data:</Text>
        <TextInput
          name="data"
          placeholder="Enter data:"
          value={notData}
          onChangeText={setNotData}
          style={{ height: 50, width: 300, backgroundColor: 'white', borderRadius: 20, marginBottom: 20, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
        />
      </View>
      <Pressable onPress={async () => {
        await sendPushNotification(peopleInLocationData, notTitle, notBody, notData);
      }}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send!</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FCEBE6',
  },
  sendButton: {
    backgroundColor: '#AF7D7D',
    borderRadius: 20,
    height: 45,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  arrowButton: {
    position: 'absolute',
    top: 50,
    left: 30,
  },
});

export default SendNotifications;
