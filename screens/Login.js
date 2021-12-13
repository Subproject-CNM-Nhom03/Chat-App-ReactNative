import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_SPRING_SERVER_URL} from "@env";

export default function Login({navigation}) {
    const [phoneNumber, setphoneNumber] = useState();
    const [password, setpassword] = useState();
    const [error, seterror] = useState('');

    useEffect(() =>{
        checkToken();
    },[]);
    //chạy login
    async function login(){
        let user={
            phoneNumber:phoneNumber,
            password:password
          };
        fetch(`${REACT_APP_SPRING_SERVER_URL}api/login`,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            // contentType: "application/json; charset=utf-8",
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(json =>{
            if(json.error){
                seterror(json.message);
            }
            else {
                setValueToken(json.userID,json.userName,json.avatarURL,json.access_token).then(()=>{
                    seterror("")
                    setphoneNumber("");
                    setpassword("");
                    navigation.replace("Home");
                }
                );
            }
          })
        .catch((err)=>{console.log(err.message)});
    }
    //add token vào store
    async function setValueToken(id,name,avatar,token){
        try {
            await AsyncStorage.setItem('@userID', id);
            await AsyncStorage.setItem('@userName', name);
            await AsyncStorage.setItem('@avatarURL', avatar);
            await AsyncStorage.setItem('@access_token', token);
            } catch (e) {
            console.log(e.message);
        }
        
    }
    //cập nhật username và avatar 
    async function setInfoUser(name,avatar){
        try {
            await AsyncStorage.setItem('@userName', name);
            await AsyncStorage.setItem('@avatarURL', avatar);
            } catch (e) {
            console.log(e.message);
        }
        
    }
    //check token trả về nếu token đúng thì cập nhật lại info mới nhất của user và vào chat
    async function checkToken(){

        try {
            let value =await AsyncStorage.getItem('@access_token');
            if(value != null ) {
                const token={
                    "access_token":value
                  }
                fetch(`${REACT_APP_SPRING_SERVER_URL}api/userfromtoken`, {
                    method: 'POST',
                    body: JSON.stringify(token),
                    headers: { 'Content-Type': 'application/json' },
                    contentType: "application/json; charset=utf-8"
                }).then(res => res.json())
                .then(json =>{
                    if(json.error){
                    }
                    else {
                        //set lại user khi user cập nhật info
                        setInfoUser(json.userName, json.avatar);
                        navigation.replace("Home");
                      
                    }
                  })
                .catch(err => console.log(err));
            }
            
          } catch(e) {
            console.log(e.message);
        }
        
    }
    function onPress2(){
        navigation.navigate("ResetPassword");
    }
    function signUp(){
        navigation.replace("SignUp");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.login}>Sign in</Text>
            <Text style={{fontSize:18,color:"black" ,textAlign:'center', paddingBottom:20}}>Welcome to the official Chat web-client.</Text>
            
            <TextInput 
                style={styles.input}
                value={phoneNumber}
                placeholder="Enter your number phone"
                placeholderTextColor='gray'
                onChangeText={(text) => {setphoneNumber(text)}}
            />
            
            <TextInput 
                style={styles.input}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor='gray'
                onChangeText={(text) => {setpassword(text)}}
                secureTextEntry={true}
            />
            <Text style={{fontSize:18,color:"red" ,textAlign:'center', margin:15}}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={login} >
                <Text style={{fontSize:24,color:"white"}}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress2} style={{width:150,alignSelf:"center"}}>
                <Text style={{fontSize:18,color:"blue" ,textAlign:'center'}}>Reset password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signUp} style={{width:100,alignSelf:"center"}}>
                <Text style={{fontSize:18,color:"blue" ,textAlign:'center'}}>Sign up</Text>
            </TouchableOpacity>
        </View>
        
    );
    
  
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        flex:1,
    
    },
    input: {
        marginTop:15,
        color:"black",
      height: 60,
      fontSize:18,
      borderWidth: 1,
      marginLeft: 20,
      marginRight: 20,
      borderRadius:10,
      paddingStart:15,
    },
    login: {
        color:"black",
        fontWeight:"bold",
        fontSize:30,
        textAlign:"center",
        paddingTop:55,
        paddingBottom:10
      },
  
    button: {
        paddingTop:10,
        color:"black",
        alignItems: "center",
        backgroundColor: "#2314FA",
        height: 60,
        fontSize:30,
        borderWidth: 1,
        margin: 20,
        marginTop: 30,
        borderRadius:10,
      },
  });
  

