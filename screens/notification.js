import React from 'react'
import {View,Text,StyleSheet,Dimensions, Pressable,ScrollView} from 'react-native'
import {useState,useEffect} from 'react'
import { useRoute } from '@react-navigation/native'

import firebaseConfig from '../../../firebase'
import firebase from 'firebase/compat'
import 'firebase/compat/firestore'
import Header from '../../components/header'
import { useNavigation } from '@react-navigation/native'

import Icon from 'react-native-vector-icons/FontAwesome'

const db = firebase.firestore();
const deviceWidth = Math.round(Dimensions.get("window").width);


const TrackAttendees = async () => {
    const route = useRoute();
    const{eventId} = route.params;
    const email = await AsyncStorage.getItem('email');
    const navigation = useNavigation();
    
  
   const [insiders,setInsiders] = useState([])
   const [outsiders,setOutsiders] = useState([])
   const [interested,setInterested] = useState([])

  useEffect(()=>{
    // here snapshot is a listener which will be trigggered everytime there is change in db
     const  unsubscribe = db.collection('user_position')
                          .where('eventId','==',eventId)
                          .onSnapshot((querySnapShot) => {
                            const attendees = []
                            querySnapShot.forEach((doc)=> {
                                const attendee = doc.data()
                                attendees.push(attendee)
                            })
                            
                            const outsideAttendees = attendees.filter(
                                (attendee) => attendee.location === 'outside'
                              );
                             
                              const insideAttendees = attendees.filter(
                                (attendee) => attendee.location === 'inside'
                              );
                      
                              const interestedAttendees = attendees.filter(
                                (attendee) => !attendee.hasOwnProperty('location')
                              );
                      
                              setOutsiders(outsideAttendees);
                              setInsiders(insideAttendees);
                              setInterested(interestedAttendees);
                          })
    //cleanup function
    return() => {
        unsubscribe();
    }
  },[eventId])

  return (
   <View style={styles.container}>
    <View style={styles.custHeader}></View>
    <Header  label="          Attendees"></Header>
    <View style={styles.arrowButton}>
    <Pressable onPress={()=> navigation.navigate('myevents',{email:email})}>
        <Icon
        name='arrow-left'
        size={25}
        color='#000'>

        </Icon>
    </Pressable>
    </View>


   
    <View style={styles.scrollViewContainer}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <Text style={styles.text}>Outsiders:</Text>
    {outsiders.map((outsidee)=> {
        return(
        <Text key={outsidee.email}>
            Name: {outsidee.attName}, Email:{outsidee.email}</Text>
        )
        })}
        </ScrollView>
        </View>


        <View style={styles.scrollViewContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <Text style={styles.text}>Insiders:</Text>
    {insiders.map((insidee)=> {
        return(
     <Text key={insidee.email}>
        Name: {insidee.attName} Email:{insidee.email}
     </Text>
        )
    })}
    </ScrollView>
    </View>


<View style={styles.scrollViewContainer}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <Text style={styles.text}>Interested:</Text>
    {interested.map((interest)=> {
        return(
     <Text key={interest.email}>
        Name:{interest.attName}  Email:{interest.email}
     </Text>
        )
    })}
    </ScrollView>
   </View>
   </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        //justifyContent:'center',
        backgroundColor:'#FCEBE6'
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
       
      },
      scrollViewContainer: {
        height: '25%',
    backgroundColor: 'white',
    width: '80%',
    marginBottom:20,
    borderRadius:5
      },
       custHeader: {
        width: deviceWidth,
        height:'3%',
       // backgroundColor:"#bfc2cc",
       backgroundColor:'white',
        justifyContent:'flex-end', //vertical align
        alignItems:'center', //horizontal alignment
       paddingBottom:10
    },
    arrowButton: {
      position:'absolute',
            top:40,
            left:20,
          zIndex:1,
        },

   text:{
    color:'black',
    fontWeight:'bold',
    fontSize:15
   },
})

export default TrackAttendees