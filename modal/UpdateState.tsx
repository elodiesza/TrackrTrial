
import React, { useState } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import Color from '../components/Color';


function UpdateState({db, staterecords, setStaterecords, states, setStates, name, updateStateVisible, setUpdateStateVisible, year, month, day}) {


  const changeState = (item) => {
    let existingstates=[...staterecords];
    const id=staterecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
    const indexToUpdate = existingstates.findIndex(state => state.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE staterecords SET item = ? WHERE id = ?', [item, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingstates[indexToUpdate].item = item;
              setStaterecords(existingstates);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
      setUpdateStateVisible(!updateStateVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={updateStateVisible}
      onRequestClose={() => {
        setUpdateStateVisible(false);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setUpdateStateVisible(!updateStateVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
            <FlatList
                horizontal={true}
                data={[... new Set(states.filter(c=>c.name==name).map(c=>c.item))]}
                renderItem={({item,index})=>
                <Pressable onPress={()=>changeState(item)}>
                  <Color color={states.filter(c=>c.name==name).map(c=>c.color)[index]}/>
                </Pressable>
                }
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
            />
              <Pressable style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default UpdateState;
