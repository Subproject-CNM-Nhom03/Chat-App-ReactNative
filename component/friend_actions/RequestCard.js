import React, { useEffect,useState } from 'react';
import {Text, View,StyleSheet, Image,TouchableOpacity} from 'react-native';

export default function RequestCard({friendInfo,socket,myID}) {
    
    const {avatarURL,userName,userID} = friendInfo;
    const s=socket;
    const [shouldHide,setShouldHide] = useState(true);
    const [HideViewInfo,setHideViewInfo] = useState(false);

    function accept(){
        s.emit('acceptInvitation', userID+"", myID+"");
        setHideViewInfo(true);

    }
    function deletez(){
        setHideViewInfo(true);

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
                <TouchableOpacity onPress={accept}>
                    <Text style={style.accept}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deletez}>
                    <Text style={style.deletez}>Delete</Text>
                </TouchableOpacity>
                
            </View>
        </View>
        ):null
        }

       

      </View>
  )
}

const style=StyleSheet.create({
    card:{
        flexDirection:"column",
        flex:1
    },
    info:{
        flexDirection:"row",
        flex:1,
        alignItems:"center"
    },

    leftContainer:{
        
        flex:1,
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
        
        flex:1,
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
    accept:{
        borderRadius:7,
        backgroundColor:"#00B2BF",
        
        fontSize:18,
        color:"white",
        padding:7,
        marginRight:10
    },
    deletez:{
        borderRadius:7,
        backgroundColor:"#A0A0A0",
        
        marginRight:5,
        fontSize:18,
        color:"white",
        padding:7,
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