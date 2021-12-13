import React, { Component, Fragment } from 'react';
import { TouchableOpacity, Text, Linking, View, Image, ImageBackground, BackHandler,StyleSheet, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_NODE_SERVER_URL} from "@env"
export default class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scan: false,
            ScanResult: false,
            result: null
        };
    }
onSuccess = async (e) => {

        this.setState({
            result: e,
            scan: false,
            ScanResult: true
        })

        const token= await AsyncStorage.getItem("@access_token");
        const qr = new FormData();
        qr.append("access_token",token);
        qr.append("code",e.data);
        // var qr={
        //     "access_token":token,
        //     "code":e.data
        // }
        // console.log(qr);
        fetch(`${REACT_APP_NODE_SERVER_URL}qrcode/verify`,{
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body:qr
        }).then(()=>{
            
        })

    }
activeQR = () => {
        this.setState({ scan: true })
    }
scanAgain = () => {
        this.setState({ scan: true, ScanResult: false })
    }
render() {
        const { scan, ScanResult, result } = this.state
        return (
            <View style={styles.scrollViewStyle}>
                <Fragment>
                    {!scan && !ScanResult &&
                        <View style={styles.cardView} >
                            <Ionicons size={36} name="qr-code-outline" color='black'></Ionicons>
                            <TouchableOpacity onPress={this.activeQR} style={styles.buttonScan}>
                                <View style={styles.buttonWrapper}>
                                <Ionicons size={36} name="camera-outline" style={styles.scanIcon}></Ionicons>
                                <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Scan QR Code</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    {ScanResult &&
                        <Fragment>
                            <Text style={styles.textTitle1}>Result</Text>
                            <View style={styles.cardView}>
                                <Text style={{color:'black'}}>Successfully authenticated</Text>
                                <TouchableOpacity onPress={this.scanAgain} style={styles.buttonScan}>
                                    <View style={styles.buttonWrapper}>
                                        <Ionicons size={36} name="camera-outline" color='black'></Ionicons>
                                        <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Click to scan again</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Fragment>
                    }
                    {scan &&
                        <QRCodeScanner
                            reactivate={true}
                            showMarker={true}
                            ref={(node) => { this.scanner = node }}
                            onRead={this.onSuccess}
                            topContent={
                                <Text style={styles.centerText}>
                                   Please move your camera {"\n"} over the QR Code
                                </Text>
                            }
                            bottomContent={
                                <View style={styles.bottomContent}>
                                    <TouchableOpacity  
                                        onPress={() => this.scanner.reactivate()} 
                                        onLongPress={() => this.setState({ scan: false })}>
                                        <Ionicons size={36} name="camera-outline" style={styles.buttonScan2}></Ionicons>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                    }
                </Fragment>
            </View>
        );
    }
}
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create(
    {
        scrollViewStyle: {
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: '#2196f3'
        },
        cardView: {
            width: dimensions.width - 32,
            height: dimensions.height/2,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 25,
            marginLeft: 5,
            marginRight: 5,
            marginTop: '10%',
            backgroundColor: 'white'
        },
        buttonWrapper: {
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center',
        },
        scanIcon:{
            paddingHorizontal:10,
            color:'black',
        },
        buttonScan: {
            borderWidth: 2,
            borderRadius: 10,
            borderColor: '#258ce3',
            paddingTop: 5,
            paddingRight: 25,
            paddingBottom: 5,
            paddingLeft: 25,
            marginTop: 20
        },
        buttonScan2: {
            color:"black",
            padding:10,
        },
        textTitle1: {
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            padding: 16,
            color: 'white'
        },
        descText: {
            padding: 16,
            textAlign: 'center',
            fontSize: 16
        },
        highlight: {
            fontWeight: '700',
        },
        centerText: {
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            padding: 32,
            color: 'white',
        },
        textBold: {
            fontWeight: '500',
            color: '#000',
        },
        bottomContent: {
           width: dimensions.width,
           height: 100,
           backgroundColor:"#2196f3",
           justifyContent:'flex-start',
           alignItems:'center',
        },
        buttonTouchable: {
            fontSize: 21,
            backgroundColor: 'white',
            marginTop: 32,
            width: dimensions.width - 62,
            justifyContent: 'center',
            alignItems: 'center',
            height: 44
        },
        buttonTextStyle: {
            color: 'black',
            fontWeight: 'bold',
            fontSize:16,
        }
    }
)
