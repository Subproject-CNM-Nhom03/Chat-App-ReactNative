import React from 'react';
import {Text, View,StyleSheet} from 'react-native';
import { Appbar } from 'react-native-paper';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import Rooms from './chat/Rooms';
import Friends from './friend/Friends';
import Profile from './profile/Profile';


const Tab = createBottomTabNavigator();

export default function Home() {


  return (
    <Tab.Navigator initialRouteName="Rooms">
        <Tab.Screen name="Rooms" component={Rooms} options={{headerShown:true, 
          tabBarLabel:({focused})=>{
            return (
              <View>
                {
                  focused ? (<Text style={style.label}>Chat</Text>):null
                }
              </View>
            ) 
          },
          tabBarIcon: ({focused})=>{
              return (
                <View>
                  <AntDesign style={{color: focused? 'blue' : 'black',paddingTop:5}} name="message1" size={30} color="black"></AntDesign>
                </View>
              )
          },
          }}/>
        <Tab.Screen name="Friends" component={Friends} options={{headerShown:false, 
          tabBarLabel:({focused})=>{
            return (
              <View>
                {
                  focused ? (<Text style={style.label}>Friend</Text>):null
                }
              </View>
            ) 
          },
          tabBarIcon: ({focused})=>{
              return (
                <View>
                  <MaterialCommunityIcons style={{color: focused? 'blue' : 'black',paddingTop:5}} name="account-multiple-outline" size={30} color="black"></MaterialCommunityIcons>
                </View>
              )
          },
          }}/>
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:true, 
          tabBarLabel:({focused})=>{
            return (
              <View>
                {
                  focused ? (<Text style={style.label}>Profile</Text>):null
                }
              </View>
            ) 
          },
          tabBarIcon: ({focused})=>{
              return (
                <View>
                  <MaterialCommunityIcons style={{color: focused? 'blue' : 'black',paddingTop:5}} name="account-circle-outline" size={30} color="black"></MaterialCommunityIcons>
                </View>
              )
          },
        }}/>
    </Tab.Navigator>
  );
  
}

const style = StyleSheet.create({
  icon: {

  },
  label:{
    color:'blue', 
    fontSize:13,
  }
});