import React from 'react';
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, Text, StyleSheet } from 'react-native';
import IsLoading from './IsLoading';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const ChangeIndName = ({db, data, changeModalVisible, setChangeModalVisible, states, setStates, load, loadx, modalVisible, setModalVisible}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(null);
    const {control, handleSubmit, reset} = useForm();
    var today = new Date();
    const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

    const EditInd = (name) => {
        let indStates=[...states];
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET name = ? WHERE name = ?', [value, name],
              (txObj, resultSet) => {
                for (var i=1; i<DaysInMonth+1;i++){
                if (resultSet.rowsAffected > 0) {
                    indStates.filter(c=>c.name==name)[i].name = value;
                  }
                }
                setStates(indStates);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
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
                    <View style={styles.changeBox}>
                      <Text>Change your indicator's name</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#B9CBCF', fontWeight: 'bold'}}> {data} </Text><Text>?</Text>
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
                                style={[styles.input,{height:40, borderColor: error ? 'red' : '#e8e8e8'}]}
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
                            value: 12,
                            message: 'Task should be max 12 characters long',
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
                        <TouchableOpacity onPress={()=>EditInd(data)} style={[styles.button,{backgroundColor: 'lightgray'}]}>
                          <Text>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setChangeModalVisible(!changeModalVisible)}} style={[styles.button,{backgroundColor: '#F4F9FA'}]}>
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

const styles = StyleSheet.create({
      changeBox: {
        flex: 1, 
        top: 200,
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
      },
      button: {
        width: 100,
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginTop: 20,
      },
    input: {
        width: '70%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgray',
        paddingHorizontal: 10,
    },
  });

export default ChangeIndName;

