import { StyleSheet,ActivityIndicator, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import IndicatorTableTitle from '../components/IndicatorTableTitle';
import Feather from '@expo/vector-icons/Feather';
import NewIndicator from '../modal/NewIndicator';
import IndicatorMenu from '../modal/IndicatorMenu';
import AddSleepLog from './AddSleepLog';
import AddMood from './AddMood';
import moment from 'moment';
import SleepTypeColors from '../constants/SleepTypeColors';
import { container,colors } from '../styles';
import Color from './Color';
import AddScale from './AddScale';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

export default function TrackersElement({db, year, month, load, loadx, setHabits, habits, tracks, setTracks, moods, setMoods, sleep, setSleep, states, setStates, staterecords, setStaterecords, scales, setScales, scalerecords, setScalerecords}) {

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [selectedSleepIndex, setSelectedSleepIndex] = useState(-1);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(-1);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [selectedStateIndex, setSelectedStateIndex] = useState(-1);
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedStateItem, setSelectedStateItem] = useState('');
  const [scaleModalVisible, setScaleModalVisible] = useState(false);
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(-1);
  const [selectedScaleName, setSelectedScaleName] = useState('');
  const [selectedScaleId, setSelectedScaleId] = useState('');
  const [selectedScaleItem, setSelectedScaleItem] = useState('');
  const [scaleValue, setScaleValue] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [updatedhabits, setUpdatedhabits] = useState([]);
  const [updatedstates, setUpdatedstates] = useState([]);
  const [updatedscales, setUpdatedscales] = useState([]);

  const lastMonthData = habits.filter(c => c.year === (month === 0 ? year - 1 : year) && c.month === (month === 0 ? 11 : month - 1));
  const lastMonthStates = staterecords.filter(c => c.year === (month === 0 ? year - 1 : year) && c.month === (month === 0 ? 11 : month - 1));
  const lastMonthScales = scalerecords.filter(c => c.year === (month === 0 ? year - 1 : year) && c.month === (month === 0 ? 11 : month - 1));


  useEffect(() => {
    if (habits.filter(c => c.year === thisYear && c.month === thisMonth).length === 0) {
      let existinghabits = [...habits];
      let lastMonthhabits = lastMonthData.filter(c => c.day === 1).map(c => c.name);
      let lastMonthTypes = lastMonthData.filter(c => c.day === 1).map(c => c.type);
      let lastMonthtracks = lastMonthData.filter(c => c.day === 1).map(c => c.track);

      const inserthabits = async () => {
        const promises = [];
      for (let j = 0; j < lastMonthhabits.length; j++) {
        const name = lastMonthhabits[j];

        for (let i = 1; i <= DaysInMonth(thisYear, thisMonth); i++) {
          promises.push(
          new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO habits (name, year, month, day, state, type, track, place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, thisYear, thisMonth, i, 0, lastMonthTypes[j], lastMonthtracks[j], j],
                (txtObj, habitResultSet) => {
                  const newHabit = {
                    id: uuid.v4(),
                    name: name,
                    year: thisYear,
                    month: thisMonth,
                    day: i,
                    state: 0,
                    type: lastMonthTypes[j],
                    track: lastMonthtracks[j],
                    place: j,
                  };
                  existinghabits.push(newHabit);
                  resolve(newHabit);
                },
                (_, error) => {
                  console.log(error);
                  reject(error);
                }
              );
            });
          })
          );
        }
      }
      return Promise.all(promises);
      };
      inserthabits()
        .then(newhabits => {
          setUpdatedhabits([...updatedhabits, ...newhabits]); // Update the updatedhabits state variable
          setIsLoading(false); 
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false); 
        });
    } 
    else {
      setIsLoading(false); // Set loading state to false if the data is already present
    }

  }, []);

  useEffect(() => {

      setHabits(updatedhabits); // Update the habits state variable
      loadx(!load);

  }, [updatedhabits]);


  useEffect(() => {
    if (staterecords.filter(c => c.year === thisYear && c.month === thisMonth).length === 0) {
      let existingrecords = [...staterecords];
      let lastMonthrecords = lastMonthStates.filter(c => c.day === 1).map(c => c.name);
      const insertstates = async () => {
        const promises = [];
      for (let j = 0; j < lastMonthrecords.length; j++) {
        const name = lastMonthrecords[j];

        for (let i = 1; i <= DaysInMonth(thisYear, thisMonth); i++) {
          promises.push(
          new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO staterecords (name, year, month, day, item) VALUES (?, ?, ?, ?, ?)',
                [name, thisYear, thisMonth, i, ''],
                (txtObj, stateResultSet) => {
                  const newState = {
                    id: uuid.v4(),
                    name: name,
                    year: thisYear,
                    month: thisMonth,
                    day: i,
                    item: '',
                  };
                  existingrecords.push(newState);
                  resolve(newState);
                },
                (_, error) => {
                  console.log(error);
                  reject(error);
                }
              );
            });
          })
          );
        }
      }
      return Promise.all(promises);
      };
      insertstates()
        .then(newstates => {
          setUpdatedstates([...updatedstates, ...newstates]);
          setIsLoading(false); 
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false); 
        });
    } 
    else {
      setIsLoading(false); // Set loading state to false if the data is already present
    }

  }, []);

  useEffect(() => {

      setStaterecords(updatedstates); // Update the habits state variable
      loadx(!load);

  }, [updatedstates]);

  useEffect(() => {
    if (scalerecords.filter(c => c.year === thisYear && c.month === thisMonth).length === 0) {
      let existingrecords = [...scalerecords];
      let lastMonthrecords = lastMonthScales.filter(c => c.day === 1).map(c => c.name);
      const insertscales = async () => {
        const promises = [];
      for (let j = 0; j < lastMonthrecords.length; j++) {
        const name = lastMonthrecords[j];

        for (let i = 1; i <= DaysInMonth(thisYear, thisMonth); i++) {
          promises.push(
          new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO scalerecords (name, year, month, day, value) VALUES (?, ?, ?, ?, ?)',
                [name, thisYear, thisMonth, i, undefined],
                (txtObj, scaleResultSet) => {
                  const newScale = {
                    id: uuid.v4(),
                    name: name,
                    year: thisYear,
                    month: thisMonth,
                    day: i,
                    value: undefined,
                  };
                  existingrecords.push(newScale);
                  resolve(newScale);
                },
                (_, error) => {
                  console.log(error);
                  reject(error);
                }
              );
            });
          })
          );
        }
      }
      return Promise.all(promises);
      };
      insertscales()
        .then(newscales => {
          setUpdatedscales([...updatedscales, ...newscales]);
          setIsLoading(false); 
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false); 
        });
    } 
    else {
      setIsLoading(false); // Set loading scale to false if the data is already present
    }

  }, []);

  useEffect(() => {

      setScalerecords(updatedscales); // Update the habits scale variable
      loadx(!load);

  }, [updatedscales]);

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)]
     : null;
  }

function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
  var channelA = colorChannelA*amountToMix;
  var channelB = colorChannelB*(1-amountToMix);
  return parseInt(channelA+channelB);
}
function colorMixer(rgbA, rgbB, amountToMix){
  var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
  var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
  var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
  return "rgb("+r+","+g+","+b+")";
}

const habitsNames = [...new Set(habits.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name))];
const uniqueStatesNames = [...new Set(staterecords.filter(c => (c.day==1, c.year==year, c.month==month)).map(c=>c.name))];
const uniqueScalesNames = [...new Set(scalerecords.filter(c => (c.day==1, c.year==year, c.month==month)).map(c=>c.name))];
const uniqueNames = [...new Set([ ...uniqueScalesNames, ...uniqueStatesNames, ...habitsNames])];

const habitsType = Array.from({ length:[...new Set(habits.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name))].length }, () => "habit");
const statesType = Array.from({ length:[...new Set(staterecords.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name))].length }, () => "state");
const scalesType = Array.from({ length:[...new Set(scalerecords.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name))].length }, () => "scale");
const uniqueTypes = [...new Set([ ...scalesType, ...statesType, ...habitsType])];


    const updateHabit = (id) => {
      let existinghabits=[...habits];
      const indexToUpdate = existinghabits.findIndex(state => state.id === id);
      if (existinghabits[indexToUpdate].state==0){
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [1, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existinghabits[indexToUpdate].state = 1;
                setHabits(existinghabits);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else {
        db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existinghabits[indexToUpdate].state = 0;
                setHabits(existinghabits);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
    };

    const updateState = (id,item) => {
      let existingstates=[...staterecords];
      const indexToUpdate = existingstates.findIndex(state => state.id === id);
        db.transaction(tx=> {
          tx.executeSql('UPDATE staterecords SET item = ? WHERE id = ?', [item, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingstates[indexToUpdate].item = item;
                setStaterecords(existingstates);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        setSelectedStateIndex(-1);
              setSelectedStateId('');
              setSelectedStateName('');
              setSelectedStateItem('');
              setStateModalVisible(!stateModalVisible);
              loadx(!load);
    };

    const updateScale = (id,item) => {
      let existingscales=[...scalerecords];
      const indexToUpdate = existingscales.findIndex(c => c.id === id);
        db.transaction(tx=> {
          tx.executeSql('UPDATE scalerecords SET value = ? WHERE id = ?', [item, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingscales[indexToUpdate].value = item;
                setScalerecords(existingscales);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        setSelectedScaleIndex(-1);
        setSelectedScaleId('');
        setSelectedScaleName('');
        setSelectedScaleItem('');
        setScaleModalVisible(!scaleModalVisible);
        loadx(!load);
    };

    const showhabits = (ind) => {
      const filteredhabits = habits.filter(c=>(c.name==ind && c.year==year && c.month==month));
      return filteredhabits.map((state,index) => {
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=> updateHabit(state.id)}>
              <View style={[container.cell, { backgroundColor : filteredhabits[index].state==1 ? '#242424' : 'white' }]} />
            </TouchableOpacity>
          </View>
        )
      })
    }
 
    const showHabitsColumns = (ind) => {
      return (
        <View>
          {showhabits(ind.item)}
        </View>
      );
    };   

    const showTitle = ({item,index}) => {
      return (
        <View>
          <Pressable style={{ height: 75, transform: [{ skewX: '-45deg' }], left: 37, width:25 }}>
            <IndicatorTableTitle name={item} year={year} month={month} setModalVisible={setModalVisible}/>
          </Pressable>
          <IndicatorMenu
            data={item}
            modalVisible={modalVisible === item}
            setModalVisible={setModalVisible}
            month={month}
            year={year}
            db={db}
            setUpdate={uniqueTypes[index]=='habit'? setHabits : uniqueTypes[index]=='state'? setStaterecords : setScalerecords}
            update={uniqueTypes[index]=='habit'? habits : uniqueTypes[index]=='state'? staterecords : scalerecords}
            loadx={loadx}
            load={load}
          />
        </View>
      );
    };

    const showstates = (name) => {
      const stateslist = staterecords.filter(c=>(c.name==name && c.year==year && c.month==month));
      return stateslist.map((item,index) => {
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=>{setSelectedStateItem(item.item);setSelectedStateId(item.id);setSelectedStateIndex(index);setSelectedStateName(name);setStateModalVisible(true)}}>
              <View style={[container.cell, { backgroundColor : item.item==""?  colors.primary.white : states.filter(c=>(c.name==item.name && c.item==item.item)).map(c=>c.color)[0]}]}/>
            </TouchableOpacity>
            <Modal
            animationType="none"
            transparent={true}
            visible={selectedStateIndex === index && stateModalVisible}
            onRequestClose={() => {
              setSelectedStateIndex(-1);
              setSelectedStateId('');
              setSelectedStateName('');
              setSelectedStateItem('');
              setStateModalVisible(!stateModalVisible);
              loadx(!load);
            }}
            >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setSelectedStateItem('');setSelectedStateId('');setStateModalVisible(!stateModalVisible);setSelectedStateIndex(-1);setSelectedStateName('');}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={container.modal}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} state</Text>
                  <FlatList
                    horizontal
                    data={states.filter(c => c.name === selectedStateName).map(c => c.color)}
                    renderItem={({item}) => (
                      <TouchableOpacity onPress={()=>updateState(selectedStateId,states.filter(c =>( c.name === selectedStateName && c.color==item)).map(c => c.item)[0])}>
                        <Color color={item}/>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.color}
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
          </View>
        )
      })
    }
    
    const showscales = (name) => {
      const scaleslist = scalerecords.filter(c=>(c.name==name && c.year==year && c.month==month));
      const mincolor = hexToRgb(scales.filter(c=>c.name==name).map(c=>c.mincolor)[0]);
      const maxcolor = hexToRgb(scales.filter(c=>c.name==name).map(c=>c.maxcolor)[0]);
      const minvalue = scales.filter(c=>c.name==name).map(c=>c.min)[0];
      const maxvalue = scales.filter(c=>c.name==name).map(c=>c.max)[0];
      return scaleslist.map((item,index) => {
        const amountomix = (maxvalue-item.value)/(maxvalue-minvalue);
        const colormix = mincolor!==null && maxcolor!==null?colorMixer(mincolor,maxcolor,amountomix):colors.primary.white;
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=>{setSelectedScaleItem(item.value);setSelectedScaleId(item.id);setSelectedScaleIndex(index);setSelectedScaleName(name);setScaleModalVisible(true)}}>
              <View style={[container.cell, { backgroundColor : item.value==undefined? colors.primary.white : colormix}]}>
                <Text>{item.value}</Text>
              </View>
            </TouchableOpacity>
            <Modal
            animationType="none"
            transparent={true}
            visible={selectedScaleIndex === index && scaleModalVisible}
            onRequestClose={() => {
              setSelectedScaleIndex(-1);
              setSelectedScaleId('');
              setSelectedScaleName('');
              setSelectedScaleItem('');
              setScaleModalVisible(!scaleModalVisible);
              loadx(!load);
            }}
            >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setSelectedScaleItem('');setSelectedScaleId('');setScaleModalVisible(!scaleModalVisible);setSelectedScaleIndex(-1);setSelectedScaleName('');}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={[container.modal,{height:130, width: 200}]}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} scale</Text>
                  <AddScale name={selectedScaleName} scalerecords={scalerecords} setScalerecords={setScalerecords} db={db} year={year} month={month} day={index+1} loadx={loadx} load={load} setScaleModalVisible={setScaleModalVisible}/> 
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
          </View>
        )
      })
    }

    const showStatesColumns = (name) => {
      return (
        <View>
          {showstates(name.item)}
        </View>
      );
    };

    const showScalesColumns = (name) => {
      return (
        <View>
          {showscales(name.item)}
        </View>
      );
    };
    
    const showNumber = ({item}) => {
      return  (
        <View style={{width:50,height:25, justifyContent:'center',flexDirection:'row'}}>
          <View style={{width:25,height:25, justifyContent:'center'}}>
            <Text style={{textAlign:'right', marginRight: 3, textAlignVertical:'center'}}>{item.day}</Text>
          </View>
          <View style={{width:25,height:25, justifyContent:'center'}}>
            <Text style={{color: colors.defaultdark, textAlign:'center', marginRight: 3, textAlignVertical:'center'}}>{item.dayoftheweek}</Text>
          </View>
        </View>

        )   
    }

    const showMood = (item,index) => {
      const bgColor = item==null?'white': item=='happy'?'yellowgreen': item=='productive'?'green': item=='sick'?'yellow': item=='stressed'?'orange': item=='angry'?'red': item=='bored'?'plum': item=='sad'?'lightblue': 'white';
      return  (
        <>
          <Pressable onPress={()=>{setSelectedMoodIndex(index);setMoodModalVisible(true);}} style={{flex:1,width:25,height:25, justifyContent:'center', borderWidth:0.5, backgroundColor: item==null?'white': bgColor }}/>
          <Modal
          animationType="none"
          transparent={true}
          visible={selectedMoodIndex === index && moodModalVisible}
          onRequestClose={() => {
            setSelectedMoodIndex(-1);
            setMoodModalVisible(!moodModalVisible);
            loadx(!load);
          }}
          >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setMoodModalVisible(!moodModalVisible);setSelectedMoodIndex(-1);}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={container.modal}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} mood</Text>
                  <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={index+1} loadx={loadx} load={load} setMoodModalVisible={setMoodModalVisible}/>
                  <TouchableOpacity onPress={() => deleteMood(index)} style={[container.button,{backgroundColor: 'lightgray'}]}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </>
        
      )   
    }

    const deleteMood = (index) => {
      let existingMoods = [...moods];
      let Idtodelete = existingMoods.filter(c=>(c.year==year && c.month==month && c.day==index+1))[0].id;
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM moods WHERE id=?',
          [Idtodelete],
          (txObj, resultSet) => {
            setMoods(existingMoods.filter(c=>(c.id!=Idtodelete))),
            console.log('Mood deleted successfully');
          },
          (txObj, error) => {
            // Handle error
            console.log('Error deleting mood:', error);
          }
        );
      });
      setMoodModalVisible(false);
    };

    const showSleep = (item,index) => {
      let sleepArray = [];
      for (let i=1; i<DaysInMonth(year,month); i++){
        let goSleepTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.sleep)[0];
        let wakeupTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.wakeup)[0];
        let sleepTime= goSleepTime>wakeupTime ? wakeupTime+24-goSleepTime : wakeupTime-goSleepTime;
        (wakeupTime!=null && goSleepTime!=null) ? sleepArray.push(sleepTime) : undefined;
      }
      let sleepMin = Math.min(...sleepArray);
      let sleepMax = Math.max(...sleepArray);
      let thisgoSleepTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==index+1)).map(c=>c.sleep)[0];
      let thiswakeupTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==index+1)).map(c=>c.wakeup)[0];
      let thissleepTime= thisgoSleepTime>thiswakeupTime ? thiswakeupTime+24-thisgoSleepTime : thiswakeupTime-thisgoSleepTime;
      let sleepColorCode = (thissleepTime-sleepMin)/(sleepMax-sleepMin);
      let sleepColor= sleepColorCode!==null? sleepColorCode>0.5? colorMixer([130,200,50], [255,255,0], 2*sleepColorCode) : colorMixer([255,255,50], [255,0,0], 2*sleepColorCode) : 'white';
      return  (
        <View>
          <Pressable onPress={()=>{setSelectedSleepIndex(index);setSleepModalVisible(true);}} style={{flex:1,width:25,height:25, justifyContent:'center', borderWidth:0.5, backgroundColor: (sleep.filter(c=>(c.year==year && c.month==month)).map(c=>c.sleep)[0]==undefined || sleep.filter(c=>(c.year==year && c.month==month)).map(c=>c.wakeup)[0]==undefined)? colors.primary.white: sleepColor}}>
            <Text style={{textAlign:'center', textAlignVertical:'center'}}>{item}</Text>
          </Pressable>
          <Modal
            animationType="none"
            transparent={true}
            visible={selectedSleepIndex === index && sleepModalVisible}
            onRequestClose={() => {
              setSelectedSleepIndex(-1);
              setSleepModalVisible(!sleepModalVisible);
              loadx(!load);
            }}
          >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setSleepModalVisible(!sleepModalVisible);setSelectedSleepIndex(-1);}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={[container.modal,{height:200}]}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} sleep log</Text>
                  <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={index+1} load={load} loadx={loadx} setSleepModalVisible={setSleepModalVisible} sleepModalVisible={sleepModalVisible}/>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </View>
        )   
    }

    const showSleepQuality = (item,index) => {
      let sleepQuality = SleepTypeColors.filter(c=>(c.type==item)).map(c=>c.color)[0];
      return  (
        <View>
          <Pressable onPress={()=>{setSelectedSleepIndex(index);setSleepModalVisible(true);}} style={{flex:1,width:25,height:25, justifyContent:'center', borderWidth:0.5, backgroundColor: sleep.filter(c=>(c.year==year && c.month==month)).length==0? 'white': sleepQuality==null? 'white' : sleepQuality }}/>
          <Modal
            animationType="none"
            transparent={true}
            visible={selectedSleepIndex === index && sleepModalVisible}
            onRequestClose={() => {
              setSelectedSleepIndex(-1);
              setSleepModalVisible(!sleepModalVisible);
              loadx(!load);
            }}
          >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setSleepModalVisible(!sleepModalVisible);setSelectedSleepIndex(-1);}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={container.modal}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} sleep log</Text>
                  <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={index+1} load={load} loadx={loadx} setSleepModalVisible={setSleepModalVisible} sleepModalVisible={sleepModalVisible}/>
                  <TouchableOpacity onPress={() => deleteSleep(index)} style={[container.button,{backgroundColor: 'lightgray'}]}>
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </View>
        )   
    }

    const deleteSleep = (index) => {
      let existingSleep = [...sleep];
      let Idtodelete = existingSleep.filter(c=>(c.year==year && c.month==month && c.day==index+1))[0].id;
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM sleep WHERE id=?',
          [Idtodelete],
          (txObj, resultSet) => {
            setSleep(existingSleep.filter(c=>(c.id!=Idtodelete))),
            console.log('Sleep deleted successfully');
          },
          (txObj, error) => {
            // Handle error
            console.log('Error deleting sleep:', error);
          }
        );
      });
      setSleepModalVisible(false);
    };

    const thismonthMoods = (year,month) =>{
      var arr= [];
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        arr.push(moods.filter(c=>(c.year==year && c.month==month && c.day==i)).length==0? null : moods.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.mood)[0] );
      }
      return (arr);
    };

    const thismonthSleep = (year,month) =>{
      var arr= [];
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        let goSleepTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.sleep)[0];
        let wakeupTime= sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.wakeup)[0];
        let sleepTime= goSleepTime>wakeupTime ? wakeupTime+24-goSleepTime : wakeupTime-goSleepTime;
        arr.push(sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).length==0? '' : sleepTime );
      }
      return (arr);
    };

    const thismonthSleepQuality = (year,month) =>{
      var arr= [];
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        let sleepType= sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).map(c=>c.type)[0];
        arr.push(sleep.filter(c=>(c.year==year && c.month==month && c.day==i)).length==0? '' : sleepType );
      }
      return (arr);
    };

    const listDays = () => {
      let arr= [];
      let dayoftheweek='';
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        dayoftheweek=moment(new Date(year,month,i)).format('ddd').slice(0,1);
        arr.push({"day":i,"dayoftheweek":dayoftheweek});
      }
      return (arr);
    }

  return (
    <View style={[container.body,{width: width}]}>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="blue" /> 
        </View>
      ) : (
      <ScrollView nestedScrollEnabled  bounces={false} showsVerticalScrollIndicator={false} style={{flex:1,width:width}}>
        <View style={{flex:1,flexDirection:'row'}}>
          <View>
            <FlatList
              data={listDays()}
              renderItem={(item)=>(showNumber(item))}
              keyExtractor={(_, index) => index.toString()}
              style={{marginTop:75,width:50,flexDirection:'row'}}
              scrollEnabled={false}
            />
          </View>
          <ScrollView horizontal={true} style={{flex:1,flexDirection:'row'}}>
            <View style={{display: moods.filter(c=>(c.year==year && c.month==month)).length==0?"none":"flex"}}>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>MOOD</Text>
              <FlatList
                data={thismonthMoods(year,month)}
                renderItem={({item,index})=>(showMood(item,index))}
                keyExtractor={(_, index) => index.toString()}
                style={{width:25,flexDirection:'row'}}
                scrollEnabled={false}
              />
            </View>
            <View style={{display: sleep.filter(c=>(c.year==year && c.month==month)).length==0?"none":"flex"}}>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>SLEEP TIME</Text>
                <FlatList
                  data={thismonthSleep(year,month)}
                  renderItem={({item, index}) => showSleep(item, index)}
                  keyExtractor={(_, index) => index.toString()}
                  style={{width:25,flexDirection:'row'}}
                  scrollEnabled={false}
                />
            </View>
            <View style={{display: sleep.filter(c=>(c.year==year && c.month==month)).length==0?"none":"flex"}}>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>SLEEP QUALITY</Text>
                <FlatList
                  data={thismonthSleepQuality(year,month)}
                  renderItem={({item, index}) => showSleepQuality(item, index)}
                  keyExtractor={(_, index) => index.toString()}
                  style={{width:25,flexDirection:'row'}}
                  scrollEnabled={false}
                />
            </View>
            <View>
              <FlatList
                horizontal
                data={uniqueNames}
                renderItem={uniqueNames!==null?({item,index})=>showTitle({item,index}):undefined}
                keyExtractor={(item) => (item==null && item!==undefined) ? item.toString():''} 
                contentContainerStyle={{paddingRight:75}}
              />
              <View style={{flexDirection:'row',alignItems:'flex-start'}}> 
                <View>
                  <FlatList
                    horizontal
                    data={uniqueScalesNames}
                    renderItem={uniqueScalesNames!==null?(name)=>showScalesColumns(name):undefined}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
                <View>
                  <FlatList
                    horizontal
                    data={uniqueStatesNames}
                    renderItem={uniqueStatesNames!==null?(name)=>showStatesColumns(name):undefined}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
                <View>
                  <FlatList
                    horizontal
                    data={habitsNames}
                    renderItem={habitsNames!==null?(name)=>showHabitsColumns(name):undefined}
                    keyExtractor={(_, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
                
              </View>
            </View>
          </ScrollView>
        </View>
        <View pointerEvents="none" style={{display: year==thisYear?(month==thisMonth?'flex':'none'):'none',position:'absolute',marginTop:50+thisDay*25, borderTopWidth:2, borderBottomWidth:2, borderColor:'blue', width:'100%', height:25}}/>
      </ScrollView >
      )}
      {/*<Button title='remove Scales' onPress={removeScalesDb} />
      <Button title='remove States' onPress={removeStatesDb} />
      <Button title='remove thismonth indicators' onPress={removeDbMonth} />
      <Button title='remove Indicators' onPress={removeDb} />
      <Button title='remove tracks' onPress={removetracksDb} /> */}
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} color={colors.primary.blue} />
      </ TouchableOpacity> 
      <NewIndicator
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        load={load}
        loadx={loadx}
        db={db}
        habits={habits}
        setHabits={setHabits}
        tracks={tracks}
        setTracks={setTracks}
        states={states}
        setStates={setStates}
        staterecords={staterecords}
        setStaterecords={setStaterecords}
        scales={scales} setScales={setScales} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
      />
    </View>
  );
}


const styles = StyleSheet.create({

  polygon: {
    width: 25,
    height: 75,
    borderWidth: 0.3,
    borderColor: 'gray',
    opacity: 1,
    transform: [{skewX: '-45deg'}],
    left:38,
    backgroundColor: 'white',
},
indText: {
    position: 'absolute',
    transform: [{scaleY: 0.5}, { rotate: "295deg" },{skewX: '-35deg'}],
    width: 120,
    height: 100,
    top: 12,
    left: 12,
}
});