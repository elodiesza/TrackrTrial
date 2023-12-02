import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import NewHabit from './NewHabit';
import NewState from './NewState';
import NewScale from './NewScale';
import NewTime from './NewTime';
import { container } from '../styles';


function NewIndicator({addModalVisible, setAddModalVisible, db, habits, setHabits, states, setStates, staterecords, setStaterecords, 
  scales, setScales, scalerecords, setScalerecords, times, setTimes, timerecords, setTimerecords ,load, loadx}) {


  const [newHabitVisible, setNewHabitVisible] = useState(false);
  const [newStateVisible, setNewStateVisible] = useState(false);
  const [newScaleVisible, setNewScaleVisible] = useState(false);
  const [newTimeVisible, setNewTimeVisible] = useState(false);


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
              <Pressable onPress={()=>setNewTimeVisible(true)} style={container.button}>
                <Text style={container.buttontext}>TIME</Text>
              </Pressable>
              <NewHabit 
                newHabitVisible={newHabitVisible} 
                setNewHabitVisible={setNewHabitVisible} 
                addModalVisible={addModalVisible} 
                setAddModalVisible={setAddModalVisible} 
                db={db} 
                habits={habits} 
                setHabits={setHabits}
                load={load} loadx={loadx}
              />
              <NewState 
                newStateVisible={newStateVisible} 
                setNewStateVisible={setNewStateVisible} 
                addModalVisible={addModalVisible} 
                setAddModalVisible={setAddModalVisible} 
                db={db} states={states} setStates={setStates} 
                staterecords={staterecords} 
                setStaterecords={setStaterecords}
                load={load} loadx={loadx}
              />
              <NewScale 
                newScaleVisible={newScaleVisible} 
                setNewScaleVisible={setNewScaleVisible} 
                addModalVisible={addModalVisible} 
                setAddModalVisible={setAddModalVisible} 
                db={db} 
                scales={scales} 
                setScales={setScales} 
                scalerecords={scalerecords} 
                setScalerecords={setScalerecords}
                load={load} loadx={loadx}
              />
              <NewTime 
                newTimeVisible={newTimeVisible} 
                setNewTimeVisible={setNewTimeVisible} 
                addModalVisible={addModalVisible} 
                setAddModalVisible={setAddModalVisible} 
                db={db} 
                times={times} 
                setTimes={setTimes} 
                timerecords={timerecords} 
                setTimerecords={setTimerecords}
                load={load} loadx={loadx}
              />
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewIndicator;

