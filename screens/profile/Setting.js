import React, { useEffect,useState,useRef } from "react";
import {Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_NODE_SERVER_URL} from "@env"
import {REACT_APP_SPRING_SERVER_URL} from "@env"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useIsFocused } from '@react-navigation/core';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Setting({navigation}){
    // const countries = ["Profile ▼","Refresh  ▼", "Update Info  ▼",  "Change Avatar  ▼","Change Password  ▼","Logout  ▼","Verify Login QR Code  ▼"]
    const [userID,setuserID] = useState();
    const [token,settoken] = useState();
    const [acctionIndex,setacctionIndex] = useState(0);
    const [userName,setuserName] = useState("User Name");
    const [avatar,setavatar] = useState();
    const [email,setemail] = useState("email@gmail.com");
    const [gender,setgender] = useState("Female");
    const [phoneNumber,setphoneNumber] = useState("phonenumber");
    const [addressId, setaddressId] = useState('0');
    const [no, setno] = useState('');
    const [ward, setWard] = useState('');
    const [district, setDistrict] = useState('');
    const [provinece, setProvinece] = useState('');
    const [country, setCountry] = useState('');
    const [address, setaddress] = useState('No. , a  Ward, Thanh  District,  Provinece, Country');
    


    useEffect(() => {
        getInfoUser();
    }, [])

    function changeAvatar(){
        handleChoosePhoto().then(()=>{
            getInfoUser();
        });
    }

    async function handleChoosePhoto(){
        launchImageLibrary({selectionLimit: 1,mediaType:'photo',quality:1},(response)=>{
          if (response.didCancel) {
      
          } else if (response.errorCode == 'permission') {
            setToastMsg('Ứng dụng chưa được cấp quyền!');
          } else if (response.errorCode == 'others') {
      
          } else if(response.assets.length>0  && response.assets[0].fileSize!=0){
            // setPhoto(response);
            uploadImage(response.assets[0]);
          }
          
        });
      }
    async function uploadImage(photo){
    const data=new FormData();
    data.append("fileId", {
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
    data.append("userID",userID);
    data.append("token",token);
    
    fetch(`${REACT_APP_NODE_SERVER_URL}changeAvatar`,{
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: data
    }).then(res =>
        res.json()).then(d => {
        let msg = {
            messageContent: "",
            sender_id: "",
            userName: "",
            avatarURL: "",
            room_id: "",
            imageURL: ""
        };
    
        msg.sender_id = userID;
        msg.userName = userName;
        msg.avatarURL = avatarURL;
        msg.room_id = room_id;
        msg.dateSend = "";
        msg.imageURL = d.x;
        socket.emit('updateRoom', msg.room_id);
        socket.emit('chatMessage', msg);
    
    })
    }

    async function getInfoUser(){
        
        try {
            let value =await AsyncStorage.getItem('@access_token');
            let userID= await AsyncStorage.getItem("@userID");
            if(value != null&&userID!=null) {
                settoken(value);
                fetch(`${REACT_APP_SPRING_SERVER_URL}api/user/` + Number.parseInt(userID), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': value
                    },
                    contentType: "application/json; charset=utf-8",
                    
                }).then(res => res.json())
                .then(json =>{
                    if(json.error){
                    }
                    else {
                        setuserID(userID);
                        setuserName(json.userName);
                        setavatar(json.avatar);
                        setemail(json.email);
                        if(json.gender==true){
                            setgender("Male");
                        }else {
                            setgender("Female");
                        }
                        setphoneNumber(json.phoneNumber);
                        
                    }
                })
                .catch(err => console.log(err));
                const url = new URL(`${REACT_APP_SPRING_SERVER_URL}api/users/address/` + Number.parseInt(userID));
                fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': value
                        }
                    }).then(data => data.json())
                    .then((json) => {
                        if (json.error)
                            console.log(json.error);
                        else {
                            json.forEach(element => {

                                setaddressId(element.addressId);
                                setno(element.numberaddress);
                                setWard(element.ward);
                                setDistrict(element.district);
                                setProvinece(element.provinece);
                                setCountry(element.country);
                                setaddress("No."+element.numberaddress+"  , "+element.ward+" Ward, "+element.district+"  District, "+element.provinece+"  Provinece , "+element.country+"  Country")
                            });

                            
                        }
                }).catch(function(error) {
                });
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
       
        clearStorage().then(()=>{
             navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
              },
            ],});
        })
        // .then(()=>navigation.replace("Login"));
    }

    return (
             <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("UpdateProfile",{
                               userID,userName,phoneNumber,email,gender,addressId,no,ward,district,provinece,country,token
                           });}} >
                    <Text style={styles.text}>Update Info  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={changeAvatar} >
                    <Text style={styles.text}>Change Avatar  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("ResetPassword");}} >
                    <Text style={styles.text}>Change Password  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("Scan");}} >
                    <Text style={styles.text}>Verify Login QR Code  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={logout} >
                    <Text style={styles.text}>Logout  </Text>
                </TouchableOpacity>
            </View>
    )
}
const styles=StyleSheet.create({
container:{
    flex:1,
    flexDirection:'column',
},
 button:{
    backgroundColor:'white',
    paddingVertical:20,
    paddingHorizontal:20,
    borderBottomColor:'lightgray',
    borderBottomWidth:1,
 },
 text:{
    color:'black',
    fontSize:18,
 }
});
