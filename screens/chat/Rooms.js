import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput,FlatList} from 'react-native';
import io from "socket.io-client";
import RoomCard from "../../component/RoomCard";
import {REACT_APP_NODE_SERVER_URL} from "@env";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from '@react-navigation/core';

export default function Rooms({navigation}) {

const [socket,setSocket]=useState();
const [rooms,setrooms] = useState([]);
var temp=[];

const isFocused = useIsFocused();
const [reRender,setRerender]=useState(false);
const [isFetching,setIsFetching]=useState(false);

var s;
useEffect(() =>{
    initSocket().then(editHeaderOptions());
    return () => {
        setrooms([]);
    };
},[]);

async function initSocket() { 
    try {
    const userID= await AsyncStorage.getItem("@userID");
    const token= await AsyncStorage.getItem("@access_token");
        if(userID !== null && token != null) {
            //Khởi tạo socket có tên tạm là s
            s = io(`${REACT_APP_NODE_SERVER_URL}`, {
            withCredentials: false,
            extraHeaders: {
            cookie: 'access_token='+token
            }
            });
            setSocket(s); //(test send socket to next screen)
            //Gửi yêu cầu joinChat lên server => server trả về danh sách các room chat
            s.emit('joinChat', { userID });//
            //Khánh dời socket.on vào func initSocket
            s.on('rooms', (listRooms) => {
                setIsFetching(true);
                //Duyệt để thay đổi tên room
                listRooms.forEach(element => {
                    if(element.chatGroup === "false"){
                        if( userID == element.listMember[0].userID){
                            element.roomName = element.listMember[1].userName;
                            element.roomAvatarURL = element.listMember[1].imageUrl
                        }else{
                            element.roomName = element.listMember[0].userName;
                            element.roomAvatarURL = element.listMember[0].imageUrl
                        }
                    }
                });
                temp=listRooms;
                setrooms(listRooms);
                setIsFetching(false);
            });

            s.on('tbNewRoom', (tb) => {
                // setRerender(!reRender);
            });
            s.on('reloadRoomLam', (room) => {
                // console.log(room);
                if(room.chatGroup === "false"){
                    if( userID == room.listMember[0].userID){
                        room.roomName = room.listMember[1].userName;
                        room.roomAvatarURL = room.listMember[1].imageUrl
                    }else{
                        room.roomName = room.listMember[0].userName;
                        room.roomAvatarURL = room.listMember[0].imageUrl
                    }
                }

                temp.unshift(room);
                setrooms(temp);
            });
            s.on('reloadRooms', () => {
                // setRerender(!reRender);
            });
            s.on('reloadRoomAddMember', (room) => {
                // console.log(room._id);
                if(room.chatGroup === "false"){
                    if( userID == room.listMember[0].userID){
                        room.roomName = room.listMember[1].userName;
                        room.roomAvatarURL = room.listMember[1].imageUrl
                    }else{
                        room.roomName = room.listMember[0].userName;
                        room.roomAvatarURL = room.listMember[0].imageUrl
                    }
                }

                var arr=[room];
                temp.forEach(element => {
                    if(element)
                    arr.push(element);
                });
                // temp=[room, ...temp];
                // temp.unshift(room);
                temp=arr;
                // console.log("Temp in add member");
                // console.log(arr.length);
                // temp.forEach(element => {
                //     console.log("1");
                //     console.log(element._id);
                // });
                
                setrooms(arr);
                // setRerender(!reRender);
            });

            s.on('deleteRoom', (roomid) => {
                temp = temp.filter(item => item._id !== roomid);
                // temp.forEach(element => {
                //     console.log("2");
                //     console.log(element);
                // });
                setrooms(temp);

                // setRerender(!reRender);
            });

            s.on('acceptInvitation', (tb, a) => {
                if(a.chatGroup === "false"){
                    if( userID == a.listMember[0].userID){
                        a.roomName = a.listMember[1].userName;
                        a.roomAvatarURL = a.listMember[1].imageUrl
                    }else{
                        a.roomName = a.listMember[0].userName;
                        a.roomAvatarURL = a.listMember[0].imageUrl
                    }
                }
                temp.unshift(a);
                setrooms(temp);
                // setRerender(!reRender);
            });

            s.on('message', (message) =>{
                const newRoom = temp.find(item => item._id === message.room_id);
                // console.log(newRoom);
                temp = temp.filter(item => item._id !== message.room_id);
                // console.log(temp.length);
                temp.unshift(newRoom);
                // console.log(temp.length);
                setrooms(temp);
              });
            
            s.on('vohieuhoa',(tb)=>{
                logout();
                alert(tb);
            })
        }
    } catch(e) {
        console.log(e.message);
    }
}

async function clearStorage() {
    try {
        await AsyncStorage.clear();
    } catch (error) {
    }
}
function logout(){
    // if(room_id===roomid){
        clearStorage().then(()=>{
        // s.off();
        navigation.reset({
           index: 0,
           routes: [
             {
               name: 'Login',
             },
           ],});
       });
    // clearStorage().then(()=>navigation.replace("Login"));
}

async function editHeaderOptions(){
    navigation.setOptions({ 
        headerStyle:{backgroundColor:'white'},
        title:null,
        headerTitle:() => (
                <View style={{flex:1, flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    <Ionicons name="search" size={30} color="black"
                        style={{paddingHorizontal:5}}></Ionicons>
                    <TouchableOpacity onPress={() =>{
                        navigation.navigate("FindRoom",{
                            s
                        });
                        }}>
                        <TextInput
                            editable={false}
                            placeholder={'Find friends, chat'} 
                            placeholderTextColor={'lightgray'}
                            style={{color:'black',backgroundColor:'white',borderRadius:15,width:250, borderWidth:0,fontSize:16}}></TextInput>
                        
                    </TouchableOpacity>
                    
                </View>
        ),
        headerRight: () => (
            <View>
                <TouchableOpacity onPress={() =>{
                    navigation.navigate("CreateGroup",{
                        s
                    });
                    }}>
                    <Ionicons name="add-outline" size={30} color="black"></Ionicons>
                </TouchableOpacity>
            </View>
        ),
     });
}

return (
    <View>
        <FlatList
            data={rooms}
            // keyExtractor={(item) => item._id}
            onRefresh={() => initSocket()}
            refreshing={isFetching}
            renderItem={({item}) =>{
                if(item){
                    return (
                        <View>
                            <TouchableOpacity onPress={() =>{
                                navigation.navigate("Chat",{
                                    roomInfo:{ 
                                        id: item._id,
                                        roomName: item.roomName,
                                        // roomAvatarURL: item.roomAvatarURL,
                                        // leaderID:item.leaderID,
                                        // chatGroup: item.chatGroup,
                                    },
                                    socket //(test send socket to next screen)
                                });
                            } }>
                                <RoomCard roomInfo={item}></RoomCard>
                            </TouchableOpacity>
                        </View>
                    )
                }else {
                    console.log("undified!");
                    return null;
                }
            } 
                }
        />
    </View>
);

}