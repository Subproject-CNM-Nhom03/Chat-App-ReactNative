import React, {useEffect, useState} from 'react';
import {Picker ,Text, View, StyleSheet, TouchableOpacity,Image,TextInput,FlatList, Dimensions,PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_NODE_SERVER_URL} from "@env"
import {REACT_APP_SPRING_SERVER_URL} from "@env"
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
//
import { launchImageLibrary } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/core';

export default function Profile({navigation}) {
    const [userID,setuserID] = useState();
    const [token,settoken] = useState();
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
    
    const isFocused = useIsFocused();
    useEffect(() =>{
        getInfoUser();

        navigation.setOptions({ 
            headerStyle:{backgroundColor:'white'},
            title:null,
            headerRight: () => (
                <View>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="dots-vertical" size={30} color="black" style={{paddingRight:15}}
                        onPress={() =>{
                            navigation.navigate("Setting");
                        }}>
                        </MaterialCommunityIcons>
                    </TouchableOpacity>
                </View>
            ),
         });

    },[isFocused]);
        

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


    return (
        <View style={style.container}>
            
            <View style={style.container1}>
                
                 <View style={style.info}>
                    <Image source={{uri:avatar}} style={style.AvatarURL}></Image>
                    <TextInput 
                    editable={false}
                    style={style.input}
                    value={userName}
                    onChangeText={(text) => {setuserName(text)}}
                     /> 
                </View>
               
                
            </View>
            <View style={style.info1}>
                <Text style={style.text}>Address:</Text>
                <TextInput 
                    style={style.input1}
                    editable={false}
                    multiline = {true}
                    value={address}
                    onChangeText={(text) => {setphoneNumber(text)}}
                />
                <Text style={style.text}>Phone:</Text>
                <TextInput 
                    style={style.input1}
                    value={phoneNumber}
                    editable={false}
                    onChangeText={(text) => {setphoneNumber(text)}}
                />
                <Text style={style.text}>Email:</Text>
                <TextInput 
                    style={style.input1}
                    value={email}
                    editable={false}
                    onChangeText={(text) => {setemail(text)}}
                />
                <Text style={style.text}>Gender:</Text>
                <TextInput 
                    style={style.input1}
                    value={gender}
                    editable={false}
                    onChangeText={(text) => {setgender(text)}}
                />
                <Text style={style.text}></Text>
                
            </View>
        </View>
    )
    }
    const style=StyleSheet.create({
        container: {
            alignItems:"center",
            marginTop:5,
        
        },
        container1: {
            borderRadius:10,
            width:370,
            backgroundColor:"white" ,
            alignItems:"center",
            padding:5,
            elevation:1
        },
        info:{
            marginTop:15,
            alignItems:"center",
            elevation:1
        },
        infox:{
            alignSelf:"flex-end",
            marginTop:10,
            marginRight:10,
            elevation:1
        },
        info1:{
            padding:5,
            marginTop:15,
            width:370,
            borderRadius:10,
            backgroundColor:"white",
         
        },
        AvatarURL:{
            borderColor:"black",
            borderWidth: 2,
            width: 170,
            height:170,
            borderRadius:85,
            aspectRatio:1,
            marginRight:15,
            padding:1,
        },
        update:{
            width: 40,
            height:40,
           
        },
        userName:{

        },    
        input: {
            marginTop:5,
            color:"black",
            fontSize:22,
            fontWeight: "bold"
        },    
        input1: {
            
            color:"black",
            fontSize:20,
            marginLeft:10,
            
        }, 
        text:{
            marginTop:10,
            fontSize:20,
            color:"#696969" ,
            textAlign:'left',
            marginLeft:10,
            
        },
})