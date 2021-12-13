import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {REACT_APP_SPRING_SERVER_URL} from "@env"

export default function ResetPassword({navigation}) {
    const [phoneNumber, setphoneNumber] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState('Welcome to the official Chat web-client.');

    useEffect(() =>{
       
    },[]);

   
    function Reset(){
        if(phoneNumber!=""&&password!=""&&phoneNumber.length==10&&password.length>=6&&!password.includes(" ")){
            //check user
            const user ={
                "password":password,
                "phoneNumber":phoneNumber,
            }
            fetch(`${REACT_APP_SPRING_SERVER_URL}api/userphone/`+phoneNumber, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                contentType: "application/json; charset=utf-8"
            }).then(data => data.json())
            .then(json => {
                if (json.error) {
                    seterror(json.message);
                } else {
                    const typeVerify="Verify Reset Password";
                    navigation.navigate("Verify",{
                        user,
                        typeVerify
                    });
                }
            })
            .catch(err => console.log(err));
        }
        else {
            seterror("Password must be at least 6 characters, no spaces.");
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.login}>Reset Password</Text>
            <Text style={{fontSize:18,color:"black" ,textAlign:'center'}}>{error}</Text>
           
            <Text style={styles.text}>Phone Number:</Text>
            <TextInput 
                style={styles.input}
                value={phoneNumber}
                placeholder="Enter your number phone"
                placeholderTextColor='gray'
                onChangeText={(text) => {setphoneNumber(text)}}
            />
            
            <Text style={styles.text}>New Password:</Text>
            <TextInput 
                style={styles.input}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor='gray'
                onChangeText={(text) => {setpassword(text)}}
                secureTextEntry={true}
            />
            <Text style={styles.text}></Text>
            
            <TouchableOpacity style={styles.button} onPress={Reset} >
                <Text style={{fontSize:24,color:"white"}}>Reset</Text>
            </TouchableOpacity>
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
    gender:{
        flexDirection:'row',
        marginTop:10,
        paddingLeft:20,
       
    },
    input: {
        marginTop:5,
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
        margin: 20,
        marginTop: 10,
        borderRadius:10,
      },
  });
  

