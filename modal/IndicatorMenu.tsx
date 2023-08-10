import React, { useState,  useEffect } from 'react';
import { StyleSheet, Modal, Alert, TouchableWithoutFeedback, Pressable, TouchableOpacity, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import IsLoading from './IsLoading';
import ChangeHabitName from './ChangeHabitName';
import { container, colors } from '../styles';

const IndicatorMenu = ({ month, year, modalVisible, setModalVisible, type, data, db, setUpdate, update, update2, setUpdate2, loadx, load }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [changeModalVisible, setChangeModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayLeft, setDisplayLeft] = useState<"none" | "flex" | undefined>('flex');
    const [displayRight, setDisplayRight] = useState<"none" | "flex" | undefined>('flex');

    useEffect(() => {
      if(update.filter(c=>(c.name==data && c.day==1)).map(c=>c.place)[0]==0){
        setDisplayLeft('none');
      }
    },[load]);
    useEffect(() => {
      const lastPlace = update.filter(c=>c.day==1).map(c=>c.place).length-1;
      if(update.filter(c=>(c.name==data && c.day==1)).map(c=>c.place)[0]==lastPlace){
        setDisplayRight('none');
      }
    },[load]);
    

    const deleteState = async (name) => {
      setIsLoading(true);
      let existingupdate = [...update];
      const currentPlace = existingupdate.filter((state) => state.name === name && state.day === 1).map((state) => state.place)[0];
      let remainingupdate = existingupdate.filter((state) => state.name !== name);
      if (update==='habits'){
        await new Promise((resolve) => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM habits WHERE name = ?',
              [name],
              (txObj, deleteResultSet) => {
                if (deleteResultSet.rowsAffected > 0) {
                  setUpdate(remainingupdate);
                  let updatedupdateCount = 0;
                  let remainingupdateLength = remainingupdate.length;
                  for (var i = 0; i < remainingupdateLength; i++) {
                    if (remainingupdate[i].place > currentPlace) {
                      let newPlace = remainingupdate[i].place - 1;
                      let iDtoUpdate = remainingupdate[i].id;
                      db.transaction((tx) => {
                        tx.executeSql(
                          'UPDATE habits SET place = ? WHERE id = ?',
                          [newPlace, iDtoUpdate],
                          (txObj, placeResultSet) => {
                            if (placeResultSet.rowsAffected > 0 && remainingupdate[i]) {
                              remainingupdate[i].place = newPlace;
                            }
                            updatedupdateCount++;
                            if (updatedupdateCount === remainingupdateLength) {
                              resolve();
                            }
                          },
                          (txObj, error) => console.log('Error updating data', error)
                        );
                      });
                    } else {
                      updatedupdateCount++;
                      if (updatedupdateCount === remainingupdateLength) {
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
      }
      else if (update==='states'){
        await new Promise((resolve) => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM states WHERE name = ?',
              [name],
              (txObj, deleteResultSet) => {
                if (deleteResultSet.rowsAffected > 0) {
                  setUpdate(remainingupdate);
                  let updatedupdateCount = 0;
                  let remainingupdateLength = remainingupdate.length;
                  for (var i = 0; i < remainingupdateLength; i++) {
                    if (remainingupdate[i].place > currentPlace) {
                      let newPlace = remainingupdate[i].place - 1;
                      let iDtoUpdate = remainingupdate[i].id;
                      db.transaction((tx) => {
                        tx.executeSql(
                          'UPDATE states SET place = ? WHERE id = ?',
                          [newPlace, iDtoUpdate],
                          (txObj, placeResultSet) => {
                            if (placeResultSet.rowsAffected > 0 && remainingupdate[i]) {
                              remainingupdate[i].place = newPlace;
                            }
                            updatedupdateCount++;
                            if (updatedupdateCount === remainingupdateLength) {
                              resolve();
                            }
                          },
                          (txObj, error) => console.log('Error updating data', error)
                        );
                      });
                    } else {
                      updatedupdateCount++;
                      if (updatedupdateCount === remainingupdateLength) {
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
      }
      else if (update==='scales'){
        await new Promise((resolve) => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM scales WHERE name = ?',
              [name],
              (txObj, deleteResultSet) => {
                if (deleteResultSet.rowsAffected > 0) {
                  setUpdate(remainingupdate);
                  let updatedupdateCount = 0;
                  let remainingupdateLength = remainingupdate.length;
                  for (var i = 0; i < remainingupdateLength; i++) {
                    if (remainingupdate[i].place > currentPlace) {
                      let newPlace = remainingupdate[i].place - 1;
                      let iDtoUpdate = remainingupdate[i].id;
                      db.transaction((tx) => {
                        tx.executeSql(
                          'UPDATE scales SET place = ? WHERE id = ?',
                          [newPlace, iDtoUpdate],
                          (txObj, placeResultSet) => {
                            if (placeResultSet.rowsAffected > 0 && remainingupdate[i]) {
                              remainingupdate[i].place = newPlace;
                            }
                            updatedupdateCount++;
                            if (updatedupdateCount === remainingupdateLength) {
                              resolve();
                            }
                          },
                          (txObj, error) => console.log('Error updating data', error)
                        );
                      });
                    } else {
                      updatedupdateCount++;
                      if (updatedupdateCount === remainingupdateLength) {
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
      }
      setUpdate([...remainingupdate]);
      setModalVisible(false);
      loadx(!load);
      setIsLoading(false);
    };


    const moveLeft = (name) => {
      setIsLoading(true);
      let existingupdate = [...update];
      let sortedupdate = [...update];
      let nameList = existingupdate.filter(c=>c.day==1).map(c=>c.name);
      let nameIndex = nameList.indexOf(name);
      let previousName = nameList[nameIndex-1];
      let newPlace2 = existingupdate.filter(c=>(c.name==name && c.day==1)).map(c=>c.place)[0];
      let newPlace = existingupdate.filter(c=>(c.name==previousName && c.day==1)).map(c=>c.place)[0];
      let toMoveLeftIndex = existingupdate.indexOf(name);
      let toMoveRightIndex = existingupdate.indexOf(previousName);
      let impactedDays = existingupdate.filter(c=>c.name==name).map(c=>c.day).length;
      if(update='habits'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                  setUpdate(sortedupdate);
                  
                }
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET place = ? WHERE name = ?', [newPlace2, previousName],
            (txObj, resultSet2) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet2.rowsAffected > 0) {
                  [...sortedupdate][toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else if(update='states'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE states SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                  setUpdate(sortedupdate);
                  
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
                  [...sortedupdate][toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else if(update='scales'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE scales SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                  setUpdate(sortedupdate);
                  
                }
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx=> {
          tx.executeSql('UPDATE scales SET place = ? WHERE name = ?', [newPlace2, previousName],
            (txObj, resultSet2) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet2.rowsAffected > 0) {
                  [...sortedupdate][toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      setModalVisible(!modalVisible);
      loadx(!loadx);
      setIsLoading(false);
    };

    const moveRight = (name) => {
      setIsLoading(true);
      let existingupdate = [...update];
      let sortedupdate = [...update];
      let nameList = existingupdate.filter(c=>c.day==1).map(c=>c.name);
      let nameIndex = nameList.indexOf(name);
      let nextName = nameList[nameIndex+1];
      let newPlace2 = existingupdate.filter(c=>(c.name==name && c.day==1)).map(c=>c.place)[0];
      let newPlace = existingupdate.filter(c=>(c.name==nextName && c.day==1)).map(c=>c.place)[0];
      let toMoveRightIndex = existingupdate.indexOf(name);
      let toMoveLeftIndex = existingupdate.indexOf(nextName);
      let impactedDays = existingupdate.filter(c=>c.name==name).map(c=>c.day).length;
      if(update==='habits'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                  setUpdate(sortedupdate);
                  
                }
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET place = ? WHERE name = ?', [newPlace2, nextName],
            (txObj, resultSet2) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet2.rowsAffected > 0) {
                  [...sortedupdate][toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else if(update==='states'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE staterecords SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                  setUpdate(sortedupdate);
                  
                }
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx=> {
          tx.executeSql('UPDATE staterecords SET place = ? WHERE name = ?', [newPlace2, nextName],
            (txObj, resultSet2) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet2.rowsAffected > 0) {
                  [...sortedupdate][toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else if(update==='scales'){
        db.transaction(tx=> {
          tx.executeSql('UPDATE scalerecords SET place = ? WHERE name = ?', [newPlace, name],
            (txObj, resultSet) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet.rowsAffected > 0) {
                  sortedupdate[toMoveLeftIndex-1+i] = existingupdate[toMoveRightIndex-1+i];
                  setUpdate(sortedupdate);
                  
                }
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx=> {
          tx.executeSql('UPDATE scalerecords SET place = ? WHERE name = ?', [newPlace2, nextName],
            (txObj, resultSet2) => {
              for (var i=1; i<impactedDays+1;i++){
              if (resultSet2.rowsAffected > 0) {
                  [...sortedupdate][toMoveRightIndex-1+i] = existingupdate[toMoveLeftIndex-1+i];
                }
              }
              setUpdate([...sortedupdate]);
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
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
          <TouchableOpacity style={{flex:1, top: 200, justifyContent: 'flex-start', alignItems: 'center'}} onPressOut={() => {setModalVisible(!modalVisible)}} activeOpacity={1}>
            <TouchableWithoutFeedback>
              <View style={[container.modal,{ width: undefined,paddingVertical:10, flexDirection:'row'}]}>
                <Pressable onPress={()=>moveLeft(data)} style={{display: displayLeft}}>
                  <Feather name="chevron-left" size={25} color={'gray'}/>
                </Pressable>
                <Pressable onPress={()=>moveRight(data)} style={{display: displayRight}}>
                  <Feather name="chevron-right" size={25} color={'gray'}/>
                </Pressable>
                <Pressable onPress={() => {setChangeModalVisible(true)}}>
                  <Feather name="edit" size={25}/>
                </Pressable>
                <Pressable onPress={() => setDeleteModalVisible(true)}>
                  <Feather name="trash-2" size={25} color={'darkred'}/>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
          <ChangeHabitName db={db} data={data} changeModalVisible={changeModalVisible} setChangeModalVisible={setChangeModalVisible} type={type} update={update} setUpdate={setUpdate} update2={update2} setUpdate2={setUpdate2} load={load} loadx={loadx} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
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
                    <View style={container.modal}>
                      <Text>Are you sure you want to delete</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#B9CBCF', fontWeight: 'bold'}}> {data} </Text><Text>?</Text>
                      </View>
                      <Text style={{color: 'gray', fontSize: 10}}>You will not be able to recover your data for this month</Text>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => deleteState(data)} style={[container.button,{backgroundColor: 'lightgray', flex:1}]}>
                          <Text>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setDeleteModalVisible(!deleteModalVisible)}} style={[container.button,{backgroundColor: '#F4F9FA', flex:1}]}>
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

  
  export default IndicatorMenu;
  
  
  
  
  
  
  