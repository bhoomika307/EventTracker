import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserSignup from './screens/UserSignup';
import Intro from './screens/Intro';
import Home from './screens/Home';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Enrollment from './screens/Enrollment';
import Map from './screens/Map';
import Card from './screens/Card';
import Register from './screens/Register';
import QrCodeDisplay from './screens/qr';
import Scanner from './screens/Scanner';
import Events from './screens/Events';
import Position from './screens/Position';
import RegisteredEvents from './screens/MyEvents';
import UserLogin from './screens/Userlogin'
import ModifyEvent from './screens/ModifyEvent'
import EditEvent from './screens/EditEvent'
import SendNotifications from './screens/SendNotifications';

const Stack = createStackNavigator();

 export default function App(){
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Intro" component={Intro}/>
    <Stack.Screen name="UserSignup" component={UserSignup}/>
    <Stack.Screen name="Home" component={Home}/>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Signup" component={Signup}/>
    <Stack.Screen name="Enrollment" component={Enrollment}/>
    <Stack.Screen name="Map" component={Map}/>
    <Stack.Screen name="Card" component={Card}/>
    <Stack.Screen name="Register" component={Register}/>
    <Stack.Screen name="QrCodeDisplay" component={QrCodeDisplay}/>
    <Stack.Screen name="Scanner" component={Scanner}/>
    <Stack.Screen name="Events" component={Events}/>
    <Stack.Screen name="Position" component={Position}/>
    <Stack.Screen name="RegisteredEvents" component={RegisteredEvents}/>
    <Stack.Screen name="UserLogin" component={UserLogin}/>
    <Stack.Screen name="Modify" component={ModifyEvent}/>
    <Stack.Screen name="EditEvent" component={EditEvent}/>
    <Stack.Screen name="SendNotifications" component={SendNotifications}/>
    </Stack.Navigator>
    </NavigationContainer>
   // <Notification/>
      );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
