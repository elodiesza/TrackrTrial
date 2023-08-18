import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';
import AddSleepLog from './AddSleepLog';
import AddMood from './AddMood';
import { container,colors } from '../styles';
import DiaryElement from './DiaryElement';
import AddScale from './AddScale';
import AddTime from './AddTime';
import UpdateState from '../modal/UpdateState';
import UpdateWeather from './UpdateWeather';
import StickerList from './StickerList';
import NewSticker from '../modal/NewSticker';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import * as Font from 'expo-font';

const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, year, month, day, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
                    statuslist, setStatuslist, statusrecords, setStatusrecords}) => {


                      async function loadFonts() {
                        await Font.loadAsync({
                          'MyFont': require('../assets/fonts/AvenirNextCondensed.ttf'),
                          // ... other fonts
                        });
                      }

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
    const timeNames= [... new Set(timerecords.map(c=>c.name))];
    const scaleCounts= scaleNames.length;


  return (
    <SafeAreaView style={container.body}>
      <Text style={{fontFamily:'MyFont'}}>TODAY</Text>
      <View style={{width:width, height :60}}>
        <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={day} load={load} loadx={loadx} setMoodModalVisible={undefined}/>
      </View>
      <View style={{height:90, width:width, flexDirection:'row'}}>
        <FlatList
          horizontal
          data={uniqueNames}
          renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
          keyExtractor={(_, index) => index.toString()}
        />
        {weather.length!==0 &&
          <UpdateWeather db={db} weather={weather} setWeather={setWeather} year={year} month={month} day={day}/>    
        } 
        {weather.length==0 &&
          <TouchableOpacity onPress={()=>{
            let existingweather=[...weather];
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO weather (id,weather,year,month,day) values (?,?,?,?,?)',
              [uuid.v4(),'sunny-outline',year,month,day],
              (txtObj,resultSet)=> {    
                  existingweather.push({id:uuid.v4(),weather:'sunny-outline',year:year,month:month,day:day});
                  setWeather(existingweather);
              },
              (txtObj, error) => console.warn('Error inserting data:', error)
              );
          });
          }} style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <Ionicons name={'add-circle-outline'} size={60} color={colors.primary.blue}/>
          </TouchableOpacity>
        }
        </View>
      <View style={{height:110, width:width}}>
        <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={day} load={load} loadx={loadx} setSleepModalVisible={undefined} sleepModalVisible={undefined}/>
      </View>
      <View style={{flex:1, width:width, flexDirection:'row'}}>
        <View style={{flex:2,marginLeft:20, marginBottom:10}}>
          <FlatList
            data={[...scaleNames, ...timeNames]}
            renderItem={[...scaleNames, ...timeNames].length!==0?({item,index})=>
            index<scaleCounts? 
            <AddScale name={item} scales={scales} scalerecords={scalerecords} 
            setScalerecords={setScalerecords} db={db} year={year} month={month} day={day} load={load} 
            loadx={loadx} setScaleModalVisible={undefined}/> : <AddTime name={item} times={times} timerecords={timerecords} 
            setTimerecords={setTimerecords} db={db} year={year} month={month} day={day} load={load} 
            loadx={loadx} setTimeModalVisible={undefined}/>
            :undefined}
            keyExtractor={(_, index) => index.toString()} 
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={{flex:3}}>
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
        <View style={{bottom:5,height:30, marginHorizontal:20, flexDirection:'row'}}>
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
    </SafeAreaView>
  );
}

export default TodayScreen;
