import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect,useState } from 'react';
import { View,Text, StyleSheet,Image, TouchableOpacity,TextInput,FlatList,LogBox, ToastAndroid } from 'react-native';
import io from "socket.io-client";
import {REACT_APP_NODE_SERVER_URL,AWS_ANHDAIDIEN_NHOM} from "@env"
import { Button, Checkbox } from 'react-native-paper';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { launchImageLibrary } from 'react-native-image-picker';


export default function CreateGroup({navigation,route}){

    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.']);

    const s=route.params.s;;
    const [userID,setUserID]=useState();
    const [listFriend,setListFriend]=useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [isValid,setIsValid]=useState(false);
    //Lưu đường dẫn tạm thời để hiển thị lên giao diện
    const [url,setUrl]=useState(AWS_ANHDAIDIEN_NHOM);
    //Lưu đối tượng hình ảnh được người dùng chọn
    const [img,setImg]=useState();
    
    useEffect(()=>{
        initSocket();
      return () => {
            setListFriend([]);
            s.off();
        };
    },[])

    async function initSocket() { 
        try {
                const userID= await AsyncStorage.getItem("@userID");
                setUserID(userID);

                //Gửi yêu cầu lấy danh sách ban bè
                s.emit('listFriend', {userID});
                //Nhận danh sách bạn bè 
                s.on('getListFriendLam', (listFriend) => {
                    setListFriend(listFriend);
                    listFriend.forEach(element => {
                        element.checked=false;
                    });
                });

                s.on('tbNewRoom', (tb) => {
                    navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Home',
                          },
                        ],
                      });
                });
        } catch(e) {
            console.log(e.message);
        }
    
    }

    function checkBoxHandle(item){
        const newArr=listFriend;
        newArr.forEach(element => {
            if(element.userId === item.userId){
                element.checked=!item.checked;
            }
        });
        setListFriend(newArr.slice(0));
        checkIsValid(newRoomName,newArr.slice(0));
    }

    function FriendCard({item}){
        return (
            <View style={style.friendCard}>
                <TouchableOpacity onPress={() => {checkBoxHandle(item);}}>
                    <View style={style.infoContainer}>
                        <View style={style.leftContainer}>
                                <Image source={{uri:item.avatar}} style={style.friendAvatarURL}></Image>
                                <Text style={style.friendName}>{item.userName}</Text>
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

    async function handleChoosePhoto() {
        launchImageLibrary({
            selectionLimit: 1,
            mediaType: 'photo',
            quality: 1
        }, (response) => {
            if (response.didCancel) {

            } else if (response.errorCode == 'permission') {
                setToastMsg('Ứng dụng chưa được cấp quyền!');
            } else if (response.errorCode == 'others') {

            } else if (response.assets.length > 0 && response.assets[0].fileSize != 0) {
                setUrl(response.assets[0].uri);
                setImg(response.assets[0]);
            }
        });
    }

    function sendCreateGroupRequest(data){
        const checkedValue=[userID];
        data.forEach(element => {
            if(element.checked===true)
                checkedValue.push(element.userId+"");
        });
        if(url==AWS_ANHDAIDIEN_NHOM){
            //Yêu cầu tạo nhóm mới
            s.emit("roomproperties", newRoomName, url, checkedValue);
        }else{
            
            const frmdata = new FormData();
            frmdata.append("fileId", {
                name: img.fileName,
                type: img.type,
                uri: Platform.OS === 'ios' ? img.uri.replace('file://', '') : img.uri,
            });
            fetch(`${REACT_APP_NODE_SERVER_URL}uploadImgNhi/uploadImg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data;charset=utf-8',
                },
                body: frmdata
            }).then(res => res.json()).then(d => {
                s.emit("roomproperties", newRoomName, d.x, checkedValue);
            }).catch((err) => {
                console.log(err.message);
                alert("Network Error!");
            });
        }
        
    }

    function handleTextChange(text){
        checkIsValid(text,listFriend);
        setNewRoomName(text);
    }

    function checkIsValid(text,list){
        if(text!= "") {
            var count=0;
            list.forEach(element => {
                if(element.checked)count++;
            });
            if(count>0) setIsValid(true);
            else setIsValid(false);
        }
        else setIsValid(false);
    }
    
    return (
        <View style={style.container}>
            <Image source={{uri:url}} style={style.roomAvatarURL}></Image>
            <View style={style.inputContainer}>
                <TouchableOpacity onPress={handleChoosePhoto}>
                            <FontAwesome5 style={{color:'black',padding:5}} name="camera" size={25}></FontAwesome5>
                </TouchableOpacity>
                <TextInput value={newRoomName} 
                    onChangeText={text => handleTextChange(text)}
                    placeholder="Group's name" placeholderTextColor="lightgray" style={style.input}></TextInput>
                <TouchableOpacity disabled={!isValid ? true : false} onPress={()=>{
                   sendCreateGroupRequest(listFriend);
                }}>
                    <FontAwesome5 style={{color:!isValid?'lightblue':'blue',padding:5}} name="check" size={25}></FontAwesome5>
                </TouchableOpacity>
            </View>
            <FlatList
            data={listFriend}
            keyExtractor={(item) => item.userId}
            renderItem={FriendCard}
            />
            <Button style={{...style.createGroupBtn, backgroundColor: !isValid?'lightblue':'blue', }}
                color="white"
                disabled={!isValid ? true : false}
                onPress={()=>{
                   sendCreateGroupRequest(listFriend);
                }}
            >Create</Button>
        </View>
    )
}

const style=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    inputContainer:{
        flexDirection:'row',
        paddingHorizontal:20,
        paddingVertical:10,
        marginVertical:10,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'white',
        elevation:1,
    },
    input:{
        flex:1,
        color:'black',
        fontSize:16,
        borderRadius:10,
    },
    friendCard:{
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
    friendAvatarURL:{
        width: 50,
        height:50,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        padding:1,
    },
    friendName:{
        fontSize:18,
        color:"black"
    },
    createGroupBtn:{
        paddingVertical:5,
        
    },
    roomAvatarURL:{
        width: 90,
        height:90,
        borderRadius:45,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        padding:5,
        alignSelf:'center',
        borderColor:'white',
        borderWidth:1
    },
})