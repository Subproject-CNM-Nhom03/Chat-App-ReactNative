import React, { useEffect,useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {REACT_APP_SPRING_SERVER_URL} from "@env"

export default function SignUp({navigation}) {
    const [phoneNumber, setphoneNumber] = useState('');
    const [email, setemail] = useState('');
    const [name, setname] = useState('');
    const [password, setpassword] = useState('');
    const [error, seterror] = useState('Welcome to the official Chat web-client.');
    const [checked, setChecked] = useState(true);

    useEffect(() =>{
       
    },[]);

   
    function signup(){
        const user ={
            "userName":name,
            "avatar": "https://uploadavatar123.s3.ap-southeast-1.amazonaws.com/anhdaidien.jpg",
            "email":email,
            "password":password,
            "phoneNumber":phoneNumber,
            "gender":checked,
            "status":true,
            "disable":false,
            "firstName":"A",
            "lastName":"A",
        }


        fetch(`${REACT_APP_SPRING_SERVER_URL}api/signup/checkvaliduser`,{
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
            contentType: "application/json; charset=utf-8"
        }).then(data => data.json())
        .then(json => {
            if(json.error){
                seterror(json.message);
            }else{
            const typeVerify="Verify Account";
            navigation.navigate("Verify",{
                user,
                typeVerify
                });
            }
        })
        .catch(err => console.log(err));
   

    }
    function rtSignin(){
        navigation.replace("Login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.login}>Sign up</Text>
            <Text style={{fontSize:18,color:"red" ,textAlign:'center'}}>{error}</Text>
           
            <Text style={styles.text}>Phone Number:</Text>
            <TextInput 
                style={styles.input}
                value={phoneNumber}
                placeholder="Enter your number phone"
                onChangeText={(text) => {setphoneNumber(text)}}
            />
            <Text style={styles.text}>Email:</Text>
            <TextInput 
                style={styles.input}
                value={email}
                placeholder="Enter your Email"
                onChangeText={(text) => {setemail(text)}}
            />
            <Text style={styles.text}>Name:</Text>
            <TextInput 
                style={styles.input}
                value={name}
                placeholder="Enter your Name"
                onChangeText={(text) => {setname(text)}}
            />
            <Text style={styles.text}>Password:</Text>
            <TextInput 
                style={styles.input}
                value={password}
                placeholder="Enter your password"
                onChangeText={(text) => {setpassword(text)}}
                secureTextEntry={true}
            />
            <Text style={styles.text}>Gender:</Text>
            <View style={styles.gender}>
                <RadioButton
                    value="true"
                    status={ checked === true ? 'checked' : 'unchecked' }
                    onPress={() => setChecked(true)}
                /><Text style={styles.text}>Male       </Text>
                <RadioButton
                    value="false"
                    status={ checked === false ? 'checked' : 'unchecked' }
                    onPress={() => setChecked(false)}
                /><Text style={styles.text}>Female</Text>
            </View>

            
            <TouchableOpacity style={styles.button} onPress={signup} >
                <Text style={{fontSize:24,color:"white"}}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={rtSignin} style={{alignSelf:"center"}}>
                <Text style={{fontSize:18,color:"blue" ,textAlign:'center'}}>Return to Sign in.</Text>
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
  

