import React, { useEffect,useState,useRef } from "react";
import {Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused } from '@react-navigation/core';

export default function ManageGroup({navigation,route}){

    const socket=route.params.socket;
    const room_id =route.params.roomInfo.id;

    // const room_name=route.params.roomInfo.roomName;
    // const room_avatarurl=route.params.roomInfo.roomAvatarURL;
    // const leaderID=route.params.roomInfo.leaderID;
    // const chatGroup=route.params.roomInfo.chatGroup;

    const [room_avatarurl,setRoomAvatarUrl]=useState();
    const [room_name,setRoomName]=useState();
    const [leaderID,setLeaderID]=useState();
    const [chatGroup,setChatGroup]=useState();

    const [userID,setUserID]=useState();
    const [userName,setUserName]=useState();
    const [listMember,setListMember]=useState([]);
    const [reRender,setRerender]=useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {

        getListMember();
        return () => {
            setListMember([]);
            // socket.off();
        }
    }, [reRender])

    // async function getUserInfo(){
    //     var id=await AsyncStorage.getItem("@userID");
    //     setUserID(id);
    //     var name=await AsyncStorage.getItem("@userName");
    //     setUserName(name);
    // }

    async function getListMember(){

        var id=await AsyncStorage.getItem("@userID");
        setUserID(id);
        var name=await AsyncStorage.getItem("@userName");
        setUserName(name);

        socket.emit("detailsPeopleOnClick",room_id);

        socket.on('getDetailsPeople', (room) => {
            if(room.chatGroup === "false"){
                
                if( id === room.listMember[0].userID){
                    setRoomName(room.listMember[1].userName);
                    setRoomAvatarUrl(room.listMember[1].imageUrl);
                }else{
                    setRoomName(room.listMember[0].userName);
                    setRoomAvatarUrl(room.listMember[0].imageUrl);
                }
            }else{
                setRoomName(room.roomName);
                setRoomAvatarUrl(room.roomAvatarURL);
            }
            setChatGroup(room.chatGroup);
            setLeaderID(room.leaderID);
            setListMember(room.listMember);
        });

        socket.on('deleteRoom', (roomid) => {
            if(room_id===roomid){
                // if(isFocused)
                    // navigation.goBack();
                // navigation.navigate("Chat");
                // navigation.reset({
                //     index: 0,
                //     routes: [
                //       {
                //         name: 'Home',
                //       },
                //     ],
                //   });
            }
            
        });

        socket.on('reloadRoom',()=>{
            setRerender(!reRender);
        });
        socket.on('reloadRoomAddMember', (room) => {
            // alert("Add memeber success");
            setRerender(!reRender);
            // setListMember(room.listMember);
        });
    }

    const showRemoveMemberConfirmDialog = ({item})=>{
        Alert.alert(
            `Delete ${item.userName}?`,
            `Are you sure to delete ${item.userName}?`,
            [
                {
                    text:"Cancel",
                    style: "cancel"
                },
                {
                text:"Yes",
                onPress:()=> {
                    socket.emit('deleteMember', room_id, item.userID,item.userName);
                    // setRerender(!reRender);
                    },
                },
            ]
            );
    }

    const showExitRoomConfirmDialog = ()=>{
        Alert.alert(
            `Leave the group?`,
            `Are you sure to leave the group?`,
            [
                {
                    text:"Cancel",
                    style: "cancel"
                },
                {
                text:"Yes",
                onPress:()=> {
                    socket.emit('deleteMember', room_id, userID,userName);
                    },
                },
            ]
            );
    }

    function MemberCard({item}){
        return (
            <View style={style.card}>
                <View style={style.infoContainer}>
                    <View style={style.leftContainer}>
                            <Image source={{uri:item.imageUrl}} style={style.memberAvatarURL}></Image>
                            <Text style={style.memberName}>{item.userName}{(item.userID==leaderID)?"(AD)":null}</Text>
                    </View>
                    {
                        
                        (chatGroup=="true" && item.userID != userID && userID==leaderID) ? (
                            <TouchableOpacity onPress={() => showRemoveMemberConfirmDialog({item})} >
                                <Ionicons style={{color:'grey'}} name="md-person-remove-sharp" size={25}></Ionicons>
                            </TouchableOpacity>
                        ): null
                    }
                </View>
            </View>
        )
    }

    return (
        <View style={style.container}>
            <View style={style.topContainer}>
                <Image source={{uri:room_avatarurl}} style={style.roomAvatar}></Image>
                <Text style={style.roomName}>{room_name}</Text>
            </View>
            {
                (chatGroup=="true") ? (
                    <View style={style.centerContainer} >
                        <TouchableOpacity style={style.btnContainer} onPress={()=>{
                            navigation.navigate("AddMember",{
                                roomInfo:{ 
                                    id: room_id,
                                },
                                socket 
                            })
                        }}>
                            <Ionicons style={style.icon} name="person-add" size={25}></Ionicons>
                            <Text style={style.btn}>Add member</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btnContainer} onPress={() => showExitRoomConfirmDialog()}>
                            <MaterialIcons style={style.icon} name="exit-to-app" size={25}></MaterialIcons>
                            <Text style={style.btn}>Leave</Text>
                        </TouchableOpacity>
                    </View>
                ):null
            }  
            <FlatList
                data={listMember}
                keyExtractor={(item)=> item.userID}
                renderItem={MemberCard}
                style={style.listMember}
            ></FlatList>
        </View>
    )
}
const dimensions = Dimensions.get('window');
// const imageHeight = Math.round(dimensions.width * 9 / 16)*2/10;
const screenWidth = dimensions.width;
const imageWidth=screenWidth*2.5/10;
const style=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'lightgray',
    },
    topContainer:{
        paddingTop:30,
        paddingBottom:15,
        marginBottom:5,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        elevation:1,
    },
    roomAvatar:{
        width:imageWidth,
        height:imageWidth,
        borderRadius:imageWidth/2,
    },
    roomName:{
        color:'black',
        fontSize:20,
        fontWeight:'bold',
        padding:5,
    },
    centerContainer:{
        backgroundColor:'white',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        marginBottom:5,
        elevation:1,
    },
    btnContainer:{
        flexDirection:'row',
        alignItems:'center',
    },
    btn:{
        flex:1,
        color:'black',
        fontSize:18,
        paddingVertical:20,
        borderBottomColor:'lightgray',
        borderBottomWidth:1,
    },
    icon:{
        color:'gray',
        padding:15,
    },
    listMember:{
        flex:1,
        backgroundColor:'white',
        elevation:1,
    },
    card:{
        flex:1,
        padding:10,
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
    memberAvatarURL:{
        width: 50,
        height:50,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        padding:1,
    },
    memberName:{
        fontSize:18,
        color:"black"
    },
});
