import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import {REACT_APP_SPRING_SERVER_URL} from "@env"
import { useIsFocused } from '@react-navigation/core';

export default function Verify({navigation, route}) {
    const [typeVerify, settypeVerify] = useState("Verify Account");
    const [confirm, setConfirm] = useState(null);
    const [codeOTP, setCodeOTP] = useState();
    const [phoneNumber, setphoneNumber] = useState("+84"+route.params.user.phoneNumber.substring(1,10));
    const [error, seterror] = useState('Click the button to send the otp code');
    // const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState();
    // const [count,setCount]=useState(0);
    // var count=0;
    // var authFlag = true;
    const isFocused = useIsFocused();
    
    useEffect(() =>{
        if(route.params.typeVerify=="Verify Reset Password"){
            settypeVerify("Verify Reset Password");
        }else {
            settypeVerify("Verify Account");
        }
        // if(auth().currentUser){
            auth().signOut();
            // .then(()=>{
                // unsubcribe();
            // })
        // }
        
        console.log(route.params.user);
        // console.log(authFlag);
        return () => {
            unsubcribe();
            // authFlag = true;
           };
    },[]);

    const unsubcribe = auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
            if(user.phoneNumber === phoneNumber){
                console.log("unsubcribe");
                // console.log(authFlag);
                // if(authFlag){
                    // setCount(1);
                    // count++;
                    if(route.params.typeVerify=="Verify Reset Password"){
                        fetch(`${REACT_APP_SPRING_SERVER_URL}api/resetPassword`, {
                            method: 'POST',
                            body: JSON.stringify(route.params.user),
                            headers: { 'Content-Type': 'application/json' },
                            contentType: "application/json; charset=utf-8"
                        }).then(data => {
                        }).catch(err => console.log(err));
                    }else {
                        fetch(`${REACT_APP_SPRING_SERVER_URL}api/signup/checkvaliduser`,{
                            method: 'POST',
                            body: JSON.stringify(route.params.user),
                            headers: { 'Content-Type': 'application/json' },
                            contentType: "application/json; charset=utf-8"
                        }).then(data => data.json())
                        .then(json => {
                            if(json.error){
                                // seterror(json.message);
                            }else{
                                fetch(`${REACT_APP_SPRING_SERVER_URL}api/users`,{
                                    method: 'POST',
                                    body: JSON.stringify(route.params.user),
                                    headers: { 'Content-Type': 'application/json' },
                                    contentType: "application/json; charset=utf-8"
                                }).then(data=>{
                                    seterror("Sign up success!!");
                                }).catch(err => console.log(err));
                            }
                        })
                        .catch(err => console.log(err));
                    }
                    // authFlag = false;
                    auth().signOut();
                    navigation.replace("Login");
                // }
            }
        } else {
            console.log("else");
        }
      });

    async function signIn() {
        try {
          const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
          setConfirm(confirmation);
          alert("OTP code have been sent, please check your message");
        } catch (error) {
          console.log(error);
        }
    }

    // function xacthuc1(){
    //     auth().onAuthStateChanged((user) => {
    //         console.log(user);
    //         if (user) {
    //             if(user.phoneNumber === phoneNumber){
    //                 console.log("xacthuc1");
    //                     if(route.params.typeVerify=="Verify Reset Password"){
    //                         fetch(`${REACT_APP_SPRING_SERVER_URL}api/resetPassword`, {
    //                             method: 'POST',
    //                             body: JSON.stringify(route.params.user),
    //                             headers: { 'Content-Type': 'application/json' },
    //                             contentType: "application/json; charset=utf-8"
    //                         }).then(data => {
    //                         }).catch(err => console.log(err));
        
    //                     }else {
    //                         fetch(`${REACT_APP_SPRING_SERVER_URL}api/signup/checkvaliduser`,{
    //                             method: 'POST',
    //                             body: JSON.stringify(user),
    //                             headers: { 'Content-Type': 'application/json' },
    //                             contentType: "application/json; charset=utf-8"
    //                         }).then(data => data.json())
    //                         .then(json => {
    //                             if(json.error){
    //                                 // seterror(json.message);
    //                             }else{
    //                                 fetch(`${REACT_APP_SPRING_SERVER_URL}api/users`,{
    //                                     method: 'POST',
    //                                     body: JSON.stringify(route.params.user),
    //                                     headers: { 'Content-Type': 'application/json' },
    //                                     contentType: "application/json; charset=utf-8"
    //                                 }).then(data=>{
    //                                     seterror("Sign up success!!");
    //                                 }).catch(err => console.log(err));
    //                             }
    //                         })
    //                         .catch(err => console.log(err));
    //                     }
    //                     navigation.replace("Login");
    //             }
    //         } else {
    //             console.log("else");
    //         }
    //       });
    // }

    function xacthuc(){
        if(codeOTP==""){
            seterror("Have not entered the otp code");
        }
        else {
            confirm.confirm(codeOTP).then((result) => {
                // User signed in successfully.
                const user = result.user;
                user.getIdToken().then(function(idToken) {
    
                    if(route.params.typeVerify=="Verify Reset Password"){
                    
                        fetch(`${REACT_APP_SPRING_SERVER_URL}api/resetPassword`, {
                            method: 'POST',
                            body: JSON.stringify(route.params.user),
                            headers: { 'Content-Type': 'application/json' },
                            contentType: "application/json; charset=utf-8"
                        }).then(data => {
                        }).catch(err => console.log(err));

                    }else {
                        
                        fetch(`${REACT_APP_SPRING_SERVER_URL}api/users`,{
                            method: 'POST',
                            body: JSON.stringify(route.params.user),
                            headers: { 'Content-Type': 'application/json' },
                            contentType: "application/json; charset=utf-8"
                        }).then(data=>{
                            seterror("Sign up success!!");
                        }).catch(err => console.log(err));
                            
                    }
                    navigation.replace("Login");
            
                }).catch(error => {
                    console.log("11111111111"+error);
                    
                }) ;
                
            }).catch((error) => {
                seterror("Enter wrong otp code");
            });
        }

    }

    return (
        <View >
            <Text style={styles.login}>{typeVerify}</Text>
            <Text style={{fontSize:18,color:"black" ,textAlign:'center'}}>{error}</Text>
            <TextInput 
                style={styles.input}
                value={phoneNumber}
                placeholder="Enter your password"
                
            />
            <TouchableOpacity style={styles.button} onPress={signIn} >
                <Text style={{fontSize:24,color:"white"}}>Send OTP Code</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Enter your OTP"
                onChangeText={(text) => {setCodeOTP(text)}}
            />
            <TouchableOpacity onPress={xacthuc} style={styles.button}>
                <Text style={{fontSize:24,color:"white"}}>Verify OTP Code</Text>
            </TouchableOpacity>

            <Text style={{fontSize:18,color:"gray" ,textAlign:'center'}}>Note: If you're using the phonenumber on the device itself then you don't need to enter the otp code</Text>
        </View>
        
    );
    
  
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:"white",
        flex:1,
    
    },
    text:{
        marginTop:10,
        fontSize:18,
        color:"black" ,
        textAlign:'left',
        paddingLeft:20
    },
    input: {
        marginTop:5,
        color:"black",
        height: 60,
        fontSize:18,
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        paddingStart:15,
        marginTop:25
    },
    login: {
        color:"black",
        fontWeight:"bold",
        fontSize:30,
        textAlign:"center",
        paddingTop:20,
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
        marginLeft: 20,
        marginRight: 20,

        borderBottomRightRadius:10,
        borderBottomLeftRadius:10
      },
  });