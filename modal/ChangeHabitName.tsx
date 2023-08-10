import React from 'react';
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, Text, StyleSheet } from 'react-native';
import IsLoading from './IsLoading';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {container, colors} from '../styles';

const ChangeHabitName = ({db, data, changeModalVisible, setChangeModalVisible, type, update, setUpdate, update2, setUpdate2, load, loadx, modalVisible, setModalVisible}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(null);
    const {control, handleSubmit, reset} = useForm();
    


    const EditInd = () => {
        let indupdate=[...update];
        if(type=='habit'){
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET name = ? WHERE name = ?', [value, data],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else if(type=='scale'){
          let indupdate2=[...update2];
          db.transaction(tx=> {
            tx.executeSql('UPDATE scalerecords SET name = ? WHERE name = ?', [value, data],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE scales SET name = ? WHERE name = ?', [value, data],
              (txObj, resultSet2) => {
                setUpdate2(indupdate2);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else if(type=='state'){
          let indupdate2=[...update2];
          db.transaction(tx=> {
            tx.executeSql('UPDATE staterecords SET name = ? WHERE name = ?', [value, data],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET name = ? WHERE name = ?', [value, data],
              (txObj, resultSet2) => {
                setUpdate2(indupdate2);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }  
          loadx(!load);
          setChangeModalVisible(!changeModalVisible);
          setModalVisible(!modalVisible);
      };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={changeModalVisible}
            onRequestClose={() => {
              setChangeModalVisible(!changeModalVisible);
              loadx(!load);
            }}
          >
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setChangeModalVisible(!changeModalVisible)}} activeOpacity={1}>
                  <TouchableWithoutFeedback>
                    <View style={container.modal}>
                      <Text>Change your indicator's name</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: colors.primary.defaultdark, fontWeight: 'bold'}}> {data} </Text><Text>?</Text>
                      </View>
                      <Controller
                        control= {control}
                        name="name"
                        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                            <>
                            <TextInput
                                value={value}
                                onChangeText={(val)=>setValue(val)}
                                autoCapitalize = {"characters"}
                                onBlur={onBlur}
                                placeholder=""
                                style={[container.textinput,{ borderColor: error ? 'red' : '#e8e8e8'}]}
                            />
                            {error && (
                                <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                            )}
                            </>
                        )}
                        rules={{
                            required: 'Input a name',
                            minLength: {
                            value: 3,
                            message: 'Task should be at least 3 characters long',
                            },
                            maxLength: {
                            value: 14,
                            message: 'Task should be max 14 characters long',
                            },
                            validate: (name) => {
                            if (name.includes('  ')) {
                                return 'Name should not contain consecutive spaces';
                            }
                            return true;
                            }
                        }}
                        />                    
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>EditInd()} style={[container.button,{backgroundColor: colors.pale.defaultlight}]}>
                          <Text>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setChangeModalVisible(!changeModalVisible)}} style={[container.button,{backgroundColor: colors.primary.defaultdark}]}>
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </TouchableOpacity>
                <IsLoading isLoading={isLoading}/>
        </Modal>
    )

};

export default ChangeHabitName;

