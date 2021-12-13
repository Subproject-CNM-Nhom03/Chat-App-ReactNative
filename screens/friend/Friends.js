import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput,FlatList, Dimensions,PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import io from "socket.io-client";

import {REACT_APP_NODE_SERVER_URL} from "@env"
import FriendCard from '../../component/friend_actions/FriendCard';
import BlockCard from '../../component/friend_actions/BlockCard';
import RequestCard from '../../component/friend_actions/RequestCard';
import NewFriend from '../../component/friend_actions/NewFriend';
import CancelRequest from '../../component/friend_actions/CancelRequest';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Friends({navigation}) {
    const [HideViewInfo,setHideViewInfo] = useState(true);
    const [socket,setSocket]=useState(); //(test send socket to next screen)
    const [friends,setfriends] = useState([]);
    const [userID,setuserID] = useState([]);
    const [actions,setactions] = useState("Actions");
    const [search,setsearch] = useState("");
    const [typeFriend,settypeFriend] = useState("1");


    useEffect(() =>{
        initSocket();
    },[]);

    async function initSocket() { 
        try {
        const userID= await AsyncStorage.getItem("@userID");
        setuserID(userID);
        const token= await AsyncStorage.getItem("@access_token");
            if(userID !== null && token != null) {
                //Khởi tạo socket có tên tạm là s
                
                const s = io(`${REACT_APP_NODE_SERVER_URL}`, {
                withCredentials: false,
                extraHeaders: {
                cookie: 'access_token='+token
                }
                });
                
                setSocket(s); //(test send socket to next screen)
                //Gửi yêu cầu joinChat lên server => server trả về danh sách các room chat
                s.emit('getListFriend', userID);//
                //Khánh dời socket.on vào func initSocket
                s.on('getListFriend', (listF) => {//
                    settypeFriend("1");
                    setfriends(listF);
                    
                });
                s.on('getListInvitation', (listI) => {//
                    settypeFriend("2");
                    setfriends(listI);
                    
                });
                s.on('getListBlock', (listB) => {//
                    settypeFriend("3");
                    setfriends(listB);
                    
                });
                s.on('findFriend', (listFind, listF, listB, listI,listR) => {
                    if(listFind.length==0){
                        alert("Not Found");
                    }else if(listFind.length==1){
                       listFind.forEach((c) => {
                        settypeFriend("5");
                        listF.forEach((f) => {
                            if(f.userID==c.userID){
                                settypeFriend("1");
                            }
                        });
                        listI.forEach((f) => {
                            if(f.userID==c.userID){
                                settypeFriend("2");
                            }
                        });
                        listB.forEach((f) => {
                            if(f.userID==c.userID){
                                settypeFriend("3");
                            }
                        });
                        listR.forEach((f) => {
                            if(f.userID==c.userID){
                                settypeFriend("4");
                            }
                        });
                           
                       });
                    }else {
                        settypeFriend("1");
                    }
                    setfriends(listFind);
                    
                });
                s.on('getContacts', (list) => {//
                    settypeFriend("5");
                    setfriends(list);
                    
                });
            }
        } catch(e) {
            console.log(e.message);
        }
    }

    function getListFriend(){

        socket.emit('getListFriend', userID);
        setactions("Friends List ");
        setHideViewInfo(!HideViewInfo);
        
    }
    function getListInvitation(){
        socket.emit('getListInvitation', userID);
        setactions("List of friend requests");
        setHideViewInfo(!HideViewInfo);
        
    }
    function getListBlock(){
        socket.emit('getListBlock', userID);
        setactions("Blocklist");
        setHideViewInfo(!HideViewInfo);
       
    } 
    function timkiem(){
        socket.emit('findFriend', userID, search);
    }
    function getcontacts(){
        getAllContacts();
        setactions("Friends in contacts");
        setHideViewInfo(!HideViewInfo);
    }

    async function getAllContacts() {
        try{
            const permission= await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                  'title': 'Contacts',
                  'message': 'This app would like to view your contacts.',
                  'buttonPositive': 'Please accept bare mortal'
                }
            );
            
            if(permission === 'granted'){
                const contacts = await Contacts.getAll();
                socket.emit("getContacts",contacts,userID);
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <View>
           

           <View style={styles.header}>
                <TextInput 
                    onChangeText={(text) => {setsearch(text)}} 
                    placeholder={'Enter Name or PhoneNumber'} 
                    placeholderTextColor={'lightgray'}
                    style={styles.input}>
                    </TextInput>
                <TouchableOpacity onPress={timkiem}>
                    <Ionicons name="search" size={30} style={styles.backbtn}></Ionicons> 
                </TouchableOpacity>
            </View>
            {/* <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                <View style={styles.inputContainer}>
                    <TextInput 
                    style={styles.input}
                    placeholder="Enter Name or PhoneNumber"
                    onChangeText={(text) => {setsearch(text)}}
                    
                    ></TextInput>
                    
                    <TouchableOpacity onPress={timkiem}style={styles.search} >
                        <Text style={styles.text}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
            
            
            <TouchableOpacity style={styles.button} onPress={()=>{setHideViewInfo(!HideViewInfo)}}>
                <View style={styles.leftContainer}>
                    <Text style={styles.text}>{actions}</Text>
                    <Text style={{paddingEnd:20,fontSize:20,color:"black"}}>▼</Text>
                </View>
            </TouchableOpacity>
            
            {
            !HideViewInfo ? (
                <View>
                <TouchableOpacity style={styles.button} onPress={getListFriend} >
                    <Text style={styles.text}>Friends List </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={getListInvitation} >
                    <Text style={styles.text}>List of friend requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={getListBlock} >
                    <Text style={styles.text}>Blocklist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={getcontacts} >
                    <Text style={styles.text}>Friends in contacts</Text>
                </TouchableOpacity>
                </View>
                ):null
            }
            <FlatList 
                style={styles.flatList}
                data={friends}
                keyExtractor={(item) => item.userID}
                renderItem={({item}) => {
                    if(typeFriend === "1"){ 
                        return( 
                            <FriendCard friendInfo={item} socket={socket} myID={userID}></FriendCard>
                        );
                    }
                    else if(typeFriend === "2"){
                        return( 
                            <RequestCard friendInfo={item} socket={socket} myID={userID}></RequestCard>
                            );
                    }
                    else if(typeFriend === "3"){
                        return( 
                            <BlockCard friendInfo={item} socket={socket} myID={userID}></BlockCard>
                            );
                    }else if(typeFriend === "4"){
                        return( 
                            <CancelRequest friendInfo={item} socket={socket} myID={userID}></CancelRequest>
                            );
                    }else if(typeFriend === "5"){
                        return( 
                            <NewFriend friendInfo={item} socket={socket} myID={userID}></NewFriend>
                            );
                    }
                }
                }
            />

        </View>
    );

}
const dimensions = Dimensions.get('window');
const Height = Math.round(dimensions.width * 9 / 16);
const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'white',
        padding:10,
        marginBottom:10,
        elevation:1,
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
        fontSize:18,
        borderRadius:15
    },
    text:{
        fontSize:20,color:"black"
    },

    flatList: {
        marginBottom:120,
        flexGrow: 0
      },
    search:{
        flexDirection:"row",
        alignItems:"center",
        fontSize:20,
        color:"black",
        borderWidth: 1,
        paddingStart:15,
        padding:5,
        height:50,
        width:"25%",
        borderBottomRightRadius: 7,
        borderTopRightRadius: 7,
        backgroundColor:"white",
    },
    // input: {
    //     borderBottomLeftRadius: 7,

    //     borderTopLeftRadius: 7,
    //     color:"black",
    //     height: 50,
    //     fontSize:18,
    //     borderWidth: 1,
    //     paddingStart:15,
    //     width:"75%"
    //     },
    leftContainer:{
        
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
    },
    inputContainer:{
       
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
    },
    button: {
        paddingTop:12,
        paddingLeft:20,
        marginTop:4,
        // marginLeft:15,
        // marginRight:15,
        color:"black",
        backgroundColor:"white",
        elevation:1,
        height: 50,
        fontSize:30,
        // borderRadius:10
    }
});