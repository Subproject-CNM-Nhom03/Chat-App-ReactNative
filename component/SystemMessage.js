import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View }from 'react-native'

export default function SystemMessage({messageInfo,navigation, route}){
    const {messageContent} = messageInfo;
    const [memberName,setMemberName]=useState();
    const [msg,setMsg]=useState();


    useEffect(() => {
        var name=messageContent.slice(messageContent.indexOf('<b>')+3, messageContent.indexOf('</b>'));
        var ms=messageContent.slice(messageContent.indexOf('</b>')+4);
        setMemberName(name);
        setMsg(ms);
        return () => {

        }
    }, [])

    
    return (
        <View style={style.systemMessage}>
            <Text style={style.memberName}>{memberName}</Text>
            <Text style={style.msg}>{msg}</Text>
        </View>
    )
    
}

const style=StyleSheet.create({
    systemMessage:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        padding:5,
    },
    memberName:{
        color:'black',
        fontSize:17,
        fontWeight:'bold',
        opacity:0.45,
    },
    msg:{
        color:'black',
        fontSize:17,
        opacity:0.45,
    },
})