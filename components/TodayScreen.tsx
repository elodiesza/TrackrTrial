import { FlatList, Pressable, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';
import AddSleepLog from './AddSleepLog';
import AddMood from './AddMood';
import { container,colors } from '../styles';
import DiaryElement from './DiaryElement';
import AddScale from './AddScale';
import UpdateState from '../modal/UpdateState';


const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, year, month, day, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, setStates}) => {


    const [isLoading, setIsLoading] = useState(false);
    const [updateStateVisible, setUpdateStateVisible] = useState(false);

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


  return (
    <SafeAreaView style={container.body}>
      <View style={{flex:1}}>
        <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={day} load={load} loadx={loadx} setMoodModalVisible={undefined}/>
      </View>
      <View style={{flex:1, width:width}}>
        <FlatList
          horizontal
          data={uniqueNames}
          renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
          keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
        />
      </View>
      <View style={{flex:1, width:width}}>
        <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={day} load={load} loadx={loadx} setSleepModalVisible={undefined} sleepModalVisible={undefined}/>
      </View>
      <View style={{flex:1, width:width, flexDirection:'row'}}>
        <View style={{flex:1}}>
          <AddScale name={'WEIGHT'} scalerecords={scalerecords} setScalerecords={setScalerecords} db={db} year={year} month={month} day={day} load={load} loadx={loadx} setScaleModalVisible={undefined}/>
        </View>
        <View style={{flex:1}}>
          <FlatList
            data={[... new Set(states.map(c=>c.name))]}
            renderItem={(item)=>
              <View style={{flexDirection:'row', height:40, marginRight:20, justifyContent:'flex-end', alignContent:'center', alignItems:'center'}}>
                <Text>{item.item}</Text>
                <Pressable onPress={()=>setUpdateStateVisible(true)} style={{width:30, height:30, marginLeft:10, borderWidth:1, borderColor: colors.primary.blue, borderRadius:10, backgroundColor: states.filter(c=>c.item==staterecords.filter(c=>(c.year==year && c.month==month && c.day==day && c.name==item.item)).map(c=>c.item)[0]).map(c=>c.color)[0]}}/>
                <View style={{display: updateStateVisible? 'flex':'none'}}>
                  <UpdateState 
                    db={db}
                    staterecords={staterecords}
                    setStaterecords={setStaterecords}
                    states={states}
                    setStates={setStates}
                    name={item.item}
                    updateStateVisible={updateStateVisible}
                    setUpdateStateVisible={setUpdateStateVisible}
                  />
                </View>
              </View>}
            keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
          />
        </View>
      </View>
      <View style={{flex:1, width:width, marginBottom:10}}>
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
    </SafeAreaView>
  );
}

export default TodayScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
