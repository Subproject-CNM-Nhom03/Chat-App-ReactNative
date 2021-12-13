import React, { useEffect,useState } from 'react';
import {Text, View,StyleSheet, Image,TouchableOpacity, Alert} from 'react-native';

export default function FriendCard({friendInfo,socket,myID}) {
    
    const {avatarURL,userName,userID} = friendInfo;
    const s=socket;
    const [shouldHide,setShouldHide] = useState(true);
    const [HideViewInfo,setHideViewInfo] = useState(false);
    function unfriend(){
        Alert.alert(
            `UnFriend?`,
            `Do you want to unfriend?`,
            [
                {
                    text:"Cancel",
                    style: "cancel"
                },
                {
                text:"Yes",
                onPress:()=> {
                    s.emit('unFriend', userID, myID);
                    setHideViewInfo(true);
                    },
                },
            ]
            );
    }
    function block(){
        Alert.alert(
            `Block?`,
            `You want to block this person?`,
            [
                {
                    text:"Cancel",
                    style: "cancel"
                },
                {
                text:"Yes",
                onPress:()=> {
                    s.emit('blockFriend', userID, myID);
                    setHideViewInfo(true);
                    },
                },
            ]
            );
    }
    
  return (
      
    <View style={style.card}>
        {
            !HideViewInfo ? (
        <View>
            <View style={style.leftContainer}>
                
                <View style={style.info}>
                    <Image source={{uri:avatarURL}} style={style.AvatarURL}></Image>
                    <Text style={style.userName}>{userName}</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                            setShouldHide(!shouldHide)}}>
                        <Image source={{uri:"https://cdn2.iconfinder.com/data/icons/interface-vol-3-1/16/more-vertical-menu-dots-512.png"}} style={style.button}></Image>
                </TouchableOpacity>
                
            </View>
            
            {
            !shouldHide ? (
                <View style={style.bottomContainer}>
                    <TouchableOpacity onPress={unfriend}>
                    <Text style={style.button1}>Unfriend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={block}>
                        <Text style={style.button1}>Block</Text>
                    </TouchableOpacity>
                </View>
                
            ):null
            }
        </View>
        ):null
        }

       

      </View>
  )
}

const style=StyleSheet.create({
    card:{
        flexDirection:"column",
        //  height:100
        
    },
    info:{
        flexDirection:"row",
        alignItems:"center"
    },

    leftContainer:{
        
        
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
        paddingVertical:5,
        backgroundColor:"white",
        paddingLeft:20,
        marginTop:12,
        marginLeft:15,
        marginRight:15,
        borderRadius:7,
    },
    
    bottomContainer:{
        
        
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:"flex-end",
        paddingVertical:5
    },
    AvatarURL:{
        width: 50,
        height:50,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        padding:1,
    },
    userName:{
        fontSize:18,
        color:"black"
    },

    button: {
        width: 15,
        height:15,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        
    },    
    button1: {
        width: 100,
        color:"black",
        fontSize:17
    },
})