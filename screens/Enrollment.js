import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Button, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { button1 } from '../src/common/button';
import { errormessage, formgroup, head1, head2, input, input1, label, link, link2 } from '../src/common/formcss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import pattern from './5.png';


const Enrollment = ({ navigation }) => {
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

  const [fdata, setFdata] = useState({
    Name: '',
    Eventname: '',
    EventDescription: '',
    EventStartTime: '',
    EventEndTime: '',
    EventBreakTime: '',
    EventDate:'',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedIntervalTime, setIntervalTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [isIntervalTimePickerVisible, setIntervalTimePickerVisible] = useState(false);
  const [email, setMail] = useState('');

  useEffect(() => {
    getEmailFromStorage();
  }, []);

  const getEmailFromStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setMail(storedEmail);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };
  const showIntervalTimePicker = () => {
    setIntervalTimePickerVisible(true);
  };
  
  const hideIntervalTimePicker = () => {
    setIntervalTimePickerVisible(false);
  };
  
  const handleIntervalTimeConfirm = (time) => {
    const newTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIntervalTime(newTime); // Fix this line
    hideIntervalTimePicker();
  };
  
  const handleDateConfirm = (date) => {
    setSelectedDate(date.toDateString());
    hideDatePicker();
  };

  const handleStartTimeConfirm = (time) => {
    const newTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedStartTime(newTime);
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (time) => {
    const newTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedEndTime(newTime);
    hideEndTimePicker();
  };
  const handleNext = () => {
    // Validate the fields before navigating
    if (!fdata.Name ||!fdata.Eventname || !fdata.EventDescription || !selectedDate || !selectedStartTime || !selectedEndTime||!selectedIntervalTime) {
      alert('Missing Fields', 'Please fill in all the required fields');
      return;
    }
  
    navigation.navigate('Map', {
      Name: fdata.Name,
      Mail: email,
      Eventname: fdata.Eventname,
      EventDescription: fdata.EventDescription,
      EventDate: selectedDate,
      EventStartTime: selectedStartTime,
      EventEndTime: selectedEndTime,
      EventIntervalTime:selectedIntervalTime
    });
  };

    // Add the new event to the events array
  
    
  

  return (
    <ImageBackground source={pattern} style={styles.backgroundImage}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.card}>
        <ScrollView>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={button1}>Logout</Text>
          </TouchableOpacity>
          <ScrollView style={styles.s2}>
            <View style={styles.formgroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Name"
                onChangeText={text => setFdata({ ...fdata, Name: text })}
              />
            </View>
            <View style={styles.formgroup}>
              <Text style={styles.label}>EventName</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your EventName"
                onChangeText={(text) => setFdata({ ...fdata, Eventname: text })}
              />
            </View>
            <View style={styles.formgroup}>
              <Text style={styles.label}>EventDescription</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your EventDescription"
                onChangeText={(text) => setFdata({ ...fdata, EventDescription: text })}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={showDatePicker}>
              <Text style={button1}>{selectedDate ? selectedDate : 'Select Date'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            <TouchableOpacity style={styles.button} onPress={showStartTimePicker}>
              <Text style={button1}>{selectedStartTime ? selectedStartTime : 'Start Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={hideStartTimePicker}
            />

            <TouchableOpacity style={styles.button} onPress={showEndTimePicker}>
              <Text style={button1}>{selectedEndTime ? selectedEndTime : 'End Time'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={hideEndTimePicker}
            />
            <TouchableOpacity style={styles.button} onPress={showIntervalTimePicker}>
  <Text style={button1}>{selectedIntervalTime ? selectedIntervalTime : 'Event Interval Time'}</Text>
</TouchableOpacity>
<DateTimePickerModal
  isVisible={isIntervalTimePickerVisible}
  mode="time"
  onConfirm={handleIntervalTimeConfirm}
  onCancel={hideIntervalTimePicker}
/>

            <TouchableOpacity style={styles.button1} onPress={handleNext}>
              <Text style={button1}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default Enrollment;

const styles = StyleSheet.create({
  container: {
      width: '100%',
      height: '100%',
      display: 'flex',

  },
  patternbg: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
  },
  container1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
  },
  s1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '10%',
  },
  small1: {
      color: '#fff',
      fontSize: 17,
  }
  ,
  h1: {
      fontSize: 30,
      color: '#fff',
  },
  s2: {
    display: 'flex',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Decreased transparency (20% opacity)
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,

  },
  formgroup: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginVertical: 10,
  },
  label: {
      fontSize: 15,
      color: 'black',
      marginLeft: 10,
      marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change the background color for all fields
    borderRadius: 20,
    padding: 10,
    color: 'black', // Change the text color for all fields
  },
  fp: {
      display: 'flex',
      alignItems: 'flex-end',
      marginHorizontal: 10,
      marginVertical: 5,
  }
})