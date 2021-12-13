import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import Chat from './screens/chat/Chat';
import Login from './screens/Login';
import VideoPlayer from './screens/chat/VideoPlayer';
import CreateGroup from './screens/chat/CreateGroup';
import ManageGroup from './screens/chat/ManageGroup';
import AddMember from './screens/chat/AddMember';
import SignUp from './screens/SignUp';
import FindRoom from './screens/chat/FindRoom';
import Verify from './screens/profile/VerifyCode';
import ResetPassword from './screens/profile/ResetPassword';
import Scan from './screens/profile/Scan';
import UpdateProfile from './screens/profile/UpdateProfile';
import Setting from './screens/profile/Setting';

const Stack=createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Chat" component={Chat}></Stack.Screen>
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} ></Stack.Screen>
        <Stack.Screen name="CreateGroup" component={CreateGroup}></Stack.Screen>
        <Stack.Screen name="ManageGroup" component={ManageGroup}></Stack.Screen>
        <Stack.Screen name="Setting" component={Setting}></Stack.Screen>
        <Stack.Screen name="AddMember" component={AddMember}></Stack.Screen>
        <Stack.Screen name="Verify" component={Verify}></Stack.Screen>
        <Stack.Screen name="FindRoom" component={FindRoom} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp}  options={{headerShown:false}} ></Stack.Screen>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown:true}}></Stack.Screen>
        <Stack.Screen name="Scan" component={Scan} options={{title:"Scan QR Code"}}></Stack.Screen>
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{headerShown:true}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}