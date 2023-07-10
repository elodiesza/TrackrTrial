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

const width = Dimensions.get('window').width;

export default function TrackersElement({db, year, month, load, loadx, setStates, states, tags, setTags, moods, setMoods, sleep, setSleep}) {

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
  const [isLoading, setIsLoading] = useState(true);

  const [updatedStates, setUpdatedStates] = useState([]);

  const lastMonthData = states.filter(c => c.year === (month === 0 ? year - 1 : year) && c.month === (month === 0 ? 11 : month - 1));


  useEffect(() => {
    if (states.filter(c => c.year === thisYear && c.month === thisMonth).length === 0) {
      let existingStates = [...states];
      let lastMonthStates = lastMonthData.filter(c => c.day === 1).map(c => c.name);
      let lastMonthTypes = lastMonthData.filter(c => c.day === 1).map(c => c.type);
      let lastMonthTags = lastMonthData.filter(c => c.day === 1).map(c => c.tag);

      const insertStates = async () => {
        const promises = [];
      for (let j = 0; j < lastMonthStates.length; j++) {
        const name = lastMonthStates[j];

        for (let i = 1; i <= DaysInMonth(thisYear, thisMonth); i++) {
          promises.push(
          new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO states (name, year, month, day, state, type, tag, place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, thisYear, thisMonth, i, 0, lastMonthTypes[j], lastMonthTags[j], j],
                (txtObj, stateResultSet) => {
                  const newState = {
                    id: stateResultSet.insertId,
                    name: name,
                    year: thisYear,
                    month: thisMonth,
                    day: i,
                    state: 0,
                    type: lastMonthTypes[j],
                    tag: lastMonthTags[j],
                    place: j,
                  };
                  existingStates.push(newState);
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
      insertStates()
        .then(newStates => {
          setUpdatedStates([...updatedStates, ...newStates]); // Update the updatedStates state variable
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

      setStates(updatedStates); // Update the states state variable
      loadx(!load);

  }, [updatedStates]);

  //colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
  var channelA = colorChannelA*amountToMix;
  var channelB = colorChannelB*(1-amountToMix);
  return parseInt(channelA+channelB);
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix){
  var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
  var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
  var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
  return "rgb("+r+","+g+","+b+")";
}

    const removeDb = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error deleting states')
        );
      });
      loadx(!load);
    }
    const removeTagsDb = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS tags', null,
          (txObj, resultSet) => setTags([]),
          (txObj, error) => console.log('error deleting tags')
        );
      });
      loadx(!load);
    }

    const removeDbMonth = () => {
      let existingStates = [...states];
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM states WHERE month = ?',
          [6],
          (txObj, resultSet) => {
            setStates(existingStates.filter(c=>c.month!=6)),
            console.log('States deleted successfully');
          },
          (txObj, error) => {
            // Handle error
            console.log('Error deleting states:', error);
          }
        );
      });
    };



    const updateState = (id) => {
      let existingStates=[...states];
      const indexToUpdate = existingStates.findIndex(state => state.id === id);
      if (existingStates[indexToUpdate].state==0){
        db.transaction(tx=> {
          tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [1, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingStates[indexToUpdate].state = 1;
                setStates(existingStates);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else {
        db.transaction(tx=> {
          tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingStates[indexToUpdate].state = 0;
                setStates(existingStates);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
    };

    const showStates = (ind) => {
      const filteredStates = states.filter(c=>(c.name==ind && c.year==year && c.month==month));
      return filteredStates.map((state,index) => {
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=> updateState(state.id)}>
              <View style={[styles.cell, { backgroundColor : filteredStates[index].state==1 ? '#242424' : 'white' }]} />
            </TouchableOpacity>
          </View>
        )
      })
    }
    

    const showTitle = (ind) => {
      return (
        <View>
          <Pressable style={{ height: 75, transform: [{ skewX: '-45deg' }], left: 37 }}>
            <IndicatorTableTitle name={ind.item} tags={tags} states={states} year={year} month={month} setModalVisible={setModalVisible}/>
          </Pressable>
          {showStates(ind.item)}
          <IndicatorMenu
            data={ind.item}
            modalVisible={modalVisible === ind.item}
            setModalVisible={setModalVisible}
            index={ind.id}
            month={month}
            year={year}
            db={db}
            setStates={setStates}
            states={states}
            loadx={loadx}
            load={load}
          />
        </View>
      );
    };
    

    const showNumber = (day) => {
      return  (
          <View style={{width:25,height:25, justifyContent:'center'}}>
            <Text style={{textAlign:'right', marginRight: 3, textAlignVertical:'center'}}>{day.item}</Text>
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
            setSelectedSleepIndex(-1);
            setMoodModalVisible(!moodModalVisible);
            loadx(!load);
          }}
          >
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setMoodModalVisible(!moodModalVisible);setSelectedMoodIndex(-1);}} activeOpacity={1}>
              <TouchableWithoutFeedback>
                <View style={styles.dialogBox}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} mood</Text>
                  <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={index+1} loadx={loadx} load={load} setMoodModalVisible={setMoodModalVisible}/>
                  <TouchableOpacity onPress={() => deleteMood(index)} style={[styles.button,{backgroundColor: 'lightgray'}]}>
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
          <Pressable onPress={()=>{setSelectedSleepIndex(index);setSleepModalVisible(true);}} style={{flex:1,width:25,height:25, justifyContent:'center', borderWidth:0.5, backgroundColor: sleep.filter(c=>(c.year==year && c.month==month)).length==0? 'white': sleepColor}}>
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
                <View style={styles.dialogBox}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} sleep log</Text>
                  <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={index+1} load={load} loadx={loadx} setSleepModalVisible={setSleepModalVisible} sleepModalVisible={sleepModalVisible}/>
                  <View style={{flexDirection:'row', flex:1}}>
                    <TouchableOpacity onPress={() => setSleepModalVisible(!sleepModalVisible)} style={[styles.button,{backgroundColor: 'lightgray', marginLeft : 29}]}>
                      <Text>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteSleep(index)} style={[styles.button,{backgroundColor: 'lightgray', marginLeft : 20}]}>
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
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
                <View style={styles.dialogBox}>
                  <Text>Update {moment(new Date(year,month,index+1)).format('MMMM Do')} sleep log</Text>
                  <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={index+1} load={load} loadx={loadx} setSleepModalVisible={setSleepModalVisible} sleepModalVisible={sleepModalVisible}/>
                  <TouchableOpacity onPress={() => deleteSleep(index)} style={[styles.button,{backgroundColor: 'lightgray'}]}>
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


    const allNames = states.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

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
      var arr= [];
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        arr.push(i);
      }
      return (arr);
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container,{width: width}]}>
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
              style={{marginTop:75,width:25,flexDirection:'row'}}
              scrollEnabled={false}
            />
          </View>
          <ScrollView horizontal={true} style={{flex:1,flexDirection:'row'}}>
            <View>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>MOOD</Text>
              <FlatList
                data={thismonthMoods(year,month)}
                renderItem={({item,index})=>(showMood(item,index))}
                keyExtractor={(_, index) => index.toString()}
                style={{width:25,flexDirection:'row'}}
                scrollEnabled={false}
              />
            </View>
            <View>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>SLEEP TIME</Text>
                <FlatList
                  data={thismonthSleep(year,month)}
                  renderItem={({item, index}) => showSleep(item, index)}
                  keyExtractor={(_, index) => index.toString()}
                  style={{width:25,flexDirection:'row'}}
                  scrollEnabled={false}
                />
            </View>
            <View>
              <View style={[styles.polygon]} /><Text numberOfLines={1} style={styles.indText}>SLEEP QUALITY</Text>
                <FlatList
                  data={thismonthSleepQuality(year,month)}
                  renderItem={({item, index}) => showSleepQuality(item, index)}
                  keyExtractor={(_, index) => index.toString()}
                  style={{width:25,flexDirection:'row'}}
                  scrollEnabled={false}
                />
            </View>
            <FlatList
              horizontal
              data={uniqueNames}
              renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
              keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
              contentContainerStyle={{paddingRight:75}}
            />
            
          </ScrollView>
        </View>
        <View pointerEvents="none" style={{display: year==thisYear?(month==thisMonth?'flex':'none'):'none',position:'absolute',marginTop:50+thisDay*25, borderTopWidth:2, borderBottomWidth:2, borderColor:'blue', width:'100%', height:25}}/>
      </ScrollView >
      )}
      </View>
      {/*<Button title='remove thismonth indicators' onPress={removeDbMonth} />
      <Button title='remove Indicators' onPress={removeDb} />
      <Button title='remove Tags' onPress={removeTagsDb} /> */}
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} />
      </ TouchableOpacity> 
      <NewIndicator
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        load={load}
        loadx={loadx}
        db={db}
        states={states}
        setStates={setStates}
        tags={tags}
        setTags={setTags}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBox: {
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
    marginTop: 10,
  },
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