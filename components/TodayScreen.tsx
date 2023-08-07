import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';
import AddSleepLog from './AddSleepLog';
import AddMood from './AddMood';
import { container,colors } from '../styles';
import DiaryElement from './DiaryElement';
import AddScale from './AddScale';
import UpdateState from '../modal/UpdateState';
import UpdateWeather from './UpdateWeather';
import StickerList from './StickerList';
import NewSticker from '../modal/NewSticker';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, year, month, day, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [updateStateVisible, setUpdateStateVisible] = useState(false);
    const [newStickerVisible, setNewStickerVisible] = useState(false);

    const allNames = habits.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    if (isLoading) {
        return (
          <View>
            <Text> Is Loading...</Text>
          </View>
        )
      }

    const updateState = (id) => {
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

    const showTitle = (ind) => {
      return (
        <View>
          <Pressable onPress={()=>updateState(habits.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0])} style={{ height: 75, width:25*1.25, transform: [{ skewX: '-45deg' },{scale: 1.25}], left: 60 }}>
            <IndicatorTableTitleToday name={ind.item} state={habits.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.state)[0]} tracks={tracks} habits={habits} year={year} month={month}/>
          </Pressable>
        </View>
      );
    };

    const scaleNames= [... new Set(scalerecords.map(c=>c.name))];


  return (
    <SafeAreaView style={container.body}>
      <View style={{width:width, height :60}}>
        <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={day} load={load} loadx={loadx} setMoodModalVisible={undefined}/>
      </View>
      <View style={{height:90, width:width, flexDirection:'row'}}>
        <FlatList
          horizontal
          data={uniqueNames}
          renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
          keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
        />
        <UpdateWeather db={db} weather={weather} setWeather={setWeather} year={year} month={month} day={day}/>    
        </View>
      <View style={{height:110, width:width}}>
        <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={day} load={load} loadx={loadx} setSleepModalVisible={undefined} sleepModalVisible={undefined}/>
      </View>
      <View style={{flex:1, width:width, flexDirection:'row'}}>
        <View style={{flex:1}}>
          <FlatList
            data={scaleNames}
            renderItem={scaleNames!==null?({item})=><AddScale name={item} scalerecords={scalerecords} 
            setScalerecords={setScalerecords} db={db} year={year} month={month} day={day} load={load} 
            loadx={loadx} setScaleModalVisible={undefined}/>:undefined}
            keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={{flex:1}}>
          <FlatList
            data={[... new Set(states.map(c=>c.name))]}
            renderItem={(item)=>
              <View style={{flexDirection:'row', height:40, marginRight:20, justifyContent:'flex-end', alignContent:'center', alignItems:'center'}}>
                <Text>{item.item}</Text>
                <Pressable onPress={()=>{setUpdateStateVisible(true);setSelectedName(item.item)}} style={{width:30, height:30, marginLeft:10, borderWidth:1, borderColor: colors.primary.blue, borderRadius:10, backgroundColor: states.filter(c=>c.item==staterecords.filter(c=>(c.year==year && c.month==month && c.day==day && c.name==item.item)).map(c=>c.item)[0]).map(c=>c.color)[0]}}/>
                <View style={{display: updateStateVisible? 'flex':'none'}}>
                  <UpdateState 
                    db={db}
                    staterecords={staterecords}
                    setStaterecords={setStaterecords}
                    states={states}
                    setStates={setStates}
                    name={selectedName}
                    updateStateVisible={updateStateVisible}
                    setUpdateStateVisible={setUpdateStateVisible}
                    year={year}
                    month={month}
                    day={day}
                  />
                </View>
              </View>}
            keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
          />
        </View>
      </View>
      <View style={{height:180, width:width, marginBottom:10}}>
        <View style={{width:width-40, height:30, marginHorizontal:20}}>
          <StickerList db={db} stickers={stickers} setStickers={setStickers} stickerrecords={stickerrecords} setStickerrecords={setStickerrecords} year={year} month={month} day={day}/>
          <Ionicons onPress={()=>setNewStickerVisible(true)} name="add-circle-outline" size={30} color={colors.primary.blue}/>
        </View>
        <DiaryElement 
          db={db}
          diary={diary}
          setDiary={setDiary}
          year={year}
          month={month}
          day={day}
          load={load}
          loadx={loadx}
        />
      </View>
      <NewSticker db={db} stickers={stickers} setStickers={setStickers} newStickerVisible={newStickerVisible} setNewStickerVisible={setNewStickerVisible}/>
     {/*  <Button title={'delete staterecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS staterecords', null,
        (txObj, resultSet) => setStaterecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete scalerecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scalerecords', null,
        (txObj, resultSet) => setScalerecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete states'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS states', null,
        (txObj, resultSet) => setStaterecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete scales'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scales', null,
        (txObj, resultSet) => setScales([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 
      <Button title={'delete times'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS times', null,
        (txObj, resultSet) => setTimes([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 
     <Button title={'delete timerecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS timerecords', null,
        (txObj, resultSet) => setTimerecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 

    <Button title={'delete habits'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS habits', null,
        (txObj, resultSet) => setHabits([]),
        (txObj, error) => console.log('error selecting habits')
      );
    })}/>
    <Button title={'delete tasks'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tasks', null,
        (txObj, resultSet) => setTasks([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
        <Button title={'delete tracks'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tracks', null,
        (txObj, resultSet) => setTracks([]),
        (txObj, error) => console.log('error selecting tracks')
      );
    })}/>
      <Button title={'delete moods'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS moods', null,
        (txObj, resultSet) => setMoods([]),
        (txObj, error) => console.log('error selecting moods')
      );
    })}/>
    <Button title={'delete logs'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS logs', null,
        (txObj, resultSet) => setLogs([]),
        (txObj, error) => console.log('error selecting logs')
      );
    })}/>
            <Button title={'delete sleep'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS sleep', null,
        (txObj, resultSet) => setSleep([]),
        (txObj, error) => console.log('error selecting sleep')
      );
    })}/>
    <Button title={'delete diary'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS diary', null,
        (txObj, resultSet) => setDiary([]),
        (txObj, error) => console.log('error selecting diary')
      );
    })}/>    */}
    </SafeAreaView>
  );
}

export default TodayScreen;
