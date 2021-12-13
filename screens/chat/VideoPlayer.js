import React from 'react'
import { useEffect } from 'react';
import { View,Text,StyleSheet } from 'react-native';
import Video from 'react-native-video';
import VideoPlayerLB from 'react-native-video-player';

export default function VideoPlayer({navigation, route }){

    const url=route.params.imageURL;

    useEffect(() => {
        
        return () => {
        }
    }, [])

    return(
        <View style={style.container}>
            <VideoPlayerLB video={{uri:url}} 
                autoplay={false} 
                defaultMuted={true} 
                thumbnail={{uri: url}} 
                showDuration={true} resizeMode={'contain'} pauseOnPress={true} 
                style={style.video}
            ></VideoPlayerLB>
            {/* <Video source={{uri: url}} 
            controls={true}
            resizeMode={'contain'}
            repeat={false}
            bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 50000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000
              }}
            currentPlaybackTime={true}
            preferredForwardBufferDuration={5000}
            style={style.video} /> */}
        </View>
    )
}
const style=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        backgroundColor:'black',
        // backgroundColor:'black'
    },
    video:{
        // flex:1,
    }
});