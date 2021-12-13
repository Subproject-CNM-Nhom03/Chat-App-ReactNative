import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect,useState,useRef } from 'react';
import { View, StyleSheet, TouchableOpacity,TextInput,FlatList,LogBox, ToastAndroid, Platform, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import MessageReceiveCard from '../../component/MessageReceiveCard';
import MessageSendCard from '../../component/MessageSendCard';
import SystemMessage from '../../component/SystemMessage';
import {REACT_APP_NODE_SERVER_URL} from "@env"
import { useIsFocused } from '@react-navigation/core';

// import RNFetchBlob from 'rn-fetch-blob';

export default function Chat({navigation, route }) {

  // Ẩn thông báo cảnh báo lỗi Non-serializable khi truyền socket to Rooms.js sang Chat.js
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.']);
  // LogBox.ignoreLogs(['Can\'t perform a React state update on an unmounted component.']);
  // Lấy socket từ route
  const socket=route.params.socket;

  // Khai báo userID để phân biệt người gửi người nhận
  const [userID,setUserID]=useState();
  const [userName,setUserName]=useState();
  const [avatarURL,setAvatarURL]=useState();
  const room_id =route.params.roomInfo.id;
  // Khai báo room_name để đổi header title
  const room_name=route.params.roomInfo.roomName;
  // const room_avatarurl=route.params.roomInfo.roomAvatarURL;
  // const leaderID=route.params.roomInfo.leaderID;
  // const chatGroup=route.params.roomInfo.chatGroup;

  // msgs danh sách message
  // const [msgs,setMsgs] = useState([]);
  // msgsHolder để giữ các message và truyền vào flatlist
  const [msgsHolder,setMsgsHolder]=useState([]);
  // Temp để lưu danh sách tin nhắn lần đầu truy cập
  var temp=[];

  // input là tin nhắn từ textinput
  const [input,setInput]=useState("");
  
  // Dùng cho auto scroll
  // const flatlistRef = useRef();

  // const [photo, setPhoto] = React.useState(null);
  const [block,setBlock]=useState("true");
  const setToastMsg = (msg)=>{
    ToastAndroid.showWithGravity(msg,ToastAndroid.SHORT,ToastAndroid.CENTER);
  }
  const isFocused = useIsFocused();

  useEffect(() => {
    getUserInfoFromStorage().then(joinRoom()).then(()=>{
        socket.on('message', (message) =>{
          if(message.room_id === room_id){
            if(temp[message._id] !== undefined)
              return;
            else{
              // Nối message vào cuối mảng
              // temp.push(message);

              // Nối message vào đầu mảng
              temp.unshift(message);
              setMsgsHolder(temp.slice(0));
            }
          }
        });

        socket.on('complete', (tb) => {
          alert(tb);
          console.log(tb);
          if(tb==="Blocked")setBlock("true");
          if(tb==="Unblocked")setBlock("false");
      });
    });

    //Thay đổi header title
    navigation.setOptions({ title: room_name,headerStyle:{backgroundColor:'white'}, 
    headerRight: () => (
      <TouchableOpacity>
        <MaterialCommunityIcons name="dots-vertical" size={25} color="black" 
          onPress={() =>{
            navigation.navigate("ManageGroup",{
                roomInfo:{ 
                    id: room_id,
                    // roomName: room_name,
                    // roomAvatarURL: room_avatarurl,
                    // leaderID:leaderID,
                    // chatGroup: chatGroup,
                },
                socket 
            });
        } }>
        </MaterialCommunityIcons>
      </TouchableOpacity>
    ), });

    return () => {
     setMsgsHolder([]);
    //  setPhoto(null);
     socket.off();
    };
 }, []);

  async function joinRoom(){
    //Vào phòng chat có id là room_id
    socket.emit('joinRoom', room_id);

    //Nhận danh sách tin nhắn trong phòng chat
    socket.on('messages', (list) => {
      //Kiểm tra thời gian tuần tự của tin nhắn trước khi đảo mảng => tránh việc mảng bị đổi mỗi lần truy cập
      // if(list[0].dateSend < list[list.length-1].dateSend){
        list.reverse();
      // }
      setMsgsHolder(list);
      //Lưu dánh sách tin nhắn vào biến temp => tránh việc msgs bị rỗng khi được gọi ở hàm socket.on("message")
      temp=list;
    });

    socket.on('deleteRoom', (roomid) => {
      if(room_id===roomid){
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
            },
          ],
        });
        // if(isFocused)
        // navigation.goBack();
        // navigation.goBack();
        // navigation.navigate("Home");
      }
  });

    socket.on('blockMessage', (a) => {
      setBlock(a);
    })
    
}

  //Lấy userID từ bộ nhớ AsyncStorage
  async function getUserInfoFromStorage(){
    var id=await AsyncStorage.getItem("@userID");
    setUserID(id);
    var name=await AsyncStorage.getItem("@userName");
    setUserName(name);
    var avatar =await AsyncStorage.getItem("@avatarURL");
    setAvatarURL(avatar);
  }
  
 

async function sendMessage(){

  if(input!=""){
    let msg = {
      messageContent: "",
      sender_id: "",
      userName: "",
      avatarURL: "",
      room_id: "",
      imageURL:"",
      file:"",
    };
    msg.messageContent = input.trim();
    msg.sender_id = userID;
    msg.userName = userName;
    msg.avatarURL = avatarURL;
    msg.room_id = room_id;
    msg.dateSend = "";
  
    socket.emit('updateRoom', msg.room_id);
    socket.emit('chatMessage', msg);
    setInput("");
  }
  
}

async function handleChoosePhoto(){
  launchImageLibrary({selectionLimit: 1,mediaType:'mixed',quality:1},(response)=>{
    if (response.didCancel) {

    } else if (response.errorCode == 'permission') {
      setToastMsg('Permission was not granted!');
    } else if (response.errorCode == 'others') {

    } else if(response.assets.length>0  && response.assets[0].fileSize!=0){
      // setPhoto(response);
      var reg=/^.*(\.mp4){1}$/;
      if(response.assets[0].type == 'video/mp4' && !response.assets[0].fileName.match(reg) ){
        response.assets[0].fileName=response.assets[0].fileName+'.mp4';
      }

      const data = new FormData();
      data.append("fileId", 
      {
        name: response.assets[0].fileName,
        type: response.assets[0].type,
        uri: Platform.OS === 'ios' ? response.assets[0].uri.replace('file://', '') : response.assets[0].uri,
      }
      );
      // console.log("Image");
      // console.log(response.assets[0]);
      upload(data);
    }
    
  });
}

async function upload(data){

  fetch(`${REACT_APP_NODE_SERVER_URL}uploadImgNhi/uploadImg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8',
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
        imageURL: "",
        file: "",
      };

      msg.sender_id = userID;
      msg.userName = userName;
      msg.avatarURL = avatarURL;
      msg.room_id = room_id;
      msg.dateSend = "";

      if (d.y == "image/jpeg" || d.y == "image/jpg" || d.y == "image/png" || d.y == "image/gif" || d.y == "video/mp4") {
        msg.imageURL = d.x;
      } else {
        msg.file = d.x;
        msg.messageContent = d.z;
      }

      socket.emit('updateRoom', msg.room_id);
      socket.emit('chatMessage', msg);
  }).catch((err) => {
    console.log(err.message);
    alert("Network Error!");
  })
}

// async function uploadImage(photo){
//   const data=new FormData();
//   data.append("fileId", {
//     name: photo.fileName,
//     type: photo.type,
//     uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
//   });
  
//   await fetch(`${REACT_APP_NODE_SERVER_URL}uploadImgNhi/uploadImg`,{
//     method: 'POST',
//     headers: {
//         'Content-Type': 'multipart/form-data;charset=utf-8',
//     },
//     body: data
//   }).then(res =>
//     res.json()).then(d => {
//     let msg = {
//         messageContent: "",
//         sender_id: "",
//         userName: "",
//         avatarURL: "",
//         room_id: "",
//         imageURL: "",
//         file:"",
//     };

//     msg.sender_id = userID;
//     msg.userName = userName;
//     msg.avatarURL = avatarURL;
//     msg.room_id = room_id;
//     msg.dateSend = "";
//     msg.imageURL = d.x;
//     socket.emit('updateRoom', msg.room_id);
//     socket.emit('chatMessage', msg);

// }).catch((err)=>{
//   console.log(err.message);
// })
// }

async function handleChooseFile() {

  try {
      const res = await DocumentPicker.pick({
      allowMultiSelection: false,
      type: [DocumentPicker.types.allFiles],
    });

    const file = res[0];
    const data = new FormData();
    data.append("fileId", {
      name: file.name,
      type: file.type,
      uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
    });
    // console.log("file");
    // console.log(file);
    upload(data);
    // fetch(`${REACT_APP_NODE_SERVER_URL}uploadImgNhi/uploadImg`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data;charset=utf-8',
    //   },
    //   body: data
    // }).then(res => res.json()).then(d => {
    //   let msg = {
    //     messageContent: "",
    //     sender_id: "",
    //     userName: "",
    //     avatarURL: "",
    //     room_id: "",
    //     imageURL: "",
    //     file: "",
    //   };

    //   msg.sender_id = userID;
    //   msg.userName = userName;
    //   msg.avatarURL = avatarURL;
    //   msg.room_id = room_id;
    //   msg.dateSend = "";

    //   if (d.y == "image/jpeg" || d.y == "image/jpg" || d.y == "image/png" || d.y == "image/gif" || d.y == "video/mp4") {
    //     msg.imageURL = d.x;
    //   } else {
    //     msg.file = d.x;
    //     msg.messageContent = d.z;
    //   }

    //   socket.emit('updateRoom', msg.room_id);
    //   socket.emit('chatMessage', msg);
    // }).catch(function (error) {
    //   console.log('There has been a problem with your fetch operation: ' + error.message);
    // });

  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log("cancel");
    } else {
      console.log(err.message);
    }
  }
}

  return (
    <View style={style.container}>
        <FlatList style={style.listRoom}
            // C1: Đảo ngược list message, truyền vào FlatList, sau đó gọi inverted để message stack on top
            inverted

            // C2: Dùng auto scroll
            // ref={flatlistRef}
            // onContentSizeChange={() => flatlistRef.current.scrollToEnd({animated: false})}
            // onLayout={() => flatlistRef.current.scrollToEnd({animated: true})}

            data={msgsHolder}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => {
              if(item.sender_id === userID){
                return(
                  <MessageSendCard messageInfo={item} navigation={navigation}></MessageSendCard>
                );
              }
              else if(item.sender_id){
                return(
                  <MessageReceiveCard messageInfo={item} navigation={navigation}></MessageReceiveCard>
                );
              }
              else{
                return(
                  <SystemMessage messageInfo={item} navigation={navigation}></SystemMessage>
                );
              }
            }}
        />
        {
          (block==="false") ? (
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'grey',fontSize:16,paddingVertical:10,opacity:0.5}}>You are blocked!</Text>
            </View>
            ):null
        }
        <View style={style.inputcontainer}>
            <View style={style.mainContainer}>
            <TouchableOpacity  onPress={handleChoosePhoto} disabled={(block==="false") ? true : false}>
                  <Ionicons style={style.cameraIcon} name="md-images-outline" size={30} color="black"></Ionicons>
              </TouchableOpacity>
            <TouchableOpacity disabled={(block==="false") ? true : false} onPress={handleChooseFile}>
                  <Ionicons style={style.attachIcon} name="attach-sharp" size={30} color="black"></Ionicons>
              </TouchableOpacity>
              <TextInput editable={!(block==="false") ? true : false} style={style.textInput} value={input} placeholder="Tin nhắn" onChangeText={setInput} onSubmitEditing={sendMessage}/>
              <TouchableOpacity disabled={(block==="false") ? true : false} onPress={sendMessage}>
                  <FontAwesome style={style.sendIcon} name="send-o" size={28} color="black"></FontAwesome>
              </TouchableOpacity>
            </View>
        </View>
      </View>
  );

}

const style=StyleSheet.create({
  container:{
    backgroundColor:"lightgray",
    flex:1,
    flexDirection:'column',
  },
  listRoom:{
    flex:1,
    marginBottom:20,
  },
  inputcontainer:{
    backgroundColor:"white",
    alignItems:'flex-start',
    justifyContent:'center',
    paddingHorizontal:10,
    paddingVertical:5
  },
  mainContainer:{
      flexDirection:'row',
      alignItems:'center',
  },
  sendIcon:{
      paddingHorizontal:5
  },
  textInput:{
      color:"black",
      paddingHorizontal:5,
      flex:1,
      borderWidth:1,
      borderColor:"lightgray",
      borderRadius:15,
      fontSize:18
  },
  attachIcon:{
      paddingRight:5
  },
  cameraIcon:{
      paddingRight:5
  },
})

//  function addMessage(message){
//   msgs.push(message);
//   setMsgsHolder(msgs);
// }
 // async function initSocket() { 
  //   try {
  //       // var id=await AsyncStorage.getItem("@userID");
  //       // setUserID(id);
  //       const token= await AsyncStorage.getItem("@access_token");
  //       if(token != null) {
  //           const s = io("http://192.168.1.14:3000/", {
  //           withCredentials: false,
  //           extraHeaders: {
  //           cookie: 'access_token='+token
  //           }
  //           });
  //           setSocket(s);
  //           //Gửi yêu cầu joinChat lên server => server trả về danh sách các room chat
  //           console.log(id);
  //           s.emit('joinChat', { id });
  //           //Vào phòng chat có id là room_id
  //           s.emit('joinRoom', room_id);
  //           //Nhận danh sách tin nhắn trong phòng chat
  //           s.on('messages', (list) => {
  //             setMsgs(list.reverse());
  //           });
  //       }
  //   } catch(e) {
  //       console.log(e.message);
  //   }
// }
// const [isCancelled,setIsCancelled] = useState(false);

// Nếu msgs rỗng thì chuyển tin nhắn từ temp qua
// if(msgs.length==0)
//   temp.forEach(element => {
//     msgs.push(element);
//   });

// nối message mới vào đầu mảng
// temp.unshift(message);
// setMsgs(temp.slice(0));
// setMsgsHolder(temp.slice(0));

// nối message mới vào cuối mảng
// temp.push(message);
// setMsgs(temp.slice(0));
// setMsgsHolder(temp.slice(0));
// const m = msgs;
// m.unshift(message);
// setMsgs(m.slice(0));
// setMsgsHolder(m.slice(0));
// temp.push(message);
// setMsgs(temp);
// setMsgsHolder(temp);
// setMsgs([...msgs,message]);

          