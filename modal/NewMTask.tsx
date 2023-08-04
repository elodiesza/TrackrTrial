import React, { useState, useEffect } from 'react';
import { Switch, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import uuid from 'react-native-uuid';

function NewTask({addModalVisible, setAddModalVisible, db, tasks, setTasks, tracks, setTracks, year, month}) {

  const {control, handleSubmit, reset} = useForm();
  const [load, loadx] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const toggleSwitch = () => setRecurring(previousState => !previousState);


  useEffect(() => {
    if (!addModalVisible) {
      reset();
    }
  }, [addModalVisible, reset]);


  const addTask = async (data) => {
    let existingTasks = [...tasks]; 
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?,?)',
          [ uuid.v4(),data.task,year,month,undefined,0,recurring?1:0,true,undefined,undefined, undefined],
          (txtObj,)=> {    
            existingTasks.push({ id: uuid.v4(), task: data.task, year:year, month:month, day:undefined, taskState:0, recurring:recurring?1:0, monthly:true, track:undefined, time:undefined, section:undefined});
            setTasks(existingTasks);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
    setRecurring(false);
    setAddModalVisible(false);
    loadx(!load);
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(false);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(false);
        }} 
        activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
              <Text>Insert new Task</Text>
              <Controller
              control= {control}
              name="task"
              render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder=""
                    style={[styles.input,{height:40, borderColor: error ? 'red' : '#e8e8e8'}]}
                  />
                  {error && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                  )}
                </>
              )}
              rules={{
                required: 'Input a task',
                minLength: {
                  value: 3,
                  message: 'Task should be at least 3 characters long',
                },
                maxLength: {
                  value: 36,
                  message: 'Task should be max 36 characters long',
                },
              }}
              />
              <Switch onValueChange={toggleSwitch} value={recurring}/>
              <Pressable onPress={handleSubmit(addTask)} style={styles.submit}><Text>CREATE</Text></Pressable> 
            <Text style={{color: 'lightgray', fontSize: 12, marginBottom:10}}>Must be up to 32 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    paddingHorizontal: 10,
  },
  submit: {
    width: '70%',
    borderWidth: 1,
    borderColor: 'lightblue',
    backgroundColor: 'lightgray',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  color: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'lightgray',
  },
  colorPicker: {
    flex: 1, 
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 10,
    padding: 15,
  }
});
