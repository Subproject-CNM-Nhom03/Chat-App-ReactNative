import React, { useState } from 'react';
import { Text, View, StyleSheet, Button,FlatList } from 'react-native';


import io from "socket.io-client";

export default function HomeScreen() {

  const [initialElements, changeEl]  = useState([
    { id : "0", text : "Object 1"},
    { id : "1", text : "Object 2"},
  ]);
  const z="AAAssadasdasdasdasssAA";
  const room="Java";


  const [exampleState, setExampleState] = useState(initialElements);
  const [idx, incr] = useState(2);
  const socket = io("http://192.168.1.2:3000/");

  socket.on('message', (message) => {
    var newArray = [...initialElements , {id : idx, text: "Object " + (idx+1) }];
    incr(idx + 1);
    console.log("xxxxxxxxxxx");
    setExampleState(newArray);
    changeEl(newArray);
  });

  const addElement = () => {
    var newArray = [...initialElements , {id : idx, text: "Object " + (idx+1) }];
    incr(idx + 1);
    console.log(initialElements.length);
    setExampleState(newArray);
    changeEl(newArray);
    socket.emit('joinRoom', { z,room});  
    console.log("yyyyyyyyyy");
    
  }

  
  //console.log(socket);



  return (
    <View style={styles.container}>
        <FlatList
            keyExtractor = {item => item.id}  
            data={exampleState}
            renderItem = {item => (<Text>{item.item.text}</Text>)} />
        <Button
          title="Add element"
          onPress={addElement} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1
  },
});