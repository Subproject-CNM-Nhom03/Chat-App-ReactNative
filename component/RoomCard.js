import React, { useEffect,useState } from 'react';
import {Text, View,StyleSheet, Image} from 'react-native';

export default function RoomCard({roomInfo}) {
    const {roomName,roomAvatarURL,dateUpdate,chatGroup} = roomInfo;
  return (
      <View style={style.card}>
          <View style={style.infoContainer}>
              <View style={style.leftContainer}>
                    <Image source={{uri:roomAvatarURL}} style={style.roomAvatarURL}></Image>
                    <Text style={style.roomName}>{chatGroup=="true"? "Group: ":""}{roomName}</Text>
              </View>
            <Text style={style.dateUpdate}>{dateUpdate}</Text>
          </View>
      </View>
  )
}

const style=StyleSheet.create({
    card:{
        padding:10,
        marginTop:10,
        backgroundColor:'white',
        elevation:1,
    },
    infoContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:5
    },
    leftContainer:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:5
    },
    roomAvatarURL:{
        width: 50,
        height:50,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        padding:1,
    },
    roomName:{
        fontSize:18,
        color:"black"
    },
    dateUpdate:{
        fontSize:12,
        color:"gray"
    }
})