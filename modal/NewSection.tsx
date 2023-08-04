import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import uuid from 'react-native-uuid';


function NewSection({db, sections, setSections, track, newSectionVisible, setNewSectionVisible}) {
    const {control, handleSubmit, reset} = useForm();
    const [value, setValue] = useState('');

    const addSection = async (data) => {
        let existingsections = [...sections]; 
            db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO sections (id,section, track) VALUES (?,?, ?)',
                  [ uuid.v4(),data.name, track],
                  (txtObj, stateResultSet) => {
                    const newState = {
                      id: uuid.v4(),
                      section: data.name,
                      track: track,
                    };
                    existingsections.push(newState);
                    setSections(existingsections); 
                  }
                );
            });
        setNewSectionVisible(false);
        setValue('');
    };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newSectionVisible}
      onRequestClose={() => {
        setNewSectionVisible(false);
        setValue('');
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setValue('');setNewSectionVisible(false);}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
               <Text>Add a new Section to {track}</Text>
               <Controller
                control= {control}
                name={'name'}
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize = {"characters"}
                    onBlur={onBlur}
                    placeholder={"new section name"}
                    style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8'}]}
                />
                {error && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                )}
                </>
                )}
                rules={{
                    required: 'Input a section name',
                    minLength: {
                    value: 3,
                    message: 'Task should be at least 3 characters long',
                    },
                    maxLength: {
                    value: 32,
                    message: 'Task should be max 32 characters long',
                    },
                    validate: (name) => {
                    if (name.includes('  ')) {
                        return 'Name should not contain consecutive spaces';
                    }
                    return true;
                    }
                }}
                />
                <Pressable onPress={handleSubmit(addSection)} style={container.button}>
                    <Text>CREATE</Text>
                </Pressable>
            </View>  
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewSection;
