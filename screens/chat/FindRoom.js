import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,LogBox,TextInput,FlatList} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import RoomCard from "../../component/RoomCard";

export default function FindRoom({navigation,route}){

    // Ẩn thông báo cảnh báo lỗi Non-serializable khi truyền socket to Rooms.js sang Chat.js
    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.']);

    const socket=route.params.s;
    const [userID,setUserID]=useState();

    const [input,setInput]=useState("");
    const [listRoom,setListRoom]=useState([]);

    useEffect(()=>{
        initListRoom();
        return () => {
            setListRoom([]);
            socket.off();
        };
    },[]);

    async function initListRoom(){
        const id= await AsyncStorage.getItem("@userID");
        setUserID(id);
       
        socket.on('roomsSearch', (listRoom) => {
            //Duyệt để thay đổi tên room
            listRoom.forEach(element => {
                if(element.chatGroup === "false"){
                    if( id == element.listMember[0].userID){
                        element.roomName = element.listMember[1].userName;
                        element.roomAvatarURL = element.listMember[1].imageUrl
                    }else{
                        element.roomName = element.listMember[0].userName;
                        element.roomAvatarURL = element.listMember[0].imageUrl
                    }
                }
            });
            setListRoom(listRoom);
        })
    }

    function searchRoom(){
        // console.log(input);
        // console.log(userID);
        socket.emit('searchRoom', input, userID);
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack();
                }}>
                    <Ionicons name="arrow-back" size={30} style={style.backbtn}></Ionicons>
                </TouchableOpacity>
                <TextInput 
                    value={input}
                    onChangeText={setInput} 
                    placeholder={'Find friends, chat'} 
                    placeholderTextColor={'lightgray'}
                    style={style.input}>
                    </TextInput>
                <TouchableOpacity onPress={searchRoom}>
                    <Ionicons name="search" size={30} style={style.backbtn}></Ionicons> 
                </TouchableOpacity>
            </View>
            <FlatList
                data={listRoom}
                keyExtractor={(item) => item._id}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={() =>{
                        navigation.replace("Chat",{
                            roomInfo:{ 
                                id: item._id,
                                roomName: item.roomName,
                                roomAvatarURL: item.roomAvatarURL,
                                leaderID:item.leaderID,
                                chatGroup: item.chatGroup,
                            },
                            socket
                        });
                    } }>
                        <RoomCard roomInfo={item}></RoomCard>
                    </TouchableOpacity>
                    
                )}
                style={style.listRoom}>
            </FlatList>
        </View>
    )
}

const style=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start'
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'white',
        padding:10
    },
    backbtn:{
        color:"black",
        paddingHorizontal:5,
    },
    input:{
        flex:1,
        backgroundColor:'white',
        color:'black',
        padding:10,
        fontSize:16,
        borderRadius:15
    },
    listRoom:{
        flex:1,
    },
})