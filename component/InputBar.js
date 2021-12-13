import React, { useState } from 'react';
import {Text, View,StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function InputBar(){

    const [message,setMessage]=useState("");

    async function initSocket(){
        
    }

    return (
        <View style={style.container}>
            <View style={style.mainContainer}>
                <TouchableOpacity>
                    <FontAwesome5 style={style.laughIcon} name="laugh-beam" size={30} color="black"></FontAwesome5>
                </TouchableOpacity>
            <TextInput style={style.textInput} value={message} placeholder="Tin nhắn" onChangeText={setMessage} onSubmitEditing={()=>alert(message)}/>
            <TouchableOpacity>
                <Ionicons style={style.attachIcon} name="attach-sharp" size={30} color="black"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons style={style.cameraIcon} name="camera-outline" size={30} color="black"></Ionicons>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const style=StyleSheet.create({
    container:{
        backgroundColor:"white",
        alignItems:'flex-start',
        justifyContent:'center',
        paddingHorizontal:10,
        paddingVertical:5
    },
    mainContainer:{
        flexDirection:'row',
        alignItems:'center',
    },
    laughIcon:{
        paddingRight:5
    },
    textInput:{
        color:"black",
        paddingHorizontal:5,
        flex:1,
        borderWidth:1,
        borderColor:"lightgray",
        borderRadius:15,
        fontSize:18
    },
    attachIcon:{
        paddingRight:5
    },
    cameraIcon:{
        paddingRight:5
    },
});