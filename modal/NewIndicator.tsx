import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import NewHabit from './NewHabit';
import NewState from './NewState';
import NewScale from './NewScale';
import { container } from '../styles';


function NewIndicator({addModalVisible, setAddModalVisible, load, loadx, db, habits, setHabits, tracks, setTracks, states, setStates, staterecords, setStaterecords, scales, setScales, scalerecords, setScalerecords}) {


  const [isLoading, setIsLoading] = useState(true);

  const [newHabitVisible, setNewHabitVisible] = useState(false);
  const [newStateVisible, setNewStateVisible] = useState(false);
  const [newScaleVisible, setNewScaleVisible] = useState(false);

  const [type, setType] = useState(0);
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => {
        setAddModalVisible(!addModalVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.modal}>
              <Text style={{marginBottom:10}}>NEW INDICATOR</Text>
              <Pressable onPress={()=>{setNewHabitVisible(true)}} style={container.button}>
                <Text style={container.buttontext}>HABIT</Text>
              </Pressable>
              <Pressable onPress={()=>{setNewStateVisible(true)}} style={container.button}>
                <Text style={container.buttontext}>STATE</Text>
              </Pressable>
              <Pressable onPress={()=>{setNewScaleVisible(true)}} style={container.button}>
                <Text style={container.buttontext}>SCALE</Text>
              </Pressable>
              <Pressable onPress={()=>setNewHabitVisible} style={container.button}>
                <Text style={container.buttontext}>TIME</Text>
              </Pressable>
              <Pressable onPress={()=>setNewHabitVisible} style={container.button}>
                <Text style={container.buttontext}>STICKER</Text>
              </Pressable>
              <NewHabit newHabitVisible={newHabitVisible} setNewHabitVisible={setNewHabitVisible} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} load={load} loadx={loadx} db={db} habits={habits} setHabits={setHabits}/>
              <NewState newStateVisible={newStateVisible} setNewStateVisible={setNewStateVisible} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} load={load} loadx={loadx} db={db} habits={habits} setHabits={setHabits} states={states} setStates={setStates} staterecords={staterecords} setStaterecords={setStaterecords}/>
              <NewScale newScaleVisible={newScaleVisible} setNewScaleVisible={setNewScaleVisible} addModalVisible={addModalVisible} setAddModalVisible={setAddModalVisible} load={load} loadx={loadx} db={db} habits={habits} setHabits={setHabits} 
              scales={scales} setScales={setScales} scalerecords={scalerecords} setScalerecords={setScalerecords}/>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewIndicator;

