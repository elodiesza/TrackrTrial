import React, { useState } from 'react';
import { StyleSheet, Modal, Alert, TouchableWithoutFeedback, Pressable, TouchableOpacity, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';


const IndicatorMenu = ({ month, year, modalVisible, setModalVisible, data, index, db, setStates, states, loadx, load }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const deleteState = (name) => {
      db.transaction(tx => {
        tx.executeSql('DELETE FROM states WHERE name = ?', [name],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingStates = [...states].filter(state => state.name !== name);
              setStates(existingStates);
            }
          },
          (txObj, error) => console.log(error)
        );
      });
      setDeleteModalVisible(!deleteModalVisible);
      loadx(!loadx);
    };

    return(
    <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setModalVisible(!modalVisible)}} activeOpacity={1}>
            <TouchableWithoutFeedback>
              <View style={styles.dialogBox}>
              <Pressable >
                <Feather name="chevron-left" size={25} color={'gray'}
                  
                />
              </Pressable>
              <Pressable >
                <Feather name="chevron-right" size={25} color={'gray'}
  
                />
              </Pressable>
              <Pressable>
                <Feather name="edit" size={25}/>
              </Pressable>
              <Pressable onPress={() => setDeleteModalVisible(true)}>
                <Feather name="trash-2" size={25} color={'darkred'}/>
              </Pressable>
              </View>
              
            </TouchableWithoutFeedback>
          </TouchableOpacity>
          <Modal
                animationType="none"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setDeleteModalVisible(!deleteModalVisible);
                }}
              >
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setDeleteModalVisible(!deleteModalVisible)}} activeOpacity={1}>
                  <TouchableWithoutFeedback>
                    <View style={styles.deleteBox}>
                      <Text>Are you sure you want to delete</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#B9CBCF', fontWeight: 'bold'}}> {data} </Text><Text>?</Text>
                      </View>
                      <Text style={{color: 'gray', fontSize: 10}}>You will not be able to recover your data for this month</Text>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => deleteState(data)} style={[styles.button,{backgroundColor: 'lightgray'}]}>
                          <Text>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setDeleteModalVisible(!deleteModalVisible)}} style={[styles.button,{backgroundColor: '#F4F9FA'}]}>
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </TouchableOpacity>
              </Modal>
        </Modal>
  );};

  const styles = StyleSheet.create({
    dialogBox: {
        position: 'absolute',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        top: 200,
      },
      deleteBox: {
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
  });
  
  export default IndicatorMenu;
  
  
  
  
  
  
  