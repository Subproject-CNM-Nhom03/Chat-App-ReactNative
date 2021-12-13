import React, { useEffect,useState } from 'react';
import {Text, View,StyleSheet, Image, TouchableOpacity, Dimensions,NativeModules,PermissionsAndroid,Platform} from 'react-native';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-player';
import {AWS_ANHDAIDIEN}from '@env';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import RNFetchBlob from 'rn-fetch-blob';

export default function MessageReceiveCard({messageInfo,navigation, route}) {
    const {avatarURL,username,sender_id,messageContent,file,imageURL,enomotion,dateSend} = messageInfo;
    const [shouldHide,setShouldHide] = useState(true);

    function FlexibleElement(props){
        if(file==""){
            if (messageContent != "") {
                return (<Text style={style.messageContent}>{messageContent}</Text>);
            } else if (imageURL != "") {
                var reg=/^.*(\.mp4){1}$/;
                if(imageURL.match(reg) ){
                    return (
                    // <VideoPlayer video={{uri:imageURL}} 
                    //     autoplay={false} 
                    //     defaultMuted={true} 
                    //     thumbnail={{uri: imageURL}} 
                    //     showDuration={true} 
                    //     resizeMode={'contain'} 
                        // pauseOnPress={true} 
                        // fullScreenOnLongPress={true}
                        // style={style.messageVideo}></VideoPlayer>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('VideoPlayer',{
                            imageURL:imageURL
                        });
                    }}>
                        <Image source={{uri:imageURL}} style={style.messageVideo}></Image>
                    </TouchableOpacity>
                    );
                }
                return (<Image source={{uri:imageURL}} style={style.messageImg} resizeMode="contain"></Image>);
            }
        }else{
            return (
                <View style={style.fileContainer}>
                     <FontAwesome5 style={style.fileIcon} name="file-alt" size={30} color="grey"></FontAwesome5>
                     <Text style={style.fileName}>{messageContent}</Text>
                     <TouchableOpacity onPress={()=>checkPermission(file,messageContent)}> 
                        <MaterialCommunityIcons style={style.downloadIcon} name="download" size={30} color="black"></MaterialCommunityIcons>
                     </TouchableOpacity>
                </View>
            )
        }
        
        
    }

// If Platform is Android then check for permissions.
async function checkPermission (url,name) {
    if (Platform.OS === 'ios') {
      downloadFile(url,name);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(url,name);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++"+err);
      }
    }
  };

  function downloadFile(url,name) {
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:RootDir+"/chatapp/"+name,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,   
      },
    };
    config(options)
      .fetch('GET', url)
      .then(res => {
        // Alert after successful downloading
        // console.log('res -> ', JSON.stringify(res));
        res.flush();
        alert('File Downloaded Successfully.');
      });
  };

  return (
      <View style={style.card}>
          <View style={style.infoContainer}>
                <Image source={{uri: (avatarURL)? avatarURL:AWS_ANHDAIDIEN}} style={style.avatarURL}></Image>
                <TouchableOpacity onPress={()=>{
                    setShouldHide(!shouldHide);
                }}>
                    <View style={style.rightContainer}>
                        {/* Kiểm tra và hiển thị từng loại tin nhắn phù hợp */}
                        <FlexibleElement/>
                        {
                            !shouldHide ? (
                            <View style={style.dateContainer}>
                                <Text style={style.dateSend}>{dateSend}</Text>
                            </View>
                            ):null
                        }
                    </View>
                </TouchableOpacity>
          </View>
      </View>
  )
}
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16)*6/10;
const imageWidth = dimensions.width*6/10; 

const style=StyleSheet.create({
    card:{
        padding:10,
        margin:5,
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    infoContainer:{
        flex:0.7,
        flexDirection:'row',
        alignItems:'center'
    },
    avatarURL:{
        width: 40,
        height:40,
        borderRadius:25,
        aspectRatio:1,
        alignItems:'center',
        justifyContent:'center',
        marginRight:15,
        padding:1,
    },
    rightContainer:{
        flex:1,
        flexDirection:'column',
    },
    messageContent:{
        fontSize:17,
        color:"black",
        backgroundColor:"white",
        paddingVertical:15,
        paddingHorizontal:15,
        borderRadius:10,
        borderBottomLeftRadius:0,
    },
    messageImg:{
        width:imageWidth,
        height:imageWidth,
        borderRadius:10,
    },
    messageVideo:{
        width:imageWidth,
        height:imageHeight,
        backgroundColor:'black'
    },
    dateContainer:{
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    dateSend:{
        fontSize:14,
        color:"gray",
        marginTop:10,
    },
    fileContainer:{
        flexDirection:'row',
        backgroundColor:"lightblue",
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:15,
        borderRadius:10,

    },
    fileName:{
        fontSize:17,
        color:"black",
        paddingHorizontal:8,
        width:"80%",
    },
    fileIcon:{
        
    },
    downloadIcon:{
        backgroundColor:'white',
        borderRadius:17,
        padding:2,
    },
})