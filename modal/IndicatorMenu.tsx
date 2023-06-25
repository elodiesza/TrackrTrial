import React, { useState,  useEffect } from 'react';
import { StyleSheet, Modal, Alert, TouchableWithoutFeedback, Pressable, TouchableOpacity, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import IsLoading from './IsLoading';


const IndicatorMenu = ({ month, year, modalVisible, setModalVisible, data, index, db, setStates, states, loadx, load }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayLeft, setDisplayLeft] = useState<"none" | "flex" | undefined>('flex');
    const [displayRight, setDisplayRight] = useState<"none" | "flex" | undefined>('flex');

    useEffect(() => {
      if(states.filter(c=>(c.name==data && c.day==1)).map(c=>c.place)[0]==0){
        setDisplayLeft('none');
      }
    },[load]);
    useEffect(() => {
      const lastPlace = states.filter(c=>c.day==1).map(c=>c.place).length-1;
      if(states.filter(c=>(c.name==data && c.day==1)).map(c=>c.place)[0]==lastPlace){
        setDisplayRight('none');
      }
    },[load]);
    

    const deleteState = async (name) => {
      setIsLoading(true);
      let existingStates = [...states];
      const currentPlace = existingStates.filter((state) => state.name === name && state.day === 1).map((state) => state.place)[0];
      let remainingStates = existingStates.filter((state) => state.name !== name);
    
      await new Promise((resolve) => {
        db.transaction((tx) => {
          tx.executeSql(
            'DELETE FROM states WHERE name = ?',
            [name],
            (txObj, deleteResultSet) => {
              if (deleteResultSet.rowsAffected > 0) {
                setStates(remainingStates);
                let updatedStatesCount = 0;
                let remainingStatesLength = remainingStates.length;
                for (var i = 0; i < remainingStatesLength; i++) {
                  if (remainingStates[i].place > currentPlace) {
                    let newPlace = remainingStates[i].place - 1;
                    let iDtoUpdate = remainingStates[i].id;
                    db.transaction((tx) => {
                      tx.executeSql(
                        'UPDATE states SET place = ? WHERE id = ?',
                        [newPlace, iDtoUpdate],
                        (txObj, placeResultSet) => {
                          if (placeResultSet.rowsAffected > 0 && remainingStates[i]) {
                            remainingStates[i].place = newPlace;
                          }
                          updatedStatesCount++;
                          if (updatedStatesCount === remainingStatesLength) {
                            resolve();
                          }
                        },
                        (txObj, error) => console.log('Error updating data', error)
                      );
                    });
                  } else {
                    updatedStatesCount++;
                    if (updatedStatesCount === remainingStatesLength) {
                      resolve();
                    }
                  }
                }
              } else {
                resolve();
              }
            },
            (txObj, error) => console.log(error)
          );
        });
      });
    
      setStates([...remainingStates]);
      setModalVisible(false);
      loadx(!load);
      setIsLoading(false);
    };

    const moveLeft = (name) => {
      setIsLoading(true);
      let existingStates = [...states];
      let sortedStates = [...states];
      const nameList = existingStates.filter(c=>c.day==1).map(c=>c.name);
      const nameIndex = nameList.indexOf(name);
      const previousName = nameList[nameIndex-1];
      const newPlace2 = existingStates.filter(c=>(c.name==name && c.day==1)).map(c=>c.place)[0];
      const newPlace = existingStates.filter(c=>(c.name==previousName && c.day==1)).map(c=>c.place)[0];
      const toMoveLeft = existingStates.filter(c=>c.name==name);
      const toMoveLeftIndex = existingStates.indexOf(name);
      const toMoveRight = existingStates.filter(c=>c.name==previousName);
      const toMoveRightIndex = existingStates.indexOf(previousName);
      const impactedDays = existingStates.filter(c=>c.name==name).map(c=>c.day).length;
      db.transaction(tx=> {
        tx.executeSql('UPDATE states SET place = ? WHERE name = ?', [newPlace, name],
          (txObj, resultSet) => {
            for (var i=1; i<impactedDays+1;i++){
            if (resultSet.rowsAffected > 0) {
                sortedStates[toMoveRightIndex-1+i] = existingStates[toMoveLeftIndex-1+i];
                setStates(sortedStates);
                
              }
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
      db.transaction(tx=> {
        tx.executeSql('UPDATE states SET place = ? WHERE name = ?', [newPlace2, previousName],
          (txObj, resultSet2) => {
            for (var i=1; i<impactedDays+1;i++){
            if (resultSet2.rowsAffected > 0) {
                [...sortedStates][toMoveLeftIndex-1+i] = existingStates[toMoveRightIndex-1+i];
                console.warn([...sortedStates][toMoveLeftIndex-1+i]);
              }
            }
            setStates([...sortedStates]);
            console.warn([...sortedStates]);
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
      setModalVisible(!modalVisible);
      loadx(!loadx);
      setIsLoading(false);
    };

    return(
    <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
            loadx(!load);
          }}
        >
          <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setModalVisible(!modalVisible)}} activeOpacity={1}>
            <TouchableWithoutFeedback>
              <View style={styles.dialogBox}>
              <Pressable onPress={()=>moveLeft(data)} style={{display: displayLeft}}>
                <Feather name="chevron-left" size={25} color={'gray'}/>
              </Pressable>
              <Pressable >
                <Feather name="chevron-right" size={25} color={'gray'} style={{display: displayRight}}/>
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
                  setDeleteModalVisible(!deleteModalVisible);
                  loadx(!load);
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
                <IsLoading isLoading={isLoading}/>
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
  
  
  
  
  
  
  