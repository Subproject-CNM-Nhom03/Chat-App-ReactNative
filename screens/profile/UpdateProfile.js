import React, { useEffect,useState } from 'react';
import { Alert, Text, View, StyleSheet, TouchableOpacity,TextInput} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {REACT_APP_SPRING_SERVER_URL} from "@env"

export default function UpdateProfile({navigation,route}) {
    const [userID,setuserID] = useState(route.params.userID);
    const [phoneNumber, setphoneNumber] = useState(route.params.phoneNumber);
    const [email, setemail] = useState(route.params.email);
    const [name, setname] = useState(route.params.userName);
    const [no, setno] = useState(route.params.no);
    const [ward, setWard] = useState(route.params.ward);
    const [district, setDistrict] = useState(route.params.district);
    const [addressId, setaddressId] = useState(route.params.addressId);
    const [provinece, setProvinece] = useState(route.params.provinece);
    const [country, setCountry] = useState(route.params.country);
    const [error, seterror] = useState();
    const [checked, setChecked] = useState();
    const [token,settoken] = useState(route.params.token);
    useEffect(() =>{
        if(route.params.gender=="Male"){
            setChecked(true);
        }else setChecked(false);
    },[]);

   function update(){
    Alert.alert(
        `Do you want to update ?`,
        `Note: You need to refresh to see the updated information`,
        [
            {
                text:"Cancel",
                style: "cancel"
            },
            {
            text:"Update",
            onPress:()=> {
                const user = {
                    userId: userID,
                    userName: name,
                    email: email,
                    gender: checked,
                    phoneNumber: phoneNumber
                }
            
                const address = {
                    addressId: addressId,
                    numberaddress: no,
                    ward: ward,
                    district: district,
                    provinece: provinece,
                    country: country,
                    user: user
                }
                const urls = new URL(`${REACT_APP_SPRING_SERVER_URL}api/users`);
                fetch(urls, {
                    method: 'PUT',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                }).then(data => {
                    //cập nhật address cũ
                    const url1 = new URL(`${REACT_APP_SPRING_SERVER_URL}api/addresses`);
                    fetch(url1, {
                        method: 'PUT',
                        body: JSON.stringify(address),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(data => {
                        navigation.goBack();
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            
            
                },
            },
        ]
    );



   }
   

    return (
        <View style={styles.container}>
            <Text style={{fontSize:18,color:"red" ,textAlign:'center'}}>{error}</Text>
           
            <Text style={styles.text}>User Name:</Text>
            <TextInput 
                style={styles.input}
                value={name}
                placeholder="Enter your Name"
                onChangeText={(text) => {setname(text)}}
            />
        
            <Text style={styles.text}>Email:</Text>
            <TextInput 
                style={styles.input}
                value={email}
                placeholder="Enter your Email"
                onChangeText={(text) => {setemail(text)}}
            />
            <Text style={styles.text}>Address:</Text>
            <View>
                <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input2}
                    placeholder="Enter No"
                    value={no}
                    onChangeText={(text) => {setno(text)}}
                    ></TextInput>
                     <TextInput 
                    style={styles.input2}
                    placeholder="Enter Ward"
                    value={ward}
                    onChangeText={(text) => {setWard(text)}}
                    ></TextInput>
                    
                </View>
            </View>
            <View >
                <View style={styles.inputContainer}>
                    <TextInput 
                    style={styles.input2}
                    placeholder="Enter District"
                    value={district}
                    onChangeText={(text) => {setDistrict(text)}}
                    ></TextInput>
                     <TextInput 
                    style={styles.input2}
                    placeholder="Enter Provinece"
                    value={provinece}
                    onChangeText={(text) => {setProvinece(text)}}
                    ></TextInput>

                </View>
            </View>
            <Text style={styles.text}>Country:</Text>
            <TextInput 
                style={styles.input}
                value={country}
                placeholder="Enter your Country"
                onChangeText={(text) => {setCountry(text)}}
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

            
            <TouchableOpacity style={styles.button} onPress={update} >
                <Text style={{fontSize:24,color:"white"}}>Update</Text>
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
        height: 50,
        fontSize:18,
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        borderRadius:10,
        paddingStart:15,
    },
    
    input2: {
        
        color:"black",
        height: 50,
        fontSize:18,
        borderWidth: 1,
        width:"48%",
        borderRadius:10,
        paddingStart:15,
        },
    inputContainer:{
        marginTop:5,
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
        marginLeft: 20,
        marginRight: 20,
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
  

