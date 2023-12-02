
import React, { useState, useRef, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import Color from '../components/Color';
import AddMood from '../components/AddMood';

function UpdateMood({db,moods, setMoods, updateStateVisible, setUpdateStateVisible, year, month, day, referenceElementPosition}) {


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
          <View style={[container.picker,{width: 200,left: referenceElementPosition.x-8+referenceElementPosition.width+10,  top: referenceElementPosition.y-8}]}>
            <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={day} setMoodModalVisible={undefined}/>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default UpdateMood;
