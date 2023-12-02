
import React, { useState, useRef, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import Color from '../components/Color';

function UpdateState({db, staterecords, setStaterecords, states, setStates, name, updateStateVisible, setUpdateStateVisible, year, month, day, referenceElementPosition}) {

  const changeState = (item) => {
    let existingstates=[...staterecords];
    const id=staterecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
    const indexToUpdate = existingstates.findIndex(c => c.id == id);
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
      animationType="fade"
      transparent={true}
      visible={updateStateVisible}
      onRequestClose={() => {
        setUpdateStateVisible(false);
      }}
    > 
      <TouchableOpacity style={{flex:1}} onPressOut={() => {setUpdateStateVisible(!updateStateVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={[container.picker,{width: 41*(states.filter(c=>c.name==name).length+1)-40,left: referenceElementPosition.x-8+referenceElementPosition.width+10,  top: referenceElementPosition.y-8}]}>
            <FlatList
                horizontal={true}
                data={[... new Set(states.filter(c=>c.name==name).map(c=>c.item))]}
                renderItem={({item,index})=>
                <Pressable onPress={()=>changeState(item)}>
                  <Color color={states.filter(c=>c.name==name).map(c=>c.color)[index]}/>
                </Pressable>
                }
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                bounces={false}
                contentContainerStyle={{ alignItems:'center', justifyContent:'center', borderRadius: 22}}
            />
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default UpdateState;
