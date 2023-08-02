import React, { useState, useEffect } from 'react';
import { Switch, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container, colors} from '../styles';
import uuid from 'react-native-uuid';

function NewProgress({addModalVisible, setAddModalVisible, db, progress, setProgress, section, track}) {
  
  const {control, handleSubmit, reset} = useForm();

  const addProgress = async (data) => {
    let existingProgress = [...progress]; 
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO progress ( name, track, list, progress, rate) values (?,?,?,?,?)',[data.name, track, section, 0,0],
          (txtObj,resultSet)=> {    
            existingProgress.push({ id: uuid.v4(), name: data.name, track: track, list: section, progress: 0, rate: 0});
            setProgress(existingProgress);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
    setAddModalVisible(false);
  };



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => {
        setAddModalVisible(!addModalVisible);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {
        setAddModalVisible(!addModalVisible);
        }} 
        activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.modal}>
            <Text>Add a new progress bar to {section}</Text>
            <Controller
              control= {control}
              name="name"
              render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder=""
                    style={[container.textinput,{height:40, borderColor: error ? 'red' : '#e8e8e8'}]}
                  />
                  {error && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                  )}
                </>
              )}
              rules={{
                required: 'Input a name for your progress bar',
                minLength: {
                  value: 3,
                  message: 'Task should be at least 3 characters long',
                },
                maxLength: {
                  value: 36,
                  message: 'Task should be max 70 characters long',
                },
              }}
            />
            <Pressable onPress={handleSubmit(addProgress)} style={container.button}><Text>CREATE</Text></Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewProgress;

