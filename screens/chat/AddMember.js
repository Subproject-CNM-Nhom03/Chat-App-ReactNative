import React, { useEffect,useState,useRef } from "react";
import {Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Checkbox } from 'react-native-paper';
import { useIsFocused } from "@react-navigation/core";

export default function AddMember({navigation,route}){
    const socket=route.params.socket;
    const room_id =route.params.roomInfo.id;

    const [userID,setUserID]=useState();
    const [listUserHolder,setListUserHolder]=useState([]);
    const [isValid,setIsValid]=useState(false);
    const [reRender,setRerender]=useState(false);
    const isFocused = useIsFocused();
    
    useEffect(()=>{
        initListUserHolder();
        return () => {
            setListUserHolder([]);
          };
    },[reRender])

    async function initListUserHolder(){
        var id=await AsyncStorage.getItem("@userID");
        setUserID(id);
        socket.emit('addPeopleOnClick', room_id, id);

        socket.on('loadMember', (room, listFriend) => {
            const newData = listFriend.filter((item) => {
                var flag=true;
                room.listMember.forEach(element => {
                    if(item.userId+"" === element.userID+""){
                        flag=false;
                    } 
                });
                return flag;
            });

            newData.forEach(element => {
                element.checked=false;
            });

            setListUserHolder(newData);
        });

        socket.on('reloadRoomAddMember', (room) => {
            // alert("Add memeber success");
            // setRerender(!reRender);
            navigation.goBack();
        });

        // socket.on('deleteRoom', (roomid) => {
        //     if(room_id===roomid){
        //         if(isFocused)
                    // navigation.goBack();
                // navigation.navigate("Home");
                // navigation.reset({
                //     index: 0,
                //     routes: [
                //       {
                //         name: 'Home',
                //       },
                //     ],
                //   });
            // }
            
        // });
    }

    function checkBoxHandle(item){
        const newArr=listUserHolder;
        newArr.forEach(element => {
            if(element.userId === item.userId){
                element.checked=!item.checked;
            }
        });
        setListUserHolder(newArr.slice(0));
        checkIsValid(newArr.slice(0));
    }

    function checkIsValid(list){
        var count=0;
            list.forEach(element => {
                if(element.checked)count++;
            });
            if(count>0) setIsValid(true);
            else setIsValid(false);
    }

    function MemberCard({item}){
        return (
            <View style={style.memberCard}>
                <TouchableOpacity onPress={() => {checkBoxHandle(item);}}>
                    <View style={style.infoContainer}>
                        <View style={style.leftContainer}>
                                <Image source={{uri:item.avatar}} style={style.memberAvatarURL}></Image>
                                <Text style={style.memberName}>{item.userName}</Text>
                        </View>
                        <Checkbox
                            status={item.checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                checkBoxHandle(item);
                            }}
                        />
                    </View>
                </TouchableOpacity>
                
            </View>
        )
    }

    function sendAddMemberRequest(list){
        const listMember=[];
        var listName='';
        list.forEach(element => {
            if(element.checked===true){
                listMember.push(element.userId+"");
                // listName.push(element.userName+"");
                listName=listName+element.userName+","
            }
            
        });

        socket.emit("addMember", listMember, room_id);


        let msg = {
            messageContent: "",
            sender_id: "",
            userName: "",
            avatarURL: "",
            room_id: "",
            imageURL: "",
            dateSend: "",
            file: ""
        };
        // alert(listName);
        msg.messageContent = "<b>" + listName.substring(0,listName.length-1) + "</b>" + "  joined the group ";
        msg.sender_id = "";
        msg.room_id = room_id;
    
        socket.emit('updateRoom', msg.room_id);
        socket.emit('chatMessage', msg);
    }


    return(
        <View style={style.container}>
            {
                (listUserHolder.length===0) ? (
                    <View style={style.messageContainer}>
                            <Text style={style.message}>No friend outside the group</Text>
                    </View>
                    
                ):null
            }
            <FlatList
            data={listUserHolder}
            keyExtractor={(item)=>item.userId}
            renderItem={MemberCard}
            ></FlatList>
            <Button style={{...style.createGroupBtn,backgroundColor:!isValid?'lightblue':'blue',}}
                color="white"
                disabled={!isValid ? true : false}
                onPress={()=>{
                   sendAddMemberRequest(listUserHolder);
                }}
            >Add</Button>
        </View>
    )
}

const style=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between',
    }, 
    messageContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    message:{
        color:"grey",
        fontSize:20,
    },
    memberCard:{
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:5,
        backgroundColor:'white',
        borderRadius:20,
        elevation:1
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
    createGroupBtn:{
        paddingVertical:5,
        
    },
})